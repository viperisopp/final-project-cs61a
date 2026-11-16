//// Animator -- an application for program-generated drawings.

import builtins
import data
import drawing
import editor
import errors
import game
import gleam/bool
import gleam/dynamic/decode
import gleam/float
import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/result
import gleam/string
import levels.{type Level}
import lustre
import lustre/attribute as attr
import lustre/effect.{type Effect}
import lustre/element.{type Element}
import lustre/element/html
import lustre/element/keyed
import lustre/event
import parser
import render
import shape.{type Path, type Point, Line, Path, Point}
import tutorial

/// Your app's public address, once you've deployed it in Problem 13, such as
/// "https://your-username.github.io/animator/".
pub const public_url = ""

/// Set to True if you would like your app's URL included in the course gallery.
pub const include_app_in_gallery = False

/// A link to your video from Problem 14, which anyone with the link can watch.
pub const video_url = ""

/// Set to True if you would like your video included in the course gallery.
pub const include_video_in_gallery = False

// Range and starting value of the shape slider.
const shape_slider_min = 0

const shape_slider_max = 100

const default_shape_slider = 10

// Range of the speed slider, as a multiple of normal speed.
const speed_min = -6.0

const speed_max = 6.0

// The menu value of the "+ New drawing…" option. Drawing names are never empty,
// so it can't collide with one.
const new_drawing_option = ""

// The code a new drawing starts with.
const new_drawing_code =
  "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n"

// Colors on the canvas.
const player_color = "#cfe3ff"

// Game mode: player lines that don't start at the anchor (and so don't count),
// old lines left behind by an anchor move, the red paths, the anchor marker and
// the next anchor position, and the goal line along the top edge.
const faded_color = "#4a5570"

const ghost_color = "#8a9cc0"

const red_color = "#ff4d4d"

const anchor_color = "#ffcb6b"

const target_color = "#8a7440"

const goal_color = "#4caf7a"

// ── Model ──────────────────────────────────────────────────────────────────────

