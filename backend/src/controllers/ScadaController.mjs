import { readScadaRegisters } from "../utils/modbusClient.mjs";
import { insertScadaData, getLatestScadaData, getScadaHistory } from "../models/scadaModel.mjs";

const pollScada = async (req, res) => {
  try {
    const data = await readScadaRegisters();
    const saved = await insertScadaData(data);

    return res.status(200).json({
      message: "SCADA data collected successfully.",
      data: saved
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while reading SCADA data.",
      error: error.message
    });
  }
};

const latestScada = async (req, res) => {
  try {
    const data = await getLatestScadaData();

    return res.status(200).json({
      message: "Latest SCADA data fetched successfully.",
      data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching latest SCADA data.",
      error: error.message
    });
  }
};

const historyScada = async (req, res) => {
  try {
    const limit = Number(req.query.limit || 50);
    const data = await getScadaHistory(limit);

    return res.status(200).json({
      message: "SCADA history fetched successfully.",
      data
    });
  } catch (error) {
    return res.status(500).json({
      message: "Error while fetching SCADA history.",
      error: error.message
    });
  }
};

export default {
  pollScada,
  latestScada,
  historyScada
};