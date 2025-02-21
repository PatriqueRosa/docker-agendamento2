<!-- filepath: /e:/node/vueagedamento/sistema-agendamento/src/views/Home.vue -->
<template>
  <div class="container text-center mt-5">
    <h1>Home</h1>
    <p>Bem-vindo à página inicial!</p>
    <button @click="goToCreate" class="btn btn-secondary mb-3">Ir para agendamento</button>
  </div>
</template>

<script>
export default {
  name: 'Home'
},
  goToCreate() {
    this.$router.push('/create');
  }
</script>

<style scoped>
/* Adicione estilos aqui */
</style>
