//# sourceMappingURL=app.mjs.map
import * as $bool from "../gleam_stdlib/gleam/bool.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $float from "../gleam_stdlib/gleam/float.mjs";
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { Some, Option$None$const } from "../gleam_stdlib/gleam/option.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $lustre from "../lustre/lustre.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $effect from "../lustre/lustre/effect.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $keyed from "../lustre/lustre/element/keyed.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import * as $builtins from "./builtins.mjs";
import * as $data from "./data.mjs";
import * as $drawing from "./drawing.mjs";
import * as $editor from "./editor.mjs";
import * as $errors from "./errors.mjs";
import * as $game from "./game.mjs";
import {
  Ok,
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
  makeError,
  divideFloat,
} from "./gleam.mjs";
import * as $levels from "./levels.mjs";
import * as $parser from "./parser.mjs";
import * as $render from "./render.mjs";
import * as $shape from "./shape.mjs";
import { Line, Path, Point } from "./shape.mjs";
import * as $tutorial from "./tutorial.mjs";

const FILEPATH = "src/app.gleam";

export class Model extends $CustomType {
  constructor(source, drawings, current, menu_revision, code_open, output, shape_slider, speed, controls_open, cursor, game_on, level_codes, level, anchor, target, stage, ghosts, status, guide) {
    super();
    this.source = source;
    this.drawings = drawings;
    this.current = current;
    this.menu_revision = menu_revision;
    this.code_open = code_open;
    this.output = output;
    this.shape_slider = shape_slider;
    this.speed = speed;
    this.controls_open = controls_open;
    this.cursor = cursor;
    this.game_on = game_on;
    this.level_codes = level_codes;
    this.level = level;
    this.anchor = anchor;
    this.target = target;
    this.stage = stage;
    this.ghosts = ghosts;
    this.status = status;
    this.guide = guide;
  }
}
export const Model$Model = (source, drawings, current, menu_revision, code_open, output, shape_slider, speed, controls_open, cursor, game_on, level_codes, level, anchor, target, stage, ghosts, status, guide) =>
  new Model(source,
  drawings,
  current,
  menu_revision,
  code_open,
  output,
  shape_slider,
  speed,
  controls_open,
  cursor,
  game_on,
  level_codes,
  level,
  anchor,
  target,
  stage,
  ghosts,
  status,
  guide);
export const Model$isModel = (value) => value instanceof Model;
export const Model$Model$source = (value) => value.source;
export const Model$Model$0 = (value) => value.source;
export const Model$Model$drawings = (value) => value.drawings;
export const Model$Model$1 = (value) => value.drawings;
export const Model$Model$current = (value) => value.current;
export const Model$Model$2 = (value) => value.current;
export const Model$Model$menu_revision = (value) => value.menu_revision;
export const Model$Model$3 = (value) => value.menu_revision;
export const Model$Model$code_open = (value) => value.code_open;
export const Model$Model$4 = (value) => value.code_open;
export const Model$Model$output = (value) => value.output;
export const Model$Model$5 = (value) => value.output;
export const Model$Model$shape_slider = (value) => value.shape_slider;
export const Model$Model$6 = (value) => value.shape_slider;
export const Model$Model$speed = (value) => value.speed;
export const Model$Model$7 = (value) => value.speed;
export const Model$Model$controls_open = (value) => value.controls_open;
export const Model$Model$8 = (value) => value.controls_open;
export const Model$Model$cursor = (value) => value.cursor;
export const Model$Model$9 = (value) => value.cursor;
export const Model$Model$game_on = (value) => value.game_on;
export const Model$Model$10 = (value) => value.game_on;
export const Model$Model$level_codes = (value) => value.level_codes;
export const Model$Model$11 = (value) => value.level_codes;
export const Model$Model$level = (value) => value.level;
export const Model$Model$12 = (value) => value.level;
export const Model$Model$anchor = (value) => value.anchor;
export const Model$Model$13 = (value) => value.anchor;
export const Model$Model$target = (value) => value.target;
export const Model$Model$14 = (value) => value.target;
export const Model$Model$stage = (value) => value.stage;
export const Model$Model$15 = (value) => value.stage;
export const Model$Model$ghosts = (value) => value.ghosts;
export const Model$Model$16 = (value) => value.ghosts;
export const Model$Model$status = (value) => value.status;
export const Model$Model$17 = (value) => value.status;
export const Model$Model$guide = (value) => value.guide;
export const Model$Model$18 = (value) => value.guide;

export class Playing extends $CustomType {}
export const Status$Playing$const = new Playing();
export const Status$Playing = () => Status$Playing$const;
export const Status$isPlaying = (value) => value instanceof Playing;

export class LevelWon extends $CustomType {}
export const Status$LevelWon$const = new LevelWon();
export const Status$LevelWon = () => Status$LevelWon$const;
export const Status$isLevelWon = (value) => value instanceof LevelWon;

export class LevelLost extends $CustomType {
  constructor(reason) {
    super();
    this.reason = reason;
  }
}
export const Status$LevelLost = (reason) => new LevelLost(reason);
export const Status$isLevelLost = (value) => value instanceof LevelLost;
export const Status$LevelLost$reason = (value) => value.reason;
export const Status$LevelLost$0 = (value) => value.reason;

export class SetCode extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetCode = ($0) => new SetCode($0);
export const Msg$isSetCode = (value) => value instanceof SetCode;
export const Msg$SetCode$0 = (value) => value[0];

export class SelectDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectDrawing = ($0) => new SelectDrawing($0);
export const Msg$isSelectDrawing = (value) => value instanceof SelectDrawing;
export const Msg$SelectDrawing$0 = (value) => value[0];

export class CreateDrawing extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$CreateDrawing = ($0) => new CreateDrawing($0);
export const Msg$isCreateDrawing = (value) => value instanceof CreateDrawing;
export const Msg$CreateDrawing$0 = (value) => value[0];

export class SetShapeSlider extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetShapeSlider = ($0) => new SetShapeSlider($0);
export const Msg$isSetShapeSlider = (value) => value instanceof SetShapeSlider;
export const Msg$SetShapeSlider$0 = (value) => value[0];

