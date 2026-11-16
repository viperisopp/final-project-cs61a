//// The game's levels: where the anchor starts, and the red ("evil") paths the
//// player must avoid. See game.gleam for the rules.
////
//// Coordinates are the canvas's: (0, 0) is the centre, x and y run from -500 to
//// 500, and y grows downward, so the top edge is y = -500.

import gleam/int
import shape.{type Path, type Point, Line, Path, Point}

pub type Level {
  Level(
    name: String,
    // Where the anchor is when the level starts or restarts.
    start: Point,
    // The red paths, timed on the red clock (tenths of a second).
    red: List(Path),
    // True: the red paths start over from an empty canvas after they finish.
    // False: they stay once drawn.
    loop: Bool,
    // The code the level starts with, before the player has edited it.
    starter: String,
  )
}

/// The code Level 2 starts with.
pub const starter_code =
  "fn draw(shape_slider: Int) -> List(Path) {
  [Path(Line(anchor, Point(anchor.x, anchor.y - 250)), 0, 10, 4)]
}

fn move_anchor(anchor: Point) -> Point {
  Point(anchor.x, anchor.y - 200)
}
"

/// Level 1's code: the same climb as starter_code, using the find_anchor
/// built-in to draw each line straight to the next anchor.
pub const level_1_code = "fn draw(shape_slider: Int) -> List(Path) {
  [find_anchor(0, 10, 4)]
}

fn move_anchor(anchor: Point) -> Point {
  Point(anchor.x, anchor.y - 200)
}
"

/// The Tutorial level's code: a working climb, explained step by step.
pub const tutorial_code =
  "// Tutorial: climb to the green bar at the top without
// touching a red line or the left and right edges. Press
// Restart to watch this code win, then try the experiments
// at the bottom.

// `anchor` is the gold diamond. Every line must start there.
// y grows downward, so going up means making y smaller.
fn draw(shape_slider: Int) -> List(Path) {
  // One line from the anchor, 300 units straight up, drawn
  // between time 0 and time 10 (tenths of a second).
  [Path(Line(anchor, Point(anchor.x, anchor.y - 300)), 0, 10, 4)]
}

// Where the anchor goes next: the small dark diamond. Once
// your line is drawn through it, the anchor jumps there, and
// draw runs again so your next line starts from it.
fn move_anchor(anchor: Point) -> Point {
  Point(anchor.x, anchor.y - 250)
}

// Experiments:
// 1. In draw, change anchor.x to anchor.x + 300. The line
//    misses the dark diamond, so the anchor stops moving.
// 2. Instead, change Point(anchor.x, anchor.y - 300) to
//    Point(300, -150). Your line now ends where the red line
//    is heading, so you are caught when it grows across to it.
// 3. Change the times 0, 10 to 0, 30. The climb is slower;
//    watch the red line grow while you wait.
// 4. Press Pause just after the anchor moves, then Reset.
//    Your old lines vanish but the anchor stays put.
"

/// Every level, in menu order.
/// PLACEHOLDERS: Level 1 and Level 2 are simple levels that exercise both kinds
/// of red drawing. The real levels are still to be designed.
pub fn all() -> List(Level) {
  [
    // Gentle: one slow red line that grows from the right edge toward the
    // left, stopping short of the straight climb up the middle.
    Level(
      name: "Tutorial",
      start: Point(0.0, 480.0),
      red: [red(500, -150, 150, -150, 0, 80)],
      loop: False,
      starter: tutorial_code,
    ),
    Level(
      name: "Level 1",
      start: Point(0.0, 480.0),
      red: [
        red(0, -500, 0, 150, 0, 40),
        red(0, -500, -350, 100, 5, 45),
        red(0, -500, 350, 100, 5, 45),
        red(0, -150, -200, 50, 20, 40),
      ],
      loop: False,
      starter: level_1_code,
    ),
    // A zigzag: rows that grow in from alternating side walls, each stopping
    // short of the far wall to leave a gap. Top row first, 0.4 s apart, each
    // taking 1.5 s; then they all clear and grow again. Weave through the gaps,
    // or time a dash across a row while it is clear.
    Level(
      name: "Level 2",
      start: Point(0.0, 480.0),
      red: [
        red(-500, -380, 180, -380, 0, 15),
        red(500, -260, -380, -260, 4, 19),
        red(-500, -140, 320, -140, 8, 23),
        red(500, -10, -320, -10, 12, 27),
        red(-500, 110, 220, 110, 16, 31),
        red(500, 220, -160, 220, 20, 35),
      ],
      loop: True,
      starter: starter_code,
    ),
  ]
}

// A red line from (x1, y1) to (x2, y2), drawn between start and end.
fn red(x1: Int, y1: Int, x2: Int, y2: Int, start: Int, end: Int) -> Path {
  Path(
    Line(point(x1, y1), point(x2, y2)),
    int.to_float(start),
    int.to_float(end),
    6.0,
  )
}

fn point(x: Int, y: Int) -> Point {
  Point(int.to_float(x), int.to_float(y))
}
