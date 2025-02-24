<!-- filepath: /e:/node/vueagedamento/sistema-agendamento/src/views/ManageAgendamento.vue -->
<template>
  <div class="container mt-5">
    <h1 class="text-center">Gerenciar Agendamento</h1>
    <div v-if="agendamentos.length" class="mt-4">
      <h2>Detalhes dos Agendamentos</h2>
      <div v-for="agendamento in agendamentos" :key="agendamento._id" class="card mb-3">
        <div class="card-body">
          <p><strong>Nome:</strong> {{ agendamento.nome }}</p>
          <p><strong>Telefone:</strong> {{ agendamento.telefone }}</p>
          <p><strong>Serviço:</strong> {{ agendamento.title }}</p>
          <p><strong>Data:</strong> {{ agendamento.dia }}</p>
          <p><strong>Horário:</strong> {{ agendamento.horario }}</p>
          <button @click="deleteAgendamento(agendamento._id)" class="btn btn-danger">Apagar Agendamento</button>
        </div>
      </div>
    </div>
    <div v-else>
      <p>Você ainda não fez um agendamento.</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api.ts'
import Cookies from 'js-cookie'

export default {
  name: 'ManageAgendamento',
  data() {
    return {
      uuid: '',
      agendamentos: []
    }
  },
  mounted() {
    this.checkForUUID();
  },
  methods: {
    async checkForUUID() {
      this.uuid = Cookies.get('uuid');
      if (this.uuid) {
        await this.fetchAgendamentos();
      }
    },
    async fetchAgendamentos() {
      try {
        const response = await api.get('/agendamentos');
        this.agendamentos = response.data.filter(agendamento => agendamento.uuid === this.uuid);
        if (!this.agendamentos.length) {
          alert('Agendamento não encontrado');
        }
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    },
    async deleteAgendamento(id) {
      try {
        await api.delete(`/agendamentos/${id}`);
        alert('Agendamento excluído com sucesso!');
        this.agendamentos = this.agendamentos.filter(agendamento => agendamento._id !== id);
        if (!this.agendamentos.length) {
          Cookies.remove('uuid'); // Remove o cookie se não houver mais agendamentos
        }
      } catch (error) {
        console.error('Erro ao excluir agendamento:', error);
      }
    }
  }
}
</script>

<style scoped>
/* Adicione estilos aqui */
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>