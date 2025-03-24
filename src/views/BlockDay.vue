<template>
  <div class="container mt-5">
    <h1 class="text-center">Bloquear Dia</h1>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <form @submit.prevent="blockDay" class="mt-4">
          <div class="mb-3">
            <label for="dia" class="form-label">Escolha o dia:</label>
            <input type="date" v-model="date" id="dia" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="isBlocked">Bloquear Dia</button>
          <p v-if="message" class="mt-3">{{ message }}</p>
        </form>
        <button @click="goToBlockedDays" class="btn btn-secondary w-100 mt-3">Ver Dias Bloqueados</button>
        <button @click="goToCalendar" class="btn btn-secondary w-100 mt-3">Voltar para o Calendário</button>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      date: '',
      isBlocked: false,
      message: ''
    };
  },
  methods: {
    async blockDay() {
      try {
        // Enviar o pedido para a rota de bloquear dia no backend
        const response = await axios.post('https://api.jkstudios.top/blockday', {
          dia: this.date
        });

        // Exibir mensagem de sucesso ou falha
        this.message = response.data.message;
        if (response.data.blocked) {
          this.isBlocked = true;
        }
      } catch (error) {
        // Tratar erros de requisição
        this.message = 'Erro ao bloquear o dia. Tente novamente mais tarde.';
        console.error(error);
      }
    },
    goToBlockedDays() {
      this.$router.push('/blocked-days');
    },
    goToCalendar() {
      this.$router.push('/calendar');
    }
  }
};
</script>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
}

button:disabled {
  background-color: gray;
}
</style>