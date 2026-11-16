//# sourceMappingURL=game.mjs.map
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { Some, Option$None$const } from "../gleam_stdlib/gleam/option.mjs";
import * as $builtins from "./builtins.mjs";
import * as $drawing from "./drawing.mjs";
import * as $errors from "./errors.mjs";
import { MissingFunction, TypeError } from "./errors.mjs";
import * as $evaluator from "./evaluator.mjs";
import { Builtin, VData, VFunc, VInt } from "./evaluator.mjs";
import {
  Ok,
  Error,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  divideFloat,
  isEqual,
} from "./gleam.mjs";
import * as $mutable_dict from "./mutable_dict.mjs";
import * as $parser from "./parser.mjs";
import * as $shape from "./shape.mjs";
import { Line, Path, Point } from "./shape.mjs";

export class AnchorReached extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Event$AnchorReached = ($0) => new AnchorReached($0);
export const Event$isAnchorReached = (value) => value instanceof AnchorReached;
export const Event$AnchorReached$0 = (value) => value[0];

export class Won extends $CustomType {}
export const Event$Won$const = new Won();
export const Event$Won = () => Event$Won$const;
export const Event$isWon = (value) => value instanceof Won;

export class Caught extends $CustomType {}
export const Event$Caught$const = new Caught();
export const Event$Caught = () => Event$Caught$const;
export const Event$isCaught = (value) => value instanceof Caught;

export class HitEdge extends $CustomType {}
export const Event$HitEdge$const = new HitEdge();
export const Event$HitEdge = () => Event$HitEdge$const;
export const Event$isHitEdge = (value) => value instanceof HitEdge;

export class Snapshot extends $CustomType {
  constructor(anchor, target, lines, ghosts, red) {
    super();
    this.anchor = anchor;
    this.target = target;
    this.lines = lines;
    this.ghosts = ghosts;
    this.red = red;
  }
}
export const Snapshot$Snapshot = (anchor, target, lines, ghosts, red) =>
  new Snapshot(anchor, target, lines, ghosts, red);
export const Snapshot$isSnapshot = (value) => value instanceof Snapshot;
export const Snapshot$Snapshot$anchor = (value) => value.anchor;
export const Snapshot$Snapshot$0 = (value) => value.anchor;
export const Snapshot$Snapshot$target = (value) => value.target;
export const Snapshot$Snapshot$1 = (value) => value.target;
export const Snapshot$Snapshot$lines = (value) => value.lines;
export const Snapshot$Snapshot$2 = (value) => value.lines;
export const Snapshot$Snapshot$ghosts = (value) => value.ghosts;
export const Snapshot$Snapshot$3 = (value) => value.ghosts;
export const Snapshot$Snapshot$red = (value) => value.red;
export const Snapshot$Snapshot$4 = (value) => value.red;

class Segment extends $CustomType {
  constructor(a, b, thickness) {
    super();
    this.a = a;
    this.b = b;
    this.thickness = thickness;
  }
}

/**
 * The y coordinate of the goal bar's lower edge: the bar fills the canvas from
 * here up to the top, and a line that reaches it wins.
 */
export const goal = -460.0;

/**
 * The x coordinate of the canvas's right edge (the left edge is at -edge). A
 * line that touches either side edge loses.
 */
export const edge = 500.0;

/**
 * The y coordinate of the canvas's top edge.
 */
export const top = -500.0;