export class SetSpeed extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SetSpeed = ($0) => new SetSpeed($0);
export const Msg$isSetSpeed = (value) => value instanceof SetSpeed;
export const Msg$SetSpeed$0 = (value) => value[0];

export class Reset extends $CustomType {}
export const Msg$Reset$const = new Reset();
export const Msg$Reset = () => Msg$Reset$const;
export const Msg$isReset = (value) => value instanceof Reset;

export class Play extends $CustomType {}
export const Msg$Play$const = new Play();
export const Msg$Play = () => Msg$Play$const;
export const Msg$isPlay = (value) => value instanceof Play;

export class Pause extends $CustomType {}
export const Msg$Pause$const = new Pause();
export const Msg$Pause = () => Msg$Pause$const;
export const Msg$isPause = (value) => value instanceof Pause;

export class ToggleCode extends $CustomType {}
export const Msg$ToggleCode$const = new ToggleCode();
export const Msg$ToggleCode = () => Msg$ToggleCode$const;
export const Msg$isToggleCode = (value) => value instanceof ToggleCode;

export class ToggleControls extends $CustomType {}
export const Msg$ToggleControls$const = new ToggleControls();
export const Msg$ToggleControls = () => Msg$ToggleControls$const;
export const Msg$isToggleControls = (value) => value instanceof ToggleControls;

export class CursorMoved extends $CustomType {
  constructor($0, $1, $2, $3) {
    super();
    this[0] = $0;
    this[1] = $1;
    this[2] = $2;
    this[3] = $3;
  }
}
export const Msg$CursorMoved = ($0, $1, $2, $3) =>
  new CursorMoved($0, $1, $2, $3);
export const Msg$isCursorMoved = (value) => value instanceof CursorMoved;
export const Msg$CursorMoved$0 = (value) => value[0];
export const Msg$CursorMoved$1 = (value) => value[1];
export const Msg$CursorMoved$2 = (value) => value[2];
export const Msg$CursorMoved$3 = (value) => value[3];

export class CursorLeft extends $CustomType {}
export const Msg$CursorLeft$const = new CursorLeft();
export const Msg$CursorLeft = () => Msg$CursorLeft$const;
export const Msg$isCursorLeft = (value) => value instanceof CursorLeft;

export class ToggleGame extends $CustomType {}
export const Msg$ToggleGame$const = new ToggleGame();
export const Msg$ToggleGame = () => Msg$ToggleGame$const;
export const Msg$isToggleGame = (value) => value instanceof ToggleGame;

export class SelectLevel extends $CustomType {
  constructor($0) {
    super();
    this[0] = $0;
  }
}
export const Msg$SelectLevel = ($0) => new SelectLevel($0);
export const Msg$isSelectLevel = (value) => value instanceof SelectLevel;
export const Msg$SelectLevel$0 = (value) => value[0];

export class RestartLevel extends $CustomType {}
export const Msg$RestartLevel$const = new RestartLevel();
export const Msg$RestartLevel = () => Msg$RestartLevel$const;
export const Msg$isRestartLevel = (value) => value instanceof RestartLevel;

export class GameEvent extends $CustomType {
  constructor($0, $1) {
    super();
    this[0] = $0;
    this[1] = $1;
  }
}
export const Msg$GameEvent = ($0, $1) => new GameEvent($0, $1);
export const Msg$isGameEvent = (value) => value instanceof GameEvent;
export const Msg$GameEvent$0 = (value) => value[0];
export const Msg$GameEvent$1 = (value) => value[1];

export class OpenGuide extends $CustomType {}
export const Msg$OpenGuide$const = new OpenGuide();
export const Msg$OpenGuide = () => Msg$OpenGuide$const;
export const Msg$isOpenGuide = (value) => value instanceof OpenGuide;

export class CloseGuide extends $CustomType {}
export const Msg$CloseGuide$const = new CloseGuide();
export const Msg$CloseGuide = () => Msg$CloseGuide$const;
export const Msg$isCloseGuide = (value) => value instanceof CloseGuide;

export class GuideNext extends $CustomType {}
export const Msg$GuideNext$const = new GuideNext();
export const Msg$GuideNext = () => Msg$GuideNext$const;
export const Msg$isGuideNext = (value) => value instanceof GuideNext;

export class GuideBack extends $CustomType {}
export const Msg$GuideBack$const = new GuideBack();
export const Msg$GuideBack = () => Msg$GuideBack$const;
export const Msg$isGuideBack = (value) => value instanceof GuideBack;

export class GuideToTutorial extends $CustomType {}
export const Msg$GuideToTutorial$const = new GuideToTutorial();
export const Msg$GuideToTutorial = () => Msg$GuideToTutorial$const;
export const Msg$isGuideToTutorial = (value) =>
  value instanceof GuideToTutorial;

const red_color = "#ff4d4d";

const default_shape_slider = 10;

const anchor_color = "#ffcb6b";

const target_color = "#8a7440";

const ghost_color = "#8a9cc0";

const goal_color = "#4caf7a";

const faded_color = "#4a5570";

const player_color = "#cfe3ff";

const new_drawing_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(Point(0, 0), Point(100, 100)), 0, 10, 2)]\n}\n";

const new_drawing_option = "";

const shape_slider_max = 100;

const shape_slider_min = 0;

const speed_max = 6.0;

const speed_min = -6.0;

/**
 * Your app's public address, once you've deployed it in Problem 13, such as
 * "https://your-username.github.io/animator/".
 */
export const public_url = "";

/**
 * Set to True if you would like your app's URL included in the course gallery.
 */
export const include_app_in_gallery = false;

/**
 * A link to your video from Problem 14, which anyone with the link can watch.
 */
export const video_url = "";

/**
 * Set to True if you would like your video included in the course gallery.
 */
export const include_video_in_gallery = false;

function start_clocks(level, speed, guide_open) {
  $render.set_red_drawing(
    $list.map(
      level.red,
      (_capture) => { return $render.render_path(_capture, red_color); },
    ),
    level.loop,
  );
  $render.reset_red_clock();
  $render.reset_clock();
  if (guide_open) {
    $render.set_red_speed(0.0);
    return $render.set_speed(0.0);
  } else {
    $render.set_red_speed(1.0);
    return $render.set_speed(speed);
  }
}

