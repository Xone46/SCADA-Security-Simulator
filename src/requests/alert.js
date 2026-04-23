import API from "./api";

export default {
  getAlerts() {
    return API.get("/scada/alerts");
  },

  clearAlerts() {
    return API.delete("/scada/alerts");
  }
};