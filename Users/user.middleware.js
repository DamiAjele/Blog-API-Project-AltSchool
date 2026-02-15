const joi = require("joi");

const validateUser = (req, res, next) => {
    const userSchema = joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
    });

    const { error } = userSchema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.message });
    }
    next();
};

module.exports = {
    validateUser,
};