pub type Model {
  Model(
    // The code in the editor.
    source: String,
    // The library: every drawing's #(name, source), in menu order.
    drawings: List(#(String, String)),
    // The name of the drawing open in the editor.
    current: String,
    // Bumped to rebuild the drawing menu, so it shows `current` again after
    // the "+ New drawing…" option was picked (e.g. when the prompt is cancelled).
    menu_revision: Int,
    // Whether the code editor is shown.
    code_open: Bool,
    output: String,
    // The value passed to draw as shape_slider.
    shape_slider: Int,
    // Animation speed: 1.0 is normal, 0.0 pauses, negative plays backward.
    speed: Float,
    // Whether the playback-controls box is expanded.
    controls_open: Bool,
    // The cursor's position on the canvas in drawing coordinates, if it is
    // over the canvas.
    cursor: Option(#(Int, Int)),
    // ── Game mode (see game.gleam and extension.txt) ──
    game_on: Bool,
    // Every level's code, #(level name, source), in menu order.
    level_codes: List(#(String, String)),
    // The name of the level being played.
    level: String,
    // Where the player's lines must start.
    anchor: Point,
    // Where move_anchor says the anchor goes next, if anywhere.
    target: Option(Point),
    // The paths the player's draw returned for the current anchor.
    stage: List(Path),
    // The player's old lines, frozen when the anchor moved, until cleared.
    ghosts: List(Path),
    status: Status,
    // The "How to play" guide's open step (counting from 0), if it is open.
    guide: Option(Int),
  )
}

/// How the current attempt at a level stands.
pub type Status {
  Playing
  LevelWon
  // Lost, with the banner's title saying why.
  LevelLost(reason: String)
}

pub type Msg {
  SetCode(String)

  // Drawing library
  SelectDrawing(String)
  CreateDrawing(String)

  // Sliders (the browser reports a range input's value as a string)
  SetShapeSlider(String)
  SetSpeed(String)

  // Playback buttons
  Reset
  Play
  Pause

  // Layout controls
  ToggleCode
  ToggleControls

  // The cursor moved over the canvas (offset x, offset y, canvas width, canvas
  // height, all in CSS pixels), or left it.
  CursorMoved(Float, Float, Float, Float)
  CursorLeft

  // Game mode
  ToggleGame
  SelectLevel(String)
  RestartLevel
  // Something happened in play, at this main-clock time.
  GameEvent(game.Event, Float)

  // The "How to play" guide
  OpenGuide
  CloseGuide
  GuideNext
  GuideBack
  GuideToTutorial
}

// ── Init ───────────────────────────────────────────────────────────────────────

pub fn init(_flags: Nil) -> #(Model, Effect(Msg)) {
  // Reopen the saved library at the drawing that was open last (or the first).
  let drawings = data.load_library()
  let first = case drawings {
    [#(name, _), ..] -> name
    [] -> ""
  }
  let current = case data.load_current() {
    Ok(name) ->
      case list.key_find(drawings, name) {
        Ok(_) -> name
        Error(_) -> first
      }
    Error(_) -> first
  }
  let source = list.key_find(drawings, current) |> result.unwrap("")
  // Each level's saved code (or the starter code), and the level open last.
  let level_codes =
    list.map(levels.all(), fn(l) {
      #(l.name, data.load_level_code(l.name) |> result.unwrap(l.starter))
    })
  let first_level = case level_codes {
    [#(name, _), ..] -> name
    [] -> ""
  }
  let level = case data.load_level() {
    Ok(name) ->
      case list.key_find(level_codes, name) {
        Ok(_) -> name
        Error(_) -> first_level
      }
    Error(_) -> first_level
  }
  let model =
    Model(
      source: source,
      drawings: drawings,
      current: current,
      menu_revision: 0,
      code_open: True,
      output: "",
      shape_slider: default_shape_slider,
      speed: 1.0,
      controls_open: True,
      cursor: None,
      game_on: False,
      level_codes: level_codes,
      level: level,
      anchor: Point(0.0, 0.0),
      target: None,
      stage: [],
      ghosts: [],
      status: Playing,
      guide: None,
    )
  // Reopen game mode if it was on when the page was last used.
  case data.load_game_on() {
    True -> open_level(model, level)
    False -> #(
      model,
      // Effects that happen automatically at the start go here.
      effect.batch([
        editor.mount(source, SetCode),
        effect.from(fn(dispatch) { dispatch(SetCode(source)) }),
      ]),
    )
  }
}

// Parse and evaluate a draw function at the given shape-slider value, returning
// the rendered paths on success, or a human-readable message on failure.
fn run_source(shape_slider: Int, source: String) -> Result(List(Path), String) {
  case parser.parse_program(source, builtins.global_frame()) {
    Error(msg) -> Error(msg)
    Ok(program) ->
      drawing.try_draw(shape_slider, program)
      // Convert Error(EvalError) to Error(String) with a useful error message.
      |> result.map_error(errors.error_message)
  }
}

// ── Update ─────────────────────────────────────────────────────────────────────

pub fn update(model: Model, msg: Msg) -> #(Model, Effect(Msg)) {
  case msg {
    ToggleCode -> #(Model(..model, code_open: !model.code_open), effect.none())

    ToggleControls -> #(
      Model(..model, controls_open: !model.controls_open),
      effect.none(),
    )

    // The canvas shows the drawing's -500..500 square, so scale the offset
    // within the canvas to that range.
    CursorMoved(x, y, width, height) ->
      case width >. 0.0 && height >. 0.0 {
        False -> #(model, effect.none())
        True -> #(
          Model(
            ..model,
            cursor: Some(#(
              float.round(x /. width *. 1000.0 -. 500.0),
              float.round(y /. height *. 1000.0 -. 500.0),
            )),
          ),
          effect.none(),
        )
      }

    CursorLeft -> #(Model(..model, cursor: None), effect.none())

    // After each keystroke in the editor, save the code into the open drawing,
    // then evaluate it and report errors.
    // In game mode, the code is saved as the open level's instead.
    SetCode(text) ->
      case model.game_on {
        False -> {
          let drawings = replace_key(model.drawings, model.current, text)
          let #(model, draw_effect) =
            redraw(Model(..model, source: text, drawings: drawings))
          #(
            model,
            effect.batch([
              effect.from(fn(_dispatch) { data.save_library(drawings) }),
              draw_effect,
            ]),
          )
        }
        True -> {
          let level = model.level
          let level_codes = replace_key(model.level_codes, level, text)
          let #(model, draw_effect) =
            redraw(Model(..model, source: text, level_codes: level_codes))
          #(
            model,
            effect.batch([
              effect.from(fn(_dispatch) { data.save_level_code(level, text) }),
              draw_effect,
            ]),
          )
        }
      }

    // Picking "+ New drawing…" asks for a name; any other option opens that
    // drawing.
    SelectDrawing(value) ->
      case value == new_drawing_option {
        True -> #(
          model,
          effect.from(fn(dispatch) {
            dispatch(CreateDrawing(data.prompt_drawing_name()))
          }),
        )
        False -> open_drawing(model, value)
      }

    // A blank name (or a cancelled prompt) only puts the menu back; an existing
    // name opens that drawing; a new name adds a drawing and opens it.
    CreateDrawing(name) -> {
      let name = string.trim(name)
      case name, list.key_find(model.drawings, name) {
        "", _ -> #(
          Model(..model, menu_revision: model.menu_revision + 1),
          effect.none(),
        )
        _, Ok(_) -> open_drawing(model, name)
        _, Error(_) -> {
          let drawings =
            list.append(model.drawings, [#(name, new_drawing_code)])
          let #(model, open_effect) =
            open_drawing(Model(..model, drawings: drawings), name)
          #(
            model,
            effect.batch([
              effect.from(fn(_dispatch) { data.save_library(drawings) }),
              open_effect,
            ]),
          )
        }
      }
    }

    // Moving the shape slider re-runs draw on the new value.
    SetShapeSlider(value) ->
      case int.parse(value) {
        Ok(n) -> redraw(Model(..model, shape_slider: n))
        Error(_) -> #(model, effect.none())
      }

    SetSpeed(value) ->
      case parse_number(value) {
        Ok(rate) -> set_speed(model, rate)
        Error(_) -> #(model, effect.none())
      }

    // Jump back to the start (empty canvas); playback continues at the
    // current speed.
    // In game mode this also clears the player's old lines.
    Reset -> {
      let reset = effect.from(fn(_dispatch) { render.reset_clock() })
      case model.game_on {
        False -> #(model, reset)
        True -> {
          let #(model, draw_effect) = game_redraw(Model(..model, ghosts: []))
          #(model, effect.batch([reset, draw_effect]))
        }
      }
    }

    Play -> set_speed(model, 1.0)

    Pause -> set_speed(model, 0.0)

    ToggleGame ->
      case model.game_on {
        // The first time game mode is turned on, open the guide too (the level
        // starts paused behind it).
        False -> {
          let first_time = !data.load_guide_seen()
          let model = case first_time {
            True -> Model(..model, guide: Some(0))
            False -> model
          }
          let #(model, open_effect) = open_level(model, model.level)
          case first_time {
            False -> #(model, open_effect)
            True -> #(
              model,
              effect.batch([
                open_effect,
                effect.from(fn(_dispatch) { data.save_guide_seen() }),
              ]),
            )
          }
        }
        True -> {
          let speed = model.speed
          let #(model, open_effect) =
            open_drawing(Model(..model, game_on: False), model.current)
          #(
            model,
            effect.batch([
              effect.from(fn(_dispatch) {
                data.save_game_on(False)
                render.clear_on_frame()
                render.set_red_drawing([], False)
                render.set_fixed([])
                render.set_speed(speed)
              }),
              open_effect,
            ]),
          )
        }
      }

    SelectLevel(name) -> open_level(model, name)

    OpenGuide -> open_guide(model)

    CloseGuide -> close_guide(model)

    GuideNext -> #(
      Model(
        ..model,
        guide: option.map(model.guide, fn(i) {
          int.min(i + 1, tutorial.count() - 1)
        }),
      ),
      effect.none(),
    )

    GuideBack -> #(
      Model(
        ..model,
        guide: option.map(model.guide, fn(i) { int.max(i - 1, 0) }),
      ),
      effect.none(),
    )

    // Close the guide and start the Tutorial level (which restarts the clocks).
    GuideToTutorial -> open_level(Model(..model, guide: None), "Tutorial")

    // Start the level over: the anchor goes back to its start, old lines are
    // cleared, and both clocks restart.
    RestartLevel ->
      case find_level(model.level) {
        Error(_) -> #(model, effect.none())
        Ok(level) -> {
          let speed = model.speed
          let guide_open = option.is_some(model.guide)
          let #(model, draw_effect) =
            game_redraw(
              Model(..model, anchor: level.start, ghosts: [], status: Playing),
            )
          #(
            model,
            effect.batch([
              effect.from(fn(_dispatch) {
                start_clocks(level, speed, guide_open)
              }),
              draw_effect,
            ]),
          )
        }
      }

    GameEvent(event, t) ->
      case model.game_on, model.status {
        True, Playing ->
          case event {
            // The anchor moves for good. The lines drawn so far stay, frozen,
            // and the player's clock starts over for lines from the new anchor.
            game.AnchorReached(point) -> {
              let ghosts =
                list.append(model.ghosts, game.freeze(counting(model), t))
              let #(model, draw_effect) =
                game_redraw(Model(..model, anchor: point, ghosts: ghosts))
              #(
                model,
                effect.batch([
                  effect.from(fn(_dispatch) { render.reset_clock() }),
                  draw_effect,
                ]),
              )
            }
            game.Won -> end_level(model, LevelWon)
            game.Caught -> end_level(model, LevelLost("Caught!"))
            game.HitEdge -> end_level(model, LevelLost("Hit the edge!"))
          }
        _, _ -> #(model, effect.none())
      }
  }
}

