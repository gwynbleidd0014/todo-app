import Projects from "./projects.js";
import Project from "./project.js";
import Todo from "./todo.js";

export default class Linker {
  static createTodo(projectName, todoName, todoDate) {
    Projects.projects[projectName].addTodo(new Todo(todoName, todoDate));
  }

  static createProject(projectName) {
    Projects.addProject(new Project(projectName));
    return Projects.projects[projectName];
  }
}
