# Animator

A CS 61A project: a web app for program-generated drawings. You write a `draw`
function in a small Gleam-like language, and the app animates the paths it
returns. It's written in [Gleam](https://gleam.run) with [Lustre](https://lustre.build).

## Features

- A code editor whose drawing updates as you type, with errors shown over the canvas
- Shape and speed sliders, plus reset / play / pause (negative speeds play backward)
- A library of drawings, saved in the browser
- **Game mode** (the Problem 12 extension): climb from the bottom of the canvas
  to the green bar at the top while dodging red lines, by writing `draw` and
  `move_anchor`. It has a "How to play" guide, a Tutorial level, and more
  levels. See [`extension.txt`](extension.txt) for the full rules.

## Running it

You need [Gleam](https://gleam.run/getting-started/installing/) installed.

```sh
gleam dev     # build and serve the app at http://localhost:8000
gleam test    # run the tests
```

## Layout

- `src/app.gleam`: the app's model, update, and view
- `src/evaluator.gleam`, `src/parser.gleam`, `src/builtins.gleam`: the interpreter
- `src/canvas.mjs`, `src/render.gleam`: the canvas animation
- `src/game.gleam`, `src/levels.gleam`, `src/tutorial.gleam`: game mode
- `index.html`, `animator.css`: the page and its styles
