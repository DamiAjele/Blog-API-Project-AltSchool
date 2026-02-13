const joi = require("joi");

const validatePost = (req, res, next) => {

    const postSchema = joi.object({
      title: joi.string().required(),
      description: joi.string().required(),
      content: joi.string().required(),
      author: joi.string(),
    });

    const { error } = postSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }

    next();
};

module.exports = {
    validatePost
}

