import "./styles.css";

import * as manager from "./app.js"; 
import { getProjects, addProject, addTodoToProject, deleteTodo, toggleComplete, updateTodo } from "./app.js";
import { renderProjects, renderTodos, initProjectListeners, initProjectForm, initTodoForm, initTodoListListeners, showEditForm, hideEditForm, initEditForm } from "./ui.js";

window.manager = manager;
// ---- TEMPORARY TEST DATA (delete later) ----
const defaultId = getProjects()[0].id;
const workId = addProject("Work");

addTodoToProject(defaultId, { title: "Has a date", description: "", dueDate: "2026-11-20", priority: "high" });
addTodoToProject(defaultId, { title: "No date", description: "", dueDate: "", priority: "low" });
addTodoToProject(workId, { title: "Work task", description: "", dueDate: "2026-12-01", priority: "medium" });
// ---- END TEST DATA ----


let currentProjectId = getProjects()[0].id;   // the Default project

renderProjects(getProjects());
renderTodos(getProjects(), currentProjectId);

initProjectListeners((projectId) => {
  currentProjectId = projectId;
  hideEditForm();   
  renderTodos(getProjects(), currentProjectId);
});


initProjectForm((name) =>{
  const newProjectId = addProject(name);
  if (!newProjectId) return;

  currentProjectId = newProjectId;
  hideEditForm();   
  renderProjects(getProjects());
  renderTodos(getProjects(), currentProjectId);
});

initTodoForm((todoData) => {
  const newTodoId = addTodoToProject(currentProjectId, todoData);
  if (!newTodoId) return;

  renderTodos(getProjects(), currentProjectId);
});

initTodoListListeners((todoId, todoControl) =>{
  if (todoControl === "edit") {
    const project = getProjects().find((p) => p.id === currentProjectId);
    const todo = project.todos.find((t) => t.id === todoId);
    if (todo) showEditForm(todo);
    return;                               // opening the form changes no data, so no re-render
  }

  if (todoControl === "delete"){
    deleteTodo(currentProjectId, todoId);
    hideEditForm();
  }
  else if (todoControl === "toggle"){
    toggleComplete(currentProjectId, todoId)
  }
  else{
    return;
  }

  renderTodos(getProjects(), currentProjectId);
});

initEditForm((todoId, changes) => {
  const result = updateTodo(currentProjectId, todoId, changes);
  if (!result) return;                    // rejected by the logic layer: leave the form open

  hideEditForm();
  renderTodos(getProjects(), currentProjectId);
});