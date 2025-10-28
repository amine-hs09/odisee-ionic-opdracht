<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        
        <ion-title>Tickets</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tickets</ion-title>
        </ion-toolbar>
      </ion-header>

     
      <ion-list>
      
        <ion-item v-if="loading">
          <ion-label>Laden...</ion-label>
          <ion-spinner></ion-spinner>
        </ion-item>

        <ion-item v-if="error">
          <ion-label color="danger">{{ error }}</ion-label>
        </ion-item>

       
        <ion-item v-for="ticket in tickets" :key="ticket.id">
          <ion-label>
            <h2>{{ ticket.first_name }} {{ ticket.last_name }}</h2>
            <p>Concert: {{ ticket.artist }} ({{ ticket.venue }})</p>
            <p>Aantal: {{ ticket.qty }}</p>
           
            {/* <p>Gekocht op: {{ ticket.bought_at }}</p> */}
          </ion-label>
          
        </ion-item>

       
        <ion-item v-if="!loading && tickets.length === 0 && !error">
          <ion-label>Geen tickets gevonden.</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
// Imports
import { ref, inject } from 'vue';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner,
  onIonViewWillEnter // Pour charger les données
} from '@ionic/vue';

// Variables réactives
const tickets = ref([]);
const loading = ref(true);
const error = ref(null);

// Injecter Axios
const axios = inject('axios');

// Fonction pour charger les tickets
const loadTickets = async () => {
  loading.value = true;
  error.value = null;
  tickets.value = [];

  if (!axios) {
    error.value = "Axios is niet geconfigureerd.";
    loading.value = false;
    return;
  }

  try {
    // Appel GET à votre API tickets.php
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php'); //

    if (response.data && Array.isArray(response.data.data)) {
      tickets.value = response.data.data; // Mettre à jour la liste des tickets
    } else {
      error.value = "Geen data array gevonden in API response.";
      console.warn("API response structure:", response.data);
    }
  } catch (e) {
    console.error("API Error:", e);
    error.value = "Fout bij het laden van tickets. Controleer de console.";
  } finally {
    loading.value = false;
  }
};

// Charger les tickets quand la page s'affiche
onIonViewWillEnter(() => {
  loadTickets();
});
</script>

<style scoped>
/* Ajoutez du style si nécessaire */
</style>