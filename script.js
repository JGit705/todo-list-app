document.addEventListener('DOMContentLoaded', function() {
  const todoForm = document.getElementById('todo-form');
  const todoInput = document.getElementById('todo-input');
  const todoDescription = document.getElementById('todo-description');
  const addDescriptionCheckbox = document.getElementById('add-description');
  const todoList = document.getElementById('todo-list');
  const todoContainer = document.querySelector('.todo-container');
  const searchBar = document.getElementById('search-bar');
  
  let todos = JSON.parse(localStorage.getItem('todos')) || [];
  
  // Initialize the app
  function init() {
    renderTodos();
    updateLayout();
  }
  
  // Update layout based on whether there are todos
  function updateLayout() {
    if (todos.length > 0) {
      todoContainer.classList.add('has-todos');
    } else {
      todoContainer.classList.remove('has-todos');
    }
  }
  
  // Render all todos (with optional filtering)
  function renderTodos() {
    todoList.innerHTML = '';
    const query = searchBar.value.trim().toLowerCase();
    const filteredTodos = todos.filter(todo =>
      todo.text.toLowerCase().includes(query) ||
      (todo.description && todo.description.toLowerCase().includes(query))
    );
    filteredTodos.forEach((todo, index) => {
      // Use the index from the original todos array for actions
      const realIndex = todos.indexOf(todo);
      const todoItem = createTodoElement(todo, realIndex);
      todoList.appendChild(todoItem);
    });
  }
  
  // Create a todo element
  function createTodoElement(todo, index) {
    const li = document.createElement('li');
    li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
    
    // Format timestamp
    const timestamp = todo.timestamp ? new Date(todo.timestamp) : new Date();
    const timeString = timestamp.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' });
    
    const descriptionHtml = todo.description ? 
      `<div class="todo-description-text">${todo.description}</div>` : '';
    
    li.innerHTML = `
      <div class="todo-content">
        <div class="todo-timestamp-row">
          <span class="todo-timestamp">${timeString}</span>
        </div>
        <span class="todo-text">${todo.text}</span>
        ${descriptionHtml}
      </div>
      <div class="todo-actions">
        <button class="complete-btn" onclick="toggleComplete(${index})">
          ${todo.completed ? 'Undo' : 'Complete'}
        </button>
        <button class="delete-btn" onclick="deleteTodo(${index})">Delete</button>
      </div>
    `;
    
    return li;
  }
  
  // Add new todo
  function addTodo(text, description = '') {
    const todo = {
      text: text.trim(),
      description: description.trim(),
      completed: false,
      id: Date.now(),
      timestamp: new Date().toISOString()
    };
    
    todos.unshift(todo); // Add to beginning of array
    saveTodos();
    renderTodos();
    updateLayout();
  }
  
  // Toggle todo completion
  function toggleComplete(index) {
    todos[index].completed = !todos[index].completed;
    saveTodos();
    renderTodos();
  }
  
  // Delete todo
  function deleteTodo(index) {
    todos.splice(index, 1);
    saveTodos();
    renderTodos();
    updateLayout();
  }
  
  // Save todos to localStorage
  function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
  }
  
  // Handle form submission
  todoForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const text = todoInput.value.trim();
    const description = addDescriptionCheckbox.checked ? todoDescription.value : '';
    
    if (text) {
      addTodo(text, description);
      todoInput.value = '';
      todoDescription.value = '';
      addDescriptionCheckbox.checked = false;
      todoDescription.style.display = 'none';
      todoInput.focus();
    }
  });
  
  // Handle Enter key in input
  todoInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      todoForm.dispatchEvent(new Event('submit'));
    }
  });
  
  // Handle description checkbox toggle
  addDescriptionCheckbox.addEventListener('change', function() {
    if (this.checked) {
      todoDescription.style.display = 'block';
      todoDescription.focus();
    } else {
      todoDescription.style.display = 'none';
      todoDescription.value = '';
    }
  });
  
  // Search bar event
  searchBar.addEventListener('input', renderTodos);
  
  // Make functions globally available for onclick handlers
  window.toggleComplete = toggleComplete;
  window.deleteTodo = deleteTodo;
  
  // Initialize the app
  init();
});
