<template>
  <div class="designer-page">
    <div class="topbar">
      <div class="top-left">
        <button class="btn" @click="$router.back()">← Retour</button>
        <div>
          <h2>{{ plan.name || "Designer industriel" }}</h2>
          <p>{{ plan.department || "Architecture OT / SCADA" }}</p>
        </div>
      </div>

      <div class="top-actions">
        <button class="btn" @click="zoomOut">−</button>
        <span class="zoom-label">{{ Math.round(zoom * 100) }}%</span>
        <button class="btn" @click="zoomIn">+</button>
        <button class="btn" @click="resetZoom">Reset</button>

        <select v-if="isAdmin" v-model="selectedEdgeType" class="edge-select">
          <option v-for="type in edgeTypes" :key="type.value" :value="type.value">
            {{ type.label }}
          </option>
        </select>

        <button v-if="isAdmin" class="btn" @click="showTextForm = true">
          + Texte
        </button>

        <button
          v-if="isAdmin"
          class="btn connect"
          :class="{ active: connectMode }"
          @click="toggleConnectMode"
        >
          🔗 {{ connectMode ? "Connexion ON" : "Connecter" }}
        </button>
      </div>
    </div>

    <div class="workspace">
      <aside v-if="isAdmin" class="palette">
        <h3>Équipements</h3>

        <button
          v-for="item in palette"
          :key="item.type"
          class="palette-item"
          @click="openNodeForm(item.type)"
        >
          <img :src="getIcon(item.type)" />
          <span>{{ item.label }}</span>
        </button>
      </aside>

      <main class="canvas" @mousemove="dragMove" @mouseup="dragEnd">
        <div class="canvas-content" :style="{ transform: canvasTransform }">
          <svg class="edges">
            <defs>
              <marker
                id="arrow"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
                markerUnits="strokeWidth"
              >
                <path d="M0,0 L0,6 L9,3 z" fill="#17324d" />
              </marker>
            </defs>

            <g v-for="edge in renderedEdges" :key="edge.id">
              <line
                :x1="edge.x1"
                :y1="edge.y1"
                :x2="edge.x2"
                :y2="edge.y2"
                class="edge-line"
                :stroke="edge.color"
                marker-end="url(#arrow)"
              />

              <text
                :x="(edge.x1 + edge.x2) / 2"
                :y="(edge.y1 + edge.y2) / 2 - 8"
                class="edge-label"
                :fill="edge.color"
              >
                {{ edge.label || edge.protocol || "Ethernet" }}
              </text>
            </g>
          </svg>

          <div
            v-for="node in nodes"
            :key="node.id"
            :class="node.type === 'text' ? 'text-node' : 'node'"
            :style="{
              left: node.x_position + 'px',
              top: node.y_position + 'px',
              color: node.type === 'text' ? node.description : ''
            }"
            @mousedown="dragStart(node, $event)"
            @click.stop="nodeClick(node)"
          >
            <template v-if="node.type === 'text'">
              {{ node.name }}
            </template>

            <template v-else>
              <img class="node-img" :src="getIcon(node.type)" />
              <strong>{{ node.name }}</strong>
              <small>{{ node.ip_address || formatType(node.type) }}</small>
            </template>

            <button
              v-if="isAdmin"
              class="delete-node"
              @click.stop="deleteNode(node.id)"
            >
              ×
            </button>
          </div>
        </div>
      </main>
    </div>

    <div v-if="showNodeForm" class="modal">
      <div class="box">
        <h3>Ajouter équipement</h3>

        <input v-model="nodeForm.name" placeholder="Nom équipement *" />
        <input v-model="nodeForm.ip_address" placeholder="Adresse IP" />

        <select v-model="nodeForm.status">
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="maintenance">Maintenance</option>
          <option value="critical">Critique</option>
        </select>

        <select v-model="nodeForm.criticality">
          <option value="low">Faible</option>
          <option value="medium">Moyenne</option>
          <option value="high">Élevée</option>
          <option value="critical">Critique</option>
        </select>

        <textarea v-model="nodeForm.description" placeholder="Description"></textarea>

        <div class="modal-actions">
          <button class="btn-cancel" @click="showNodeForm = false">Annuler</button>
          <button class="btn-save" @click="saveNode">Créer</button>
        </div>
      </div>
    </div>

    <div v-if="showTextForm" class="modal">
      <div class="box">
        <h3>Ajouter texte</h3>

        <input v-model="textForm.text" placeholder="Texte" />
        <input v-model="textForm.color" type="color" />

        <div class="modal-actions">
          <button class="btn-cancel" @click="showTextForm = false">Annuler</button>
          <button class="btn-save" @click="saveText">Ajouter</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ArchitectureService from "@/requests/architecture";

