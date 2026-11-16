//// The rules of game mode ("Climb", described in extension.txt).
////
//// The player's code sees a built-in `anchor` Point. Its draw function's lines
//// count only if they start at the anchor. An optional
//// `fn move_anchor(anchor: Point) -> Point` names the anchor's next position; the
//// anchor moves there once a counting line has been drawn through it. The player
//// wins when a line reaches the green goal bar along the top, and loses when one
//// of their lines touches a red path while both are drawn, or touches the left or
//// right edge of the canvas.
////
//// The player's paths are timed on the main clock (which the playback controls
//// move), the red paths on the red clock (which runs on its own), and lines left
//// behind by an anchor move are frozen, always fully drawn, until cleared.

import builtins
import drawing
import errors.{type EvalError, MissingFunction, TypeError}
import evaluator.{type Value, Builtin, VData, VFunc, VInt}
import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import mutable_dict
import parser
import shape.{type Path, type Point, Line, Path, Point}

/// The y coordinate of the canvas's top edge.
pub const top = -500.0

/// The y coordinate of the goal bar's lower edge: the bar fills the canvas from
/// here up to the top, and a line that reaches it wins.
pub const goal = -460.0

/// The x coordinate of the canvas's right edge (the left edge is at -edge). A
/// line that touches either side edge loses.
pub const edge = 500.0

/// What a frame of play can lead to.
pub type Event {
  // A counting line reached the point move_anchor named.
  AnchorReached(Point)
  // A counting line reached the goal bar.
  Won
  // One of the player's lines touched a red path.
  Caught
  // One of the player's lines touched the left or right edge.
  HitEdge
}

/// Everything check needs to judge a frame.
pub type Snapshot {
  Snapshot(
    anchor: Point,
    // Where move_anchor says the anchor goes next, if anywhere.
    target: Option(Point),
    // The player's counting lines (those that start at the anchor), timed on
    // the main clock.
    lines: List(Path),
    // The player's frozen old lines.
    ghosts: List(Path),
    // The level's red paths, timed on the red clock.
    red: List(Path),
  )
}

// ── Running the player's code ─────────────────────────────────────────────────

