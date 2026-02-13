const authService = require("./auth.service");

const register = async (req, res,) => {
    try {
        const user = await authService.signUp(req.body);
        console.log(user);
        return res.status(201).json(user);
    } catch(error) {
        return res.status(400).json({ message: error.message});
    }
};

const login = async (req, res) => {
    try {
        const user = await authService.signIn(req.body);
        return res.status(200).json(user);
    }catch (error) {
        return res.status(400).json({ message: error.message });
    }
}

module.exports = {
    register,
    login,
}