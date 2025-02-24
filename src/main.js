import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css' // Importar o CSS do Bootstrap
import 'bootstrap/dist/js/bootstrap.bundle.min.js' // Importar o JS do Bootstrap

createApp(App).use(router).mount('#app')