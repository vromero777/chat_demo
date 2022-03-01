import { createApp } from './vue.esm-browser.js'

const supabaseURL = 'https://ntxezphcoiipjaogxnzi.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50eGV6cGhjb2lpcGphb2d4bnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDU0MzgzMjksImV4cCI6MTk2MTAxNDMyOX0.RaIi-WWMMgSq9I7pPvV8JDr7dC7e6M1XvEjY186DVIM';

const cli = supabase.createClient(supabaseURL, supabaseKey)


createApp({
    data() {
        return {
            messages: [],
            nameSender:'',
            newMessage: ''

        }
    },
    methods: {
        cargarMensajes: async function () {
            let { data: data , error } = await cli
                .from('messages')
                .select('*')
                .order('created_at',{ ascending: true })
            this.messages = data
        },
        enviarMensaje: async function () {
            const { data,error } = await cli
                .from('messages')
                .insert([{
                    name: this.nameSender, content: this.newMessage
                }])
            this.newMessage = '';
        },
        escucharNuevosMensajes: function () {
            cli
                .from('messages')
                .on('INSERT', payload => {
                    // Guardamos cambios en base local
                    this.messages.push(payload.new);
                })
                .subscribe()
        }
    },
    watch:{
        messages: {
            handler (newValue, oldValue) {
                // update el Scroll
                this.$nextTick(() => {
                    const elemento = this.$refs.mensajesContenedor;
                    elemento.scrollTo(0,elemento.scrollHeight)
                })
            },
            deep: true
        }
    },
    mounted () {
        this.cargarMensajes();
        this.escucharNuevosMensajes()
    }
}).mount('#app')