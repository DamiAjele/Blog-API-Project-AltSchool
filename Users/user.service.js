const userModel = require("./user.model");

const updateUserProfile = async (userId, body) => {
    const { firstName, lastName } = body;
    try {
        const findUser = await userModel.findById(userId);
        if (!findUser) {
            throw new Error("User not found");
        }
        const user = await userModel.findByIdAndUpdate( userId, { firstName, lastName }, { new: true });
        
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }

}

const getUserById = async (userId) => {
    try {
        const user = await userModel.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

module.exports = {
    updateUserProfile,
    getUserById,
}