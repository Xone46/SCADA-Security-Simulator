<template>
    <div class="verified">
        <div class="parent">
            <Spinner />
        </div>

    </div>
</template>
  
<script>

import Spinner from 'vue-simple-spinner'

export default {
    name: 'verified-component',
    data() {
        return {

        }
    },

    components : {
        Spinner
    },

    methods: {

    },


}
</script>


<style scoped>

.verified {
    width: 100%;
    height: 100%;
    position: fixed;
    z-index: 999;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.3);
    display: flex;
    justify-content: center;
    align-items: center;
}

.parent {
    width: auto;
    margin: 0;
    padding: 10px;
    height: auto;
    background-color: white;
    display: flex;
    flex-direction: column;
    border-radius: 5px;
}

</style>