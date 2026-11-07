import { format, parseISO } from "date-fns";

export function renderProjects(projects){
    const projectList = document.querySelector("#project-list");
    projectList.textContent = "";

    for(const project of projects){
        const li = document.createElement("li");
        li.textContent = project.name;
        li.dataset.id = project.id;

        projectList.appendChild(li);
    }
}


// Logic for displaying Todos in Projects



export function initProjectListeners(onSelect){
    const projectList = document.querySelector("#project-list");

    projectList.addEventListener("click", (e) => {
       const li = e.target.closest("li");
       if(!li) return;
       
       onSelect(li.dataset.id); // report which project was clicked
    });
}

export function renderTodos(projects, currentProjectId){
   
    const projectTitle = document.querySelector("#project-title")
    const todoList = document.querySelector("#todo-list");
    projectTitle.textContent = "";
    todoList.textContent = "";

    const currentProject = projects.find((proj) => proj.id === currentProjectId);
    if (!currentProject) return;
    const todos = currentProject.todos;

    projectTitle.textContent = currentProject.name;
    

    for(const todo of todos){
        const li = document.createElement("li");
        const dueDateDisplay = todo.dueDate ? format(parseISO(todo.dueDate), "MMM d, yyyy") : "No due date";

        li.textContent = `Task: ${todo.title}  Complete before: ${dueDateDisplay}`;
        li.dataset.id = todo.id;
        li.classList.add(`priority-${todo.priority}`);

        todoList.appendChild(li);
    }

}


// Recent, treba pozvati f-ju u index.js
export function initProjectForm(onAdd){
    const form = document.querySelector("#project-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const name = form.elements.name.value.trim();   /* read the value from the input named "name" */;
        if (!name) return;

        onAdd(name);
        /* clear the form */
        form.reset();
  });
}

export function initTodoForm(onAdd){
    const form = document.querySelector("#todo-form");

    form.addEventListener("submit", (e) => {
        e.preventDefault();

        const title = form.elements.title.value.trim();
        const description = form.elements.description.value.trim();
        const dueDate = form.elements.dueDate.value;
        const priority = form.elements.priority.value;

        if (!title || !priority) return;

        const todoData = {
            title,
            description,
            dueDate,
            priority,
        };

        onAdd(todoData);

        form.reset();
    });
}