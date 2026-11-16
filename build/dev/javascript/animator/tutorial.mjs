//# sourceMappingURL=tutorial.mjs.map
import * as $int from "../gleam_stdlib/gleam/int.mjs";
import * as $list from "../gleam_stdlib/gleam/list.mjs";
import * as $option from "../gleam_stdlib/gleam/option.mjs";
import { Some, Option$None$const } from "../gleam_stdlib/gleam/option.mjs";
import * as $string from "../gleam_stdlib/gleam/string.mjs";
import * as $attr from "../lustre/lustre/attribute.mjs";
import * as $element from "../lustre/lustre/element.mjs";
import * as $html from "../lustre/lustre/element/html.mjs";
import * as $event from "../lustre/lustre/event.mjs";
import {
  Empty as $Empty,
  List$Empty$const as $List$Empty$const,
  prepend as listPrepend,
  CustomType as $CustomType,
} from "./gleam.mjs";

export class Step extends $CustomType {
  constructor(title, paragraphs, snippet) {
    super();
    this.title = title;
    this.paragraphs = paragraphs;
    this.snippet = snippet;
  }
}
export const Step$Step = (title, paragraphs, snippet) =>
  new Step(title, paragraphs, snippet);
export const Step$isStep = (value) => value instanceof Step;
export const Step$Step$title = (value) => value.title;
export const Step$Step$0 = (value) => value.title;
export const Step$Step$paragraphs = (value) => value.paragraphs;
export const Step$Step$1 = (value) => value.paragraphs;
export const Step$Step$snippet = (value) => value.snippet;
export const Step$Step$2 = (value) => value.snippet;

export function steps() {
  return listPrepend(
    new Step(
      "Climb to the top",
      listPrepend(
        "Write code whose lines climb from the bottom of the canvas to the green bar at the top.",
        listPrepend(
          "Red lines grow down from the top. If any of your lines touches a red line, you're caught.",
          listPrepend(
            "Stay inside the canvas, too: a line that touches the left or right edge loses.",
            $List$Empty$const,
          ),
        ),
      ),
      Option$None$const,
    ),
    listPrepend(
      new Step(
        "Start at the anchor",
        listPrepend(
          "Your lines must start at `anchor`, the gold diamond near the bottom. Lines that start anywhere else are drawn faded and don't count.",
          listPrepend(
            "y grows downward, so going up means making y smaller.",
            $List$Empty$const,
          ),
        ),
        new Some(
          "fn draw(shape_slider: Int) -> List(Path) {\n  [Path(Line(anchor, Point(anchor.x, anchor.y - 300)), 0, 10, 4)]\n}",
        ),
      ),
      listPrepend(
        new Step(
          "Move the anchor up",
          listPrepend(
            "One line can't reach the top on its own. Write `move_anchor` to say where the anchor goes next; it's shown as a small dark diamond.",
            listPrepend(
              "When one of your lines is drawn through that point, the anchor jumps there for good, and draw runs again so your next lines start from it.",
              listPrepend(
                "Shortcut: `find_anchor(start, end, thickness)` is a straight line from the anchor to the next anchor, so `[find_anchor(0, 10, 4)]` climbs from anchor to anchor.",
                $List$Empty$const,
              ),
            ),
          ),
          new Some(
            "fn move_anchor(anchor: Point) -> Point {\n  Point(anchor.x, anchor.y - 250)\n}",
          ),
        ),
        listPrepend(
          new Step(
            "Two clocks",
            listPrepend(
              "The red lines run on their own clock, which starts when the level does.",
              listPrepend(
                "Play, Pause, Reset, and the speed slider control only your lines. The red lines keep growing no matter what you do.",
                $List$Empty$const,
              ),
            ),
            Option$None$const,
          ),
          listPrepend(
            new Step(
              "The reset trick",
              listPrepend(
                "When the anchor moves, your old lines stay on screen (dimmer), and red lines can still catch them.",
                listPrepend(
                  "Reset, or a negative speed, clears your old lines, but the anchor stays where it climbed to. So climb, let the anchor move, then reset before the red lines reach what you left behind.",
                  $List$Empty$const,
                ),
              ),
              Option$None$const,
            ),
            listPrepend(
              new Step(
                "Timing",
                listPrepend(
                  "A Path's last three numbers are its start time, end time, and thickness. Times are in tenths of a second.",
                  listPrepend(
                    "Start a line later, or draw it faster, to slip past a red line before it arrives.",
                    $List$Empty$const,
                  ),
                ),
                new Some(
                  "Path(Line(anchor, Point(anchor.x - 200, anchor.y - 300)), 15, 20, 4)",
                ),
              ),
              listPrepend(
                new Step(
                  "Levels",
                  listPrepend(
                    "Pick a level from the menu above the code. In some levels the red lines stay once drawn; in others they clear and grow again in a loop.",
                    listPrepend(
                      "Restart puts the anchor back at the start and restarts both clocks. Each level remembers your code.",
                      listPrepend(
                        "The Tutorial level is a gentle place to try all of this.",
                        $List$Empty$const,
                      ),
                    ),
                  ),
                  Option$None$const,
                ),
                $List$Empty$const,
              ),
            ),
          ),
        ),
      ),
    ),
  );
}

