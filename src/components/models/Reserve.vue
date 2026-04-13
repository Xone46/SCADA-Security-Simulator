<template>
  <div class="reserve-modal">
    <div class="modal-container">
      
      <!-- En-tête -->
      <div class="modal-header">
        <h3>{{ `${infoReserve[0]}/${infoReserve[1]}` }} {{ infoReserve[2] }}</h3>
        <div class="tab-buttons">
          <button @click="switchTab('phrases')" :class="{active: flagPhrases}">Modèles disponibles</button>
          <button @click="switchTab('saisie')" :class="{active: flagSaisie}">Saisie observation</button>
        </div>
      </div>

      <!-- Contenu -->
      <div class="modal-content">

        <!-- Section modèles -->
        <div v-if="flagPhrases" class="models-section">
          <div class="models-list">
            <div v-for="(item, index) in liste" :key="index" class="model-item">
              <div class="model-text">{{ item.name }}</div>
              <button class="select-btn" @click="addModel(item.name)">
                <font-awesome-icon icon="circle-check" />
              </button>
            </div>
          </div>
        </div>

        <!-- Section saisie libre -->
        <div v-if="flagSaisie" class="free-input-section">
          <textarea 
            v-model="content" 
            rows="8" 
            placeholder="Saisissez votre commentaire ici..."
            class="comment-input">
          </textarea>
          <button v-if="content.length > 0" class="add-btn" @click="addModel(content)">Ajouter commentaire</button>
        </div>

        <!-- Commentaires sélectionnés -->
        <div class="selected-section">
          <div class="selected-list">
            <div v-for="(item, index) in modelSelected" :key="index + 100" class="selected-item">
              <div class="item-content">
                <div v-if="!item.disabled" class="item-text">{{ item.name }}</div>
                <textarea 
                  v-else
                  :value="item.name"
                  @input="handelEdit($event, index)"
                  class="edit-input">
                </textarea>
              </div>

              <div class="item-actions">
                <button class="action-btn delete" @click="supprimer(item.name)">
                  <font-awesome-icon icon="trash" />
                </button>
                <button v-if="!item.disabled" class="action-btn edit" @click="edit(item.name)">
                  <font-awesome-icon icon="pencil" />
                </button>
                <button v-else class="action-btn save" @click="sauvegarderComment(item.name)">
                  <font-awesome-icon icon="circle-check" />
                </button>
                <select v-model="item.status" class="status-select">
                  <option value="critique">Critique</option>
                  <option value="non critique">Non critique</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>

      <!-- Pied de page -->
      <div class="modal-footer">
        <button v-if="modelSelected.length && checkedSelected" class="footer-btn save" @click="sauvegarder">Enregistrer</button>
        <button v-if="commentaireId && modelSelected.length >= 1" class="footer-btn reset" @click="reset">Initialiser</button>
        <button class="footer-btn quit" @click="sortir">Fermer</button>
      </div>

    </div>
  </div>
</template>

<script>
import Commentaires from "@/requests/commentaire";
import Reserve from "@/requests/Reserve";

