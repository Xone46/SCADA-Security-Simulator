import {
  createControl,
  getControlsByPlc,
  deleteControl
} from "../models/plcControlModel.mjs";

const addControl = async (req, res) => {
  try {
    const result = await createControl(req.body);

    res.status(201).json({
      message: "Contrôle ajouté",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur création contrôle"
    });
  }
};

const getControls = async (req, res) => {
  try {
    const controls = await getControlsByPlc(req.params.plc_id);

    res.json({ data: controls });
  } catch (error) {
    res.status(500).json({
      message: "Erreur récupération contrôles"
    });
  }
};

const removeControl = async (req, res) => {
  try {
    const result = await deleteControl(req.params.id);

    res.json({
      message: "Contrôle supprimé",
      data: result
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur suppression"
    });
  }
};

export default {
  addControl,
  getControls,
  removeControl
};