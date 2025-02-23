<template>
    <div>
        <h1>Dados do Backend:</h1>
        <pre>{{ dados }}</pre>
    </div>
</template>

<script>
    import { defineComponent, ref, onMounted } from 'vue';
    import api from '@/services/api';

    export default defineComponent({
        setup() {
            const dados = ref(null);

            try {
                onMounted(async () => {
                    const response = await api.get('/dados');
                    dados.value = response.data;
                });
            } catch (error) {
                console.error('Erro ao buscar dados: ',error);
            };

            return { dados};
        }
    });
</script>