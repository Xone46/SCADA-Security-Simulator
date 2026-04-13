<template>
  <div class="visualisation">
    <div class="sites">
      <h1 v-if="commentaires.length === 0">Il n'y a pas de commentaires</h1>

      <table class="table-data" v-if="commentaires.length !== 0">
        <thead>
          <tr>
            <th colspan="4" class="table-title">VISUALISATION DES RÉSERVES CONSTATÉES</th>
          </tr>
          <tr>
            <th class="col-small">N° Obs</th>
            <th class="col-large">Observation</th>
            <th class="col-small">Status</th>
            <th class="col-small">Action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in commentaires" :key="index">
            <td class="col-small">O{{ index + 1 }}</td>
            <td class="col-large">{{ item.name }}</td>
            <td class="col-small">
              <span :class="item.status === 'critique' ? 'critique' : 'non_critique'">
                {{ item.status }}
              </span>
            </td>
            <td class="col-small">
              <button class="delete-btn" @click="supprimer(item.titre, item.ref, item.name, index)">
                <font-awesome-icon icon="trash" /> 
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="buttons">
        <button class="quit-btn" @click="quitter">
          <font-awesome-icon icon="xmark" /> Fermer
        </button>
      </div>
    </div>

    <Verified v-if="flagVerified" @confirmer="confirmer" @retirer="retirer" />
  </div>
</template>

<script>
import Commentaires from '@/requests/commentaire'
import Verified from '@/components/models/Verified.vue'

export default {
  name: 'reserve-component',
  data() {
    return {
      titre: null,
      ref: null,
      name: null,
      indexCommentaire: null,
      flagVerified: false,
      commentaires: []
    }
  },
  props: { observateurId: String },
  components: { Verified },
  methods: {
    quitter() { this.$emit('quitter') },
    supprimer(titre, ref, name, index) {
      this.titre = titre
      this.ref = ref
      this.name = name
      this.indexCommentaire = index
      this.flagVerified = true
    },
    confirmer() {
      Commentaires.supprimer(this.titre, this.ref, this.name, this.observateurId)
        .then(result => {
          if (result) {
            this.commentaires.splice(this.indexCommentaire, 1)
            this.resetSelection()
          }
        })
        .catch(error => console.error(error))
    },
    retirer() { this.resetSelection() },
    resetSelection() {
      this.titre = null
      this.ref = null
      this.name = null
      this.indexCommentaire = null
      this.flagVerified = false
    }
  },
  created() {
    Commentaires.readCommentaires(this.observateurId)
      .then(result => {
        result.data.forEach(item => {
          item.modelSelected.forEach(model => {
            this.commentaires.push({
              titre: item.titre,
              ref: item.ref,
              name: model.name,
              status: model.status
            })
          })
        })
      })
      .catch(error => console.error(error))
  }
}
</script>

<style scoped>
.visualisation {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.35);
  backdrop-filter: blur(2px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 1rem;
  font-family: "Segoe UI", Arial, sans-serif;
}

.sites {
  height: 60vh;
  width: 90%;
  max-width: 800px;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 8px 25px rgba(0,0,0,0.25);
  padding: 0.8rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 0.8rem;
}

.sites h1 {
  text-align: left;
  font-size: 1.15rem;
  color: #2c3e50;
  font-weight: 500;
  margin: 0.5rem 0;
}

/* ======================
   TABLE STRUCTURE
   ====================== */
.table-data {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.table-data thead {
  display: table-header-group;
}

.table-data tbody {
  display: block;
  max-height: calc(4 * 36px); /* scroll si plus de 4 lignes */
  overflow-y: auto;
  overflow-x: hidden;
}

.table-data tr {
  display: table;
  width: 100%;
  table-layout: fixed;
}

.table-data th, .table-data td {
  padding: 6px 8px;
  border: 1px solid #ddd;
  text-align: left; /* align left */
  vertical-align: middle;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.table-data th {
  background: #f5f5f5;
  font-weight: 600;
  position: sticky;
  top: 0;
  z-index: 5;
}

/* Largeurs colonnes */
.col-small { width: 80px; }
.col-large { width: auto; }

.table-title {
  font-size: 18px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  background: rgba(0, 0, 0, 0.61) !important; /* fond semi-transparent */
  color: #ffffff !important; /* texte blanc bold */
  padding: 12px 0;
  text-align: center; /* centrage horizontal */
  border-radius: 4px;
}
.table-data tbody tr:hover { background: #f0f4f8; }

.critique { color: #e74c3c; font-weight: 600; }
.non_critique { color: #27ae60; font-weight: 600; }

.buttons {
  display: flex;
  justify-content: flex-end;
  margin-top: 0.8rem;
  gap: 0.5rem;
}

.quit-btn {
  background-color: red;
  color: #fff;
  padding: 6px 14px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
}

.quit-btn:hover { background-color: #c0392b; }

.delete-btn {
  background-color: #e74c3c;
  color: #fff;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
}

.delete-btn:hover { background-color: #c0392b; }

@media (max-width: 768px) {
  .sites { width: 100%; padding: 0.6rem; }
  .table-data { font-size: 12px; }
  .table-data tbody { max-height: 4 * 36px; }
  .buttons button { font-size: 12px; padding: 5px 12px; }
}

table thead tr th {
  text-align: center;
}

.table-data thead tr:first-child th {
  display: flex;
  justify-content: center; /* centrage horizontal */
  align-items: center;     /* centrage vertical */
}

</style>