// The list with key's value replaced by value.
fn replace_key(
  pairs: List(#(String, String)),
  key: String,
  value: String,
) -> List(#(String, String)) {
  list.map(pairs, fn(pair) {
    case pair.0 == key {
      True -> #(key, value)
      False -> pair
    }
  })
}

// Show the named drawing: remember it as the open one, put its code in a fresh
// editor, and animate it from the start.
fn open_drawing(model: Model, name: String) -> #(Model, Effect(Msg)) {
  case list.key_find(model.drawings, name) {
    Error(_) -> #(model, effect.none())
    Ok(source) -> #(
      Model(..model, current: name, menu_revision: model.menu_revision + 1),
      effect.batch([
        effect.from(fn(_dispatch) {
          data.save_current(name)
          render.reset_clock()
        }),
        editor.mount(source, SetCode),
        // Mounting doesn't report the new text, so evaluate it explicitly.
        effect.from(fn(dispatch) { dispatch(SetCode(source)) }),
      ]),
    )
  }
}

// Record the new speed (so the slider follows) and apply it to the canvas. In
// game mode, a negative speed also clears the player's old lines, and once a
// level is over the clocks stay stopped until it restarts.
fn set_speed(model: Model, rate: Float) -> #(Model, Effect(Msg)) {
  let model = Model(..model, speed: rate)
  let apply = effect.from(fn(_dispatch) { render.set_speed(rate) })
  case model.game_on, model.status {
    False, _ -> #(model, apply)
    True, Playing ->
      case rate <. 0.0 && model.ghosts != [] {
        False -> #(model, apply)
        True -> {
          let #(model, draw_effect) = game_redraw(Model(..model, ghosts: []))
          #(model, effect.batch([apply, draw_effect]))
        }
      }
    True, _ -> #(model, effect.none())
  }
}

