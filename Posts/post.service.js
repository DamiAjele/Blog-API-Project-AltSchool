const postModel = require("./post.model");
const calculateReadingTime = require("../Utils/calculateReadingTime");
const ApiQueryBuilder = require("../Utils/queryBuilder");

const createPost = async (body) => {
  const { title, description, content, author } = body;
  try {
    const blogPost = await postModel.findOne({ title });
    if (blogPost) {
      throw new Error("This post already exists");
    }

    
    const readingTime = calculateReadingTime(content);
    const post = await postModel.create({
      title,
      description,
      content: content,
      author,
      readingTime,

    });
    return post;
  } catch (error) {
    throw error;
  }
};

const getAllPosts = async (queryParams) => {
  try {
    const baseQuery = postModel.find({ state: "published" });

    const features = new ApiQueryBuilder(baseQuery, queryParams)
      .filter()
      .search()
      .sort()
      .paginate();

    const posts = await features.query.populate("author", "name email");

    // Get total count for pagination metadata
    const totalPosts = await postModel.countDocuments({ state: "published" });

    const limit = queryParams.limit * 1 || 20;
    const page = queryParams.page * 1 || 1;
    const hasNextPage = page * limit < totalPosts;

    return {
      posts: posts,
      totalPosts: totalPosts,
      hasNextPage: hasNextPage,
      currentPage: page,
    };
  } catch (error) {
    throw error;
  }
};

const getSinglePost = async (id) => {
  try {
    const post = await postModel
      .findByIdAndUpdate(id, { $inc: { readCount: 1 } }, { new: true })
      .populate("author", "name email");
    return post;
  } catch (error) {
    throw error;
  }
};

const updatePost = async (id, body) => {
  try {
    const post = await postModel.findByIdAndUpdate(id, body, { new: true });
    return post;
  } catch (error) {
    throw error;
  }
};

const deletePost = async (id) => {
  try {
    const post = await postModel.findByIdAndDelete(id);
  } catch (error) {
    throw error;
  }
};

const updateStateToPublished = async (id) => {
  try {
    const post = await postModel.findByIdAndUpdate(
      id,
      { state: "published" },
      { new: true },
    );
    return post;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  updateStateToPublished,
};