export default {
  name: 'reserve-component',
  props: {
    infoReserve: { type: Array, required: true },
    observateurId: { type: String, required: true }
  },
  data() {
    return {
      flagPhrases: false,
      flagSaisie: false,
      content: "",
      modelSelected: [],
      commentaireId: "",
      liste: [],
      commentaires : []
    }
  },

  computed: {
    checkedSelected() {
      return this.modelSelected.some(el => el.status !== "");
    }
  }, 

  methods: { 

    switchTab(tab) {
      this.flagPhrases = tab === 'phrases';
      this.flagSaisie = tab === 'saisie';
    },

    addModel(value) {
      if (!value) return;
      const trimmed = value.trim();
      if (!trimmed) return;

      this.modelSelected.push({
        name: trimmed,
        status: "",
        etat: "not_saved",
        disabled: false
      });

      const index = this.liste.findIndex(el => el.name.toLowerCase() === trimmed.toLowerCase());
      if (index >= 0) this.liste.splice(index, 1);

      this.content = "";
    },

    edit(value) {
      const item = this.modelSelected.find(el => el.name === value);
      if (item) item.disabled = true;
    },

    sauvegarderComment(value) {
      const item = this.modelSelected.find(el => el.name === value);
      if (item) item.disabled = false;
    },

    handelEdit(event, index) {
      this.modelSelected[index].name = event.target.value.trim();
    },

    supprimer(value) {

      const index = this.modelSelected.findIndex(el => el.name === value);
      if (index === -1) return;

      const item = this.modelSelected[index];

      // Fonction utilitaire pour retirer de la sélection et remettre dans la liste
      const removeFromSelected = () => {
        this.modelSelected.splice(index, 1);

        // Vérifie si l'élément existe déjà dans la liste pour éviter les doublons
        const exists = this.liste.some(el => el.name.toLowerCase() === value.toLowerCase());
        if (!exists) {
          this.liste.push({ name: value });
        }
      };

      // Si l'item n'a jamais été sauvegardé, on le retire simplement
      if (item.etat === "not_saved") {
        return removeFromSelected();
      }

      // Si l'item est déjà sauvegardé, on appelle l'API pour le supprimer côté serveur
      if (item.etat === "saved") {
        Commentaires.deleteByIndexAndRef(
          this.infoReserve[0], 
          this.infoReserve[1], 
          this.infoReserve[2], 
          index, 
          this.observateurId
        )
        .then(() => removeFromSelected())
        .catch(err => console.error("Erreur suppression commentaire :", err));
      }
    },


    sauvegarder() {
      Commentaires.create(this.observateurId, this.infoReserve[0], this.infoReserve[1], this.infoReserve[2], this.modelSelected)
        .then(() => this.$emit('valider', this.infoReserve))
        .catch(err => console.log(err));
    },

    reset() {
      Commentaires.delete(this.commentaireId)
        .then(() => this.$emit('annuler', this.infoReserve))
        .catch(err => console.log(err));
    },

    sortir() {
      if (this.modelSelected.length === 0) this.$emit('annuler', this.infoReserve);
      else this.$emit('sortir');
    },

async handelReserve() {

      this.liste = [];
      this.commentaireId = "";
      this.modelSelected = [];

      console.log(this.infoReserve)

      try {
        // Récupérer les commentaires
        const resultCommentaires = await Commentaires.readCommentaires(this.observateurId);
        this.commentaires = resultCommentaires.data;

        // Vérifier si des commentaires existent pour ce ref et number et titre
        if (this.commentaires.length !== 0) {
          const exist = this.commentaires.find(c => c.ref === this.infoReserve[0] && c.number === this.infoReserve[1] && c.titre === this.infoReserve[2]);
          if (exist) {
            this.modelSelected.push(...exist.modelSelected);
          }
        }

        // Récupérer les réserves
        const resReserve = await Reserve.read();
        this.liste = resReserve.data;

        // Supprimer doublons
        this.modelSelected.forEach(el => {
          const index = this.liste.findIndex(val => val.name.toLowerCase().trim() === el.name.toLowerCase().trim());
          if (index >= 0) this.liste.splice(index, 1);
        });


      } catch (error) {
        console.error(error);
      }
    }

  },

  created() {
    this.handelReserve();
  }
}
</script>

<style scoped>
/* Conteneur principal */
.reserve-modal {
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background-color: rgba(0,0,0,0.7);
  display: flex; justify-content: center; align-items: center;
  z-index: 1000; padding: 20px;
  font-family: Arial, sans-serif; /* <-- texte par défaut Arial */
  color: black; /* <-- texte par défaut noir */
}

.modal-container {
  background-color: white;
  width: 90%; max-width: 900px; max-height: 90vh;
  display: flex; flex-direction: column;
  border-radius: 8px; box-shadow: 0 4px 20px rgba(0,0,0,0.2);
  overflow: hidden;
  font-family: inherit;
  color: inherit;
}

/* En-tête */
.modal-header {
  background-color: #2c3e50; color: white;
  padding: 15px 20px; display: flex; flex-direction: column; gap: 15px;
}
.modal-header h3 { 
  margin: 0; font-size: 1.2rem; font-weight: 500; 
  font-family: inherit; color: inherit; 
}