// Evaluate the model's source at its shape-slider value. On success, send the
// paths to the canvas; on failure, show the error message and draw nothing.
fn redraw(model: Model) -> #(Model, Effect(Msg)) {
  use <- bool.lazy_guard(model.game_on, fn() { game_redraw(model) })
  case run_source(model.shape_slider, model.source) {
    Ok(paths) -> #(
      Model(..model, output: ""),
      effect.from(fn(_dispatch) {
        paths
        |> list.map(fn(p) { render.render_path(p, "#cfe3ff") })
        |> render.set_drawing
      }),
    )
    Error(msg) -> #(
      Model(..model, output: msg),
      effect.from(fn(_dispatch) { render.set_drawing([]) }),
    )
  }
}

// ── Game mode ──────────────────────────────────────────────────────────────────

fn find_level(name: String) -> Result(Level, Nil) {
  list.find(levels.all(), fn(l) { l.name == name })
}

// Switch to game mode at the named level, from its start, with its saved code.
fn open_level(model: Model, name: String) -> #(Model, Effect(Msg)) {
  case find_level(name), list.key_find(model.level_codes, name) {
    Ok(level), Ok(source) -> {
      let speed = model.speed
      let guide_open = option.is_some(model.guide)
      #(
        Model(
          ..model,
          game_on: True,
          level: name,
          anchor: level.start,
          target: None,
          stage: [],
          ghosts: [],
          status: Playing,
          output: "",
          menu_revision: model.menu_revision + 1,
        ),
        effect.batch([
          effect.from(fn(_dispatch) {
            data.save_game_on(True)
            data.save_level(name)
            start_clocks(level, speed, guide_open)
          }),
          editor.mount(source, SetCode),
          // Mounting doesn't report the new text, so evaluate it explicitly.
          effect.from(fn(dispatch) { dispatch(SetCode(source)) }),
        ]),
      )
    }
    _, _ -> #(model, effect.none())
  }
}

