import createProject from "./project.js";
import createTodo from "./todo.js";

const projects = [];

export function getProjects(){
    return projects;
}

const defaultProject = createProject("Default");
projects.push(defaultProject);

export function addProject(name){
    const project = createProject(name);
    projects.push(project);

    return project.id;
}

export function addTodoToProject(projectId, todoData){ 
    // todoData is object with data that user submits in the form
    const project = findProject(projectId);
    if (!project) return;
    const todo = createTodo(todoData.title, todoData.description, todoData.dueDate, todoData.priority);
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


