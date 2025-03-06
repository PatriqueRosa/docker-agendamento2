<template>
  <div class="container mt-5">
    <!-- Menu para dispositivos móveis -->
    <div class="mobile-menu" :class="{ 'active': menuOpen }">
      <div class="menu-header">
        <h2>Menu</h2>
        <button @click="toggleMenu" class="close-btn">&times;</button>
      </div>
      <div class="menu-items">
        <button @click="goToAgendamentos" class="menu-btn">Agendamentos</button>
        <button @click="goToBlockDay" class="menu-btn">Bloquear dia</button>
        <button @click="goToCreate" class="menu-btn">Ir para agendamento</button>
      </div>
    </div>
    
    <!-- Ícone de hambúrguer para dispositivos móveis -->
    <button @click="toggleMenu" class="hamburger-btn d-md-none">
      <span></span>
      <span></span>
      <span></span>
    </button>
    
    <!-- Botões para telas maiores -->
    <div class="d-none d-md-flex mb-3 btn-group">
      <button @click="goToAgendamentos" class="btn btn-primary me-2">Agendamentos</button>
      <button @click="goToBlockDay" class="btn btn-warning me-2">Bloquear dia</button>
      <button @click="goToCreate" class="btn btn-success">Ir para agendamento</button>
    </div>
    
    <FullCalendar :options="calendarOptions" />
  </div>
</template>

<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from '@fullcalendar/interaction'
import timeGridPlugin from '@fullcalendar/timegrid'
import ptBrLocale from '@fullcalendar/core/locales/pt-br' 
import api from '@/services/api.ts'
import Agendamentos from './Agendamentos.vue'

export default {
  name: 'Calendar',
  components: {
    FullCalendar
  },
  data() {
    return {
      menuOpen: false,
      calendarOptions: {
        plugins: [ dayGridPlugin, interactionPlugin, timeGridPlugin ],
        initialView: 'timeGridWeek',
        locale: ptBrLocale,
        slotMinTime: "08:00:00", // Hora mínima
        slotMaxTime: "20:00:00", // Hora máxima
        slotDuration: '00:30:00', // Intervalo de 30 minutos
        navLinks: true,
        selectable: true,
        headerToolbar: {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        },
        events: [], 
        dateClick: this.handleDateClick,
        eventClick: this.handleEventClick,
        eventContent: this.renderEventContent,
        // Configurações responsivas
        height: 'auto',
        titleFormat: { 
          year: 'numeric', 
          month: 'short',
          day: 'numeric'
        }
      }
    }
  },
  mounted() {
    this.fetchEvents();
    // Detecta mudanças no tamanho da tela para ajustar o calendário
    window.addEventListener('resize', this.handleResize);
    this.handleResize();
  },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize);
  },
  methods: {
    toggleMenu() {
      this.menuOpen = !this.menuOpen;
    },
    handleResize() {
      // Ajusta a visualização do calendário baseado no tamanho da tela
      if (window.innerWidth < 768) {
        this.calendarOptions.headerToolbar = {
          left: 'prev,next',
          center: 'title',
          right: 'dayGridMonth,timeGridDay'
        };
        if (this.calendarOptions.initialView === 'timeGridWeek') {
          this.$nextTick(() => {
            const calendarApi = this.$refs.calendar?.getApi();
            if (calendarApi) {
              calendarApi.changeView('timeGridDay');
            }
          });
        }
      } else {
        this.calendarOptions.headerToolbar = {
          left: 'prev,next today',
          center: 'title',
          right: 'dayGridMonth,timeGridWeek,timeGridDay'
        };
      }
    },
    async fetchEvents() {
      try {
        const response = await api.get('/agendamentos');
        this.calendarOptions.events = response.data.map(event => ({
          id: event._id,
          title: event.nome,
          start: event.start,
          horario: event.horario,
          servico: event.servico, // Adicione o serviço ao evento
          telefone: event.telefone, // Adicione o telefone ao evento
          backgroundColor: event.status === 'Realizado' ? 'red' : '' // Define a cor de fundo para eventos realizados
        }));
        console.log('Agendamentos carregados:', this.calendarOptions.events); 
      } catch (error) {
        console.error('Erro ao buscar agendamentos: ', error);
      }
    },
    handleEventClick(info) {
      console.log('event click! ' + info.event.title);
      console.log('event id: ' + info.event.id);
      console.log('event start: ' + info.event.start);
    },
    renderEventContent(arg) {
      const viewType = arg.view.type;
      if (viewType === 'dayGridMonth') {
        return {
          html: `<b>${arg.event.extendedProps.horario}</b>: ${arg.event.title}`
        }
      } else if (viewType === 'timeGridWeek' || viewType === 'timeGridDay') {
        return {
          html: `<b>${arg.event.title}</b><br/>Tel: ${arg.event.extendedProps.telefone}`
        }
      }
      return {
        html: `<b>${arg.event.title}</b>`
      }
    },
    goToAgendamentos() {
      this.menuOpen = false;
      this.$router.push('/agendamentos');
    },
    goToBlockDay() {
      this.menuOpen = false;
      this.$router.push('/block-day');
    },
    goToCreate() {
      this.menuOpen = false;
      this.$router.push('/create');
    }
  }
}
</script>