function inline_code(text) {
  let _pipe = $string.split(text, "`");
  return $list.index_map(
    _pipe,
    (part, i) => {
      let $ = i % 2;
      if ($ === 0) {
        return $html.text(part);
      } else {
        return $html.code(
          listPrepend($attr.class$("guide-code"), $List$Empty$const),
          listPrepend($html.text(part), $List$Empty$const),
        );
      }
    },
  );
}

/**
 * The guide panel open at step index (counting from 0), over the whole app.
 * to_tutorial opens the Tutorial level; it is offered on the last step.
 */
export function view(index, on_back, on_next, on_close, to_tutorial) {
  let all = steps();
  let count$1 = $list.length(all);
  let last = index >= (count$1 - 1);
  let $ = $list.drop(all, index);
  if ($ instanceof $Empty) {
    return $element.none();
  } else {
    let step = $.head;
    return $html.div(
      listPrepend($attr.class$("guide-backdrop"), $List$Empty$const),
      listPrepend(
        $html.div(
          listPrepend(
            $attr.class$("guide"),
            listPrepend(
              $attr.role("dialog"),
              listPrepend(
                $attr.attribute("aria-modal", "true"),
                listPrepend(
                  $attr.attribute("aria-labelledby", "guide-title"),
                  $List$Empty$const,
                ),
              ),
            ),
          ),
          listPrepend(
            $html.div(
              listPrepend($attr.class$("guide-header"), $List$Empty$const),
              listPrepend(
                $html.span(
                  listPrepend($attr.class$("guide-kicker"), $List$Empty$const),
                  listPrepend($html.text("How to play"), $List$Empty$const),
                ),
                listPrepend(
                  $html.button(
                    listPrepend(
                      $attr.class$("guide-close"),
                      listPrepend(
                        $attr.title("Close"),
                        listPrepend(
                          $attr.attribute("aria-label", "Close"),
                          listPrepend(
                            $event.on_click(on_close),
                            $List$Empty$const,
                          ),
                        ),
                      ),
                    ),
                    listPrepend($html.text("×"), $List$Empty$const),
                  ),
                  $List$Empty$const,
                ),
              ),
            ),
            listPrepend(
              $html.h2(
                listPrepend(
                  $attr.id("guide-title"),
                  listPrepend($attr.class$("guide-title"), $List$Empty$const),
                ),
                listPrepend($html.text(step.title), $List$Empty$const),
              ),
              listPrepend(
                $html.div(
                  listPrepend($attr.class$("guide-body"), $List$Empty$const),
                  $list.map(
                    step.paragraphs,
                    (p) => { return $html.p($List$Empty$const, inline_code(p)); },
                  ),
                ),
                listPrepend(
                  (() => {
                    let $1 = step.snippet;
                    if ($1 instanceof Some) {
                      let code = $1[0];
                      return $html.pre(
                        listPrepend(
                          $attr.class$("guide-snippet"),
                          $List$Empty$const,
                        ),
                        listPrepend(
                          $html.code(
                            $List$Empty$const,
                            listPrepend($html.text(code), $List$Empty$const),
                          ),
                          $List$Empty$const,
                        ),
                      );
                    } else {
                      return $element.none();
                    }
                  })(),
                  listPrepend(
                    $html.div(
                      listPrepend(
                        $attr.class$("guide-footer"),
                        $List$Empty$const,
                      ),
                      listPrepend(
                        $html.span(
                          listPrepend(
                            $attr.class$("guide-progress"),
                            $List$Empty$const,
                          ),
                          listPrepend(
                            $html.text(
                              (("Step " + $int.to_string(index + 1)) + " of ") + $int.to_string(
                                count$1,
                              ),
                            ),
                            $List$Empty$const,
                          ),
                        ),
                        listPrepend(
                          $html.div(
                            listPrepend(
                              $attr.class$("guide-actions"),
                              $List$Empty$const,
                            ),
                            listPrepend(
                              $html.button(
                                listPrepend(
                                  $attr.class$("library-btn"),
                                  listPrepend(
                                    $attr.disabled(index === 0),
                                    listPrepend(
                                      $event.on_click(on_back),
                                      $List$Empty$const,
                                    ),
                                  ),
                                ),
                                listPrepend(
                                  $html.text("Back"),
                                  $List$Empty$const,
                                ),
                              ),
                              listPrepend(
                                (() => {
                                  if (last) {
                                    return $html.button(
                                      listPrepend(
                                        $attr.class$(
                                          "library-btn guide-primary",
                                        ),
                                        listPrepend(
                                          $event.on_click(to_tutorial),
                                          $List$Empty$const,
                                        ),
                                      ),
                                      listPrepend(
                                        $html.text("Try the Tutorial level"),
                                        $List$Empty$const,
                                      ),
                                    );
                                  } else {
                                    return $html.button(
                                      listPrepend(
                                        $attr.class$(
                                          "library-btn guide-primary",
                                        ),
                                        listPrepend(
                                          $event.on_click(on_next),
                                          $List$Empty$const,
                                        ),
                                      ),
                                      listPrepend(
                                        $html.text("Next"),
                                        $List$Empty$const,
                                      ),
                                    );
                                  }
                                })(),
                                $List$Empty$const,
                              ),
                            ),
                          ),
                          $List$Empty$const,
                        ),
                      ),
                    ),
                    $List$Empty$const,
                  ),
                ),
              ),
            ),
          ),
        ),
        $List$Empty$const,
      ),
    );
  }
}

/**
 * The number of steps in the guide.
 */
export function count() {
  return $list.length(steps());
}
