class ApiQueryBuilder {
  constructor(query, queryParams) {
    this.query = query;
    this.queryParams = queryParams || {};
  }

  filter() {
    const queryObj = { ...this.queryParams };
    const excludedFields = ["page", "sort", "limit", "fields", "search"];
    excludedFields.forEach((el) => delete queryObj[el]);

    // Advanced filtering (for gte, gt, lte, lt)
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);

    this.query = this.query.find(JSON.parse(queryStr));
    return this;
  }

  search() {
    if (this.queryParams.search) {
      const searchStr = this.queryParams.search;
      this.query = this.query.find({
        $or: [
          { title: { $regex: searchStr, $options: "i" } },
          { tags: { $regex: searchStr, $options: "i" } },
        ],
      });
    }
    return this;
  }

  sort() {
    if (this.queryParams.sort) {
      const sortBy = this.queryParams.sort.split(",").join(" ");
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort("-createdAt");
    }
    return this;
  }

  paginate() {
    const page = Math.abs(this.queryParams.page) || 1;
    const limit = Math.abs(this.queryParams.limit) || 20;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

module.exports = ApiQueryBuilder;
