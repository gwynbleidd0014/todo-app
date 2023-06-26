export default class Projects {
  static projects = {};

  static addProject(project) {
    if (!(project.name in this.projects)) {
      this.projects[project.name] = project;
    }
  }

  static removeProject(name) {}
}
