const { Op } = require('sequelize');

class ApiFeatures {
  constructor(model, queryString) {
    this.model = model;
    this.queryString = queryString;
    this.queryOptions = {};
  }

  filter() {
    const queryObj = { ...this.queryString };
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    
    let where = {};
    for (const key in queryObj) {
      if (queryObj.hasOwnProperty(key)) {
        if (typeof queryObj[key] === 'object') {
          where[key] = { [Op[queryObj[key].operator]]: queryObj[key].value };
        } else {
          where[key] = queryObj[key];
        }
      }
    }
    
    this.queryOptions.where = where;
    return this;
  }

  sort() {
    if (this.queryString.sort) {
      const order = this.queryString.sort.split(',').map(item => {
        return item.startsWith('-') ? [item.slice(1), 'DESC'] : [item, 'ASC'];
      });
      this.queryOptions.order = order;
    } else {
      this.queryOptions.order = [['created_at', 'DESC']];
    }
    return this;
  }

  limitFields() {
    if (this.queryString.fields) {
      const attributes = this.queryString.fields.split(',');
      this.queryOptions.attributes = attributes;
    }
    return this;
  }

  paginate() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 10;
    const offset = (page - 1) * limit;
    
    this.queryOptions.limit = limit;
    this.queryOptions.offset = offset;
    return this;
  }

  get query() {
    return this.model.findAll(this.queryOptions);
  }
}

module.exports = ApiFeatures;