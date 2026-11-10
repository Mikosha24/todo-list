import createProject from "./project.js";
import createTodo from "./todo.js";
import { parseISO, isValid } from "date-fns";

const STORAGE_KEY = "todo-projects";
const editableFields = ["title", "description", "dueDate", "priority"];
const allowedPriorities = ["low", "medium", "high"];
const projects = loadProjects();

export function getProjects(){
    return projects;
}
// Local Storage Persistance
function saveProjects() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function createDefaultProjects() {
  return [createProject("Default")];
}

function looksLikeProjects(data) {
  return (
    Array.isArray(data) &&
    data.length > 0 &&
    data.every(
      (p) =>
        p &&
        typeof p.id === "string" &&
        typeof p.name === "string" &&
        Array.isArray(p.todos)
    )
  );
}

function loadProjects() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === null) return createDefaultProjects();   // first visit

  try {
    const parsed = JSON.parse(stored);
    if (!looksLikeProjects(parsed)) return createDefaultProjects();
    return parsed;
  } catch (error) {
    return createDefaultProjects();                      // broken JSON
  }
}
// END of localStorage


export function addProject(name){
    if (typeof name !== "string") return null;
    const trimmed = name.trim();
    if (!trimmed) return null;

    const project = createProject(trimmed);
    projects.push(project);
    saveProjects();  

    return project.id;
}

export function addTodoToProject(projectId, todoData){ 
    // todoData is object with data that user submits in the form
    if (!validateTodoFields(todoData, { requireAll : true })) return null;
    const title = todoData.title.trim();

    const project = findProject(projectId);
    if (!project) return null;

    const todo = createTodo(title, todoData.description, todoData.dueDate, todoData.priority);

    project.todos.push(todo);
    saveProjects();  

    return todo.id;
}

export function deleteTodo(projectId, todoId){
    const project = findProject(projectId);
    if(!project){ return; }
    const todoIndex = project.todos.findIndex((el) => el.id === todoId);
    if(todoIndex === -1){ return; }
    project.todos.splice(todoIndex, 1);
    saveProjects();  
}

export function toggleComplete(projectId, todoId){
    const project = findProject(projectId);
    if(!project){ return; }
    const todo = project.todos.find((el) => el.id === todoId);
    if(!todo){ return; }
    todo.complete = !todo.complete;
    saveProjects();  
}

function findProject(projectId){
    const project = projects.find((el) => el.id === projectId);
    
    return project;
}



export function updateTodo(projectId, todoId, changes){
    const project = findProject(projectId);
    if (!project) return null;
    
    const todo = project.todos.find((el) => el.id === todoId);
    if (!todo) return null;
    
    if (!validateTodoFields(changes)) return null;

    const allKeysAreAllowed = Object.keys(changes).every((key) => editableFields.includes(key));

    if (!allKeysAreAllowed) return null;
    if (Object.keys(changes).length === 0) return null;

    const cleaned = { ...changes };

    if ("title" in cleaned) {
        cleaned.title = cleaned.title.trim();
    }

    Object.assign(todo, cleaned);
    saveProjects();  

    return todo.id;
}





function validateTodoFields(fields, { requireAll = false } = {}) {
  // 0. must be a real object
  if (typeof fields !== "object" || fields === null) return false;

  // 1. creating a todo: title and priority must exist
  if (requireAll && (!("title" in fields) || !("priority" in fields))) return false;

  // 2. every field that IS present must be valid
  if ("title" in fields) {
    if (typeof fields.title !== "string" || !fields.title.trim()) return false;
  }

  if ("priority" in fields) {
    if (!allowedPriorities.includes(fields.priority)) return false;
  }

  if ("description" in fields) {
    if (typeof fields.description !== "string") return false;
  }

  if ("dueDate" in fields) {
    if (typeof fields.dueDate !== "string") return false;
    if (fields.dueDate !== "" && !isValid(parseISO(fields.dueDate))) return false;
  }

  return true;   // nothing failed
}