<template>
  <transition name="modal-fade">
    <div class="modal-backdrop" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div class="modal">

        <header class="modal-header" id="modal-title">
          Attendez
        </header>

        <section class="modal-body">
          <Spinner :spacing="30" :font-size="20" :line-size="60" message="Veuillez patienter, votre demande sera effectuée" />
        </section>

        <footer class="modal-footer">
          <!-- footer vide, prêt à être utilisé -->
        </footer>

      </div>
    </div>
  </transition>
</template>

<script>
import Spinner from 'vue-simple-spinner'

export default {
  name: 'modal-component',
  components: { Spinner }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 15px;
}

.modal {
  background: #fff;
  border-radius: 12px;
  width: 90%;
  max-width: 700px;
  max-height: 400px;
  box-shadow: 0 10px 40px rgba(0,0,0,0.2);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.modal-header {
  padding: 20px;
  border-bottom: 1px solid #eee;
  color: #d32f2f;
  font-size: 1.8rem;
  font-weight: 700;
  text-align: center;
  text-transform: capitalize;
  user-select: none;
}

.modal-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 25px 30px;
  font-size: 1.125rem;
  color: #333;
  text-align: center;
}

/* Modal footer styling left empty but ready for buttons if needed */
.modal-footer {
  padding: 15px 20px;
  border-top: 1px solid #eee;
  display: flex;
  justify-content: center;
  gap: 15px;
}

/* Fade transition */
.modal-fade-enter-active, .modal-fade-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-enter-from, .modal-fade-leave-to {
  opacity: 0;
}
</style>
