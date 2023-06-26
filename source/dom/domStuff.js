import Todo from "../todos/todo.js";
import Project from "../todos/project.js";
import Linker from "../todos/linking.js";
import Projects from "../todos/projects.js";
import done from "../assets/done.svg";
import close from "../assets/close.svg";
import add from "../assets/add.svg";
import logo from "../assets/logo.svg";

export default class DOM {
  static projectsEL = document.querySelector(".projects");
  static todosEl = document.querySelector(".todos");
  static currentProject = Projects.projects["default"];
  static addProjectEL = document.querySelector(".add-project");
  static ball = document.querySelector(".ball");
  static app = document.querySelector(".app");

  static displayProjects() {
    this.projectsEL.innerHTML = "";
    console.log(this.currentProjectIndex);
    for (let [key, value] of Object.entries(Projects.projects)) {
      const divWR = document.createElement("div");
      const divNM = document.createElement("div");
      const divNB = document.createElement("div");
      divWR.classList.add("project");
      divNM.classList.add("project-name");
      divNB.classList.add("todo-number");

      divNM.textContent = key;
      divNM.dataset.name = value.name;
      divNB.textContent = Object.keys(value.todos).length;

      divWR.append(divNM, divNB);
      this.projectsEL.appendChild(divWR);
    }
    const div = document.createElement("div");
    div.classList.add("add-project");
    div.innerHTML = `    
    <img src="${add}" alt="add-icon" class="add-icon" />
    <div class="add-project-text">Add project</div>`;
    this.projectsEL.appendChild(div);

    div.addEventListener("click", this.displayAdd);
    if (Object.keys(Projects.projects).length > 0) {
      this.chooseCurrentProject();
    }
  }

  static chooseCurrentProject() {
    const firstProjectName = document.querySelectorAll(".project-name");
    firstProjectName[this.currentProjectIndex].classList.add("selected");
    const firstProject = document.querySelectorAll(".project");
    firstProject[this.currentProjectIndex].classList.add("bg");
  }

  static displayTodos() {
    this.clearTodos();
    if (Object.keys(Projects.projects).length < 1) {
      return;
    }
    for (let [key, value] of Object.entries(this.getCurrentProject().todos)) {
      const html = `
      <div class="todo" data-name="${key}">

    </div>`;
      const div = document.createElement("div");
      div.classList.add("todo");
      div.dataset.name = key;

      const date = value.date
        ? `<div class="date-str">${value.date}</div>`
        : '<input type="date" class="date" />';

      div.innerHTML = `        
        <img src="${done}" alt="" class="todo-clear" />
        <div class="todo-name">${key}</div>
        ${date}
        <img src="${close}" alt="" class="todo-delete" />`;

      this.todosEl.appendChild(div);
    }

    const div = document.createElement("div");
    div.classList.add("add-todo");
    div.innerHTML = `    
    <img src="${add}" alt="add-icon" class="add-icon" />
    <div class="add-todo-text">Add todo</div>`;
    this.todosEl.appendChild(div);
    div.addEventListener("click", this.displayAdd);

    this.updateDateEventListeners();
    this.updateTodoNameEventListeners();
    this.updateDeleteAndCompleteEventListeners();
  }

  static updateDateEventListeners() {
    const dates = document.querySelectorAll(".date");

    dates.forEach((date) => {
      date.addEventListener("change", (e) => {
        const project = this.getCurrentProject().todos;
        const todo = e.target.parentElement;
        const todoName = todo.dataset.name;

        const dateSTR = e.target.value;
        const before = e.target.nextElementSibling;

        const div = document.createElement("div");
        div.classList.add("date-str");
        div.textContent = dateSTR;

        project[todoName].changeProp("date", dateSTR);

        todo.insertBefore(div, before);
        div.addEventListener("click", (e) => {
          todo.insertBefore(date, before);
          div.remove();
        });
        date.remove();
      });
    });
  }

  static updateTodoNameEventListeners() {
    const names = document.querySelectorAll(".todo-name");

    names.forEach((name) => {
      name.addEventListener("click", (e) => {
        console.log("click");
        const project = this.getCurrentProject().todos;
        const todo = e.target.parentElement;
        const todoName = todo.dataset.name;
        const before = e.target.nextElementSibling;

        const input = document.createElement("input");
        input.classList.add("todo-name", "todo-name-input");

        input.value = name.textContent;
        todo.insertBefore(input, before);

        document.addEventListener("keyup", (e) => {
          if (e.key === "Enter") {
            if (input.value === "") {
              alert("Bro name can't be empty");
              return;
            }
            name.textContent = input.value;
            project[todoName].changeProp("name", input.value);
            todo.insertBefore(name, before);
            input.remove();
          }
        });
        name.remove();
      });
    });
  }

