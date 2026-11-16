//// Convert each shape into a list of points called a RenderPath.

import shape.{type Path, type Point, Line}

/// One path as canvas.mjs setDrawing consumes it (field by field): the
/// polyline, stroke colour/width, and the start and end times (in tenths of a second)
/// between which the reveal runs — so the renderer's clock needs no shape
/// knowledge.
pub type RenderPath {
  RenderPath(
    points: List(Point),
    thickness: Float,
    color: String,
    start: Float,
    end: Float,
  )
}

// ── The canvas (canvas.mjs) ───────────────────────────────────────────────────

/// Replace the drawing being animated in the page's
/// `<canvas id="animation-canvas">` element. If that element doesn't appear within
/// about 10 seconds, this logs an error to the browser console. This keeps the
/// current time, so a drawing that replaces a finished one appears complete. To
/// animate it from the start, also call reset_clock.
@external(javascript, "./canvas.mjs", "setDrawing")
pub fn set_drawing(paths: List(RenderPath)) -> Nil

/// Set the animation's speed, as a multiple of its normal speed: 1.0 is normal and
/// is where it starts, 0.0 pauses, and a negative rate plays it backward.
/// Time stops at the start of the drawing and when its last path finishes, so
/// playing a finished drawing again takes a call to reset_clock.
@external(javascript, "./canvas.mjs", "setSpeed")
pub fn set_speed(rate: Float) -> Nil

/// Jump the animation back to its start, where the canvas is empty.
@external(javascript, "./canvas.mjs", "resetClock")
pub fn reset_clock() -> Nil

// ── Game layers (canvas.mjs) ──────────────────────────────────────────────────

/// Replace the game's red layer (an empty list removes it). It runs on its own
/// clock, separate from set_speed and reset_clock. With loop, it starts over from
/// an empty canvas shortly after its last path finishes; otherwise it holds there.
@external(javascript, "./canvas.mjs", "setRedDrawing")
pub fn set_red_drawing(paths: List(RenderPath), loop: Bool) -> Nil

/// Set the red layer's speed, like set_speed does for the main drawing.
@external(javascript, "./canvas.mjs", "setRedSpeed")
pub fn set_red_speed(rate: Float) -> Nil

/// Jump the red layer back to its start.
@external(javascript, "./canvas.mjs", "resetRedClock")
pub fn reset_red_clock() -> Nil

/// Replace the fixed layer: paths always drawn complete, beneath the main
/// drawing, whatever the clocks say.
@external(javascript, "./canvas.mjs", "setFixed")
pub fn set_fixed(paths: List(RenderPath)) -> Nil

/// Call callback(main clock, red clock) after every frame, replacing any
/// earlier callback. If it returns True, it is unregistered.
@external(javascript, "./canvas.mjs", "onFrame")
pub fn on_frame(callback: fn(Float, Float) -> Bool) -> Nil

/// Stop calling the on_frame callback.
@external(javascript, "./canvas.mjs", "clearOnFrame")
pub fn clear_on_frame() -> Nil

pub fn render_path(path: Path, color: String) -> RenderPath {
  case path.shape {
    Line(a, b) ->
      RenderPath([a, b], path.thickness, color, path.start, path.end)
  }
}
