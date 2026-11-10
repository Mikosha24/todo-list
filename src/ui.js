import { format, parseISO } from "date-fns";

export function renderProjects(projects, currentProjectId){
    const projectList = document.querySelector("#project-list");
    projectList.textContent = "";

    for(const project of projects){
        const li = document.createElement("li");
        li.textContent = project.name;
        li.dataset.id = project.id;
        if (project.id === currentProjectId) li.classList.add("selected");
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
        li.dataset.id = todo.id;
        li.classList.add(`priority-${todo.priority}`);
        if (todo.complete) li.classList.add("complete");

        // toggle checkbox 
        const toggle = document.createElement("input");
        toggle.type = "checkbox";
        toggle.checked = todo.complete;
        toggle.dataset.action = "toggle";

        // text, wrapped in a span so it can sit beside the controls
        const dueDateDisplay = todo.dueDate 
            ? format(parseISO(todo.dueDate), "MMM d, yyyy") 
            : "No due date";
        const text = document.createElement("span");
        text.textContent = `Task: ${todo.title}  Complete before: ${dueDateDisplay}`;
        
        // delete button
        const deleteBtn = document.createElement("button");
        deleteBtn.type = "button";
        deleteBtn.textContent = "Delete";
        deleteBtn.dataset.action = "delete";

        // edit button

        const editBtn = document.createElement("button");
        editBtn.type = "button";
        editBtn.textContent = "Edit";
        editBtn.dataset.action = "edit";

        li.append(toggle, text, editBtn, deleteBtn);
        todoList.appendChild(li);
    }

}



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

export function initTodoListListeners(onAction){
    const todoList = document.querySelector("#todo-list");

    todoList.addEventListener("click", (e) =>{
        const li = e.target.closest("li");
        const todoControl = e.target.dataset.action;

        if (!li || !todoControl) return; 

        onAction(li.dataset.id, todoControl);
    });
}

// Expand todo form

export function showEditForm(todo) {
  clearEditError();
  const panel = document.querySelector("#todo-details");
  const form = document.querySelector("#edit-form");

  form.dataset.todoId = todo.id;          // remember which todo we're editing
  form.elements.title.value = todo.title;
  form.elements.description.value = todo.description;
  form.elements.dueDate.value = todo.dueDate;
  form.elements.priority.value = todo.priority;

  panel.hidden = false;
}

export function hideEditForm() {
  clearEditError();
  const panel = document.querySelector("#todo-details");
  const form = document.querySelector("#edit-form");

  form.reset();
  delete form.dataset.todoId;
  panel.hidden = true;
}

export function initEditForm(onSave) {
  const form = document.querySelector("#edit-form");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const changes = {
      title: form.elements.title.value.trim(),
      description: form.elements.description.value.trim(),
      dueDate: form.elements.dueDate.value,
      priority: form.elements.priority.value,
    };

    onSave(form.dataset.todoId, changes);
  });

  document.querySelector("#edit-cancel").addEventListener("click", hideEditForm);
}

// Error messages

export function showEditError(message) {
  const el = document.querySelector("#edit-error");
  el.textContent = message;
  el.hidden = false;
}

function clearEditError() {
  const el = document.querySelector("#edit-error");
  el.textContent = "";
  el.hidden = true;
}