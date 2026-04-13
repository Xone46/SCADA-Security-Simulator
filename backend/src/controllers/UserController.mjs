import { createUser, getAllUsers } from "../models/userModel.mjs";

const register = (req, res) => {
    try {
        const { username, password } = req.body;

        createUser(username, password);

        return res.status(201).json({ msg: "USER CREATED" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getUsers = (req, res) => {
    try {
        const users = getAllUsers();
        return res.json(users);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default { register, getUsers };