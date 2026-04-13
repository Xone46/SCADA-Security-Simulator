import { insertScadaData, getLatestScada } from "../models/scadaModel.mjs";

const sendData = (req, res) => {
    try {
        const data = req.body;

        insertScadaData(data);

        return res.json({ msg: "DATA SAVED" });

    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

const getData = (req, res) => {
    try {
        const data = getLatestScada(20);
        return res.json(data);
    } catch (err) {
        return res.status(500).json({ error: err.message });
    }
};

export default { sendData, getData };