// Open the guide at its first step. Both clocks pause while it is open, so the
// red lines can't catch the player while they read.
fn open_guide(model: Model) -> #(Model, Effect(Msg)) {
  #(
    Model(..model, guide: Some(0)),
    effect.from(fn(_dispatch) {
      data.save_guide_seen()
      render.set_speed(0.0)
      render.set_red_speed(0.0)
    }),
  )
}

// Close the guide and, if the level is still being played, resume both clocks.
fn close_guide(model: Model) -> #(Model, Effect(Msg)) {
  let speed = model.speed
  let resume = model.game_on && model.status == Playing
  #(
    Model(..model, guide: None),
    effect.from(fn(_dispatch) {
      case resume {
        True -> {
          render.set_speed(speed)
          render.set_red_speed(1.0)
        }
        False -> Nil
      }
    }),
  )
}

// Show the level's red paths and put both clocks back at the start, running
// unless the guide is open. (Lustre doesn't promise the order of batched effects,
// so this decides about the guide itself rather than relying on a later pause.)
fn start_clocks(level: Level, speed: Float, guide_open: Bool) -> Nil {
  render.set_red_drawing(
    list.map(level.red, render.render_path(_, red_color)),
    level.loop,
  )
  render.reset_red_clock()
  render.reset_clock()
  case guide_open {
    True -> {
      render.set_red_speed(0.0)
      render.set_speed(0.0)
    }
    False -> {
      render.set_red_speed(1.0)
      render.set_speed(speed)
    }
  }
}

// The player's lines that count: those starting at the anchor.
fn counting(model: Model) -> List(Path) {
  list.filter(model.stage, game.counts(_, model.anchor))
}

// Run the level's code at the current anchor and show the result: the player's
// lines, the fixed layer, and (while playing) a per-frame check for events.
fn game_redraw(model: Model) -> #(Model, Effect(Msg)) {
  let model = case game.run(model.source, model.shape_slider, model.anchor) {
    Ok(#(paths, target)) ->
      Model(..model, stage: paths, target: target, output: "")
    Error(msg) -> Model(..model, stage: [], target: None, output: msg)
  }
  #(model, effect.from(fn(dispatch) { show_game(model, dispatch) }))
}

