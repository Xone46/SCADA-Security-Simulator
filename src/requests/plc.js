import API from "./api";

export default {
  getAllPlcs() {
    return API.get("/plcs");
  },

  getPlcById(id) {
    return API.get(`/plcs/${id}`);
  },

  createPlc(data) {
    return API.post("/plcs", data);
  },

  updatePlc(id, data) {
    return API.put(`/plcs/${id}`, data);
  },

  updatePlcStatus(id, status, decommissioning_date = "") {
    return API.put(`/plcs/${id}/status`, { status, decommissioning_date });
  },

  deletePlc(id) {
    return API.delete(`/plcs/${id}`);
  }
};