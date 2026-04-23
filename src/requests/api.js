import axios from "axios";

const API = axios.create({
  baseURL: process.env.VUE_APP_API_URL || "http://localhost:5000/api/v1",
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});

// Ajouter automatiquement le token si existant
API.interceptors.request.use(
  config => {
    const token = sessionStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  error => Promise.reject(error)
);

// Gestion globale des erreurs
API.interceptors.response.use(
  response => response,
  error => {
    const status = error?.response?.status;

    if (status === 401) {
      console.warn("Session expirée ou non autorisée");
      sessionStorage.clear();
      window.location.href = "/";
    }

    if (status === 403) {
      console.warn("Accès refusé");
    }

    if (!error.response) {
      console.error("Serveur inaccessible ou problème réseau");
    }

    return Promise.reject(error);
  }
);

export default API;