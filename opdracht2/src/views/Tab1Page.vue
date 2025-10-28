<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Concerten</ion-title>
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

    </ion-content>
  </ion-page>
</template>

<script setup>
// Imports nécessaires depuis Vue et Ionic/Vue
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
  IonNote,
  IonSpinner,
  onIonViewWillEnter // Hook pour déclencher le chargement
} from '@ionic/vue';

// Variables réactives pour stocker l'état
const concerts = ref([]); // La liste des concerts
const loading = ref(true); // Indicateur de chargement
const error = ref(null); // Pour stocker les messages d'erreur

// Injecter l'instance Axios configurée dans main.js
const axios = inject('axios'); [cite_start]// [cite: 4208]

// Fonction asynchrone pour charger les concerts depuis l'API
const loadConcerts = async () => {
  loading.value = true; // Début du chargement
  error.value = null; // Réinitialiser l'erreur
  concerts.value = []; // Vider la liste actuelle

  // Vérifier si Axios a bien été injecté
  if (!axios) {
    error.value = "Axios is niet geconfigureerd.";
    loading.value = false;
    return;
  }

  try {
    // Faire l'appel GET à votre API de concerts
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php'); //
    
    // Vérifier si la réponse contient bien les données attendues
    if (response.data && Array.isArray(response.data.data)) {
      concerts.value = response.data.data; // Mettre à jour la liste des concerts
    } else {
      // Si la structure de la réponse n'est pas celle attendue
      error.value = "Geen data array gevonden in API response.";
      console.warn("API response structure:", response.data); // Afficher la structure reçue pour déboguer
    }
  } catch (e) {
    // Gérer les erreurs réseau ou autres erreurs lors de l'appel API
    console.error("API Error:", e);
    error.value = "Fout bij het laden van concerten. Controleer de console.";
  } finally {
    // Quoi qu'il arrive (succès ou erreur), arrêter le chargement
    loading.value = false;
  }
};

// Utiliser le hook onIonViewWillEnter pour appeler loadConcerts
// chaque fois que l'utilisateur navigue vers cet onglet.
[cite_start]onIonViewWillEnter(() => { // [cite: 4134]
  loadConcerts();
});
</script>