export default {
  name: "ArchitectureDesignerView",

  data() {
    return {
      plan: {},
      nodes: [],
      edges: [],

      zoom: 1,
      panX: 0,
      panY: 0,

      showNodeForm: false,
      showTextForm: false,
      connectMode: false,
      firstNode: null,

      draggingNode: null,
      offsetX: 0,
      offsetY: 0,

      selectedEdgeType: "ethernet",

      edgeTypes: [
        { value: "ethernet", label: "Ethernet", color: "#17324d" },
        { value: "modbus", label: "Modbus TCP", color: "#f59e0b" },
        { value: "opcua", label: "OPC-UA", color: "#2563eb" },
        { value: "profinet", label: "PROFINET", color: "#16a34a" },
        { value: "s7comm", label: "S7Comm", color: "#7c3aed" },
        { value: "alarm", label: "Alerte", color: "#dc2626" },
        { value: "data", label: "Flux données", color: "#0891b2" }
      ],

      palette: [
        { type: "scada", label: "SCADA Server" },
        { type: "hmi", label: "HMI" },
        { type: "historian", label: "Historian" },
        { type: "detector", label: "Detection Engine" },
        { type: "firewall", label: "Firewall OT" },
        { type: "switch", label: "Switch OT" },
        { type: "plc", label: "PLC" },
        { type: "machine", label: "Machine" },
        { type: "sensor", label: "Capteur" },
        { type: "motor", label: "Moteur" },
        { type: "pump", label: "Pompe" },
        { type: "valve", label: "Vanne" },
        { type: "conveyor", label: "Convoyeur" }
      ],

      nodeForm: {
        plan_id: "",
        name: "",
        type: "",
        x_position: 140,
        y_position: 140,
        ip_address: "",
        status: "active",
        criticality: "medium",
        description: ""
      },

      textForm: {
        text: "",
        color: "#17324d",
        x_position: 200,
        y_position: 200
      }
    };
  },

  computed: {
    isAdmin() {
      return (sessionStorage.getItem("role") || "user").toLowerCase() === "admin";
    },

    canvasTransform() {
      return `translate(${this.panX}px, ${this.panY}px) scale(${this.zoom})`;
    },

    renderedEdges() {
      return this.edges
        .map(edge => {
          const source = this.nodes.find(
            n => Number(n.id) === Number(edge.source_node_id)
          );
          const target = this.nodes.find(
            n => Number(n.id) === Number(edge.target_node_id)
          );

          if (!source || !target) return null;

          const edgeType = this.edgeTypes.find(t => t.value === edge.protocol);

          return {
            id: edge.id,
            label: edge.label,
            protocol: edge.protocol,
            color: edgeType ? edgeType.color : "#17324d",
            x1: Number(source.x_position) + 70,
            y1: Number(source.y_position) + 55,
            x2: Number(target.x_position) + 70,
            y2: Number(target.y_position) + 55
          };
        })
        .filter(Boolean);
    }
  },

  methods: {
    async loadAll() {
      const planId = this.$route.params.id;

      const planRes = await ArchitectureService.getPlan(planId);
      this.plan = planRes.data.data || {};

      const nodesRes = await ArchitectureService.getNodes(planId);
      this.nodes = nodesRes.data.data || [];

      const edgesRes = await ArchitectureService.getEdges(planId);
      this.edges = edgesRes.data.data || [];
    },

    openNodeForm(type) {
      this.nodeForm = {
        plan_id: this.$route.params.id,
        name: this.formatType(type),
        type,
        x_position: 140,
        y_position: 140,
        ip_address: "",
        status: "active",
        criticality: "medium",
        description: ""
      };

      this.showNodeForm = true;
    },

    async saveNode() {
      if (!this.nodeForm.name) {
        alert("Nom équipement obligatoire");
        return;
      }

      await ArchitectureService.createNode(this.nodeForm);
      this.showNodeForm = false;
      await this.loadAll();
    },

    async saveText() {
      if (!this.textForm.text) {
        alert("Texte obligatoire");
        return;
      }

      await ArchitectureService.createNode({
        plan_id: this.$route.params.id,
        name: this.textForm.text,
        type: "text",
        x_position: this.textForm.x_position,
        y_position: this.textForm.y_position,
        ip_address: "",
        status: "active",
        criticality: "low",
        description: this.textForm.color
      });

      this.showTextForm = false;
      this.textForm = {
        text: "",
        color: "#17324d",
        x_position: 200,
        y_position: 200
      };

      await this.loadAll();
    },

    dragStart(node, event) {
      if (!this.isAdmin || this.connectMode) return;

      this.draggingNode = node;
      this.offsetX = event.offsetX;
      this.offsetY = event.offsetY;
    },

    dragMove(event) {
      if (!this.draggingNode) return;

      const rect = event.currentTarget.getBoundingClientRect();

      this.draggingNode.x_position = Math.max(
        0,
        (event.clientX - rect.left - this.panX) / this.zoom - this.offsetX
      );

      this.draggingNode.y_position = Math.max(
        0,
        (event.clientY - rect.top - this.panY) / this.zoom - this.offsetY
      );
    },

    async dragEnd() {
      if (!this.draggingNode) return;

      await ArchitectureService.moveNode(
        this.draggingNode.id,
        this.draggingNode.x_position,
        this.draggingNode.y_position
      );

      this.draggingNode = null;
    },

    toggleConnectMode() {
      this.connectMode = !this.connectMode;
      this.firstNode = null;
    },

    async nodeClick(node) {
      if (node.type === "text") return;
      if (!this.isAdmin || !this.connectMode) return;

      if (!this.firstNode) {
        this.firstNode = node;
        return;
      }

      if (Number(this.firstNode.id) === Number(node.id)) return;

      const selectedType = this.edgeTypes.find(
        e => e.value === this.selectedEdgeType
      );

      await ArchitectureService.createEdge({
        plan_id: this.$route.params.id,
        source_node_id: this.firstNode.id,
        target_node_id: node.id,
        label: selectedType ? selectedType.label : "Ethernet",
        protocol: selectedType ? selectedType.value : "ethernet",
        status: "active"
      });

      this.firstNode = null;
      this.connectMode = false;
      await this.loadAll();
    },

    async deleteNode(id) {
      if (!confirm("Supprimer cet élément ?")) return;
      await ArchitectureService.deleteNode(id);
      await this.loadAll();
    },

    zoomIn() {
      this.zoom = Math.min(this.zoom + 0.1, 2);
    },

    zoomOut() {
      this.zoom = Math.max(this.zoom - 0.1, 0.5);
    },

    resetZoom() {
      this.zoom = 1;
      this.panX = 0;
      this.panY = 0;
    },

    getIcon(type) {
      const icons = {
        scada: require("@/assets/icons/scada.svg"),
        hmi: require("@/assets/icons/hmi.svg"),
        historian: require("@/assets/icons/historian.svg"),
        detector: require("@/assets/icons/detector.svg"),
        firewall: require("@/assets/icons/firewall.svg"),
        switch: require("@/assets/icons/switch.svg"),
        plc: require("@/assets/icons/plc.svg"),
        machine: require("@/assets/icons/machine.svg"),
        sensor: require("@/assets/icons/sensor.svg"),
        motor: require("@/assets/icons/motor.svg"),
        pump: require("@/assets/icons/pump.svg"),
        valve: require("@/assets/icons/valve.svg"),
        conveyor: require("@/assets/icons/conveyor.svg")
      };

      return icons[type] || icons.machine;
    },

    formatType(type) {
      const labels = {
        scada: "SCADA Server",
        hmi: "HMI",
        historian: "Historian",
        detector: "Detection Engine",
        firewall: "Firewall OT",
        switch: "Switch OT",
        plc: "PLC",
        machine: "Machine",
        sensor: "Capteur",
        motor: "Moteur",
        pump: "Pompe",
        valve: "Vanne",
        conveyor: "Convoyeur"
      };

      return labels[type] || type;
    }
  },

  mounted() {
    this.loadAll();
  }
};
</script>