function find_anchor(args, frame, anchor) {
  let $ = $mutable_dict.get(frame, "move_anchor");
  if (args instanceof $Empty) {
    return new Error(
      new TypeError(
        "find_anchor takes three Ints: start time, end time, and thickness",
      ),
    );
  } else if ($ instanceof Ok) {
    let $1 = args.tail;
    if ($1 instanceof $Empty) {
      return new Error(
        new TypeError(
          "find_anchor takes three Ints: start time, end time, and thickness",
        ),
      );
    } else {
      let $2 = $1.tail;
      if ($2 instanceof $Empty) {
        return new Error(
          new TypeError(
            "find_anchor takes three Ints: start time, end time, and thickness",
          ),
        );
      } else if ($2.tail instanceof $Empty) {
        let $3 = args.head;
        if ($3 instanceof VInt) {
          let $4 = $1.head;
          if ($4 instanceof VInt) {
            let $5 = $2.head;
            if ($5 instanceof VInt) {
              let move_anchor = $[0];
              let start = $3[0];
              let end = $4[0];
              let thickness = $5[0];
              let $6 = $evaluator.apply(
                move_anchor,
                listPrepend(anchor, $List$Empty$const),
              );
              if ($6 instanceof Ok) {
                let $7 = $6[0];
                if ($7 instanceof VData) {
                  let $8 = $7.fields;
                  if ($8 instanceof $Empty) {
                    return new Error(
                      new TypeError("move_anchor must return a Point"),
                    );
                  } else {
                    let $9 = $8.tail;
                    if ($9 instanceof $Empty) {
                      return new Error(
                        new TypeError("move_anchor must return a Point"),
                      );
                    } else if (
                      $9.tail instanceof $Empty &&
                      $8.head instanceof VInt &&
                      $9.head instanceof VInt &&
                      $7.tag === "Point"
                    ) {
                      let next = $7;
                      return new Ok(
                        new VData(
                          "Path",
                          listPrepend(
                            new VData(
                              "Line",
                              listPrepend(
                                anchor,
                                listPrepend(next, $List$Empty$const),
                              ),
                            ),
                            listPrepend(
                              new VInt(start),
                              listPrepend(
                                new VInt(end),
                                listPrepend(
                                  new VInt(thickness),
                                  $List$Empty$const,
                                ),
                              ),
                            ),
                          ),
                        ),
                      );
                    } else {
                      return new Error(
                        new TypeError("move_anchor must return a Point"),
                      );
                    }
                  }
                } else {
                  return new Error(
                    new TypeError("move_anchor must return a Point"),
                  );
                }
              } else {
                return $6;
              }
            } else {
              return new Error(
                new TypeError(
                  "find_anchor takes three Ints: start time, end time, and thickness",
                ),
              );
            }
          } else {
            return new Error(
              new TypeError(
                "find_anchor takes three Ints: start time, end time, and thickness",
              ),
            );
          }
        } else {
          return new Error(
            new TypeError(
              "find_anchor takes three Ints: start time, end time, and thickness",
            ),
          );
        }
      } else {
        return new Error(
          new TypeError(
            "find_anchor takes three Ints: start time, end time, and thickness",
          ),
        );
      }
    }
  } else {
    let $1 = args.tail;
    if ($1 instanceof $Empty) {
      return new Error(
        new TypeError(
          "find_anchor takes three Ints: start time, end time, and thickness",
        ),
      );
    } else {
      let $2 = $1.tail;
      if ($2 instanceof $Empty) {
        return new Error(
          new TypeError(
            "find_anchor takes three Ints: start time, end time, and thickness",
          ),
        );
      } else if (
        $2.tail instanceof $Empty &&
        args.head instanceof VInt &&
        $1.head instanceof VInt &&
        $2.head instanceof VInt
      ) {
        return new Error(new MissingFunction("move_anchor", 1));
      } else {
        return new Error(
          new TypeError(
            "find_anchor takes three Ints: start time, end time, and thickness",
          ),
        );
      }
    }
  }
}

function point_value(p) {
  return new VData(
    "Point",
    listPrepend(
      new VInt($float.round(p.x)),
      listPrepend(new VInt($float.round(p.y)), $List$Empty$const),
    ),
  );
}

/**
 * Parse source with `anchor` and `find_anchor` bound, call draw on shape_slider,
 * and call move_anchor on the anchor if the program defines it. Returns the paths
 * and the anchor's next position, or a human-readable error message.
 */
export function run(source, shape_slider, anchor) {
  let frame = $builtins.global_frame();
  let anchor_value = point_value(anchor);
  $mutable_dict.insert(frame, "anchor", anchor_value);
  $mutable_dict.insert(
    frame,
    "find_anchor",
    new VFunc(
      new Builtin(
        "find_anchor",
        3,
        (_capture) => { return find_anchor(_capture, frame, anchor_value); },
      ),
    ),
  );
  let $ = $parser.parse_program(source, frame);
  if ($ instanceof Ok) {
    let program = $[0];
    let $1 = $drawing.try_draw(shape_slider, program);
    if ($1 instanceof Ok) {
      let paths = $1[0];
      let $2 = $evaluator.run(
        "move_anchor",
        listPrepend(anchor_value, $List$Empty$const),
        program,
      );
      if ($2 instanceof Ok) {
        let $3 = $2[0];
        if ($3 instanceof VData) {
          let $4 = $3.fields;
          if ($4 instanceof $Empty) {
            return new Error("move_anchor must return a Point");
          } else {
            let $5 = $4.tail;
            if ($5 instanceof $Empty) {
              return new Error("move_anchor must return a Point");
            } else if ($5.tail instanceof $Empty) {
              let $6 = $4.head;
              if ($6 instanceof VInt) {
                let $7 = $5.head;
                if ($7 instanceof VInt && $3.tag === "Point") {
                  let x = $6[0];
                  let y = $7[0];
                  return new Ok(
                    [
                      paths,
                      new Some(new Point($int.to_float(x), $int.to_float(y))),
                    ],
                  );
                } else {
                  return new Error("move_anchor must return a Point");
                }
              } else {
                return new Error("move_anchor must return a Point");
              }
            } else {
              return new Error("move_anchor must return a Point");
            }
          }
        } else {
          return new Error("move_anchor must return a Point");
        }
      } else {
        let $3 = $2[0];
        if ($3 instanceof MissingFunction && $3.name === "move_anchor") {
          return new Ok([paths, Option$None$const]);
        } else {
          let err = $3;
          return new Error($errors.error_message(err));
        }
      }
    } else {
      let err = $1[0];
      return new Error($errors.error_message(err));
    }
  } else {
    return $;
  }
}

/**
 * Whether a player's path counts: it must start at the anchor.
 */
export function counts(path, anchor) {
  let $ = path.shape;
  let start = $.start;
  return isEqual(start, anchor);
}

