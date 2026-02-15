const userService = require("./user.service");

const updateUser = async (req, res, next) => {;
    try {
        const user = await userService.updateUserProfile(req.params.id, req.body);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
};

const getUserById = async (req, res, next) => {
    try {
        const user = await userService.getUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({user});
    } catch (error) {
        next(error);
    }
};

module.exports = {
    updateUser,
    getUserById,
}