function find_level(name) {
  return $list.find($levels.all(), (l) => { return l.name === name; });
}

function open_level(model, name) {
  let $ = find_level(name);
  let $1 = $list.key_find(model.level_codes, name);
  if ($ instanceof Ok && $1 instanceof Ok) {
    let level = $[0];
    let source = $1[0];
    let speed = model.speed;
    let guide_open = $option.is_some(model.guide);
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision + 1,
        model.code_open,
        "",
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        true,
        model.level_codes,
        name,
        level.start,
        Option$None$const,
        $List$Empty$const,
        $List$Empty$const,
        Status$Playing$const,
        model.guide,
      ),
      $effect.batch(
        listPrepend(
          $effect.from(
            (_) => {
              $data.save_game_on(true);
              $data.save_level(name);
              return start_clocks(level, speed, guide_open);
            },
          ),
          listPrepend(
            $editor.mount(source, (var0) => { return new SetCode(var0); }),
            listPrepend(
              $effect.from(
                (dispatch) => { return dispatch(new SetCode(source)); },
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    ];
  } else {
    return [model, $effect.none()];
  }
}

export function init(_) {
  let drawings = $data.load_library();
  let _block;
  if (drawings instanceof $Empty) {
    _block = "";
  } else {
    let name = drawings.head[0];
    _block = name;
  }
  let first = _block;
  let _block$1;
  let $ = $data.load_current();
  if ($ instanceof Ok) {
    let name = $[0];
    let $1 = $list.key_find(drawings, name);
    if ($1 instanceof Ok) {
      _block$1 = name;
    } else {
      _block$1 = first;
    }
  } else {
    _block$1 = first;
  }
  let current = _block$1;
  let _block$2;
  let _pipe = $list.key_find(drawings, current);
  _block$2 = $result.unwrap(_pipe, "");
  let source = _block$2;
  let level_codes = $list.map(
    $levels.all(),
    (l) => {
      return [
        l.name,
        (() => {
          let _pipe$1 = $data.load_level_code(l.name);
          return $result.unwrap(_pipe$1, l.starter);
        })(),
      ];
    },
  );
  let _block$3;
  if (level_codes instanceof $Empty) {
    _block$3 = "";
  } else {
    let name = level_codes.head[0];
    _block$3 = name;
  }
  let first_level = _block$3;
  let _block$4;
  let $1 = $data.load_level();
  if ($1 instanceof Ok) {
    let name = $1[0];
    let $2 = $list.key_find(level_codes, name);
    if ($2 instanceof Ok) {
      _block$4 = name;
    } else {
      _block$4 = first_level;
    }
  } else {
    _block$4 = first_level;
  }
  let level = _block$4;
  let model = new Model(
    source,
    drawings,
    current,
    0,
    true,
    "",
    default_shape_slider,
    1.0,
    true,
    Option$None$const,
    false,
    level_codes,
    level,
    new Point(0.0, 0.0),
    Option$None$const,
    $List$Empty$const,
    $List$Empty$const,
    Status$Playing$const,
    Option$None$const,
  );
  let $2 = $data.load_game_on();
  if ($2) {
    return open_level(model, level);
  } else {
    return [
      model,
      $effect.batch(
        listPrepend(
          $editor.mount(source, (var0) => { return new SetCode(var0); }),
          listPrepend(
            $effect.from(
              (dispatch) => { return dispatch(new SetCode(source)); },
            ),
            $List$Empty$const,
          ),
        ),
      ),
    ];
  }
}

function run_source(shape_slider, source) {
  let $ = $parser.parse_program(source, $builtins.global_frame());
  if ($ instanceof Ok) {
    let program = $[0];
    let _pipe = $drawing.try_draw(shape_slider, program);
    return $result.map_error(_pipe, $errors.error_message);
  } else {
    return $;
  }
}

function end_level(model, status) {
  return [
    new Model(
      model.source,
      model.drawings,
      model.current,
      model.menu_revision,
      model.code_open,
      model.output,
      model.shape_slider,
      model.speed,
      model.controls_open,
      model.cursor,
      model.game_on,
      model.level_codes,
      model.level,
      model.anchor,
      model.target,
      model.stage,
      model.ghosts,
      status,
      model.guide,
    ),
    $effect.from(
      (_) => {
        $render.clear_on_frame();
        $render.set_speed(0.0);
        return $render.set_red_speed(0.0);
      },
    ),
  ];
}

function counting(model) {
  return $list.filter(
    model.stage,
    (_capture) => { return $game.counts(_capture, model.anchor); },
  );
}

function instant(a, b, thickness) {
  return new Path(new Line(a, b), 0.0, 0.0, thickness);
}

function marker(p, r, thickness, color) {
  let n = new Point(p.x, p.y - r);
  let e = new Point(p.x + r, p.y);
  let s = new Point(p.x, p.y + r);
  let w = new Point(p.x - r, p.y);
  return $list.map(
    listPrepend(
      [n, e],
      listPrepend(
        [e, s],
        listPrepend([s, w], listPrepend([w, n], $List$Empty$const)),
      ),
    ),
    (side) => {
      return $render.render_path(instant(side[0], side[1], thickness), color);
    },
  );
}

function fixed_layer(model) {
  let middle = ($game.top + $game.goal) / 2.0;
  let goal = $render.render_path(
    instant(
      new Point(0.0 - $game.edge, middle),
      new Point($game.edge, middle),
      $game.goal - $game.top,
    ),
    goal_color,
  );
  let ghosts = $list.map(
    model.ghosts,
    (_capture) => { return $render.render_path(_capture, ghost_color); },
  );
  let _block;
  let $ = model.target;
  if ($ instanceof Some) {
    let p = $[0];
    _block = marker(p, 8.0, 2.0, target_color);
  } else {
    _block = $List$Empty$const;
  }
  let target = _block;
  return $list.flatten(
    listPrepend(
      listPrepend(goal, $List$Empty$const),
      listPrepend(
        ghosts,
        listPrepend(
          target,
          listPrepend(
            marker(model.anchor, 12.0, 3.0, anchor_color),
            $List$Empty$const,
          ),
        ),
      ),
    ),
  );
}

function show_game(model, dispatch) {
  $render.set_drawing(
    $list.map(
      model.stage,
      (p) => {
        return $render.render_path(
          p,
          (() => {
            let $ = $game.counts(p, model.anchor);
            if ($) {
              return player_color;
            } else {
              return faded_color;
            }
          })(),
        );
      },
    ),
  );
  $render.set_fixed(fixed_layer(model));
  let $ = model.status;
  let $1 = find_level(model.level);
  if ($1 instanceof Ok && $ instanceof Playing) {
    let level = $1[0];
    let snapshot = new $game.Snapshot(
      model.anchor,
      model.target,
      counting(model),
      model.ghosts,
      level.red,
    );
    return $render.on_frame(
      (t, red_t) => {
        let $2 = $game.check(snapshot, t, red_t);
        if ($2 instanceof Some) {
          let event = $2[0];
          dispatch(new GameEvent(event, t));
          return true;
        } else {
          return false;
        }
      },
    );
  } else {
    return $render.clear_on_frame();
  }
}

function game_redraw(model) {
  let _block;
  let $ = $game.run(model.source, model.shape_slider, model.anchor);
  if ($ instanceof Ok) {
    let paths = $[0][0];
    let target = $[0][1];
    _block = new Model(
      model.source,
      model.drawings,
      model.current,
      model.menu_revision,
      model.code_open,
      "",
      model.shape_slider,
      model.speed,
      model.controls_open,
      model.cursor,
      model.game_on,
      model.level_codes,
      model.level,
      model.anchor,
      target,
      paths,
      model.ghosts,
      model.status,
      model.guide,
    );
  } else {
    let msg = $[0];
    _block = new Model(
      model.source,
      model.drawings,
      model.current,
      model.menu_revision,
      model.code_open,
      msg,
      model.shape_slider,
      model.speed,
      model.controls_open,
      model.cursor,
      model.game_on,
      model.level_codes,
      model.level,
      model.anchor,
      Option$None$const,
      $List$Empty$const,
      model.ghosts,
      model.status,
      model.guide,
    );
  }
  let model$1 = _block;
  return [
    model$1,
    $effect.from((dispatch) => { return show_game(model$1, dispatch); }),
  ];
}

function close_guide(model) {
  let speed = model.speed;
  let resume = model.game_on && (model.status instanceof Playing);
  return [
    new Model(
      model.source,
      model.drawings,
      model.current,
      model.menu_revision,
      model.code_open,
      model.output,
      model.shape_slider,
      model.speed,
      model.controls_open,
      model.cursor,
      model.game_on,
      model.level_codes,
      model.level,
      model.anchor,
      model.target,
      model.stage,
      model.ghosts,
      model.status,
      Option$None$const,
    ),
    $effect.from(
      (_) => {
        if (resume) {
          $render.set_speed(speed);
          return $render.set_red_speed(1.0);
        } else {
          return undefined;
        }
      },
    ),
  ];
}

function open_guide(model) {
  return [
    new Model(
      model.source,
      model.drawings,
      model.current,
      model.menu_revision,
      model.code_open,
      model.output,
      model.shape_slider,
      model.speed,
      model.controls_open,
      model.cursor,
      model.game_on,
      model.level_codes,
      model.level,
      model.anchor,
      model.target,
      model.stage,
      model.ghosts,
      model.status,
      new Some(0),
    ),
    $effect.from(
      (_) => {
        $data.save_guide_seen();
        $render.set_speed(0.0);
        return $render.set_red_speed(0.0);
      },
    ),
  ];
}

function open_drawing(model, name) {
  let $ = $list.key_find(model.drawings, name);
  if ($ instanceof Ok) {
    let source = $[0];
    return [
      new Model(
        model.source,
        model.drawings,
        name,
        model.menu_revision + 1,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        model.guide,
      ),
      $effect.batch(
        listPrepend(
          $effect.from(
            (_) => {
              $data.save_current(name);
              return $render.reset_clock();
            },
          ),
          listPrepend(
            $editor.mount(source, (var0) => { return new SetCode(var0); }),
            listPrepend(
              $effect.from(
                (dispatch) => { return dispatch(new SetCode(source)); },
              ),
              $List$Empty$const,
            ),
          ),
        ),
      ),
    ];
  } else {
    return [model, $effect.none()];
  }
}

function set_speed(model, rate) {
  let model$1 = new Model(
    model.source,
    model.drawings,
    model.current,
    model.menu_revision,
    model.code_open,
    model.output,
    model.shape_slider,
    rate,
    model.controls_open,
    model.cursor,
    model.game_on,
    model.level_codes,
    model.level,
    model.anchor,
    model.target,
    model.stage,
    model.ghosts,
    model.status,
    model.guide,
  );
  let apply = $effect.from((_) => { return $render.set_speed(rate); });
  let $ = model$1.game_on;
  let $1 = model$1.status;
  if ($) {
    if ($1 instanceof Playing) {
      let $2 = (rate < 0.0) && (!(model$1.ghosts instanceof $Empty));
      if ($2) {
        let $3 = game_redraw(
          new Model(
            model$1.source,
            model$1.drawings,
            model$1.current,
            model$1.menu_revision,
            model$1.code_open,
            model$1.output,
            model$1.shape_slider,
            model$1.speed,
            model$1.controls_open,
            model$1.cursor,
            model$1.game_on,
            model$1.level_codes,
            model$1.level,
            model$1.anchor,
            model$1.target,
            model$1.stage,
            $List$Empty$const,
            model$1.status,
            model$1.guide,
          ),
        );
        let model$2 = $3[0];
        let draw_effect = $3[1];
        return [
          model$2,
          $effect.batch(
            listPrepend(apply, listPrepend(draw_effect, $List$Empty$const)),
          ),
        ];
      } else {
        return [model$1, apply];
      }
    } else {
      return [model$1, $effect.none()];
    }
  } else {
    return [model$1, apply];
  }
}

function parse_number(text) {
  let $ = $float.parse(text);
  if ($ instanceof Ok) {
    return $;
  } else {
    let _pipe = $int.parse(text);
    return $result.map(_pipe, $int.to_float);
  }
}

function redraw(model) {
  return $bool.lazy_guard(
    model.game_on,
    () => { return game_redraw(model); },
    () => {
      let $ = run_source(model.shape_slider, model.source);
      if ($ instanceof Ok) {
        let paths = $[0];
        return [
          new Model(
            model.source,
            model.drawings,
            model.current,
            model.menu_revision,
            model.code_open,
            "",
            model.shape_slider,
            model.speed,
            model.controls_open,
            model.cursor,
            model.game_on,
            model.level_codes,
            model.level,
            model.anchor,
            model.target,
            model.stage,
            model.ghosts,
            model.status,
            model.guide,
          ),
          $effect.from(
            (_) => {
              let _pipe = paths;
              let _pipe$1 = $list.map(
                _pipe,
                (p) => { return $render.render_path(p, "#cfe3ff"); },
              );
              return $render.set_drawing(_pipe$1);
            },
          ),
        ];
      } else {
        let msg = $[0];
        return [
          new Model(
            model.source,
            model.drawings,
            model.current,
            model.menu_revision,
            model.code_open,
            msg,
            model.shape_slider,
            model.speed,
            model.controls_open,
            model.cursor,
            model.game_on,
            model.level_codes,
            model.level,
            model.anchor,
            model.target,
            model.stage,
            model.ghosts,
            model.status,
            model.guide,
          ),
          $effect.from(
            (_) => { return $render.set_drawing($List$Empty$const); },
          ),
        ];
      }
    },
  );
}

function replace_key(pairs, key, value) {
  return $list.map(
    pairs,
    (pair) => {
      let $ = pair[0] === key;
      if ($) {
        return [key, value];
      } else {
        return pair;
      }
    },
  );
}

export function update(model, msg) {
  if (msg instanceof SetCode) {
    let text = msg[0];
    let $ = model.game_on;
    if ($) {
      let level = model.level;
      let level_codes = replace_key(model.level_codes, level, text);
      let $1 = redraw(
        new Model(
          text,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
      );
      let model$1 = $1[0];
      let draw_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(
            $effect.from((_) => { return $data.save_level_code(level, text); }),
            listPrepend(draw_effect, $List$Empty$const),
          ),
        ),
      ];
    } else {
      let drawings = replace_key(model.drawings, model.current, text);
      let $1 = redraw(
        new Model(
          text,
          drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
      );
      let model$1 = $1[0];
      let draw_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(
            $effect.from((_) => { return $data.save_library(drawings); }),
            listPrepend(draw_effect, $List$Empty$const),
          ),
        ),
      ];
    }
  } else if (msg instanceof SelectDrawing) {
    let value = msg[0];
    let $ = value === new_drawing_option;
    if ($) {
      return [
        model,
        $effect.from(
          (dispatch) => {
            return dispatch(new CreateDrawing($data.prompt_drawing_name()));
          },
        ),
      ];
    } else {
      return open_drawing(model, value);
    }
  } else if (msg instanceof CreateDrawing) {
    let name = msg[0];
    let name$1 = $string.trim(name);
    let $ = $list.key_find(model.drawings, name$1);
    if (name$1 === "") {
      return [
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision + 1,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
        $effect.none(),
      ];
    } else if ($ instanceof Ok) {
      return open_drawing(model, name$1);
    } else {
      let drawings = $list.append(
        model.drawings,
        listPrepend([name$1, new_drawing_code], $List$Empty$const),
      );
      let $1 = open_drawing(
        new Model(
          model.source,
          drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
        name$1,
      );
      let model$1 = $1[0];
      let open_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(
            $effect.from((_) => { return $data.save_library(drawings); }),
            listPrepend(open_effect, $List$Empty$const),
          ),
        ),
      ];
    }
  } else if (msg instanceof SetShapeSlider) {
    let value = msg[0];
    let $ = $int.parse(value);
    if ($ instanceof Ok) {
      let n = $[0];
      return redraw(
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          n,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
      );
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof SetSpeed) {
    let value = msg[0];
    let $ = parse_number(value);
    if ($ instanceof Ok) {
      let rate = $[0];
      return set_speed(model, rate);
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof Reset) {
    let reset = $effect.from((_) => { return $render.reset_clock(); });
    let $ = model.game_on;
    if ($) {
      let $1 = game_redraw(
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          $List$Empty$const,
          model.status,
          model.guide,
        ),
      );
      let model$1 = $1[0];
      let draw_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(reset, listPrepend(draw_effect, $List$Empty$const)),
        ),
      ];
    } else {
      return [model, reset];
    }
  } else if (msg instanceof Play) {
    return set_speed(model, 1.0);
  } else if (msg instanceof Pause) {
    return set_speed(model, 0.0);
  } else if (msg instanceof ToggleCode) {
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        !model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        model.guide,
      ),
      $effect.none(),
    ];
  } else if (msg instanceof ToggleControls) {
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        !model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        model.guide,
      ),
      $effect.none(),
    ];
  } else if (msg instanceof CursorMoved) {
    let x = msg[0];
    let y = msg[1];
    let width = msg[2];
    let height = msg[3];
    let $ = (width > 0.0) && (height > 0.0);
    if ($) {
      return [
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          new Some(
            [
              $float.round(((divideFloat(x, width)) * 1000.0) - 500.0),
              $float.round(((divideFloat(y, height)) * 1000.0) - 500.0),
            ],
          ),
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
        $effect.none(),
      ];
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof CursorLeft) {
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        Option$None$const,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        model.guide,
      ),
      $effect.none(),
    ];
  } else if (msg instanceof ToggleGame) {
    let $ = model.game_on;
    if ($) {
      let speed = model.speed;
      let $1 = open_drawing(
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          false,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          model.guide,
        ),
        model.current,
      );
      let model$1 = $1[0];
      let open_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(
            $effect.from(
              (_) => {
                $data.save_game_on(false);
                $render.clear_on_frame();
                $render.set_red_drawing($List$Empty$const, false);
                $render.set_fixed($List$Empty$const);
                return $render.set_speed(speed);
              },
            ),
            listPrepend(open_effect, $List$Empty$const),
          ),
        ),
      ];
    } else {
      let first_time = !$data.load_guide_seen();
      let _block;
      if (first_time) {
        _block = new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          model.anchor,
          model.target,
          model.stage,
          model.ghosts,
          model.status,
          new Some(0),
        );
      } else {
        _block = model;
      }
      let model$1 = _block;
      let $1 = open_level(model$1, model$1.level);
      let model$2 = $1[0];
      let open_effect = $1[1];
      if (first_time) {
        return [
          model$2,
          $effect.batch(
            listPrepend(
              open_effect,
              listPrepend(
                $effect.from((_) => { return $data.save_guide_seen(); }),
                $List$Empty$const,
              ),
            ),
          ),
        ];
      } else {
        return [model$2, open_effect];
      }
    }
  } else if (msg instanceof SelectLevel) {
    let name = msg[0];
    return open_level(model, name);
  } else if (msg instanceof RestartLevel) {
    let $ = find_level(model.level);
    if ($ instanceof Ok) {
      let level = $[0];
      let speed = model.speed;
      let guide_open = $option.is_some(model.guide);
      let $1 = game_redraw(
        new Model(
          model.source,
          model.drawings,
          model.current,
          model.menu_revision,
          model.code_open,
          model.output,
          model.shape_slider,
          model.speed,
          model.controls_open,
          model.cursor,
          model.game_on,
          model.level_codes,
          model.level,
          level.start,
          model.target,
          model.stage,
          $List$Empty$const,
          Status$Playing$const,
          model.guide,
        ),
      );
      let model$1 = $1[0];
      let draw_effect = $1[1];
      return [
        model$1,
        $effect.batch(
          listPrepend(
            $effect.from(
              (_) => { return start_clocks(level, speed, guide_open); },
            ),
            listPrepend(draw_effect, $List$Empty$const),
          ),
        ),
      ];
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof GameEvent) {
    let event = msg[0];
    let t = msg[1];
    let $ = model.game_on;
    let $1 = model.status;
    if ($ && $1 instanceof Playing) {
      if (event instanceof $game.AnchorReached) {
        let point = event[0];
        let ghosts = $list.append(
          model.ghosts,
          $game.freeze(counting(model), t),
        );
        let $2 = game_redraw(
          new Model(
            model.source,
            model.drawings,
            model.current,
            model.menu_revision,
            model.code_open,
            model.output,
            model.shape_slider,
            model.speed,
            model.controls_open,
            model.cursor,
            model.game_on,
            model.level_codes,
            model.level,
            point,
            model.target,
            model.stage,
            ghosts,
            model.status,
            model.guide,
          ),
        );
        let model$1 = $2[0];
        let draw_effect = $2[1];
        return [
          model$1,
          $effect.batch(
            listPrepend(
              $effect.from((_) => { return $render.reset_clock(); }),
              listPrepend(draw_effect, $List$Empty$const),
            ),
          ),
        ];
      } else if (event instanceof $game.Won) {
        return end_level(model, Status$LevelWon$const);
      } else if (event instanceof $game.Caught) {
        return end_level(model, new LevelLost("Caught!"));
      } else {
        return end_level(model, new LevelLost("Hit the edge!"));
      }
    } else {
      return [model, $effect.none()];
    }
  } else if (msg instanceof OpenGuide) {
    return open_guide(model);
  } else if (msg instanceof CloseGuide) {
    return close_guide(model);
  } else if (msg instanceof GuideNext) {
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        $option.map(
          model.guide,
          (i) => { return $int.min(i + 1, $tutorial.count() - 1); },
        ),
      ),
      $effect.none(),
    ];
  } else if (msg instanceof GuideBack) {
    return [
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        $option.map(model.guide, (i) => { return $int.max(i - 1, 0); }),
      ),
      $effect.none(),
    ];
  } else {
    return open_level(
      new Model(
        model.source,
        model.drawings,
        model.current,
        model.menu_revision,
        model.code_open,
        model.output,
        model.shape_slider,
        model.speed,
        model.controls_open,
        model.cursor,
        model.game_on,
        model.level_codes,
        model.level,
        model.anchor,
        model.target,
        model.stage,
        model.ghosts,
        model.status,
        Option$None$const,
      ),
      "Tutorial",
    );
  }
}