<style scoped>
/* Estilos gerais */
.container {
  position: relative;
  padding-top: 60px;
}

/* Estilos do menu móvel */
.mobile-menu {
  position: fixed;
  top: 0;
  left: -100%;
  width: 80%;
  max-width: 300px;
  height: 100vh;
  background-color: #fff;
  z-index: 1000;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
  transition: left 0.3s ease;
  display: flex;
  flex-direction: column;
}

.mobile-menu.active {
  left: 0;
}

.menu-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px;
  border-bottom: 1px solid #eee;
}

.menu-header h2 {
  margin: 0;
  font-size: 20px;
}

.close-btn {
  background: none;
  border: none;
  font-size: 24px;
  cursor: pointer;
}

.menu-items {
  display: flex;
  flex-direction: column;
  padding: 15px;
}

.menu-btn {
  background: none;
  border: none;
  text-align: left;
  padding: 12px 15px;
  margin-bottom: 8px;
  border-radius: 5px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.2s;
}

.menu-btn:hover {
  background-color: #f5f5f5;
}

/* Botão de hambúrguer */
.hamburger-btn {
  position: fixed;
  top: 15px;
  left: 15px;
  z-index: 999;
  background: none;
  border: none;
  cursor: pointer;
  width: 40px;
  height: 40px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  padding: 10px;
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 2px 5px rgba(0,0,0,0.2);
}

.hamburger-btn span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: #333;
  border-radius: 2px;
}

/* Ajustes para o FullCalendar */
:deep(.fc-toolbar-title) {
  font-size: 1.2rem !important;
  margin: 0 !important;
  text-align: center;
}

:deep(.fc-header-toolbar) {
  flex-wrap: wrap;
  justify-content: center;
  gap: 10px;
  margin-bottom: 1rem !important;
}

:deep(.fc-button) {
  padding: 6px 10px !important;
  font-size: 14px !important;
}

@media (max-width: 767px) {
  :deep(.fc-toolbar-title) {
    font-size: 1rem !important;
  }
  
  :deep(.fc-header-toolbar) {
    padding: 0 5px;
  }
  
  :deep(.fc-button) {
    padding: 4px 8px !important;
    font-size: 12px !important;
  }
}

/* Tema escuro (se estiver usando) */
:global(html.dark-theme) .mobile-menu {
  background-color: #1e1e1e;
  border-color: #444;
}

:global(html.dark-theme) .menu-header {
  border-bottom-color: #444;
}

:global(html.dark-theme) .menu-btn:hover {
  background-color: #2a2a2a;
}

:global(html.dark-theme) .hamburger-btn {
  background-color: #1e1e1e;
}

:global(html.dark-theme) .hamburger-btn span {
  background-color: #fff;
}

.fc-media-screen{
  background-color: #fff;
  border: 1px solid black;;
  border-radius: 10px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

</style>