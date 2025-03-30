function autopopulate(field) {
  return function(next) {
    this.populate(field);
    next();
  }
}

module.exports = { autopopulate };