function view_guide(model) {
  let $ = model.game_on;
  let $1 = model.guide;
  if ($ && $1 instanceof Some) {
    let step = $1[0];
    return $tutorial.view(
      step,
      Msg$GuideBack$const,
      Msg$GuideNext$const,
      Msg$CloseGuide$const,
      Msg$GuideToTutorial$const,
    );
  } else {
    return $element.none();
  }
}

function playback_button(icon, label, msg, extra_class) {
  return $html.button(
    listPrepend(
      $attr.class$($string.trim("playback-btn " + extra_class)),
      listPrepend(
        $attr.title(label),
        listPrepend(
          $attr.attribute("aria-label", label),
          listPrepend($event.on_click(msg), $List$Empty$const),
        ),
      ),
    ),
    listPrepend($html.text(icon), $List$Empty$const),
  );
}

function view_controls(model) {
  let _block;
  let $1 = model.controls_open;
  if ($1) {
    _block = ["controls", "▾", "Hide controls"];
  } else {
    _block = ["controls collapsed", "▸", "Show controls"];
  }
  let $ = _block;
  let box_class = $[0];
  let toggle_icon = $[1];
  let toggle_title = $[2];
  let _block$1;
  let $3 = model.cursor;
  if ($3 instanceof Some) {
    let x = $3[0][0];
    let y = $3[0][1];
    _block$1 = [$int.to_string(x), $int.to_string(y)];
  } else {
    _block$1 = ["–", "–"];
  }
  let $2 = _block$1;
  let cursor_x = $2[0];
  let cursor_y = $2[1];
  return $html.div(
    listPrepend($attr.class$(box_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("controls-header"), $List$Empty$const),
        listPrepend(
          $html.span(
            listPrepend(
              $attr.class$("cursor-readout"),
              listPrepend(
                $attr.title("Cursor position on the canvas"),
                $List$Empty$const,
              ),
            ),
            listPrepend(
              $html.span(
                listPrepend($attr.class$("cursor-axis"), $List$Empty$const),
                listPrepend($html.text("x"), $List$Empty$const),
              ),
              listPrepend(
                $html.span(
                  listPrepend($attr.class$("cursor-value"), $List$Empty$const),
                  listPrepend($html.text(cursor_x), $List$Empty$const),
                ),
                listPrepend(
                  $html.span(
                    listPrepend($attr.class$("cursor-axis"), $List$Empty$const),
                    listPrepend($html.text("y"), $List$Empty$const),
                  ),
                  listPrepend(
                    $html.span(
                      listPrepend(
                        $attr.class$("cursor-value"),
                        $List$Empty$const,
                      ),
                      listPrepend($html.text(cursor_y), $List$Empty$const),
                    ),
                    $List$Empty$const,
                  ),
                ),
              ),
            ),
          ),
          listPrepend(
            $html.button(
              listPrepend(
                $attr.class$("controls-toggle"),
                listPrepend(
                  $attr.title(toggle_title),
                  listPrepend(
                    $attr.attribute("aria-label", toggle_title),
                    listPrepend(
                      $attr.attribute(
                        "aria-expanded",
                        (() => {
                          let $4 = model.controls_open;
                          if ($4) {
                            return "true";
                          } else {
                            return "false";
                          }
                        })(),
                      ),
                      listPrepend(
                        $event.on_click(Msg$ToggleControls$const),
                        $List$Empty$const,
                      ),
                    ),
                  ),
                ),
              ),
              listPrepend($html.text(toggle_icon), $List$Empty$const),
            ),
            $List$Empty$const,
          ),
        ),
      ),
      listPrepend(
        $html.div(
          listPrepend($attr.class$("control"), $List$Empty$const),
          listPrepend(
            $html.div(
              listPrepend($attr.class$("playback-buttons"), $List$Empty$const),
              listPrepend(
                playback_button("⟲", "Reset", Msg$Reset$const, "reset-btn"),
                listPrepend(
                  playback_button("▶\u{FE0E}", "Play", Msg$Play$const, ""),
                  listPrepend(
                    playback_button("❚❚", "Pause", Msg$Pause$const, ""),
                    $List$Empty$const,
                  ),
                ),
              ),
            ),
            listPrepend(
              $html.input(
                listPrepend(
                  $attr.type_("range"),
                  listPrepend(
                    $attr.min($float.to_string(speed_min)),
                    listPrepend(
                      $attr.max($float.to_string(speed_max)),
                      listPrepend(
                        $attr.step("0.1"),
                        listPrepend(
                          $attr.value($float.to_string(model.speed)),
                          listPrepend(
                            $attr.attribute("data-test-id", "speed-slider"),
                            listPrepend(
                              $event.on_input(
                                (var0) => { return new SetSpeed(var0); },
                              ),
                              $List$Empty$const,
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
              listPrepend(
                $html.span(
                  listPrepend($attr.class$("control-value"), $List$Empty$const),
                  listPrepend(
                    $html.text(
                      $float.to_string($float.to_precision(model.speed, 1)) + "×",
                    ),
                    $List$Empty$const,
                  ),
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
        listPrepend(
          $html.label(
            listPrepend($attr.class$("control"), $List$Empty$const),
            listPrepend(
              $html.span(
                listPrepend($attr.class$("control-label"), $List$Empty$const),
                listPrepend($html.text("shape_slider"), $List$Empty$const),
              ),
              listPrepend(
                $html.input(
                  listPrepend(
                    $attr.type_("range"),
                    listPrepend(
                      $attr.min($int.to_string(shape_slider_min)),
                      listPrepend(
                        $attr.max($int.to_string(shape_slider_max)),
                        listPrepend(
                          $attr.step("1"),
                          listPrepend(
                            $attr.value($int.to_string(model.shape_slider)),
                            listPrepend(
                              $attr.attribute("data-test-id", "shape-slider"),
                              listPrepend(
                                $event.on_input(
                                  (var0) => { return new SetShapeSlider(var0); },
                                ),
                                $List$Empty$const,
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
                listPrepend(
                  $html.span(
                    listPrepend(
                      $attr.class$("control-value"),
                      $List$Empty$const,
                    ),
                    listPrepend(
                      $html.text($int.to_string(model.shape_slider)),
                      $List$Empty$const,
                    ),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
          ),
          $List$Empty$const,
        ),
      ),
    ),
  );
}

function view_game_toggle(model) {
  return $html.button(
    listPrepend(
      $attr.class$("game-toggle"),
      listPrepend(
        $attr.title(
          (() => {
            let $ = model.game_on;
            if ($) {
              return "Back to drawing";
            } else {
              return "Play the game";
            }
          })(),
        ),
        listPrepend(
          $attr.attribute(
            "aria-pressed",
            (() => {
              let $ = model.game_on;
              if ($) {
                return "true";
              } else {
                return "false";
              }
            })(),
          ),
          listPrepend($event.on_click(Msg$ToggleGame$const), $List$Empty$const),
        ),
      ),
    ),
    listPrepend($html.text("Problem 12: Game"), $List$Empty$const),
  );
}

function banner(title, class$) {
  return $html.div(
    listPrepend($attr.class$(class$), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("banner-title"), $List$Empty$const),
        listPrepend($html.text(title), $List$Empty$const),
      ),
      listPrepend(
        $html.button(
          listPrepend(
            $attr.class$("library-btn"),
            listPrepend(
              $event.on_click(Msg$RestartLevel$const),
              $List$Empty$const,
            ),
          ),
          listPrepend($html.text("Restart level"), $List$Empty$const),
        ),
        $List$Empty$const,
      ),
    ),
  );
}

function view_banner(model) {
  let $ = model.game_on;
  let $1 = model.status;
  if ($) {
    if ($1 instanceof LevelWon) {
      return banner("Level complete!", "banner won");
    } else if ($1 instanceof LevelLost) {
      let reason = $1.reason;
      return banner(reason, "banner lost");
    } else {
      return $element.none();
    }
  } else {
    return $element.none();
  }
}

function cursor_decoder() {
  return $decode.field(
    "offsetX",
    $decode.float,
    (x) => {
      return $decode.field(
        "offsetY",
        $decode.float,
        (y) => {
          return $decode.subfield(
            listPrepend("target", listPrepend("clientWidth", $List$Empty$const)),
            $decode.float,
            (width) => {
              return $decode.subfield(
                listPrepend(
                  "target",
                  listPrepend("clientHeight", $List$Empty$const),
                ),
                $decode.float,
                (height) => {
                  return $decode.success(new CursorMoved(x, y, width, height));
                },
              );
            },
          );
        },
      );
    },
  );
}

function view_reveal_code(model) {
  let $ = model.code_open;
  if ($) {
    return $element.none();
  } else {
    return $html.button(
      listPrepend(
        $attr.class$("icon-btn reveal-code"),
        listPrepend(
          $attr.attribute("title", "Show code"),
          listPrepend($event.on_click(Msg$ToggleCode$const), $List$Empty$const),
        ),
      ),
      listPrepend($html.text("⟩"), $List$Empty$const),
    );
  }
}

function view_anim(model) {
  return $html.div(
    listPrepend($attr.class$("canvas-area"), $List$Empty$const),
    listPrepend(
      view_reveal_code(model),
      listPrepend(
        $html.canvas(
          listPrepend(
            $attr.id("animation-canvas"),
            listPrepend(
              $attr.class$("canvas"),
              listPrepend(
                $event.on("mousemove", cursor_decoder()),
                listPrepend(
                  $event.on("mouseleave", $decode.success(Msg$CursorLeft$const)),
                  $List$Empty$const,
                ),
              ),
            ),
          ),
        ),
        listPrepend(
          $html.pre(
            listPrepend($attr.class$("output"), $List$Empty$const),
            listPrepend($html.text(model.output), $List$Empty$const),
          ),
          listPrepend(
            view_banner(model),
            listPrepend(
              view_game_toggle(model),
              listPrepend(view_controls(model), $List$Empty$const),
            ),
          ),
        ),
      ),
    ),
  );
}

function view_level_menu(model) {
  return $html.select(
    listPrepend(
      $attr.class$("library-select"),
      listPrepend(
        $attr.attribute("aria-label", "Level"),
        listPrepend(
          $attr.attribute("data-test-id", "level-select"),
          listPrepend(
            $event.on_change((var0) => { return new SelectLevel(var0); }),
            $List$Empty$const,
          ),
        ),
      ),
    ),
    $list.map(
      $levels.all(),
      (l) => {
        return $html.option(
          listPrepend(
            $attr.value(l.name),
            listPrepend(
              $attr.selected(l.name === model.level),
              $List$Empty$const,
            ),
          ),
          l.name,
        );
      },
    ),
  );
}

function view_drawing_menu(model) {
  let options = $list.map(
    model.drawings,
    (d) => {
      return $html.option(
        listPrepend(
          $attr.value(d[0]),
          listPrepend($attr.selected(d[0] === model.current), $List$Empty$const),
        ),
        d[0],
      );
    },
  );
  return $html.select(
    listPrepend(
      $attr.class$("library-select"),
      listPrepend(
        $attr.attribute("aria-label", "Drawing"),
        listPrepend(
          $attr.attribute("data-test-id", "drawing-select"),
          listPrepend(
            $event.on_change((var0) => { return new SelectDrawing(var0); }),
            $List$Empty$const,
          ),
        ),
      ),
    ),
    $list.append(
      options,
      listPrepend(
        $html.option(
          listPrepend($attr.value(new_drawing_option), $List$Empty$const),
          "+ New drawing…",
        ),
        $List$Empty$const,
      ),
    ),
  );
}

function view_library(model) {
  let revision = $int.to_string(model.menu_revision);
  let $ = model.game_on;
  if ($) {
    return $keyed.div(
      listPrepend($attr.class$("library"), $List$Empty$const),
      listPrepend(
        ["levels-" + revision, view_level_menu(model)],
        listPrepend(
          [
            "restart",
            $html.button(
              listPrepend(
                $attr.class$("library-btn"),
                listPrepend(
                  $attr.title("Restart level"),
                  listPrepend(
                    $event.on_click(Msg$RestartLevel$const),
                    $List$Empty$const,
                  ),
                ),
              ),
              listPrepend($html.text("Restart"), $List$Empty$const),
            ),
          ],
          listPrepend(
            [
              "guide",
              $html.button(
                listPrepend(
                  $attr.class$("library-btn"),
                  listPrepend(
                    $attr.title("How to play"),
                    listPrepend(
                      $event.on_click(Msg$OpenGuide$const),
                      $List$Empty$const,
                    ),
                  ),
                ),
                listPrepend($html.text("How to play"), $List$Empty$const),
              ),
            ],
            $List$Empty$const,
          ),
        ),
      ),
    );
  } else {
    return $keyed.div(
      listPrepend($attr.class$("library"), $List$Empty$const),
      listPrepend(
        ["drawings-" + revision, view_drawing_menu(model)],
        $List$Empty$const,
      ),
    );
  }
}

export function view(model) {
  let _block;
  let $ = model.code_open;
  if ($) {
    _block = "app";
  } else {
    _block = "app code-hidden";
  }
  let app_class = _block;
  return $html.div(
    listPrepend($attr.class$(app_class), $List$Empty$const),
    listPrepend(
      $html.div(
        listPrepend($attr.class$("code-col"), $List$Empty$const),
        listPrepend(
          $editor.view_panel(
            Msg$ToggleCode$const,
            view_library(model),
            model.game_on && (model.level === "Tutorial"),
          ),
          $List$Empty$const,
        ),
      ),
      listPrepend(
        view_anim(model),
        listPrepend(view_guide(model), $List$Empty$const),
      ),
    ),
  );
}

export function main() {
  let app = $lustre.application(init, update, view);
  let $ = $lustre.start(app, "#app", undefined);
  if (!($ instanceof Ok)) {
    throw makeError(
      "let_assert",
      FILEPATH,
      "app",
      1098,
      "main",
      "Pattern match failed, no pattern matched the value.",
      {
        value: $,
        start: 34212,
        end: 34261,
        pattern_start: 34223,
        pattern_end: 34228
      }
    )
  }
  return undefined;
}