fn show_game(model: Model, dispatch: fn(Msg) -> Nil) -> Nil {
  render.set_drawing(
    list.map(model.stage, fn(p) {
      render.render_path(p, case game.counts(p, model.anchor) {
        True -> player_color
        False -> faded_color
      })
    }),
  )
  render.set_fixed(fixed_layer(model))
  case model.status, find_level(model.level) {
    Playing, Ok(level) -> {
      let snapshot =
        game.Snapshot(
          anchor: model.anchor,
          target: model.target,
          lines: counting(model),
          ghosts: model.ghosts,
          red: level.red,
        )
      render.on_frame(fn(t, red_t) {
        case game.check(snapshot, t, red_t) {
          None -> False
          Some(event) -> {
            dispatch(GameEvent(event, t))
            True
          }
        }
      })
    }
    _, _ -> render.clear_on_frame()
  }
}

// The level is over: stop both clocks and the per-frame check.
fn end_level(model: Model, status: Status) -> #(Model, Effect(Msg)) {
  #(
    Model(..model, status: status),
    effect.from(fn(_dispatch) {
      render.clear_on_frame()
      render.set_speed(0.0)
      render.set_red_speed(0.0)
    }),
  )
}

// What is always drawn in game mode: the goal bar along the top, the player's
// old lines, the next anchor position (if any), and the anchor itself.
fn fixed_layer(model: Model) -> List(render.RenderPath) {
  // The bar is one line across the canvas, as thick as the bar is tall, so it
  // fills everything from the top edge down to game.goal.
  let middle = { game.top +. game.goal } /. 2.0
  let goal =
    render.render_path(
      instant(
        Point(0.0 -. game.edge, middle),
        Point(game.edge, middle),
        game.goal -. game.top,
      ),
      goal_color,
    )
  let ghosts = list.map(model.ghosts, render.render_path(_, ghost_color))
  let target = case model.target {
    Some(p) -> marker(p, 8.0, 2.0, target_color)
    None -> []
  }
  list.flatten([
    [goal],
    ghosts,
    target,
    marker(model.anchor, 12.0, 3.0, anchor_color),
  ])
}

// A diamond of radius r around p.
fn marker(
  p: Point,
  r: Float,
  thickness: Float,
  color: String,
) -> List(render.RenderPath) {
  let n = Point(p.x, p.y -. r)
  let e = Point(p.x +. r, p.y)
  let s = Point(p.x, p.y +. r)
  let w = Point(p.x -. r, p.y)
  list.map([#(n, e), #(e, s), #(s, w), #(w, n)], fn(side) {
    render.render_path(instant(side.0, side.1, thickness), color)
  })
}

// A line that is drawn complete at once.
fn instant(a: Point, b: Point, thickness: Float) -> Path {
  Path(Line(a, b), 0.0, 0.0, thickness)
}

// Range inputs report whole numbers without a decimal point ("1", "-2"), which
// float.parse rejects, so fall back to parsing an Int.
fn parse_number(text: String) -> Result(Float, Nil) {
  case float.parse(text) {
    Ok(x) -> Ok(x)
    Error(_) -> int.parse(text) |> result.map(int.to_float)
  }
}

// ── View ──────────────────────────────────────────────────────────────────
//
// Two side-by-side panes: the code editor on the left and its rendered output on
// the right. The code column can be hidden to expand the right pane.

pub fn view(model: Model) -> Element(Msg) {
  let app_class = case model.code_open {
    True -> "app"
    False -> "app code-hidden"
  }
  // The code column still exists even when hidden (CSS collapses it) so the
  // mounted CodeMirror editor keeps its state across show/hide.
  html.div([attr.class(app_class)], [
    html.div([attr.class("code-col")], [
      // The built-ins reference opens by itself on the Tutorial level.
      editor.view_panel(
        ToggleCode,
        view_library(model),
        model.game_on && model.level == "Tutorial",
      ),
    ]),
    view_anim(model),
    view_guide(model),
  ])
}

// The "How to play" guide, over the whole app while it is open in game mode.
fn view_guide(model: Model) -> Element(Msg) {
  case model.game_on, model.guide {
    True, Some(step) ->
      tutorial.view(
        step,
        on_back: GuideBack,
        on_next: GuideNext,
        on_close: CloseGuide,
        to_tutorial: GuideToTutorial,
      )
    _, _ -> element.none()
  }
}