  static updateDeleteAndCompleteEventListeners() {
    const removeTodo = (e) => {
      const todoName = e.target.parentElement.dataset.name;
      const project = this.getCurrentProject();
      project.removeTodo(todoName);
      e.target.parentElement.remove();
      this.displayProjects();
    };

    const clears = document.querySelectorAll(".todo-clear");
    const removes = document.querySelectorAll(".todo-delete");

    clears.forEach((clear) => {
      clear.addEventListener("click", removeTodo);
    });

    removes.forEach((remove) => {
      remove.addEventListener("click", removeTodo);
    });
  }

  static getCurrentProject() {
    const currentProjectName = document.querySelector(".selected").dataset.name;
    return Projects.projects[currentProjectName];
  }

  static updateEventListenersOnProjects() {
    const projects = document.querySelectorAll(".project");

    projects.forEach((project, i) => {
      project.addEventListener("click", (e) => {
        projects.forEach((project) => {
          if (project.classList.contains("bg")) {
            project.firstElementChild.classList.remove("selected");
            project.classList.remove("bg");
          }
        });
        DOM.currentProjectIndex = i;
        project.firstChild.classList.add("selected");
        project.classList.add("bg");
        DOM.displayTodos();
      });
    });
  }

  static clearTodos() {
    const todos = document.querySelectorAll(".todo");
    todos.forEach((todo) => {
      todo.remove();
    });
    document.querySelector(".add-todo")?.remove();
  }

  static updateEventListenersOnTodos() {
    const todos = document.querySelectorAll(".todos");
    todos.forEach((todo) => {
      todo.addEventListener("click", (e) => {});
    });
  }

  static displayAdd(e) {
    let addItem = null;
    let todo = false;
    if (
      e.target.classList.contains("add-project") ||
      e.target.parentElement.classList.contains("add-project")
    ) {
      addItem = e.target.classList.contains("add-project")
        ? e.target
        : e.target.parentElement;
    } else {
      addItem = e.target.classList.contains("add-todo")
        ? e.target
        : e.target.parentElement;
      todo = true;
    }

    const html = `
    <input type="text" class="project-add-inp" />
    <button class="project-add-btn">Add</button>
    <button class="project-add-cancell-btn">Cancell</button>
    `;
    const div = document.createElement("div");
    div.classList.add("project-add-wrap");
    div.innerHTML = html;

    addItem.parentElement.appendChild(div);
    let addBtn = null;
    let cancellBtn = null;
    if (!todo) {
      addBtn = DOM.projectsEL.querySelector(".project-add-btn");
      cancellBtn = DOM.projectsEL.querySelector(".project-add-cancell-btn");
    } else {
      addBtn = DOM.todosEl.querySelector(".project-add-btn");
      cancellBtn = DOM.todosEl.querySelector(".project-add-cancell-btn");
    }

    cancellBtn.addEventListener("click", (e) => {
      addItem.classList.toggle("hidden");
      div.remove();
    });

    addBtn.addEventListener("click", (e) => {
      if (e.target.previousElementSibling.value !== "") {
        if (!todo) {
          DOM.addProject(e.target.previousElementSibling.value);
          DOM.currentProjectIndex = Object.keys(Projects.projects).length - 1;
          DOM.displayProjects();
          DOM.updateEventListenersOnProjects();
          DOM.displayTodos();

          addItem.remove();
        } else {
          DOM.addTodo(
            DOM.getCurrentProject().name,
            e.target.previousElementSibling.value
          );
          DOM.displayTodos();
          addBtn.parentElement.remove();
          DOM.displayProjects();
          DOM.updateEventListenersOnProjects();
          addItem.remove();
        }
      } else {
        alert("Bro project name can't be emtpy");
      }
    });

    addItem.classList.toggle("hidden");
  }

  static addProject(projectName) {
    Linker.createProject(projectName);
  }

  static addTodo(projectName, todoName) {
    Linker.createTodo(projectName, todoName);
  }

  static loadUI() {
    this.currentProjectIndex = 0;
    this.todoViw = false;
    this.displayProjects();
    this.displayTodos();
    document.querySelector(".logo").src = logo;
    this.ball.addEventListener("click", () => {
      if (DOM.todoViw) {
        DOM.todosEl.style.setProperty("--cont", "none");
        DOM.projectsEL.style.setProperty("--proj", "block");
        DOM.app.style.setProperty(
          "--area",
          `
        'logo logo'
        'projects projects'
        'footer footer'`
        );
        DOM.todoViw = !DOM.todoViw;
      } else {
        DOM.todosEl.style.setProperty("--cont", "block");
        DOM.projectsEL.style.setProperty("--proj", "none");
        DOM.app.style.setProperty(
          "--area",
          `"logo logo"
          "content content"
          "footer footer"`
        );
        DOM.todoViw = !DOM.todoViw;
      }
    });
  }
}
