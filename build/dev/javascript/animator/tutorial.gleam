//// The game's "How to play" guide: a short series of steps shown in a panel.
//// The app keeps track of which step is open; this module holds the steps and
//// draws the panel, so it never depends back on app.

import gleam/int
import gleam/list
import gleam/option.{type Option, None, Some}
import gleam/string
import lustre/attribute as attr
import lustre/element.{type Element}
import lustre/element/html
import lustre/event

/// One step of the guide. In a paragraph, text between backticks is shown as
/// code. A snippet is example code, shown read-only beneath the paragraphs.
pub type Step {
  Step(title: String, paragraphs: List(String), snippet: Option(String))
}

pub fn steps() -> List(Step) {
  [
    Step(
      "Climb to the top",
      [
        "Write code whose lines climb from the bottom of the canvas to the green bar at the top.",
        "Red lines grow down from the top. If any of your lines touches a red line, you're caught.",
        "Stay inside the canvas, too: a line that touches the left or right edge loses.",
      ],
      None,
    ),
    Step(
      "Start at the anchor",
      [
        "Your lines must start at `anchor`, the gold diamond near the bottom. Lines that start anywhere else are drawn faded and don't count.",
        "y grows downward, so going up means making y smaller.",
      ],
      Some(
        "fn draw(shape_slider: Int) -> List(Path) {
  [Path(Line(anchor, Point(anchor.x, anchor.y - 300)), 0, 10, 4)]
}",
      ),
    ),
    Step(
      "Move the anchor up",
      [
        "One line can't reach the top on its own. Write `move_anchor` to say where the anchor goes next; it's shown as a small dark diamond.",
        "When one of your lines is drawn through that point, the anchor jumps there for good, and draw runs again so your next lines start from it.",
        "Shortcut: `find_anchor(start, end, thickness)` is a straight line from the anchor to the next anchor, so `[find_anchor(0, 10, 4)]` climbs from anchor to anchor.",
      ],
      Some(
        "fn move_anchor(anchor: Point) -> Point {
  Point(anchor.x, anchor.y - 250)
}",
      ),
    ),
    Step(
      "Two clocks",
      [
        "The red lines run on their own clock, which starts when the level does.",
        "Play, Pause, Reset, and the speed slider control only your lines. The red lines keep growing no matter what you do.",
      ],
      None,
    ),
    Step(
      "The reset trick",
      [
        "When the anchor moves, your old lines stay on screen (dimmer), and red lines can still catch them.",
        "Reset, or a negative speed, clears your old lines, but the anchor stays where it climbed to. So climb, let the anchor move, then reset before the red lines reach what you left behind.",
      ],
      None,
    ),
    Step(
      "Timing",
      [
        "A Path's last three numbers are its start time, end time, and thickness. Times are in tenths of a second.",
        "Start a line later, or draw it faster, to slip past a red line before it arrives.",
      ],
      Some(
        "Path(Line(anchor, Point(anchor.x - 200, anchor.y - 300)), 15, 20, 4)",
      ),
    ),
    Step(
      "Levels",
      [
        "Pick a level from the menu above the code. In some levels the red lines stay once drawn; in others they clear and grow again in a loop.",
        "Restart puts the anchor back at the start and restarts both clocks. Each level remembers your code.",
        "The Tutorial level is a gentle place to try all of this.",
      ],
      None,
    ),
  ]
}

/// The guide panel open at step index (counting from 0), over the whole app.
/// to_tutorial opens the Tutorial level; it is offered on the last step.
pub fn view(
  index: Int,
  on_back on_back: msg,
  on_next on_next: msg,
  on_close on_close: msg,
  to_tutorial to_tutorial: msg,
) -> Element(msg) {
  let all = steps()
  let count = list.length(all)
  let last = index >= count - 1
  case list.drop(all, index) {
    [] -> element.none()
    [step, ..] ->
      html.div([attr.class("guide-backdrop")], [
        html.div(
          [
            attr.class("guide"),
            attr.role("dialog"),
            attr.attribute("aria-modal", "true"),
            attr.attribute("aria-labelledby", "guide-title"),
          ],
          [
            html.div([attr.class("guide-header")], [
              html.span([attr.class("guide-kicker")], [
                html.text("How to play"),
              ]),
              html.button(
                [
                  attr.class("guide-close"),
                  attr.title("Close"),
                  attr.attribute("aria-label", "Close"),
                  event.on_click(on_close),
                ],
                [html.text("×")],
              ),
            ]),
            html.h2([attr.id("guide-title"), attr.class("guide-title")], [
              html.text(step.title),
            ]),
            html.div(
              [attr.class("guide-body")],
              list.map(step.paragraphs, fn(p) { html.p([], inline_code(p)) }),
            ),
            case step.snippet {
              Some(code) ->
                html.pre([attr.class("guide-snippet")], [
                  html.code([], [html.text(code)]),
                ])
              None -> element.none()
            },
            html.div([attr.class("guide-footer")], [
              html.span([attr.class("guide-progress")], [
                html.text(
                  "Step "
                  <> int.to_string(index + 1)
                  <> " of "
                  <> int.to_string(count),
                ),
              ]),
              html.div([attr.class("guide-actions")], [
                html.button(
                  [
                    attr.class("library-btn"),
                    attr.disabled(index == 0),
                    event.on_click(on_back),
                  ],
                  [html.text("Back")],
                ),
                case last {
                  False ->
                    html.button(
                      [
                        attr.class("library-btn guide-primary"),
                        event.on_click(on_next),
                      ],
                      [html.text("Next")],
                    )
                  True ->
                    html.button(
                      [
                        attr.class("library-btn guide-primary"),
                        event.on_click(to_tutorial),
                      ],
                      [html.text("Try the Tutorial level")],
                    )
                },
              ]),
            ]),
          ],
        ),
      ])
  }
}

/// The number of steps in the guide.
pub fn count() -> Int {
  list.length(steps())
}

// A paragraph's text, with the parts between backticks shown as code.
fn inline_code(text: String) -> List(Element(msg)) {
  string.split(text, "`")
  |> list.index_map(fn(part, i) {
    case i % 2 {
      0 -> html.text(part)
      _ -> html.code([attr.class("guide-code")], [html.text(part)])
    }
  })
}
