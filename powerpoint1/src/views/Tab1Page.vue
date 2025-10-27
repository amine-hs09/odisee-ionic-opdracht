<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 - Ajouter Concert</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1 - Ajouter Concert</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <!-- Champs mis à jour pour l'API Concerts -->
        <ion-item>
          <ion-input label="Artiste" label-placement="floating" placeholder="Nom de l'artiste" v-model="artist"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input label="Lieu (Venue)" label-placement="floating" placeholder="Lieu du concert" v-model="venue"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input label="Date" label-placement="floating" type="date" v-model="date"></ion-input>
        </ion-item>
        
        <ion-item>
          <ion-input label="Heure" label-placement="floating" type="time" v-model="time"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Prix" label-placement="floating" type="number" placeholder="Entrez le prix" v-model="price"></ion-input>
        </ion-item>
      </ion-list>

      <!-- @click appelle la fonction envoyerFormulaire -->
      <ion-button expand="block" class="ion-margin-top" @click="envoyerFormulaire">
        Ajouter Concert (POST)
      </ion-button>
      
      <!-- Message de succès ou d'erreur -->
      <ion-item v-if="message">
        <ion-label :color="couleurMessage">{{ message }}</ion-label>
      </ion-item>

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
  IonInput,
  IonButton,
  IonLabel
  // IonSelect n'est plus utilisé ici
} from '@ionic/vue';

// Injecter Axios
const axios = inject('axios');

// !! Variables réactives mises à jour pour l'API Concerts
const artist = ref('');
const date = ref('');
const time = ref('');
const venue = ref('');
const price = ref(null);

// Variables réactives pour les messages
const message = ref('');
const couleurMessage = ref('success'); // 'success' ou 'danger'

// Fonction pour envoyer le formulaire (Page 17 - POST)
const envoyerFormulaire = async () => {
  message.value = '';
  
  // !! Objet mis à jour pour TON API
  const nouveauConcert = {
    artist: artist.value,
    date: date.value,
    time: time.value,
    venue: venue.value,
    price: price.value
  };

  console.log('Envoi du concert:', nouveauConcert);
  
  try {
    // !! URL changée pour TON API de concerts
    const response = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', nouveauConcert);
    
    console.log('Réponse de l\'API (POST):', response.data);
    
    // !! Message de succès basé sur ta propre API
    message.value = response.data.message || `Concert (ID: ${response.data.id}) ajouté avec succès !`;
    couleurMessage.value = 'success';

    // Vider le formulaire
    artist.value = '';
    date.value = '';
    time.value = '';
    venue.value = '';
    price.value = null;

  } catch (e) {
    console.error('Erreur lors de l\'envoi (POST):', e);
    message.value = (e.response && e.response.data && e.response.data.message) || "Erreur: Impossible d'envoyer le formulaire.";
    couleurMessage.value = 'danger';
  }
};
</script>

<style scoped>
/* Tu peux ajouter du style ici */
</style>