<template>
    <div class="invertesment">
        {{ msgInvertesment }}
    </div>
</template>
  
<script>


export default {
    name: 'invertesment-component',
    data() {
        return {
        }
    },

    props: {
        msgInvertesment : String
    },

    methods: {

    },


}
</script>


<style scoped>

.invertesment {
    width: 60%;
    padding: 10px;
    background-color: rgba(255, 0, 0, 0.377);
    border : 3px solid red;
    color: white;
}
  
</style>