<style scoped>
.designer-page {
  height: 100vh;
  background: #eef4f8;
  display: flex;
  flex-direction: column;
}

.topbar {
  min-height: 72px;
  background: white;
  padding: 12px 18px;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  box-shadow: 0 8px 18px rgba(0, 0, 0, 0.06);
  z-index: 10;
}

.top-left {
  display: flex;
  align-items: center;
  gap: 14px;
}

.top-left h2 {
  margin: 0;
  color: #17324d;
  font-size: 20px;
}

.top-left p {
  margin: 3px 0 0;
  color: #5d6f82;
  font-size: 13px;
}

.top-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.btn,
.edge-select {
  border: none;
  background: #17324d;
  color: white;
  border-radius: 10px;
  padding: 9px 12px;
  cursor: pointer;
  font-size: 13px;
}

.edge-select {
  outline: none;
}

.connect.active {
  background: #e74c3c;
}

.zoom-label {
  font-size: 13px;
  color: #17324d;
  font-weight: 700;
}

.workspace {
  flex: 1;
  display: flex;
  overflow: hidden;
}

.palette {
  width: 220px;
  min-width: 220px;
  background: white;
  padding: 16px;
  overflow-y: auto;
}

.palette h3 {
  margin: 0 0 12px;
  color: #17324d;
}

