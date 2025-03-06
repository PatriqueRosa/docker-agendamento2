<template>
  <div class="container mt-5">

    <img 
      :src="theme === 'dark' ? logoDark : logoLight" 
      alt="Logo" 
      class="logo-img" 
      @click="toggleTheme"
      :title="theme === 'dark' ? 'Clique para mudar para tema claro' : 'Clique para mudar para tema escuro'"
      style="cursor: pointer;"
    />

    <div class="row justify-content-center">
      <div class="col-md-8 col-lg-6">
        <form @submit.prevent="submitForm" class="mt-4">
          <div class="mb-3">
            <label for="nome" class="form-label">Nome:</label>
            <input type="text" id="nome" v-model="form.nome" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="telefone" class="form-label">Telefone:</label>
            <input
              type="tel"
              id="telefone"
              v-model="form.telefone"
              @input="formatPhone"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label for="title" class="form-label">Serviço:</label>
            <select id="title" v-model="form.title" class="form-select" required>
              <option v-for="servico in servicos" :key="servico.id" :value="servico.nome">{{ servico.nome }}</option>
            </select>
          </div>
          <div class="mb-3">
            <label for="dia" class="form-label">Dia:</label>
            <input type="date" id="dia" v-model="form.dia" @change="fetchHorariosDisponiveis" class="form-control" :min="minDate" required />
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
        <a :href="whatsappLink" target="_blank" class="btn btn-success w-100 mt-3">
          Falar no WhatsApp
        </a>
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
import logoDark from '../../public/logoFundoPreto.png'
import logoLight from '../../public/logoFio.jpeg'

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
      theme: localStorage.getItem('theme') || 'light',
      minDate: new Date().toISOString().split('T')[0],
      logoDark, 
      logoLight
    }
  },
  mounted() {
    this.fetchServicos();
    this.applyTheme();
  },
  computed: {
    whatsappLink() {
      const phoneNumber = '+551599684-3267';
      const message = 'Olá, gostaria de mais informações sobre o agendamento.';
      const encodedMessage = encodeURIComponent(message);
      return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    }
  },
  methods: {
    applyTheme() {
      if (this.theme === 'dark') {
        document.documentElement.classList.add('dark-theme');
      } else {
        document.documentElement.classList.remove('dark-theme');
      }
    },
    toggleTheme() {
      this.theme = this.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', this.theme);
      this.applyTheme();
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
      // Se não tiver data selecionada, não faz nada
      if (!this.form.dia) return;

      // Verifica se a data selecionada é anterior à data atual
      const hoje = new Date().toISOString().split('T')[0];
      if (this.form.dia < hoje) {
        alert('Não é possível agendar em dias anteriores à data atual.');
        this.form.dia = hoje; // Reset para a data atual
        this.horariosDisponiveis = [];
        return;
      }

      try {
        const response = await api.get(`/horarios?dia=${this.form.dia}`);
        this.horariosDisponiveis = response.data;

        // Se não houver horários disponíveis, informa o usuário
        if (this.horariosDisponiveis.length === 0) {
          alert('Não há horários disponíveis para esta data.');
        }
      } catch (error) {
        if (error.response && error.response.status === 400) {
          alert(error.response.data.message || 'Data inválida para agendamento.');
          this.form.dia = hoje; // Reset para a data atual
        } else if (error.response && error.response.status === 403) {
          alert('Este dia não está disponível para agendamentos.');
        } else {
          console.error('Erro ao buscar horários disponíveis:', error);
          alert('Ocorreu um erro ao buscar horários disponíveis.');
        }
        this.horariosDisponiveis = [];
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
        alert(`Agendamento realizado com sucesso!`);
        window.location.reload();
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
    },
    formatPhone() {
      let phone = this.form.telefone;
        // Verifica se o número já começa com +5515
        if (!phone.startsWith('+5515')) {
            // Se não começar, adiciona +5515 no início
            this.form.telefone = '+5515' + phone;
        }
      
    }
  }
}
</script>

<style>
/* Estilos globais que afetam toda a aplicação */
html.dark-theme {
  background-color: #121212;
  color: #fff;
  min-height: 100%;
}

html.dark-theme body {
  background-color: #121212;
  color: #fff;
  min-height: 100vh;
}

html, body {
  margin: 0;
  padding: 0;
  min-height: 100vh;
}
</style>

<style scoped>
/* Estilos específicos do componente */
.container {
  min-height: 100vh;
  width: 100%;
  padding: 0 1rem;
}

form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border: 1px solid #ccc;
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
  font-size: 24px;
  background: none;
  border: none;
  cursor: pointer;
}

/* Imagem do logo */
.logo-img {
  display: block;
  max-width: 100%;
  height: auto;
  margin: 0 auto;
  text-align: center;
  padding: 1rem 0;
}

/* Limites de tamanho para evitar que a imagem fique muito grande em telas maiores */
@media (min-width: 768px) {
  .logo-img {
    max-width: 70%;
  }
}

@media (min-width: 992px) {
  .logo-img {
    max-width: 50%;
  }
}



/* Estilos específicos para o tema escuro */
:global(html.dark-theme) .form-control,
:global(html.dark-theme) .form-select {
  background-color: #1e1e1e;
  color: #fff;
  border: 1px solid #666;
}

:global(html.dark-theme) .btn-primary {
  background-color: hsl(145, 63%, 42%);
  border-color: hsl(153, 28%, 34%);
}

:global(html.dark-theme) .btn-secondary {
  background-color: #121212;
  border-color: #1a7a7a;
}

:global(html.dark-theme) form {
  border-color: #666;
}

:global(html.dark-theme) .footer {
  border-top: 1px solid #666;
}
</style>