function distance2(p, q) {
  let dx = p.x - q.x;
  let dy = p.y - q.y;
  return (dx * dx) + (dy * dy);
}

function point_segment_distance2(p, a, b) {
  let dx = b.x - a.x;
  let dy = b.y - a.y;
  let length2 = (dx * dx) + (dy * dy);
  let _block;
  let $ = length2 === 0.0;
  if ($) {
    _block = 0.0;
  } else {
    _block = $float.clamp(
      divideFloat((((p.x - a.x) * dx) + ((p.y - a.y) * dy)), length2),
      0.0,
      1.0,
    );
  }
  let u = _block;
  return distance2(p, new Point(a.x + (dx * u), a.y + (dy * u)));
}

function cross(o, a, b) {
  return ((a.x - o.x) * (b.y - o.y)) - ((a.y - o.y) * (b.x - o.x));
}

function segment_distance2(p1, p2, q1, q2) {
  let d1 = cross(q1, q2, p1);
  let d2 = cross(q1, q2, p2);
  let d3 = cross(p1, p2, q1);
  let d4 = cross(p1, p2, q2);
  let $ = ((d1 * d2) < 0.0) && ((d3 * d4) < 0.0);
  if ($) {
    return 0.0;
  } else {
    return $list.fold(
      listPrepend(
        point_segment_distance2(q1, p1, p2),
        listPrepend(
          point_segment_distance2(q2, p1, p2),
          listPrepend(point_segment_distance2(p2, q1, q2), $List$Empty$const),
        ),
      ),
      point_segment_distance2(p1, q1, q2),
      $float.min,
    );
  }
}

function visible(path, t) {
  let $ = t < path.start;
  let $1 = path.shape;
  if ($) {
    return new Error(undefined);
  } else {
    let a = $1.start;
    let b = $1.end;
    let duration = path.end - path.start;
    let _block;
    let $2 = duration <= 0.0;
    if ($2) {
      _block = 1.0;
    } else {
      _block = $float.clamp(divideFloat((t - path.start), duration), 0.0, 1.0);
    }
    let u = _block;
    let tip = new Point(a.x + ((b.x - a.x) * u), a.y + ((b.y - a.y) * u));
    let $3 = isEqual(tip, a);
    if ($3) {
      return new Error(undefined);
    } else {
      return new Ok(new Segment(a, tip, path.thickness));
    }
  }
}

/**
 * What, if anything, has happened by main-clock time t and red-clock time
 * red_t. Losing (being caught, then hitting an edge) outranks winning, which
 * outranks moving the anchor. Line thickness counts throughout.
 */
export function check(s, t, red_t) {
  let current = $list.filter_map(
    s.lines,
    (_capture) => { return visible(_capture, t); },
  );
  let ghosts = $list.filter_map(
    s.ghosts,
    (_capture) => { return visible(_capture, 0.0); },
  );
  let mine = $list.append(current, ghosts);
  let reds = $list.filter_map(
    s.red,
    (_capture) => { return visible(_capture, red_t); },
  );
  let caught = $list.any(
    mine,
    (m) => {
      return $list.any(
        reds,
        (r) => {
          let reach = (m.thickness + r.thickness) / 2.0;
          return segment_distance2(m.a, m.b, r.a, r.b) <= (reach * reach);
        },
      );
    },
  );
  let hit_edge = $list.any(
    mine,
    (m) => {
      let half = m.thickness / 2.0;
      return (($float.min(m.a.x, m.b.x) - half) <= (0.0 - edge)) || (($float.max(
        m.a.x,
        m.b.x,
      ) + half) >= edge);
    },
  );
  let won = $list.any(
    current,
    (m) => { return ($float.min(m.a.y, m.b.y) - (m.thickness / 2.0)) <= goal; },
  );
  let _block;
  let $ = s.target;
  if ($ instanceof Some) {
    let target = $[0];
    let $1 = distance2(target, s.anchor) > 1.0;
    if ($1) {
      let $2 = $list.any(
        current,
        (m) => {
          let reach = (m.thickness / 2.0) + 1.0;
          return point_segment_distance2(target, m.a, m.b) <= (reach * reach);
        },
      );
      if ($2) {
        _block = new Some(new AnchorReached(target));
      } else {
        _block = Option$None$const;
      }
    } else {
      _block = Option$None$const;
    }
  } else {
    _block = $;
  }
  let moved = _block;
  if (caught) {
    return new Some(Event$Caught$const);
  } else if (hit_edge) {
    return new Some(Event$HitEdge$const);
  } else if (won) {
    return new Some(Event$Won$const);
  } else {
    return moved;
  }
}

/**
 * The player's lines as drawn at time t, frozen: each becomes an instant path
 * covering only the part drawn so far, and lines not yet started are dropped.
 */
export function freeze(paths, t) {
  return $list.filter_map(
    paths,
    (p) => {
      let $ = visible(p, t);
      if ($ instanceof Ok) {
        let seg = $[0];
        return new Ok(new Path(new Line(seg.a, seg.b), 0.0, 0.0, p.thickness));
      } else {
        return $;
      }
    },
  );
}
