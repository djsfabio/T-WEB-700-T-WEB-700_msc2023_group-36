class User {
  constructor(id = 0, name = '', email = '', password = '', role = '' ) {
    this.id = id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role;
    this.auth_id = '';
    this.is_active = false;
    this.subscribed_at = new Date();
    this.updated_at = new Date();
  }
}

module.exports = User;
