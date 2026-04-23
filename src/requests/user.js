import API from "./api";

export default {
  connexion(email, password) {
    return API.post("/auth/login", { email, password });
  },

  inscription(data) {
    return API.post("/users/register", data);
  },

  getAllUsers() {
    return API.get("/users");
  },

  getUserById(id) {
    return API.get(`/users/${id}`);
  },

  updateUser(id, data) {
    return API.put(`/users/${id}`, data);
  },

  updateUserRole(id, role) {
    return API.put(`/users/${id}/role`, { role });
  },

  deleteUser(id) {
    return API.delete(`/users/${id}`);
  },

  updateUserStatus(id, status) {
   return API.put(`/users/${id}/status`, { status });
  }
};