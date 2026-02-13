const userModel = require('../Users/user.model');
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

const signUp = async (payload) => {
    const { firstName, lastName, email, password } = payload;
    try {
        const user = await userModel.findOne({ email });
        if (user) {
           throw new Error("User already exists");
        }

        const newUser = await userModel.create({
            firstName,
            lastName,
            email,
            password,
            role: "author",
        });

        const _newUser = newUser.toObject();
        delete _newUser.password;

        return {newUser: _newUser, status: 201, message: "Account created successfully"};
    } catch (error) {
        console.error(error);
        throw error;
    }
};

const signIn = async (payload) => {
    const { email, password } = payload;
    try {
        const user = await userModel.findOne({ email });
        if (!user) {
            console.log(user);
            throw new Error("Invalid Credentials");
        }

        if (user.role === "reader") {
            throw new Error("Unauthorized Access");
        };

        const isPasswordMatch = await user.comparePassword(password);
        if (!isPasswordMatch) {
            console.log(isPasswordMatch);
            throw new Error("Invalid Credentials");
        }

        const token = jwt.sign({ userId: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        const _user = user.toObject();
        delete _user.password;

        return {
          user: _user,
          status: 200,
          token,
          message: "Logged In successfully",
        };
    }catch (error) {
        throw error;
    }
};

module.exports = {
    signUp,
    signIn
}