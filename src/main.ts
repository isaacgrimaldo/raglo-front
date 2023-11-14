import { createApp } from 'vue'

import './style.css'
import '/node_modules/primeflex/primeflex.css'
import 'primevue/resources/themes/md-light-deeppurple/theme.css'
import 'primeicons/primeicons.css'
import PrimeVue from 'primevue/config';
import ConfirmationService from 'primevue/confirmationservice';
import ToastService from 'primevue/toastservice';

import App from './App.vue'


const app = createApp(App);
app.use(PrimeVue);
app.use(ConfirmationService);
app.use(ToastService);
app.mount('#app')

