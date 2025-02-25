<template>
  <div class="container text-center mt-5">
    <h1>Home</h1>
    <p>Bem-vindo à página inicial!</p>
    <router-link to="/create">
      <button class="btn btn-primary mt-3">Ir para Agendamento</button>
    </router-link>
  </div>
</template>

<script>
export default {
  name: 'Home'
}
</script>

<style scoped>
/* Adicione estilos aqui */
</style>
