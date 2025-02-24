<!-- filepath: /e:/node/vueagedamento/sistema-agendamento/src/views/Create.vue -->
<template>
  <div class="container mt-5">
    <h1 class="text-center">Agendar Serviço</h1>
    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <form @submit.prevent="submitForm" class="mt-4">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome:</label>
            <input type="text" id="nome" v-model="form.nome" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone:</label>
            <input type="tel" id="telefone" v-model="form.telefone" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="title" class="form-label">Serviço:</label>
            <select id="title" v-model="form.title" class="form-select" required>
              <option v-for="servico in servicos" :key="servico.id" :value="servico.nome">{{ servico.nome }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="dia" class="form-label">Dia:</label>
            <input type="date" id="dia" v-model="form.dia" @change="fetchHorariosDisponiveis" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="horario" class="form-label">Horário:</label>
            <select id="horario" v-model="form.horario" class="form-select" required>
              <option v-for="horario in horariosDisponiveis" :key="horario" :value="horario">{{ horario }}</option>
            </select>
          </div>
          <button type="submit" class="btn btn-primary w-100">Agendar</button>
        </form>
        <button @click="goToManageAgendamento" class="btn btn-secondary w-100 mt-3">Gerenciar Agendamento</button>
      </div>
    </div>
    <footer class="footer mt-5">
      <p>Dev Patrique Rosa</p>
    </footer>
  </div>
</template>

<script>
import api from '@/services/api.ts'
import Cookies from 'js-cookie'

export default {
  name: 'Create',
  data() {
    return {
      form: {
        nome: '',
        telefone: '',
        title: '', // Atualize para usar o nome do serviço
        dia: '',
        horario: ''
      },
      servicos: [], // Lista de serviços
      horariosDisponiveis: [] // Lista de horários disponíveis
    }
  },
  mounted() {
    this.fetchServicos();
  },
  methods: {
    async fetchServicos() {
      try {
        const response = await api.get('/servicos');
        this.servicos = response.data;
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    },
    async fetchHorariosDisponiveis() {
      console.log("Data selecionada:", this.form.dia); // Verifique se o formato está correto
      try {
        const response = await api.get(`/horarios?dia=${this.form.dia}`);
        this.horariosDisponiveis = response.data;
      } catch (error) {
        console.error('Erro ao buscar horários disponíveis:', error);
      }
    },
    async submitForm() {
      const existingUUID = Cookies.get('uuid');
      if (existingUUID) {
        const confirmAnother = confirm('Você já tem um agendamento, deseja realizar outro?');
        if (!confirmAnother) {
          return;
        }
        this.form.uuid = existingUUID;
      }
      try {
        const response = await api.post('/agendamentos', this.form);
        if (!existingUUID) {
          Cookies.set('uuid', response.data.uuid, { expires: 1 }); // Salva o UUID como um cookie por 1 dia (24 horas)
        }
        alert(`Agendamento realizado com sucesso! Seu UUID é: ${response.data.uuid}`);
      } catch (error) {
        if (error.response && error.response.status === 400 && error.response.data.message === 'Este dia foi bloqueado pelo admin.') {
          alert('Este dia foi bloqueado pelo admin.');
        } else {
          console.error('Erro ao realizar agendamento:', error);
        }
      }
    },
    goToManageAgendamento() {
      this.$router.push('/manage-agendamento');
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
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
}

.footer {
  height: 3rem; /* Altura de aproximadamente três parágrafos */
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ccc;
  margin-top: 2rem;
}
</style>