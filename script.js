class TodoApp {
    constructor() {
        this.todos = this.loadTodos();
        this.taskInput = document.querySelector('.task-input');
        this.addBtn = document.querySelector('.add-btn');
        this.todoList = document.getElementById('todo-list');
        this.clearCompletedBtn = document.getElementById('clear-completed');
        
        this.init();
    }

    init() {
        this.addBtn.addEventListener('click', () => this.addTodo());
        this.taskInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.addTodo();
            }
        });
        this.clearCompletedBtn.addEventListener('click', () => this.clearCompleted());
        
        this.render();
    }

    addTodo() {
        const text = this.taskInput.value.trim();
        if (text === '') {
            this.taskInput.focus();
            return;
        }

        const todo = {
            id: Date.now(),
            text: text,
            completed: false,
            createdAt: new Date().toISOString()
        };

        this.todos.unshift(todo);
        this.saveTodos();
        this.taskInput.value = '';
        this.taskInput.focus();
        this.render();
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.saveTodos();
            this.render();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.saveTodos();
        this.render();
    }

    clearCompleted() {
        this.todos = this.todos.filter(t => !t.completed);
        this.saveTodos();
        this.render();
    }

    loadTodos() {
        const saved = localStorage.getItem('todos');
        return saved ? JSON.parse(saved) : [];
    }

    saveTodos() {
        localStorage.setItem('todos', JSON.stringify(this.todos));
    }

    updateStats() {
        const total = this.todos.length;
        const completed = this.todos.filter(t => t.completed).length;
        const pending = total - completed;

        document.getElementById('total-tasks').textContent = total;
        document.getElementById('completed-tasks').textContent = completed;
        document.getElementById('pending-tasks').textContent = pending;

        this.clearCompletedBtn.disabled = completed === 0;
    }

    render() {
        this.updateStats();

        if (this.todos.length === 0) {
            this.todoList.innerHTML = `
                <div class="empty-state">
                    <h3>No tasks yet</h3>
                    <p>Add your first task above to get started!</p>
                </div>
            `;
            return;
        }

        this.todoList.innerHTML = this.todos.map(todo => `
            <div class="todo-item ${todo.completed ? 'completed' : ''}">
                <div class="todo-checkbox ${todo.completed ? 'checked' : ''}" 
                     onclick="todoApp.toggleTodo(${todo.id})"></div>
                <div class="todo-text">${this.escapeHtml(todo.text)}</div>
                <button class="delete-btn" onclick="todoApp.deleteTodo(${todo.id})">
                    Delete
                </button>
            </div>
        `).join('');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

const todoApp = new TodoApp();