// The strip above the code: the drawing menu (every saved drawing, then
// "+ New drawing…"), or in game mode the level menu, a restart button, and a
// button that opens the "How to play" guide. A menu is keyed by menu_revision
// so that bumping it rebuilds the <select> showing the open drawing or level.
fn view_library(model: Model) -> Element(Msg) {
  let revision = int.to_string(model.menu_revision)
  case model.game_on {
    False ->
      keyed.div([attr.class("library")], [
        #("drawings-" <> revision, view_drawing_menu(model)),
      ])
    True ->
      keyed.div([attr.class("library")], [
        #("levels-" <> revision, view_level_menu(model)),
        #(
          "restart",
          html.button(
            [
              attr.class("library-btn"),
              attr.title("Restart level"),
              event.on_click(RestartLevel),
            ],
            [html.text("Restart")],
          ),
        ),
        #(
          "guide",
          html.button(
            [
              attr.class("library-btn"),
              attr.title("How to play"),
              event.on_click(OpenGuide),
            ],
            [html.text("How to play")],
          ),
        ),
      ])
  }
}

fn view_drawing_menu(model: Model) -> Element(Msg) {
  let options =
    list.map(model.drawings, fn(d) {
      html.option([attr.value(d.0), attr.selected(d.0 == model.current)], d.0)
    })
  html.select(
    [
      attr.class("library-select"),
      attr.attribute("aria-label", "Drawing"),
      attr.attribute("data-test-id", "drawing-select"),
      event.on_change(SelectDrawing),
    ],
    list.append(options, [
      html.option([attr.value(new_drawing_option)], "+ New drawing…"),
    ]),
  )
}

fn view_level_menu(model: Model) -> Element(Msg) {
  html.select(
    [
      attr.class("library-select"),
      attr.attribute("aria-label", "Level"),
      attr.attribute("data-test-id", "level-select"),
      event.on_change(SelectLevel),
    ],
    list.map(levels.all(), fn(l) {
      html.option(
        [attr.value(l.name), attr.selected(l.name == model.level)],
        l.name,
      )
    }),
  )
}

// The game-mode toggle, in the top-right corner of the animation pane.
fn view_game_toggle(model: Model) -> Element(Msg) {
  html.button(
    [
      attr.class("game-toggle"),
      attr.title(case model.game_on {
        True -> "Back to drawing"
        False -> "Play the game"
      }),
      attr.attribute("aria-pressed", case model.game_on {
        True -> "true"
        False -> "false"
      }),
      event.on_click(ToggleGame),
    ],
    [
      html.text("Problem 12: Game"),
    ],
  )
}

// The end-of-level banner, over the canvas.
fn view_banner(model: Model) -> Element(Msg) {
  case model.game_on, model.status {
    True, LevelWon -> banner("Level complete!", "banner won")
    True, LevelLost(reason) -> banner(reason, "banner lost")
    _, _ -> element.none()
  }
}

fn banner(title: String, class: String) -> Element(Msg) {
  html.div([attr.class(class)], [
    html.div([attr.class("banner-title")], [html.text(title)]),
    html.button([attr.class("library-btn"), event.on_click(RestartLevel)], [
      html.text("Restart level"),
    ]),
  ])
}

fn view_anim(model: Model) -> Element(Msg) {
  html.div([attr.class("canvas-area")], [
    view_reveal_code(model),
    html.canvas([
      attr.id("animation-canvas"),
      attr.class("canvas"),
      event.on("mousemove", cursor_decoder()),
      event.on("mouseleave", decode.success(CursorLeft)),
    ]),
    html.pre([attr.class("output")], [html.text(model.output)]),
    view_banner(model),
    view_game_toggle(model),
    view_controls(model),
  ])
}

// Reads a mousemove event on the canvas: where the cursor is within it, and the
// canvas's size.
fn cursor_decoder() -> decode.Decoder(Msg) {
  use x <- decode.field("offsetX", decode.float)
  use y <- decode.field("offsetY", decode.float)
  use width <- decode.subfield(["target", "clientWidth"], decode.float)
  use height <- decode.subfield(["target", "clientHeight"], decode.float)
  decode.success(CursorMoved(x, y, width, height))
}

