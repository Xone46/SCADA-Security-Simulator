import {
  createPlc,
  getAllPlcs,
  findPlcById,
  updatePlc,
  deletePlc,
  updatePlcStatus
} from "../models/plcModel.mjs";

const create = async (req, res) => {
  try {
    const { name, ip_address } = req.body;

    if (!name || !ip_address) {
      return res.status(400).json({
        message: "Nom PLC et adresse IP obligatoires."
      });
    }

    if (req.body.status === "hors_service" && !req.body.decommissioning_date) {
      return res.status(400).json({
        message: "Date hors service obligatoire si le PLC est hors service."
      });
    }

    const plc = await createPlc(req.body);

    res.status(201).json({
      message: "PLC créé avec succès.",
      data: plc
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur création PLC.",
      error: error.message
    });
  }
};

const getAll = async (req, res) => {
  try {
    const plcs = await getAllPlcs();
    res.json({ data: plcs });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération PLC." });
  }
};

const getById = async (req, res) => {
  try {
    const plc = await findPlcById(req.params.id);

    if (!plc) {
      return res.status(404).json({ message: "PLC introuvable." });
    }

    res.json({ data: plc });
  } catch (error) {
    res.status(500).json({ message: "Erreur récupération PLC." });
  }
};

const updateById = async (req, res) => {
  try {
    const existing = await findPlcById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "PLC introuvable." });
    }

    if (req.body.status === "hors_service" && !req.body.decommissioning_date) {
      return res.status(400).json({
        message: "Date hors service obligatoire si le PLC est hors service."
      });
    }

    if (req.body.status !== "hors_service") {
      req.body.decommissioning_date = "";
    }

    const updated = await updatePlc(req.params.id, req.body);

    res.json({
      message: "PLC modifié avec succès.",
      data: updated
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur modification PLC.",
      error: error.message
    });
  }
};

const deleteById = async (req, res) => {
  try {
    const existing = await findPlcById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: "PLC introuvable." });
    }

    const result = await deletePlc(req.params.id);

    res.json({
      message: "PLC supprimé avec succès.",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur suppression PLC." });
  }
};

const updateStatus = async (req, res) => {
  try {
    const { status, decommissioning_date } = req.body;
    const allowed = ["active", "inactive", "maintenance", "hors_service"];

    if (!allowed.includes(status)) {
      return res.status(400).json({ message: "Statut invalide." });
    }

    if (status === "hors_service" && !decommissioning_date) {
      return res.status(400).json({
        message: "Date hors service obligatoire."
      });
    }

    const result = await updatePlcStatus(req.params.id, status);

    res.json({
      message: "Statut PLC mis à jour.",
      data: result
    });
  } catch (error) {
    res.status(500).json({ message: "Erreur statut PLC." });
  }
};

export default {
  create,
  getAll,
  getById,
  updateById,
  deleteById,
  updateStatus
};