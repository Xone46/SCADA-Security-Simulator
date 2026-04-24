import {
  createPlan,
  getPlans,
  getPlanById,
  deletePlan,
  createNode,
  getNodesByPlan,
  updateNodePosition,
  deleteNode,
  createEdge,
  getEdgesByPlan,
  deleteEdge
} from "../models/architectureModel.mjs";

const addPlan = async (req, res) => {
  try {
    if (!req.body.name) {
      return res.status(400).json({ message: "Nom du plan obligatoire." });
    }

    const plan = await createPlan(req.body);
    return res.status(201).json({ message: "Plan créé.", data: plan });
  } catch (error) {
    return res.status(500).json({ message: "Erreur création plan.", error: error.message });
  }
};

const listPlans = async (req, res) => {
  try {
    const plans = await getPlans();
    return res.json({ data: plans });
  } catch (error) {
    return res.status(500).json({ message: "Erreur récupération plans.", error: error.message });
  }
};

const getPlan = async (req, res) => {
  try {
    const plan = await getPlanById(req.params.id);

    if (!plan) return res.status(404).json({ message: "Plan introuvable." });

    return res.json({ data: plan });
  } catch (error) {
    return res.status(500).json({ message: "Erreur récupération plan.", error: error.message });
  }
};

const removePlan = async (req, res) => {
  try {
    const result = await deletePlan(req.params.id);
    return res.json({ message: "Plan supprimé.", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Erreur suppression plan.", error: error.message });
  }
};

const addNode = async (req, res) => {
  try {
    if (!req.body.plan_id || !req.body.name || !req.body.type) {
      return res.status(400).json({ message: "plan_id, name et type sont obligatoires." });
    }

    const node = await createNode(req.body);
    return res.status(201).json({ message: "Équipement ajouté.", data: node });
  } catch (error) {
    return res.status(500).json({ message: "Erreur création équipement.", error: error.message });
  }
};

const listNodes = async (req, res) => {
  try {
    const nodes = await getNodesByPlan(req.params.planId);
    return res.json({ data: nodes });
  } catch (error) {
    return res.status(500).json({ message: "Erreur récupération équipements.", error: error.message });
  }
};

const moveNode = async (req, res) => {
  try {
    const result = await updateNodePosition(
      req.params.id,
      req.body.x_position,
      req.body.y_position
    );

    return res.json({ message: "Position mise à jour.", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Erreur déplacement équipement.", error: error.message });
  }
};

const removeNode = async (req, res) => {
  try {
    const result = await deleteNode(req.params.id);
    return res.json({ message: "Équipement supprimé.", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Erreur suppression équipement.", error: error.message });
  }
};

const addEdge = async (req, res) => {
  try {
    if (!req.body.plan_id || !req.body.source_node_id || !req.body.target_node_id) {
      return res.status(400).json({ message: "plan_id, source_node_id et target_node_id obligatoires." });
    }

    const edge = await createEdge(req.body);
    return res.status(201).json({ message: "Connexion créée.", data: edge });
  } catch (error) {
    return res.status(500).json({ message: "Erreur création connexion.", error: error.message });
  }
};

const listEdges = async (req, res) => {
  try {
    const edges = await getEdgesByPlan(req.params.planId);
    return res.json({ data: edges });
  } catch (error) {
    return res.status(500).json({ message: "Erreur récupération connexions.", error: error.message });
  }
};

const removeEdge = async (req, res) => {
  try {
    const result = await deleteEdge(req.params.id);
    return res.json({ message: "Connexion supprimée.", data: result });
  } catch (error) {
    return res.status(500).json({ message: "Erreur suppression connexion.", error: error.message });
  }
};

export default {
  addPlan,
  listPlans,
  getPlan,
  removePlan,
  addNode,
  listNodes,
  moveNode,
  removeNode,
  addEdge,
  listEdges,
  removeEdge
};