// The playback controls, in a small box overlaid on the bottom-right corner of
// the animation pane: the cursor's coordinates and a collapse toggle along the
// top, then the reset / play / pause buttons with the speed slider, then the
// shape slider. Collapsing only
// hides the rows (via CSS), so the sliders stay in the page.
fn view_controls(model: Model) -> Element(Msg) {
  let #(box_class, toggle_icon, toggle_title) = case model.controls_open {
    True -> #("controls", "▾", "Hide controls")
    False -> #("controls collapsed", "▸", "Show controls")
  }
  let #(cursor_x, cursor_y) = case model.cursor {
    Some(#(x, y)) -> #(int.to_string(x), int.to_string(y))
    None -> #("–", "–")
  }
  html.div([attr.class(box_class)], [
    // Top row: the cursor's coordinates, and the collapse toggle.
    html.div([attr.class("controls-header")], [
      html.span(
        [
          attr.class("cursor-readout"),
          attr.title("Cursor position on the canvas"),
        ],
        [
          html.span([attr.class("cursor-axis")], [html.text("x")]),
          html.span([attr.class("cursor-value")], [html.text(cursor_x)]),
          html.span([attr.class("cursor-axis")], [html.text("y")]),
          html.span([attr.class("cursor-value")], [html.text(cursor_y)]),
        ],
      ),
      html.button(
        [
          attr.class("controls-toggle"),
          attr.title(toggle_title),
          attr.attribute("aria-label", toggle_title),
          attr.attribute("aria-expanded", case model.controls_open {
            True -> "true"
            False -> "false"
          }),
          event.on_click(ToggleControls),
        ],
        [html.text(toggle_icon)],
      ),
    ]),
    html.div([attr.class("control")], [
      html.div([attr.class("playback-buttons")], [
        playback_button("⟲", "Reset", Reset, "reset-btn"),
        playback_button("▶\u{FE0E}", "Play", Play, ""),
        playback_button("❚❚", "Pause", Pause, ""),
      ]),
      html.input([
        attr.type_("range"),
        attr.min(float.to_string(speed_min)),
        attr.max(float.to_string(speed_max)),
        attr.step("0.1"),
        attr.value(float.to_string(model.speed)),
        attr.attribute("data-test-id", "speed-slider"),
        event.on_input(SetSpeed),
      ]),
      html.span([attr.class("control-value")], [
        html.text(float.to_string(float.to_precision(model.speed, 1)) <> "×"),
      ]),
    ]),
    html.label([attr.class("control")], [
      html.span([attr.class("control-label")], [html.text("shape_slider")]),
      html.input([
        attr.type_("range"),
        attr.min(int.to_string(shape_slider_min)),
        attr.max(int.to_string(shape_slider_max)),
        attr.step("1"),
        attr.value(int.to_string(model.shape_slider)),
        attr.attribute("data-test-id", "shape-slider"),
        event.on_input(SetShapeSlider),
      ]),
      html.span([attr.class("control-value")], [
        html.text(int.to_string(model.shape_slider)),
      ]),
    ]),
  ])
}

fn playback_button(
  icon: String,
  label: String,
  msg: Msg,
  extra_class: String,
) -> Element(Msg) {
  html.button(
    [
      attr.class(string.trim("playback-btn " <> extra_class)),
      attr.title(label),
      attr.attribute("aria-label", label),
      event.on_click(msg),
    ],
    [html.text(icon)],
  )
}

// The button that brings the code column back, overlaid on the top-left of the
// right pane. Nothing is rendered while the column is already showing (its own
// header holds the button that hides it).
fn view_reveal_code(model: Model) -> Element(Msg) {
  case model.code_open {
    True -> element.none()
    False ->
      html.button(
        [
          attr.class("icon-btn reveal-code"),
          attr.attribute("title", "Show code"),
          event.on_click(ToggleCode),
        ],
        [html.text("⟩")],
      )
  }
}

// ── Main ───────────────────────────────────────────────────────────────────────

pub fn main() -> Nil {
  let app = lustre.application(init, update, view)
  let assert Ok(_) = lustre.start(app, "#app", Nil)
  Nil
}
