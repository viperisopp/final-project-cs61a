//// The library of saved drawings. A drawing is a name and the source of its draw
//// function.

import examples
import gleam/dynamic/decode
import gleam/json
import gleam/list
import gleam/result

// ── localStorage (data_ffi.mjs) ───────────────────────────────────────────────

/// The string stored in localStorage under key, or an Error if there isn't one.
@external(javascript, "./data_ffi.mjs", "storageGet")
pub fn storage_get(key: String) -> Result(String, Nil)

/// Store value in localStorage under key, replacing anything already there. If that
/// isn't possible, this logs the reason to the browser console.
@external(javascript, "./data_ffi.mjs", "storageSet")
pub fn storage_set(key: String, value: String) -> Nil

// ── The new-drawing prompt (data_ffi.mjs) ─────────────────────────────────────

/// Prompt the user to name a new drawing; "" (empty string) means they
/// cancelled or left it blank.
@external(javascript, "./data_ffi.mjs", "promptDrawingName")
pub fn prompt_drawing_name() -> String

// ── The saved library ─────────────────────────────────────────────────────────
//
// Each drawing's source is stored verbatim (not JSON-encoded) under its own key,
// so the text the user typed appears in localStorage exactly as written. A JSON
// list of names under names_key keeps the menu order, and current_key remembers
// which drawing was open.

const names_key = "animator:drawings"

const current_key = "animator:current"

fn source_key(name: String) -> String {
  "animator:drawing:" <> name
}

/// The saved drawings as #(name, source) pairs, in menu order. A browser with
/// no saved library (or one that can't be read) starts with examples.all.
pub fn load_library() -> List(#(String, String)) {
  let saved = {
    use text <- result.try(storage_get(names_key))
    json.parse(text, decode.list(decode.string))
    |> result.replace_error(Nil)
  }
  case saved {
    Error(Nil) -> examples.all
    Ok(names) ->
      case
        list.filter_map(names, fn(name) {
          storage_get(source_key(name))
          |> result.map(fn(source) { #(name, source) })
        })
      {
        [] -> examples.all
        drawings -> drawings
      }
  }
}

/// Save the whole library: the menu order and every drawing's source.
pub fn save_library(drawings: List(#(String, String))) -> Nil {
  list.each(drawings, fn(d) { save_drawing(d.0, d.1) })
  storage_set(
    names_key,
    json.to_string(json.array(list.map(drawings, fn(d) { d.0 }), json.string)),
  )
}

/// Save one drawing's source, exactly as typed.
pub fn save_drawing(name: String, source: String) -> Nil {
  storage_set(source_key(name), source)
}

/// The name of the drawing that was open last, if one was saved.
pub fn load_current() -> Result(String, Nil) {
  storage_get(current_key)
}

/// Remember which drawing is open, so a reload reopens it.
pub fn save_current(name: String) -> Nil {
  storage_set(current_key, name)
}

// ── Game mode ─────────────────────────────────────────────────────────────────
//
// Each level's code is stored verbatim under its own key, like a drawing's, and
// two more keys remember whether game mode was on and which level was open.

const game_on_key = "animator:game"

const level_key = "animator:level"

fn level_code_key(name: String) -> String {
  "animator:level-code:" <> name
}

/// The player's saved code for the named level, if any.
pub fn load_level_code(name: String) -> Result(String, Nil) {
  storage_get(level_code_key(name))
}

/// Save the player's code for the named level, exactly as typed.
pub fn save_level_code(name: String, source: String) -> Nil {
  storage_set(level_code_key(name), source)
}

/// Whether game mode was on when the page was last used.
pub fn load_game_on() -> Bool {
  storage_get(game_on_key) == Ok("on")
}

pub fn save_game_on(on: Bool) -> Nil {
  storage_set(game_on_key, case on {
    True -> "on"
    False -> "off"
  })
}

/// The name of the level that was open last, if one was saved.
pub fn load_level() -> Result(String, Nil) {
  storage_get(level_key)
}

pub fn save_level(name: String) -> Nil {
  storage_set(level_key, name)
}

const guide_seen_key = "animator:guide-seen"

/// Whether the game's "How to play" guide has been shown in this browser.
pub fn load_guide_seen() -> Bool {
  storage_get(guide_seen_key) == Ok("yes")
}

pub fn save_guide_seen() -> Nil {
  storage_set(guide_seen_key, "yes")
}