.palette-item {
  width: 100%;
  display: flex;
  align-items: center;
  gap: 10px;
  border: none;
  background: transparent;
  border-radius: 10px;
  padding: 9px 6px;
  cursor: pointer;
  color: #17324d;
  font-weight: 600;
}

.palette-item:hover {
  background: #eef4f8;
}

.palette-item img {
  width: 30px;
  height: 30px;
}

.canvas {
  flex: 1;
  position: relative;
  overflow: hidden;
  background-image:
    linear-gradient(#d9e2ec 1px, transparent 1px),
    linear-gradient(90deg, #d9e2ec 1px, transparent 1px);
  background-size: 25px 25px;
}

.canvas-content {
  position: absolute;
  inset: 0;
  transform-origin: 0 0;
}

.edges {
  position: absolute;
  width: 4000px;
  height: 3000px;
  pointer-events: none;
}

.edge-line {
  stroke-width: 3;
}

.edge-label {
  font-size: 13px;
  font-weight: 700;
  pointer-events: none;
}

.node {
  position: absolute;
  width: 145px;
  min-height: 105px;
  background: white;
  border: 2px solid #17324d;
  border-radius: 16px;
  padding: 10px;
  cursor: move;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
  text-align: center;
  user-select: none;
}

.text-node {
  position: absolute;
  min-width: 80px;
  min-height: 30px;
  background: transparent;
  border: none;
  padding: 4px;
  cursor: move;
  font-weight: 700;
  font-size: 16px;
  user-select: none;
}

.node-img {
  width: 42px;
  height: 42px;
  margin-bottom: 5px;
}

.node strong {
  display: block;
  color: #17324d;
  font-size: 14px;
}

.node small {
  color: #5d6f82;
  font-size: 12px;
}

.delete-node {
  position: absolute;
  right: -8px;
  top: -8px;
  border: none;
  background: #e74c3c;
  color: white;
  border-radius: 50%;
  cursor: pointer;
  width: 22px;
  height: 22px;
}

.modal {
  position: fixed;
  inset: 0;
  background: rgba(15, 34, 53, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
  padding: 20px;
}

.box {
  width: 380px;
  background: white;
  border-radius: 18px;
  padding: 20px;
}

.box h3 {
  margin: 0 0 14px;
  color: #17324d;
}

.box input,
.box textarea,
.box select {
  width: 100%;
  margin-bottom: 10px;
  border: 1px solid #d6dde5;
  border-radius: 10px;
  padding: 10px;
  outline: none;
}

.box textarea {
  min-height: 80px;
  resize: vertical;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.btn-save,
.btn-cancel {
  border: none;
  border-radius: 10px;
  padding: 10px 14px;
  color: white;
  cursor: pointer;
}

.btn-save {
  background: #17324d;
}

.btn-cancel {
  background: #6b7280;
}
</style>