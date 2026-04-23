import API from "./api";

export default {
  poll() {
    return API.get("/scada/poll");
  },

  getLatestData() {
    return API.get("/scada/latest");
  },

  getHistory(limit = 50) {
    return API.get(`/scada/history?limit=${limit}`);
  }
};