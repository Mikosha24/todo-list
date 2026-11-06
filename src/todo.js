export default function createTodo(title, description, dueDate, priority, complete = false){
    
    return {
        id: crypto.randomUUID(), 
        title, 
        description, 
        dueDate, 
        priority, 
        complete,
    };
    
}

