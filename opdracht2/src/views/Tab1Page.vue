<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Concerten</ion-title>

        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Concerten</ion-title>
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
        <ion-item v-for="concert in concerts" :key="concert.id">
          <ion-label>
            <h2>{{ concert.artist }}</h2>
            <p>{{ concert.venue }} - {{ concert.date }}</p>
          </ion-label>
          <ion-note slot="end">€{{ parseFloat(concert.price).toFixed(2) }}</ion-note>
        </ion-item>
        <ion-item v-if="!loading && concerts.length === 0 && !error">
          <ion-label>Geen concerten gevonden.</ion-label>
        </ion-item>
      </ion-list>

      
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>Nieuw Concert Toevoegen</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Sluiten</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <form @submit.prevent="handleAddConcert">
            <ion-item>
              <ion-input label="Artiest" label-placement="stacked" v-model="newConcertData.artist" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Datum" label-placement="stacked" type="date" v-model="newConcertData.date" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Tijd" label-placement="stacked" type="time" v-model="newConcertData.time" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Locatie" label-placement="stacked" v-model="newConcertData.venue" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Prijs" label-placement="stacked" type="number" step="0.01" v-model="newConcertData.price" required></ion-input>
            </ion-item>
            <ion-button type="submit" expand="block" class="ion-margin-top">Opslaan</ion-button>
          </form>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, inject } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonNote, IonSpinner, onIonViewWillEnter, IonButtons, IonButton, IonIcon,
  IonModal, IonInput, toastController //
} from '@ionic/vue';
import { add } from 'ionicons/icons'; //

// Bestaande refs
const concerts = ref([]);
const loading = ref(true);
const error = ref(null);

// Nieuwe refs voor de modal en het formulier
const isModalOpen = ref(false);
const newConcertData = ref({
  artist: '',
  date: '',
  time: '',
  venue: '',
  price: null
});

const axios = inject('axios');

// Functie om de modal te openen en formulier te resetten
const openAddModal = () => {
  newConcertData.value = { artist: '', date: '', time: '', venue: '', price: null }; // Reset form
  isModalOpen.value = true;
};

// Functie om de modal te sluiten
const closeModal = () => {
  isModalOpen.value = false;
};

// Functie om de lijst te herladen (bestaande functie)
const loadConcerts = async () => {
  // ... (code blijft hetzelfde als voorheen) ...
  loading.value = true;
  error.value = null;
  // concerts.value = []; // Optioneel: niet altijd nodig bij refresh

  if (!axios) {
    error.value = "Axios is niet geconfigureerd.";
    loading.value = false;
    return;
  }
  try {
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php');
    if (response.data && Array.isArray(response.data.data)) {
      concerts.value = response.data.data;
    } else {
      error.value = "Geen data array gevonden in API response.";
      console.warn("API response structure:", response.data);
    }
  } catch (e) {
    console.error("API Error:", e);
    error.value = "Fout bij het laden van concerten. Controleer de console.";
  } finally {
    loading.value = false;
  }
};

// Functie die wordt aangeroepen bij het submitten van het formulier
const handleAddConcert = async () => {
  if (!axios) {
    console.error("Axios niet beschikbaar");
    // Toon eventueel een foutmelding
    const toast = await toastController.create({
        message: 'Fout: Axios niet beschikbaar.',
        duration: 2000,
        color: 'danger'
      });
    await toast.present();
    return;
  }

  try {
    // Stuur POST request naar je API
    const response = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', newConcertData.value);

    // Toon succesbericht
    const toast = await toastController.create({
      message: response.data.message || 'Concert succesvol toegevoegd!',
      duration: 2000,
      color: 'success'
    });
    await toast.present();

    closeModal(); // Sluit de modal
    loadConcerts(); // Herlaad de lijst

  } catch (err) {
    console.error("Fout bij toevoegen concert:", err);
    // Toon foutbericht
     const toast = await toastController.create({
        message: err.response?.data?.message || err.message || 'Kon concert niet toevoegen.',
        duration: 3000,
        color: 'danger'
      });
    await toast.present();
  }
};

onIonViewWillEnter(() => {
  loadConcerts();
});
</script>

<style scoped>
/* Stijl voor modal indien nodig */
ion-modal ion-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}
</style>