import createProject from "./project.js";
import createTodo from "./todo.js";

const projects = [];
const allowedPriorities = ["low", "medium", "high"];

export function getProjects(){
    return projects;
}

const defaultProject = createProject("Default");
projects.push(defaultProject);

export function addProject(name){
    if (typeof name !== "string") return null;
    const trimmed = name.trim();
    if (!trimmed) return null;

    const project = createProject(trimmed);
    projects.push(project);

    return project.id;
}

export function addTodoToProject(projectId, todoData){ 
    // todoData is object with data that user submits in the form
    if (typeof todoData.title !== "string") return null;
    const title = todoData.title.trim();
    if (!title) return null;
    if (!allowedPriorities.includes(todoData.priority)) return null;

    const project = findProject(projectId);
    if (!project) return null;

    const todo = createTodo(title, todoData.description, todoData.dueDate, todoData.priority);
    project.todos.push(todo);

    return todo.id;
}

export function deleteTodo(projectId, todoId){
    const project = findProject(projectId);
    if(!project){ return; }
    const todoIndex = project.todos.findIndex((el) => el.id === todoId);
    if(todoIndex === -1){ return; }
    project.todos.splice(todoIndex, 1);
}

export function toggleComplete(projectId, todoId){
    const project = findProject(projectId);
    if(!project){ return; }
    const todo = project.todos.find((el) => el.id === todoId);
    if(!todo){ return; }
    todo.complete = !todo.complete;
}

function findProject(projectId){
    const project = projects.find((el) => el.id === projectId);
    
    return project;
}


