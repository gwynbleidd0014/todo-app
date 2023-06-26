export default class Project {
  constructor(name) {
    this.name = name;
    this.todos = {};
  }

  addTodo(todo) {
    this.todos[todo.name] = todo;
  }

  removeTodo(name) {
    if (name in this.todos) {
      delete this.todos[name];
    }
  }
}