/* Onglets */
.tab-buttons { display: flex; gap: 10px; }
.tab-buttons button {
  padding: 8px 16px; border: none; border-radius: 4px;
  background-color: #e90b1a; color: white; cursor: pointer;
  font-size: 0.9rem; transition: all 0.2s;
  font-family: inherit;
}
.tab-buttons button.active { background-color: #f14337; font-weight: bold; }
.tab-buttons button:hover { background-color: #f52020; }

/* Contenu modal */
.modal-content { flex: 1; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 20px; }

/* Sections */
.models-section, .free-input-section, .selected-section {
  background-color: #f8f9fa; border-radius: 6px; padding: 15px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
  font-family: inherit; color: inherit;
}

.models-list, .selected-list { display: flex; flex-direction: column; gap: 10px; max-height: 300px; overflow-y: auto; }

.model-item, .selected-item {
  display: flex; justify-content: space-between; align-items: center;
  padding: 12px 15px; background-color: white; border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1); transition: all 0.2s;
  font-family: inherit; color: inherit;
}
.model-item:hover, .selected-item:hover { box-shadow: 0 2px 5px rgba(0,0,0,0.15); }

.model-text, .item-text { flex: 1; font-size: 0.95rem; line-height: 1.4; font-family: inherit; color: inherit; }
.select-btn { background-color: #2ecc71; color: white; border: none; border-radius: 4px; padding: 6px 10px; cursor: pointer; transition: 0.2s; font-family: inherit; }
.select-btn:hover { background-color: #27ae60; }

/* Textareas */
.comment-input, .edit-input {
  width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 4px;
  font-size: 0.95rem; line-height: 1.5; resize: vertical; min-height: 150px;
  font-family: Arial, sans-serif; /* <-- Arial */
  color: black; /* <-- texte noir */
}
.comment-input:focus, .edit-input:focus { outline: none; border-color: #3498db; box-shadow: 0 0 0 2px rgba(52,152,219,0.2); }

/* Boutons ajout et actions */
.add-btn {
  align-self: flex-end;
  background-color: #1b770d;
  color: white;
  border: none;
  border-radius: 0; /* <-- carré */
  padding: 8px 16px; /* tu peux ajuster si tu veux un vrai carré parfait */
  cursor: pointer;
  transition: 0.2s;
  font-family: inherit;
  border-radius: 5px;
}

.add-btn:hover {
  background-color: #146106;
}

.item-actions { display: flex; align-items: center; gap: 8px; }
.action-btn { width: 32px; height: 32px; display: flex; justify-content: center; align-items: center; border: none; border-radius: 4px; cursor: pointer; transition: 0.2s; font-family: inherit; }
.action-btn.delete { background-color: #e74c3c; color: white; }
.action-btn.delete:hover { background-color: #c0392b; }
.action-btn.edit { background-color: #f39c12; color: white; }
.action-btn.edit:hover { background-color: #d35400; }
.action-btn.save {   background-color: #1b770d; color: white; }
.action-btn.save:hover { background-color: #146106; }

.status-select { padding: 6px 10px; border-radius: 4px; border: 1px solid #ddd; font-size: 0.9rem; font-family: inherit; color: inherit; }

/* Footer */
.modal-footer { background-color: #ecf0f1; padding: 15px 20px; display: flex; justify-content: flex-end; gap: 10px; border-top: 1px solid #ddd; font-family: inherit; color: inherit; }
.footer-btn { padding: 8px 16px; border: none; border-radius: 4px; cursor: pointer; font-size: 0.9rem; transition: 0.2s; font-family: inherit; }
.footer-btn.save { background-color: #1b770d; color: white; }
.footer-btn.save:hover { background-color: #146106; }
.footer-btn.reset { background-color: #f39c12; color: white; }
.footer-btn.reset:hover { background-color: #d35400; }
.footer-btn.quit { background-color: #e74c3c; color: white; }
.footer-btn.quit:hover { background-color: #c0392b; }

/* Responsive */
@media (max-width: 768px) {
  .modal-container { width: 95%; }
  .modal-header { padding: 12px 15px; }
  .modal-content { padding: 15px; }
  .model-item, .selected-item { flex-direction: column; align-items: flex-start; gap: 10px; }
  .item-actions { align-self: flex-end; }
  .modal-footer { flex-wrap: wrap; justify-content: center; }
  .footer-btn { flex: 1; min-width: 120px; }
}

</style>
