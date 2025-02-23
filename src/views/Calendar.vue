<!-- filepath: /e:/node/vueagedamento/sistema-agendamento/src/views/Calendar.vue -->
<template>
  <div class="container mt-5">
    <button @click="goToAgendamentos" class="btn btn-primary mb-3">Agendamentos</button>
    <button @click="goToBlockDay" class="btn btn-warning mb-3">Bloquear dia</button>
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
        eventContent: this.renderEventContent // Adicione esta linha para personalizar o conteúdo do evento
      }
    }
  },
  mounted() {
    this.fetchEvents();
  },
  methods: {
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
      this.$router.push('/agendamentos');
    },
    goToBlockDay() {
      this.$router.push('/block-day');
    }
  }
}
</script>

<style scoped>
/* Adicione estilos aqui */
</style>