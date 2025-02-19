<!-- filepath: /e:/node/vueagedamento/sistema-agendamento/src/views/Login.vue -->
<template>
  <div class="container mt-5">
    <h1 class="text-center">Login</h1>
    <div class="row justify-content-center">
      <div class="col-md-6">
        <form @submit.prevent="login">
          <div class="mb-3">
            <label for="email" class="form-label">Email:</label>
            <input type="email" id="email" v-model="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label for="password" class="form-label">Senha:</label>
            <input type="password" id="password" v-model="password" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-primary w-100">Login</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/services/api.ts'

export default {
  name: 'Login',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    async login() {
      try {
        const response = await api.post('/login', { email: this.email, password: this.password });
        localStorage.setItem('token', response.data.token);
        this.$router.push('/calendar');
      } catch (error) {
        console.error('Erro ao fazer login:', error);
        alert('Erro ao fazer login. Verifique suas credenciais.');
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