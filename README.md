# Projectx — Interactive JavaScript Learning

Projectx is a static, browser-based JavaScript learning site built with plain HTML, CSS, and JavaScript. It does not require a framework, build step, API key, or package installation.

## Run it

1. Extract this folder.
2. Open the folder in VS Code.
3. Use the Live Server extension to open `index.html` at a localhost URL. This is recommended for Worker-based tools, module examples, and external API requests. Opening the HTML file directly may work for some features but is less reliable.

## What's included

- 54 JavaScript lessons with topic navigation, search, progress, bookmarks, quiz scores, and theme toggle
- Sandboxed HTML/CSS/JavaScript Tryit editor with console output, reset, layout selection, and fullscreen mode
- Coding practice with hints, solutions, saved attempts, and sample output checks
- **Advanced Code Visualizer:** paste JavaScript, run it in a Web Worker, step through captured snapshots, inspect variable values and console output, and read a plain-English explanation for every source line
- Predict-the-output quiz, debugging lab, interview preparation, and safe text-rendering security lab
- Guided calculator, to-do list, mini quiz, and weather lookup
- **Three complete, single-file projects with full source code and beginner walkthroughs:** Study Planner Pro, Expense Tracker Dashboard, and Quiz Master

## Advanced Code Visualizer: what it can and cannot do

The visualizer is a teaching tracer, not a full JavaScript debugger or a compiler. It works best with one statement per line, ordinary variables, functions, arrays, `if`/`else`, and loops with braces. It instruments source lines and records snapshots. Minified code, multiline expressions, modules, browser DOM APIs, unusual syntax, and complex scope patterns may not trace accurately. The line-by-line descriptions are educational heuristics, so they can simplify or misclassify advanced statements. If a trace fails, try formatting the code with one statement per line and braces around control-flow bodies.

The visualizer executes user code in a separate Web Worker and terminates it after 2.5 seconds. The trace is capped at 600 snapshots to avoid excessive output. This is useful protection against accidental infinite loops, but it is not a complete security boundary for hostile code.

## Storage and external services

- Lesson completion, bookmarks, quiz scores, editor content, and practice attempts are stored in this browser using `localStorage`. They do not sync between devices and are not a user account or cloud database.
- The guided projects save their data in this browser only.
- The weather lookup requires an internet connection and the public Open-Meteo service.
- The full Tryit HTML preview runs in a sandboxed iframe. Browsers do not give this static page a reliable way to stop every infinite loop inside a full-page preview. Avoid running code you do not trust; reload the page if a preview becomes unresponsive.
- Some module examples require localhost/HTTPS rather than a `file://` URL.

## Validation performed for this build

- `node --check` passed for `script.js` and `projects.js`.
- Each of the three embedded project JavaScript blocks passed `node --check`.
- The three sample visualizer programs were instrumented and executed in a Node-based trace simulation; their console output was verified.
- Required feature hooks and the ZIP archive structure were checked.
- A Chromium headless smoke test timed out in this environment, so full browser click-through, mobile rendering, and end-to-end interaction testing remain unverified. Test these in your browser before public release.
