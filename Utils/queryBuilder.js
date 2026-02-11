class ApiQueryBuilder {
  constructor(query, queryParams) {
    this.query = query;  // refers to the Mongoose query object
    this.queryParams = queryParams;  // refers to the query parameters from the request: req.query 
  }

  filter() {
    const queryField = { ...this.queryParams };

    const excluded = ["page", "limit", "sort", "search"];
    excluded.forEach((el) => delete queryField[el]);

    this.query = this.query.find(queryField);

    return this;
  }

  search() {
    if (this.queryParams.search) {
      this.query = this.query.find({
        $text: { $search: this.queryParams.search },
      });
    }

    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      this.query = this.query.sort(this.queryParams.sort);
    } else {
      this.query = this.query.sort("-createdAt");
    }

    return this;
  }

  paginate() {
    const page = this.queryParams.page * 1 || 1;
    const limit = this.queryParams.limit * 1 || 20;

    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = ApiQueryBuilder;
