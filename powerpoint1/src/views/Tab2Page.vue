<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2 - Concerts (API)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2 - Concerts (API)</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Indicateur de chargement -->
      <ion-list v-if="loading">
        <ion-item>
          <ion-label>Chargement des concerts...</ion-label>
          <ion-spinner slot="end"></ion-spinner>
        </ion-item>
      </ion-list>
      
      <!-- Affichage en cas d'erreur -->
      <ion-item v-if="!loading && erreur">
         <ion-label color="danger">{{ erreur }}</ion-label>
      </ion-item>

      <!-- Liste des concerts (maintenant chargée depuis TON API) -->
      <ion-list v-if="!loading && !erreur">
        <ion-item v-for="concert in concerts" :key="concert.id">
          <ion-label>
            <h2>{{ concert.artist }}</h2>
            <p>Prix: {{ concert.price }}€ - Lieu: {{ concert.venue }}</p>
            <p>Date: {{ concert.date }} à {{ concert.time }}</p>
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
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
  onIonViewWillEnter // Pour charger les données (Page 6)
} from '@ionic/vue';

// Injecter Axios (fourni dans main.js)
const axios = inject('axios');

// Variables réactives
const concerts = ref([]); // Commencer avec une liste vide
const loading = ref(true);
const erreur = ref(null);

// Fonction pour charger les concerts (Page 16 - GET)
const loadConcerts = async () => {
  try {
    loading.value = true;
    erreur.value = null;
    
    // !! URL changée pour TON API de concerts
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php');
    
    // !! 'response.data.data' basé sur ton API PHP
    concerts.value = response.data.data; 
    console.log('Concerts chargés:', concerts.value);
    
  } catch (e) {
    console.error('Erreur lors du chargement:', e);
    erreur.value = "Erreur: Impossible de charger les concerts. (Vérifie la console F12 et si ton API est en ligne)";
  } finally {
    loading.value = false;
  }
};

// Hook de cycle de vie Ionic (Page 6)
onIonViewWillEnter(() => {
  console.log('Tab2Page: onIonViewWillEnter - Chargement des concerts...');
  loadConcerts(); // Charger les données à chaque fois qu'on entre dans l'onglet
});
</script>

<style scoped>
/* Tu peux ajouter du style ici */
</style>

