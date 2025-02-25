<template>
  <div :class="['container mt-5', theme]">

    <h1 class="text-center flex items-center justify-center gap-2 relative">
      Agendar Serviço
      <button @click="toggleTheme" class="theme-toggle">
        <span v-if="theme === 'dark'">☀️</span>
        <span v-else>🌙</span>
      </button>
    </h1>

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
        title: '',
        dia: '',
        horario: ''
      },
      servicos: [],
      horariosDisponiveis: [],
      theme: localStorage.getItem('theme') || 'light' // Define o tema salvo ou padrão claro
    }
  },
  mounted() {
    this.fetchServicos();
    document.body.classList.toggle('dark', this.theme === 'dark'); // Aplica o tema ao carregar a página
  },
  methods: {
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      document.body.classList.toggle('dark', this.theme === 'dark');
    },
    async fetchServicos() {
      try {
        const response = await api.get('/servicos');
        this.servicos = response.data;
      } catch (error) {
        console.error('Erro ao buscar serviços:', error);
      }
    },
    async fetchHorariosDisponiveis() {
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
        if (!confirmAnother) return;
        this.form.uuid = existingUUID;
      }
      try {
        const response = await api.post('/agendamentos', this.form);
        if (!existingUUID) {
          Cookies.set('uuid', response.data.uuid, { expires: 1 });
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
/* Estilos padrão */
.container {
  height: 100vh;
  width: 100%;
}
form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid black;
  border-radius: 10px;
  padding: 1rem;
}

.footer {
  height: 3rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-top: 1px solid #ccc;
  margin-top: 2rem;
}

/* Botão de alternância de tema */
.theme-toggle {
  position: static; /* Removendo absolute */
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

/* Tema escuro */
.dark {
  background-color: #121212;
  color: #fff;
}

.dark .form-control, 
.dark .form-select {
  background-color: #1e1e1e;
  color: #fff;
  border: 1px solid #ccc;
}

.dark .btn-primary {
  background-color: hsl(145, 95%, 76%);
  border-color: hsl(153, 28%, 34%);
}

.dark .btn-secondary {
  background-color: #03dac6;
  border-color: #03dac6;
}

.dark .footer {
  border-top: 1px solid #666;
}
</style>
