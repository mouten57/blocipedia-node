module.exports = class ApplicationPolicy {

  constructor(user, record) {
    this.user = user;
    this.record = record;

    console.log(user);
    //The record part is showing up undefined, even with admin user
    console.log(record);
  }

  _isOwner() {
    return this.record && (this.record.userId == this.user.id);
  }

  _isAdmin() {
    return this.user && this.user.role == "admin";
  }

  new() {
    return this.user != null;
  }

  create() {
    return this.new();
  }

  show() {
    return true;
  }

  edit() {
    return this.new();
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}