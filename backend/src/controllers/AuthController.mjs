import { findUserByEmail } from "../models/userModel.mjs";

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "L'email et le mot de passe sont requis."
      });
    }

    const user = await findUserByEmail(email);

    if (!user) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    if (user.password !== password) {
      return res.status(401).json({
        message: "Email ou mot de passe incorrect."
      });
    }

    req.session.user = {
      id: user.id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    };

    return res.status(200).json({
      id: user.id,
      matricule: user.matricule,
      nom: user.nom,
      prenom: user.prenom,
      email: user.email,
      role: user.role
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    return res.status(500).json({
      message: "Erreur interne lors de la connexion.",
      error: err.message
    });
  }
};

const logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        message: "Erreur lors de la déconnexion."
      });
    }

    res.clearCookie("connect.sid");

    return res.status(200).json({
      message: "Déconnexion réussie."
    });
  });
};

const status = (req, res) => {
  if (req.session.user) {
    return res.status(200).json(req.session.user);
  }

  return res.status(401).json({
    message: "Utilisateur non authentifié."
  });
};

export default { login, logout, status };