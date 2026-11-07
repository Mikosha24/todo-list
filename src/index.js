import "./styles.css";

import * as manager from "./app.js"; 
import { getProjects, addProject, addTodoToProject } from "./app.js";
import { renderProjects, renderTodos, initProjectListeners, initProjectForm, initTodoForm } from "./ui.js";

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
  renderTodos(getProjects(), currentProjectId);
});


initProjectForm((name) =>{
  const newProjectId = addProject(name);
  if (!newProjectId) return;

  currentProjectId = newProjectId;
  renderProjects(getProjects());
  renderTodos(getProjects(), currentProjectId);
});

initTodoForm((todoData) => {
  const newTodoId = addTodoToProject(currentProjectId, todoData);
  if (!newTodoId) return;

  renderTodos(getProjects(), currentProjectId);
});