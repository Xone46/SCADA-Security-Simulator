import { findUserByUsername } from "../models/userModel.mjs";

const login = (req, res) => {
    try {
        const { username, password } = req.body;

        const user = findUserByUsername(username);

        if (!user) {
            return res.status(401).json({ msg: "BAD CREDENTIALS" });
        }

        if (user.password !== password) {
            return res.status(401).json({ msg: "WRONG PASSWORD" });
        }

        req.session.user = {
            id: user.id,
            username: user.username
        };

        return res.status(200).json(req.session.user);

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const logout = (req, res) => {
    req.session.destroy();
    res.json({ msg: "LOGOUT SUCCESS" });
};

const status = (req, res) => {
    if (req.session.user) {
        return res.json(req.session.user);
    } else {
        return res.status(401).json({ msg: "NOT AUTH" });
    }
};

export default { login, logout, status };