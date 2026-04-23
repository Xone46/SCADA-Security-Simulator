import {
  createUser,
  getAllUsers,
  findUserById,
  findUserByEmail,
  updateUser,
  deleteUser,
  updateUserRole,
  updateUserStatus
} from "../models/userModel.mjs";

/**
 * CREATE USER
 */
const register = async (req, res) => {
  try {
    const {
      matricule,
      nom,
      prenom,
      email,
      password,
      role = "user",
      status = "active"
    } = req.body;

    if (!matricule || !nom || !prenom || !email || !password) {
      return res.status(400).json({
        message: "Tous les champs obligatoires doivent être remplis."
      });
    }

    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        message: "Un utilisateur avec cet email existe déjà."
      });
    }

    const newUser = await createUser({
      matricule,
      nom,
      prenom,
      email,
      password,
      role,
      status
    });

    return res.status(201).json({
      message: "Utilisateur créé avec succès.",
      data: newUser
    });
  } catch (error) {
    console.error("❌ register user error:", error);
    return res.status(500).json({
      message: "Erreur lors de la création de l’utilisateur.",
      error: error.message
    });
  }
};

/**
 * GET ALL USERS
 */
const getUsers = async (req, res) => {
  try {
    const users = await getAllUsers();

    return res.status(200).json({
      message: "Liste des utilisateurs récupérée avec succès.",
      data: users
    });
  } catch (error) {
    console.error("❌ getUsers error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération des utilisateurs.",
      error: error.message
    });
  }
};

/**
 * GET USER BY ID
 */
const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await findUserById(id);

    if (!user) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    return res.status(200).json({
      message: "Utilisateur récupéré avec succès.",
      data: user
    });
  } catch (error) {
    console.error("❌ getUserById error:", error);
    return res.status(500).json({
      message: "Erreur lors de la récupération de l’utilisateur.",
      error: error.message
    });
  }
};

/**
 * UPDATE USER
 */
const updateUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const { matricule, nom, prenom, email, password, role, status } = req.body;

    const existingUser = await findUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    if (email && email !== existingUser.email) {
      const userWithSameEmail = await findUserByEmail(email);

      if (userWithSameEmail) {
        return res.status(409).json({
          message: "Un utilisateur avec cet email existe déjà."
        });
      }
    }

    const updated = await updateUser(id, {
      matricule,
      nom,
      prenom,
      email,
      password,
      role,
      status
    });

    return res.status(200).json({
      message: "Utilisateur modifié avec succès.",
      data: updated
    });
  } catch (error) {
    console.error("❌ updateUserById error:", error);
    return res.status(500).json({
      message: "Erreur lors de la modification de l’utilisateur.",
      error: error.message
    });
  }
};

/**
 * DELETE USER
 */
const deleteUserById = async (req, res) => {
  try {
    const { id } = req.params;

    const existingUser = await findUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    const result = await deleteUser(id);

    return res.status(200).json({
      message: "Utilisateur supprimé avec succès.",
      data: result
    });
  } catch (error) {
    console.error("❌ deleteUserById error:", error);
    return res.status(500).json({
      message: "Erreur lors de la suppression de l’utilisateur.",
      error: error.message
    });
  }
};

/**
 * UPDATE ROLE
 */
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!role || !["admin", "user"].includes(String(role).toLowerCase())) {
      return res.status(400).json({
        message: "Le rôle doit être 'admin' ou 'user'."
      });
    }

    const existingUser = await findUserById(id);

    if (!existingUser) {
      return res.status(404).json({
        message: "Utilisateur introuvable."
      });
    }

    const result = await updateUserRole(id, role.toLowerCase());

    return res.status(200).json({
      message: "Rôle mis à jour avec succès.",
      data: result
    });
  } catch (error) {
    console.error("❌ updateRole error:", error);
    return res.status(500).json({
      message: "Erreur lors de la mise à jour du rôle.",
      error: error.message
    });
  }
};


const updateStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!["active", "inactive"].includes(status)) {
      return res.status(400).json({
        message: "Status invalide"
      });
    }

    const result = await updateUserStatus(id, status);

    res.json({
      message: "Statut mis à jour",
      data: result
    });

  } catch (error) {
    console.error("❌ updateStatus:", error);
    res.status(500).json({
      message: "Erreur update status"
    });
  }
};

export default {
  register,
  getUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  updateRole,
  updateStatus
};