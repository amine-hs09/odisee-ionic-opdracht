<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Bezoekers</ion-title> {/* Titre pour l'onglet Visiteurs */}
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bezoekers</ion-title>
        </ion-toolbar>
      </ion-header>

      {/* Liste des visiteurs */}
      <ion-list>
        {/* Affichage pendant le chargement */}
        <ion-item v-if="loading">
          <ion-label>Laden...</ion-label>
          <ion-spinner></ion-spinner>
        </ion-item>

        {/* Affichage en cas d'erreur */}
        <ion-item v-if="error">
          <ion-label color="danger">{{ error }}</ion-label>
        </ion-item>

        {/* Boucle pour afficher chaque visiteur */}
        <ion-item v-for="visitor in visitors" :key="visitor.id">
          <ion-label>
            <h2>{{ visitor.first_name }} {{ visitor.last_name }}</h2>
            <p>{{ visitor.email }}</p>
            <p>Geboortedatum: {{ visitor.birth_date }}</p>
          </ion-label>
          {/* Ici, on ajoutera plus tard les boutons Edit/Delete */}
        </ion-item>

        {/* Affichage si la liste est vide */}
        <ion-item v-if="!loading && visitors.length === 0 && !error">
          <ion-label>Geen bezoekers gevonden.</ion-label>
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
const visitors = ref([]);
const loading = ref(true);
const error = ref(null);

// Injecter Axios
const axios = inject('axios');

// Fonction pour charger les visiteurs
const loadVisitors = async () => {
  loading.value = true;
  error.value = null;
  visitors.value = [];

  if (!axios) {
    error.value = "Axios is niet geconfigureerd.";
    loading.value = false;
    return;
  }

  try {
    // Appel GET à votre API visitors.php
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php'); //

    if (response.data && Array.isArray(response.data.data)) {
      visitors.value = response.data.data; // Mettre à jour la liste des visiteurs
    } else {
      error.value = "Geen data array gevonden in API response.";
      console.warn("API response structure:", response.data);
    }
  } catch (e) {
    console.error("API Error:", e);
    error.value = "Fout bij het laden van bezoekers. Controleer de console.";
  } finally {
    loading.value = false;
  }
};

// Charger les visiteurs quand la page s'affiche
onIonViewWillEnter(() => {
  loadVisitors();
});
</script>

<style scoped>
/* Ajoutez du style si nécessaire */
</style>