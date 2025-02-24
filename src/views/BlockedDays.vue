<template>
  <div class="container mt-5">
    <h1 class="text-center">Dias Bloqueados</h1>
    <div v-if="blockedDays.length">
      <ul class="list-group">
        <li v-for="day in blockedDays" :key="day._id" class="list-group-item d-flex justify-content-between align-items-center">
          {{ day.dia }}
          <button @click="deleteBlockedDay(day._id)" class="btn btn-danger btn-sm">Excluir</button>
        </li>
      </ul>
    </div>
    <div v-else>
      <p class="text-center">Nenhum dia bloqueado encontrado.</p>
    </div>
    <button @click="goToCalendar" class="btn btn-secondary mt-3">Voltar para o Calendário</button>
  </div>
</template>

<script>
import api from '@/services/api.ts'

export default {
  name: 'BlockedDays',
  data() {
    return {
      blockedDays: []
    }
  },
  mounted() {
    this.fetchBlockedDays();
  },
  methods: {
    async fetchBlockedDays() {
      try {
        const response = await api.get('/blockdaylist');
        this.blockedDays = response.data;
      } catch (error) {
        console.error('Erro ao obter dias bloqueados:', error);
      }
    },
    async deleteBlockedDay(id) {
      const confirmacao = confirm('Tem certeza que deseja excluir este dia bloqueado?');
      if (confirmacao) {
        try {
          await api.delete(`/blockday/${id}`);
          this.fetchBlockedDays(); // Atualiza a lista de dias bloqueados após a exclusão
          alert('Dia bloqueado excluído com sucesso!');
        } catch (error) {
          console.error('Erro ao excluir dia bloqueado:', error);
        }
      }
    },
    goToCalendar() {
      this.$router.push('/calendar');
    }
  }
}
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: auto;
}

h1 {
  margin-bottom: 20px;
}

.list-group-item {
  font-size: 1.2rem;
}

button {
  display: block;
  width: 100%;
}
</style>