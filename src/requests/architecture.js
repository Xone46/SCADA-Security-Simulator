import API from "./api";

export default {
  getPlans() {
    return API.get("/architecture/plans");
  },

  createPlan(data) {
    return API.post("/architecture/plans", data);
  },

  getPlan(id) {
    return API.get(`/architecture/plans/${id}`);
  },

  deletePlan(id) {
    return API.delete(`/architecture/plans/${id}`);
  },

  getNodes(planId) {
    return API.get(`/architecture/nodes/${planId}`);
  },

  createNode(data) {
    return API.post("/architecture/nodes", data);
  },

  moveNode(id, x, y) {
    return API.put(`/architecture/nodes/${id}/position`, {
      x_position: x,
      y_position: y
    });
  },

  deleteNode(id) {
    return API.delete(`/architecture/nodes/${id}`);
  },

  getEdges(planId) {
    return API.get(`/architecture/edges/${planId}`);
  },

  createEdge(data) {
    return API.post("/architecture/edges", data);
  },

  deleteEdge(id) {
    return API.delete(`/architecture/edges/${id}`);
  }
};