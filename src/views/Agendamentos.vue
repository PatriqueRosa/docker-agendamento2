<template>
  <div class="container mt-5">
    <h1 class="text-center">Agendamentos</h1>
    <p class="text-center">Visualize e gerencie seus agendamentos.</p>
    <button @click="excluirAgendamentosRealizados" class="btn btn-danger mb-3">Excluir agendamentos Realizados</button>
    <button @click="goToCalendar" class="btn btn-secondary mb-3">Voltar para o Calendário</button>
    <div v-if="agendamentos.length">
      <div v-for="agendamento in paginatedAgendamentos" :key="agendamento._id" class="card mb-3">
        <div class="card-body">
          <p><strong>Nome:</strong> {{ agendamento.nome }}</p>
          <p><strong>Telefone:</strong> {{ agendamento.telefone }}</p>
          <p><strong>Serviço:</strong> {{ agendamento.title }}</p>
          <p><strong>Data:</strong> {{ agendamento.dia }}</p>
          <p><strong>Horário:</strong> {{ agendamento.horario }}</p>
          <p><strong>Status:</strong> {{ agendamento.status }}</p>
          <button @click="alterarStatus(agendamento._id)" v-if="agendamento.status === 'Agendado'" class="btn btn-success">Marcar como Realizado</button>
        </div>
      </div>
      <nav aria-label="Page navigation">
        <ul class="pagination justify-content-center">
          <li class="page-item" :class="{ disabled: currentPage === 1 }">
            <button class="page-link" @click="changePage(currentPage - 1)">Anterior</button>
          </li>
          <li class="page-item" v-for="page in totalPages" :key="page" :class="{ active: currentPage === page }">
            <button class="page-link" @click="changePage(page)">{{ page }}</button>
          </li>
          <li class="page-item" :class="{ disabled: currentPage === totalPages }">
            <button class="page-link" @click="changePage(currentPage + 1)">Próximo</button>
          </li>
        </ul>
      </nav>
    </div>
    <div v-else>
      <p class="text-center">Nenhum agendamento encontrado.</p>
    </div>
  </div>
</template>

<script>
import api from '@/services/api.ts'

export default {
  name: 'Agendamentos',
  data() {
    return {
      agendamentos: [],
      currentPage: 1,
      itemsPerPage: 10
    }
  },
  computed: {
    totalPages() {
      return Math.ceil(this.agendamentos.length / this.itemsPerPage);
    },
    paginatedAgendamentos() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.agendamentos.slice(start, end);
    }
  },
  mounted() {
    this.fetchAgendamentos();
  },
  methods: {
    async fetchAgendamentos() {
      try {
        const response = await api.get('/agendamentos');
        this.agendamentos = response.data.sort((a, b) => new Date(b.start) - new Date(a.start));
      } catch (error) {
        console.error('Erro ao buscar agendamentos:', error);
      }
    },
    async alterarStatus(id) {
      try {
        await api.put(`/agendamentos/${id}/status`);
        this.fetchAgendamentos(); // Atualiza a lista de agendamentos após alterar o status
      } catch (error) {
        console.error('Erro ao alterar status do agendamento:', error);
      }
    },
    async excluirAgendamentosRealizados() {
      const confirmacao = confirm('Tem certeza que deseja excluir todos os agendamentos realizados?');
      if (confirmacao) {
        try {
          const response = await api.delete('/agendamentos/realizados');
          console.log(response.data.message); // Adicione um log para verificar a resposta do servidor
          this.fetchAgendamentos(); // Atualiza a lista de agendamentos após excluir os realizados
          alert('Todos os agendamentos realizados foram excluídos com sucesso!');
        } catch (error) {
          console.error('Erro ao excluir agendamentos realizados:', error);
        }
      }
    },
    changePage(page) {
      if (page > 0 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    goToCalendar() {
      this.$router.push('/calendar');
    }
  }
}
</script>

<style scoped>
/* Adicione estilos aqui */
</style>