/// Parse source with `anchor` and `find_anchor` bound, call draw on shape_slider,
/// and call move_anchor on the anchor if the program defines it. Returns the paths
/// and the anchor's next position, or a human-readable error message.
pub fn run(
  source: String,
  shape_slider: Int,
  anchor: Point,
) -> Result(#(List(Path), Option(Point)), String) {
  let frame = builtins.global_frame()
  let anchor_value = point_value(anchor)
  mutable_dict.insert(frame, "anchor", anchor_value)
  mutable_dict.insert(
    frame,
    "find_anchor",
    VFunc(Builtin("find_anchor", 3, find_anchor(_, frame, anchor_value))),
  )
  case parser.parse_program(source, frame) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      case drawing.try_draw(shape_slider, program) {
        Error(err) -> Error(errors.error_message(err))
        Ok(paths) ->
          case evaluator.run("move_anchor", [anchor_value], program) {
            Ok(VData("Point", [VInt(x), VInt(y)])) ->
              Ok(#(paths, Some(Point(int.to_float(x), int.to_float(y)))))
            Ok(_) -> Error("move_anchor must return a Point")
            // No move_anchor (with one argument): the anchor stays put.
            Error(MissingFunction("move_anchor", _)) -> Ok(#(paths, None))
            Error(err) -> Error(errors.error_message(err))
          }
      }
  }
}

// find_anchor(start, end, thickness): a Path drawn straight from the anchor to
// the point the program's move_anchor names, between start and end. The program's
// functions are added to frame when it is parsed, so move_anchor is looked up
// when find_anchor is called.
fn find_anchor(
  args: List(Value),
  frame: evaluator.GlobalFrame,
  anchor: Value,
) -> Result(Value, EvalError) {
  case args, mutable_dict.get(frame, "move_anchor") {
    [VInt(_), VInt(_), VInt(_)], Error(Nil) ->
      Error(MissingFunction("move_anchor", 1))
    [VInt(start), VInt(end), VInt(thickness)], Ok(move_anchor) ->
      case evaluator.apply(move_anchor, [anchor]) {
        Ok(VData("Point", [VInt(_), VInt(_)]) as next) ->
          Ok(
            VData("Path", [
              VData("Line", [anchor, next]),
              VInt(start),
              VInt(end),
              VInt(thickness),
            ]),
          )
        Ok(_) -> Error(TypeError("move_anchor must return a Point"))
        Error(err) -> Error(err)
      }
    _, _ ->
      Error(TypeError(
        "find_anchor takes three Ints: start time, end time, and thickness",
      ))
  }
}

fn point_value(p: Point) -> Value {
  VData("Point", [VInt(float.round(p.x)), VInt(float.round(p.y))])
}

/// Whether a player's path counts: it must start at the anchor.
pub fn counts(path: Path, anchor: Point) -> Bool {
  case path.shape {
    Line(start, _) -> start == anchor
  }
}

// ── Judging a frame ───────────────────────────────────────────────────────────

/// What, if anything, has happened by main-clock time t and red-clock time
/// red_t. Losing (being caught, then hitting an edge) outranks winning, which
/// outranks moving the anchor. Line thickness counts throughout.
pub fn check(s: Snapshot, t: Float, red_t: Float) -> Option(Event) {
  let current = list.filter_map(s.lines, visible(_, t))
  let ghosts = list.filter_map(s.ghosts, visible(_, 0.0))
  let mine = list.append(current, ghosts)
  let reds = list.filter_map(s.red, visible(_, red_t))
  let caught =
    list.any(mine, fn(m) {
      list.any(reds, fn(r) {
        let reach = { m.thickness +. r.thickness } /. 2.0
        segment_distance2(m.a, m.b, r.a, r.b) <=. reach *. reach
      })
    })
  let hit_edge =
    list.any(mine, fn(m) {
      let half = m.thickness /. 2.0
      float.min(m.a.x, m.b.x) -. half <=. 0.0 -. edge
      || float.max(m.a.x, m.b.x) +. half >=. edge
    })
  let won =
    list.any(current, fn(m) {
      float.min(m.a.y, m.b.y) -. m.thickness /. 2.0 <=. goal
    })
  let moved = case s.target {
    Some(target) ->
      case distance2(target, s.anchor) >. 1.0 {
        False -> None
        True ->
          case
            list.any(current, fn(m) {
              let reach = m.thickness /. 2.0 +. 1.0
              point_segment_distance2(target, m.a, m.b) <=. reach *. reach
            })
          {
            True -> Some(AnchorReached(target))
            False -> None
          }
      }
    None -> None
  }
  case caught, hit_edge, won {
    True, _, _ -> Some(Caught)
    _, True, _ -> Some(HitEdge)
    _, _, True -> Some(Won)
    _, _, False -> moved
  }
}

/// The player's lines as drawn at time t, frozen: each becomes an instant path
/// covering only the part drawn so far, and lines not yet started are dropped.
pub fn freeze(paths: List(Path), t: Float) -> List(Path) {
  list.filter_map(paths, fn(p) {
    case visible(p, t) {
      Ok(seg) -> Ok(Path(Line(seg.a, seg.b), 0.0, 0.0, p.thickness))
      Error(Nil) -> Error(Nil)
    }
  })
}

// ── Geometry ──────────────────────────────────────────────────────────────────

// The drawn part of a line: from a to b, with its thickness.
type Segment {
  Segment(a: Point, b: Point, thickness: Float)
}

// The part of path drawn by time t, matching what canvas.mjs shows: nothing
// before it starts, then a growing piece from its start point. A path that has
// no length yet (just started, rewound to its start, or from a point to itself)
// counts as nothing drawn, so a lone anchor can't be caught, win, or move.
fn visible(path: Path, t: Float) -> Result(Segment, Nil) {
  case t <. path.start, path.shape {
    True, _ -> Error(Nil)
    False, Line(a, b) -> {
      let duration = path.end -. path.start
      let u = case duration <=. 0.0 {
        True -> 1.0
        False -> float.clamp({ t -. path.start } /. duration, 0.0, 1.0)
      }
      let tip = Point(a.x +. { b.x -. a.x } *. u, a.y +. { b.y -. a.y } *. u)
      case tip == a {
        True -> Error(Nil)
        False -> Ok(Segment(a, tip, path.thickness))
      }
    }
  }
}

fn distance2(p: Point, q: Point) -> Float {
  let dx = p.x -. q.x
  let dy = p.y -. q.y
  dx *. dx +. dy *. dy
}

// The squared distance from p to the segment from a to b.
fn point_segment_distance2(p: Point, a: Point, b: Point) -> Float {
  let dx = b.x -. a.x
  let dy = b.y -. a.y
  let length2 = dx *. dx +. dy *. dy
  let u = case length2 == 0.0 {
    True -> 0.0
    False ->
      float.clamp(
        { { p.x -. a.x } *. dx +. { p.y -. a.y } *. dy } /. length2,
        0.0,
        1.0,
      )
  }
  distance2(p, Point(a.x +. dx *. u, a.y +. dy *. u))
}

// The squared distance between segments p1-p2 and q1-q2: zero if they cross,
// otherwise the smallest distance from an endpoint of one to the other.
fn segment_distance2(p1: Point, p2: Point, q1: Point, q2: Point) -> Float {
  let d1 = cross(q1, q2, p1)
  let d2 = cross(q1, q2, p2)
  let d3 = cross(p1, p2, q1)
  let d4 = cross(p1, p2, q2)
  case d1 *. d2 <. 0.0 && d3 *. d4 <. 0.0 {
    True -> 0.0
    False ->
      list.fold(
        [
          point_segment_distance2(q1, p1, p2),
          point_segment_distance2(q2, p1, p2),
          point_segment_distance2(p2, q1, q2),
        ],
        point_segment_distance2(p1, q1, q2),
        float.min,
      )
  }
}

// Which side of the line through o and a the point b is on (the z of the cross
// product): positive one way, negative the other, zero on the line.
fn cross(o: Point, a: Point, b: Point) -> Float {
  { a.x -. o.x } *. { b.y -. o.y } -. { a.y -. o.y } *. { b.x -. o.x }
}
