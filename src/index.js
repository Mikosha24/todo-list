import "./styles.css";
 
import { getProjects, addProject, addTodoToProject, deleteTodo, toggleComplete, updateTodo } from "./app.js";
import { renderProjects, renderTodos, initProjectListeners, initProjectForm, initTodoForm, initTodoListListeners, showEditForm, hideEditForm, initEditForm } from "./ui.js";

let currentProjectId = getProjects()[0].id;   // the Default project

function renderAll() {
  renderProjects(getProjects(), currentProjectId);
  renderTodos(getProjects(), currentProjectId);
}

renderAll();

initProjectListeners((projectId) => {
  currentProjectId = projectId;
  hideEditForm();   
  renderAll(); 
});


initProjectForm((name) =>{
  const newProjectId = addProject(name);
  if (!newProjectId) return;

  currentProjectId = newProjectId;
  hideEditForm();   
  renderAll(); 
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