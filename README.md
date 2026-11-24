# Todo List

A browser-based todo app with projects, built with vanilla JavaScript and webpack as part of [The Odin Project](https://www.theodinproject.com/) curriculum. Todos are organised into projects, can be created, edited, completed and deleted, and are saved in the browser so they survive a page refresh.

## Features

- Create projects; a **Default** project always exists
- Add todos to the selected project with a title, description, due date and priority (low / medium / high)
- View all projects and the todos of the selected project, with the due date shown in a readable format and priority shown by colour
- Mark todos as complete or incomplete
- Edit any field of a todo in an edit panel
- Delete todos
- Data is saved to `localStorage` after every change and restored on load
- Input is validated in the logic layer, not only in the browser forms

## Tech stack

| Tool | Purpose |
|------|---------|
| JavaScript (ES modules) | Application code |
| webpack | Bundling and dev server |
| [date-fns](https://date-fns.org/) | Parsing and formatting dates |
| Web Storage API (`localStorage`) | Persistence |

## Getting started

```bash
git clone <repository-url>
cd todo-list
npm install
npm run dev      # start the dev server
npm run build    # create a production bundle
```

Script names depend on your `package.json`; adjust the commands above if yours differ.

## Project structure

```
src/
├── index.js       # Entry point: holds app state, connects logic and UI
├── app.js         # Logic layer: projects, todos, validation, persistence
├── project.js     # createProject factory
├── todo.js        # createTodo factory
├── ui.js          # DOM layer: rendering and event listeners
├── styles.css     # Styling
└── template.html  # HTML template
```

## Architecture

The app is split into three layers that have different jobs and a one-way dependency between them.

| Layer | File | Knows about | Does not know about |
|-------|------|-------------|---------------------|
| Logic | `app.js`, `project.js`, `todo.js` | Data, rules, storage | The DOM |
| UI | `ui.js` | The DOM | The logic layer |
| Coordinator | `index.js` | Both | |

`ui.js` never imports the logic layer. Instead, UI functions take **callbacks**, and `index.js` supplies them. When the user does something, the flow is:

```
user event -> listener in ui.js -> callback in index.js -> logic function (validate, change, save) -> render
```

This keeps the logic testable without any HTML (it can be exercised from the console) and means either side can be rewritten without touching the other.

`index.js` owns one piece of state, `currentProjectId`, which says which project is selected.

## Data model

Both factories return plain objects with no methods, so they survive `JSON.stringify` / `JSON.parse` unchanged.

**Todo**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | UUID from `crypto.randomUUID()`, never changes |
| `title` | string | Required, stored trimmed |
| `description` | string | May be empty |
| `dueDate` | string | `""` (no date) or an ISO date such as `"2026-11-20"` |
| `priority` | string | `"low"`, `"medium"` or `"high"` |
| `complete` | boolean | Defaults to `false` |

**Project**

| Field | Type | Notes |
|-------|------|-------|
| `id` | string | UUID |
| `name` | string | Required, stored trimmed |
| `todos` | array | The project's todos |

## Logic API (`app.js`)

Functions that can fail return `null` and change nothing. None of them throw on bad input.

| Function | Returns | Description |
|----------|---------|-------------|
| `getProjects()` | array | The current list of projects |
| `addProject(name)` | id or `null` | Adds a project; `null` if the name is not a non-blank string |
| `addTodoToProject(projectId, todoData)` | id or `null` | Validates `todoData`, builds a todo with `createTodo`, adds it to the project |
| `updateTodo(projectId, todoId, changes)` | id or `null` | Applies a partial update in place |
| `toggleComplete(projectId, todoId)` | nothing | Flips `complete`; does nothing if the ids do not match |
| `deleteTodo(projectId, todoId)` | nothing | Removes the todo; does nothing if the ids do not match |

### Validation rules

- `title`: a string that is not blank after trimming
- `priority`: one of `low`, `medium`, `high`
- `description`: a string
- `dueDate`: an empty string, or a string that date-fns can parse as a valid date

`addTodoToProject` requires `title` and `priority`. `updateTodo` only checks the fields that are present, so partial updates work.

### How `updateTodo` behaves

1. Both the project and the todo must exist.
2. `changes` may only contain `title`, `description`, `dueDate` and `priority`. Any other key (including `id` and `complete`) rejects the whole update.
3. An empty `changes` object is rejected.
4. All fields are validated before anything is applied, so an update is all or nothing.
5. The title is trimmed on a copy of `changes`; the caller's object is never modified.

## Persistence

All projects and todos are stored as one JSON string in `localStorage` under the key `todo-projects`.

- **Saving:** `saveProjects()` runs after every successful change (add project, add todo, toggle, update, delete). Rejected changes do not trigger a save.
- **Loading:** `loadProjects()` runs once when the module loads.
  - Nothing stored: start with a new Default project.
  - Stored data that is not valid JSON, or does not look like a non-empty array of projects (each with a string `id`, string `name` and `todos` array): start with a new Default project.
  - Unreadable data is first copied to `todo-projects-backup` so it is not silently destroyed.

## UI API (`ui.js`)

| Function | Description |
|----------|-------------|
| `renderProjects(projects, currentProjectId)` | Redraws the project list and marks the selected project |
| `renderTodos(projects, currentProjectId)` | Redraws the project heading and its todos |
| `initProjectListeners(onSelect)` | One delegated click listener on the project list; calls `onSelect(projectId)` |
| `initProjectForm(onAdd)` | Handles the add-project form; calls `onAdd(name)` |
| `initTodoForm(onAdd)` | Handles the add-todo form; calls `onAdd(todoData)` |
| `initTodoListListeners(onAction)` | One delegated click listener on the todo list; calls `onAction(todoId, action)` with `"toggle"`, `"edit"` or `"delete"` |
| `initEditForm(onSave)` | Handles the edit form; calls `onSave(todoId, changes)` |
| `showEditForm(todo)` / `hideEditForm()` | Opens the edit panel filled with a todo / closes and resets it |
| `showEditError(message)` | Shows a message in the edit panel |

Design notes:

- Every render function clears its container first and then redraws from the data, so the screen always matches the current state.
- Each list item carries the object's id in a `data-id` attribute; controls carry `data-action`. Delegated listeners read these to know what was clicked.
- User-provided text is always set with `textContent`, never `innerHTML`.
- Dates are displayed with date-fns (for example `Nov 20, 2026`), and a todo without a date shows "No due date".

## Manual test checklist

1. Fresh start (`localStorage.clear()` then refresh): only Default exists.
2. Add a project: it appears and becomes selected.
3. Add a todo with and without a due date: both display correctly.
4. Spaces-only project name or todo title: nothing is added.
5. Toggle, edit and delete a todo: the list updates and the change survives a refresh.
6. Edit with a blank title: a message appears and nothing is saved.
7. Open the edit panel, then switch project or delete that todo: the panel closes.
8. Corrupt storage (`localStorage.setItem("todo-projects", "garbage")`) and refresh: the app starts with a fresh Default and no console errors.

## Known limitations

- Data lives only in one browser on one device.
- Projects cannot be renamed or deleted.
- Duplicate project names are allowed (projects are told apart by id).
- Rejected input in the add-project and add-todo forms is ignored silently; only the edit panel shows a message.
- `saveProjects()` and the `getItem` call are not wrapped in `try/catch`, so browsers with storage disabled (some private modes) can throw.
- No sorting or filtering of todos, and no `notes` or `checklist` fields.

## Possible next steps

- Delete and rename projects (keeping at least one project)
- Sort todos by due date or priority
- Notes and checklists on todos
- Automated tests for the logic layer
- Deploy with GitHub Pages

## Credits

Project specification from [The Odin Project](https://www.theodinproject.com/).
