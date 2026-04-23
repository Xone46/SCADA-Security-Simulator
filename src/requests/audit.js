import API from "./api";

export default {
  getReport() {
    return API.get("/scada/audit-report");
  }
};