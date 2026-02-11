const postModel = require("./post.model");
const calculateReadingTime = require("../Utils/calculateReadingTime");
const ApiQueryBuilder = require("../Utils/queryBuilder");

const createPost = async (body) => {
  try {
    const readingTime = calculateReadingTime(body.content);
    const post = await new postModel(...body, readingTime).save();
    return post;
  } catch (error) {
    throw error;
  }
};

const getAllPosts = async (queryParams) => {
    try {
        const posts = new ApiQueryBuilder(
          postModel.find().populate("author", "name email", "-password"), // populate author field with name and email, excluding password
          queryParams,
        )
          .filter()
          .search()
          .sort()
          .paginate();
        return await posts.query.select("-content"); // exclude content field from the response
    } catch (error) {        
        throw error;
    }
}

const getSinglePost = async (id) => {
    try {
        const post = await postModel.findByIdAndUpdate(id,
            { $inc: { read_count: 1 } },
    { new: true }
      ).populate("author", "name email");
        return post;
    } catch (error) {
        throw error;
    }
}

const updatePost = async (id, body) => {
    try {
        const post = await postModel.findByIdAndUpdate(id, body, { new: true });
        return post;
    } catch (error) {
        throw error;
    }
}

const deletePost = async (id) => {
    try {
        const post = await postModel.findByIdAndDelete(id);
        return post;
    } catch (error) {
        throw error;
    }
}

const updateStateToPublished = async (id) => {
    try {
        const post = await postModel.findByIdAndUpdate(id, { state: 'published' }, { new: true });
        return post;
    } catch (error) {
        throw error;
    }
}

module.exports = {
    createPost,
    getAllPosts,
    getSinglePost,
    updatePost,
    deletePost,
    updateStateToPublished
};
