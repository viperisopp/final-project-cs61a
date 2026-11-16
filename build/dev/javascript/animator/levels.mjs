//# sourceMappingURL=levels.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import {
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";
import * as $shape from "./shape.mjs";
import { Line, Path, Point } from "./shape.mjs";

export class Level extends $CustomType {
  constructor(name, start, red, loop, starter) {
    super();
    this.name = name;
    this.start = start;
    this.red = red;
    this.loop = loop;
    this.starter = starter;
  }
}
export const Level$Level = (name, start, red, loop, starter) =>
  new Level(name, start, red, loop, starter);
export const Level$isLevel = (value) => value instanceof Level;
export const Level$Level$name = (value) => value.name;
export const Level$Level$0 = (value) => value.name;
export const Level$Level$start = (value) => value.start;
export const Level$Level$1 = (value) => value.start;
export const Level$Level$red = (value) => value.red;
export const Level$Level$2 = (value) => value.red;
export const Level$Level$loop = (value) => value.loop;
export const Level$Level$3 = (value) => value.loop;
export const Level$Level$starter = (value) => value.starter;
export const Level$Level$4 = (value) => value.starter;

/**
 * The code Level 2 starts with.
 */
export const starter_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(anchor, Point(anchor.x, anchor.y - 250)), 0, 10, 4)]\n}\n\nfn move_anchor(anchor: Point) -> Point {\n  Point(anchor.x, anchor.y - 200)\n}\n";

/**
 * Level 1's code: the same climb as starter_code, using the find_anchor
 * built-in to draw each line straight to the next anchor.
 */
export const level_1_code = "fn draw(shape_slider: Int) -> List(Path) {\n  [find_anchor(0, 10, 4)]\n}\n\nfn move_anchor(anchor: Point) -> Point {\n  Point(anchor.x, anchor.y - 200)\n}\n";

/**
 * The Tutorial level's code: a working climb, explained step by step.
 */
export const tutorial_code = "// Tutorial: climb to the green bar at the top without\n// touching a red line or the left and right edges. Press\n// Restart to watch this code win, then try the experiments\n// at the bottom.\n\n// `anchor` is the gold diamond. Every line must start there.\n// y grows downward, so going up means making y smaller.\nfn draw(shape_slider: Int) -> List(Path) {\n  // One line from the anchor, 300 units straight up, drawn\n  // between time 0 and time 10 (tenths of a second).\n  [Path(Line(anchor, Point(anchor.x, anchor.y - 300)), 0, 10, 4)]\n}\n\n// Where the anchor goes next: the small dark diamond. Once\n// your line is drawn through it, the anchor jumps there, and\n// draw runs again so your next line starts from it.\nfn move_anchor(anchor: Point) -> Point {\n  Point(anchor.x, anchor.y - 250)\n}\n\n// Experiments:\n// 1. In draw, change anchor.x to anchor.x + 300. The line\n//    misses the dark diamond, so the anchor stops moving.\n// 2. Instead, change Point(anchor.x, anchor.y - 300) to\n//    Point(300, -150). Your line now ends where the red line\n//    is heading, so you are caught when it grows across to it.\n// 3. Change the times 0, 10 to 0, 30. The climb is slower;\n//    watch the red line grow while you wait.\n// 4. Press Pause just after the anchor moves, then Reset.\n//    Your old lines vanish but the anchor stays put.\n";

function point(x, y) {
  return new Point($int.to_float(x), $int.to_float(y));
}

function red(x1, y1, x2, y2, start, end) {
  return new Path(
    new Line(point(x1, y1), point(x2, y2)),
    $int.to_float(start),
    $int.to_float(end),
    6.0,
  );
}

/**
 * Every level, in menu order.
 * PLACEHOLDERS: Level 1 and Level 2 are simple levels that exercise both kinds
 * of red drawing. The real levels are still to be designed.
 */
export function all() {
  return listPrepend(
    new Level(
      "Tutorial",
      new Point(0.0, 480.0),
      listPrepend(red(500, -150, 150, -150, 0, 80), $List$Empty$const),
      false,
      tutorial_code,
    ),
    listPrepend(
      new Level(
        "Level 1",
        new Point(0.0, 480.0),
        listPrepend(
          red(0, -500, 0, 150, 0, 40),
          listPrepend(
            red(0, -500, -350, 100, 5, 45),
            listPrepend(
              red(0, -500, 350, 100, 5, 45),
              listPrepend(red(0, -150, -200, 50, 20, 40), $List$Empty$const),
            ),
          ),
        ),
        false,
        level_1_code,
      ),
      listPrepend(
        new Level(
          "Level 2",
          new Point(0.0, 480.0),
          listPrepend(
            red(-500, -380, 180, -380, 0, 15),
            listPrepend(
              red(500, -260, -380, -260, 4, 19),
              listPrepend(
                red(-500, -140, 320, -140, 8, 23),
                listPrepend(
                  red(500, -10, -320, -10, 12, 27),
                  listPrepend(
                    red(-500, 110, 220, 110, 16, 31),
                    listPrepend(
                      red(500, 220, -160, 220, 20, 35),
                      $List$Empty$const,
                    ),
                  ),
                ),
              ),
            ),
          ),
          true,
          starter_code,
        ),
        $List$Empty$const,
      ),
    ),
  );
}
