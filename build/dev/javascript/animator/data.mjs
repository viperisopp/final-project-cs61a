//# sourceMappingURL=data.mjs.map
import * as $json from "../gleam_json/gleam/json.mjs";
import * as $decode from "../gleam_stdlib/gleam/dynamic/decode.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $result from "../gleam_stdlib/gleam/result.mjs";
import {
  storageGet as storage_get,
  storageSet as storage_set,
  promptDrawingName as prompt_drawing_name,
} from "./data_ffi.mjs";
import * as $examples from "./examples.mjs";
import { Ok, Empty as $Empty, isEqual } from "./gleam.mjs";

export { prompt_drawing_name, storage_get, storage_set };

const names_key = "animator:drawings";

const current_key = "animator:current";

const game_on_key = "animator:game";

const level_key = "animator:level";

const guide_seen_key = "animator:guide-seen";

function source_key(name) {
  return "animator:drawing:" + name;
}

/**
 * The saved drawings as #(name, source) pairs, in menu order. A browser with
 * no saved library (or one that can't be read) starts with examples.all.
 */
export function load_library() {
  let saved = $result.try$(
    storage_get(names_key),
    (text) => {
      let _pipe = $json.parse(text, $decode.list($decode.string));
      return $result.replace_error(_pipe, undefined);
    },
  );
  if (saved instanceof Ok) {
    let names = saved[0];
    let $ = $list.filter_map(
      names,
      (name) => {
        let _pipe = storage_get(source_key(name));
        return $result.map(_pipe, (source) => { return [name, source]; });
      },
    );
    if ($ instanceof $Empty) {
      return $examples.all;
    } else {
      return $;
    }
  } else {
    return $examples.all;
  }
}

/**
 * Save one drawing's source, exactly as typed.
 */
export function save_drawing(name, source) {
  return storage_set(source_key(name), source);
}

/**
 * Save the whole library: the menu order and every drawing's source.
 */
export function save_library(drawings) {
  $list.each(drawings, (d) => { return save_drawing(d[0], d[1]); });
  return storage_set(
    names_key,
    $json.to_string(
      $json.array($list.map(drawings, (d) => { return d[0]; }), $json.string),
    ),
  );
}

/**
 * The name of the drawing that was open last, if one was saved.
 */
export function load_current() {
  return storage_get(current_key);
}

/**
 * Remember which drawing is open, so a reload reopens it.
 */
export function save_current(name) {
  return storage_set(current_key, name);
}

function level_code_key(name) {
  return "animator:level-code:" + name;
}

/**
 * The player's saved code for the named level, if any.
 */
export function load_level_code(name) {
  return storage_get(level_code_key(name));
}

/**
 * Save the player's code for the named level, exactly as typed.
 */
export function save_level_code(name, source) {
  return storage_set(level_code_key(name), source);
}

/**
 * Whether game mode was on when the page was last used.
 */
export function load_game_on() {
  return isEqual(storage_get(game_on_key), new Ok("on"));
}

export function save_game_on(on) {
  return storage_set(
    game_on_key,
    (() => {
      if (on) {
        return "on";
      } else {
        return "off";
      }
    })(),
  );
}

/**
 * The name of the level that was open last, if one was saved.
 */
export function load_level() {
  return storage_get(level_key);
}

export function save_level(name) {
  return storage_set(level_key, name);
}

/**
 * Whether the game's "How to play" guide has been shown in this browser.
 */
export function load_guide_seen() {
  return isEqual(storage_get(guide_seen_key), new Ok("yes"));
}

export function save_guide_seen() {
  return storage_set(guide_seen_key, "yes");
}
