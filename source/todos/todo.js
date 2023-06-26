export default class Todo {
  constructor(name, date) {
    this.name = name;
    this.date = date;
  }

  changeProp(propName, value) {
    if (propName in this) {
      this[propName] = value;
    }
  }
}
