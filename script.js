let toDoInput;
let errorInfo;
let addBtn;
let ulList;
let newToDo;

let popup;
let popupInfo;
let todoToEdit;
let popupInput;
let popupAddBtn;
let popupCloseBtn;

const main = () => {
    prepareDOMElements();
    prepareDOMEvents();

    loadTodos();
}

const prepareDOMElements = () => {
    toDoInput = document.querySelector('.todo-input');
    errorInfo = document.querySelector('.error-info');
    addBtn = document.querySelector('.btn-add');
    ulList = document.querySelector('.todolist ul');

    popup = document.querySelector('.popup');
    popupInfo = document.querySelector('.popup-info');
    popupInput = document.querySelector('.popup-input');
    popupAddBtn = document.querySelector('.accept');
    popupCloseBtn = document.querySelector('.cancel');
}

const prepareDOMEvents = () => {
    addBtn.addEventListener('click', addNewToDo);
    ulList.addEventListener('click', checkClick);
    popupCloseBtn.addEventListener('click', closePopup);
    popupAddBtn.addEventListener('click', changeTodoText);
    toDoInput.addEventListener('keyup', enterKeyCheck);
}

const addNewToDo = () => {
    if (toDoInput.value != '') {
        newToDo = document.createElement('li');
        newToDo.textContent = toDoInput.value;
        ulList.append(newToDo);
        createToolAreal(newToDo);
        toDoInput.value = '';
        errorInfo.textContent = '';

        saveTodosToLocalStorage();
    } else {
        errorInfo.textContent = 'Enter the content of the task!';
    }
}

const createToolAreal = (todoItem) => {
    let toolsArea = todoItem.querySelector('.tools');


    if (!toolsArea) {
        toolsArea = document.createElement('div');
        toolsArea.classList.add('tools');
        todoItem.append(toolsArea);
    } else {
       
        toolsArea.innerHTML = '';
    }

    const buttonDone = document.createElement('button');
    buttonDone.classList.add('complete');
    buttonDone.innerHTML = '<i class="fas fa-check"></i>';

    const buttonEdit = document.createElement('button');
    buttonEdit.classList.add('edit');
    buttonEdit.textContent = 'EDIT';

    const buttonCancel = document.createElement('button');
    buttonCancel.classList.add('delete');
    buttonCancel.innerHTML = '<i class="fas fa-times"></i>';

    toolsArea.append(buttonDone, buttonEdit, buttonCancel);
};



const checkClick = (e) => {
    if (e.target.matches('.complete')) {
        e.target.closest('li').classList.toggle('completed');
        e.target.classList.toggle('completed');
    } else if (e.target.matches('.edit')) {
        editToDo(e);
    } else if (e.target.matches('.delete')) {
        deleteToDo(e);
    }
}

const editToDo = (e) => {
    todoToEdit = e.target.closest('li');
    popupInput.value = todoToEdit.firstChild.textContent;
    popup.style.display = 'flex';
}

const closePopup = () => {
    popup.style.display = 'none';
    popupInfo.textContent = '';
}

const changeTodoText = () => {
    if (popupInput.value != '') {
        todoToEdit.firstChild.textContent = popupInput.value;
        popup.style.display = 'none';
        popupInfo.textContent = '';

        
        saveTodosToLocalStorage();
    } else {
        popupInfo.textContent = 'You must provide some content!';
    }
}

const deleteToDo = (e) => {
    e.target.closest('li').remove();

    // Save todos to local storage after deleting a todo
    saveTodosToLocalStorage();

    const allToDos = ulList.querySelectorAll('li');
    if (allToDos.length == 0) {
        errorInfo.textContent = 'No tasks on the list (:'
    }
}

const enterKeyCheck = (e) => {
    if (e.key == 'Enter') {
        addNewToDo();
    }
}

const loadTodos = () => {
    const storedTodos = localStorage.getItem('todos');

    if (storedTodos) {
        const parsedTodos = JSON.parse(storedTodos);

        // Clear existing todos before loading from local storage
        ulList.innerHTML = '';

    
        parsedTodos.forEach(todo => {
            addTodoToList(todo);
        });
    }
}

const saveTodosToLocalStorage = () => {
    const todos = Array.from(ulList.children).map(todo => {
        return {
            text: todo.textContent,
            completed: todo.classList.contains('completed'),
        };
    });

    localStorage.setItem('todos', JSON.stringify(todos));
}

const addTodoToList = (todo) => {
    newToDo = document.createElement('li');
    newToDo.textContent = todo.text;
    if (todo.completed) {
        newToDo.classList.add('completed');
    }
    ulList.append(newToDo);
    createToolAreal(newToDo); 
}

document.addEventListener('DOMContentLoaded', main);
