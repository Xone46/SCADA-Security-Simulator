import API from "./api";

export default {
  getControls(plc_id) {
    return API.get(`/plc-controls/${plc_id}`);
  },

  createControl(data) {
    return API.post("/plc-controls", data);
  },

  deleteControl(id) {
    return API.delete(`/plc-controls/${id}`);
  }
};