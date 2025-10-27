<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 1 - Ajouter Produit</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 1 - Ajouter Produit</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-list>
        <!-- v-model lie l'input à la variable réactive (Page 8) -->
        <ion-item>
          <ion-input label="Nom du produit" label-placement="floating" placeholder="Entrez le nom" v-model="nomProduit"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Prix" label-placement="floating" type="number" placeholder="Entrez le prix" v-model="prixProduit"></ion-input>
        </ion-item>

        <ion-item>
          <ion-select label="Catégorie" label-placement="floating" placeholder="Sélectionnez" v-model="categorieProduit">
            <ion-select-option value="Fruit">Fruit</ion-select-option>
            <ion-select-option value="Groente">Groente</ion-select-option>
          </ion-select>
        </ion-item>
      </ion-list>

      <!-- @click appelle la fonction envoyerFormulaire -->
      <ion-button expand="block" class="ion-margin-top" @click="envoyerFormulaire">
        Envoyer (POST)
      </ion-button>
      
      <!-- Message de succès ou d'erreur -->
      <ion-item v-if="message">
        <ion-label :color="couleurMessage">{{ message }}</ion-label>
      </ion-item>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, inject } from 'vue'; // Importer ref et inject
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonLabel
} from '@ionic/vue';

// Injecter Axios
const axios = inject('axios');

// Variables réactives pour le formulaire (Page 8-9)
const nomProduit = ref('');
const prixProduit = ref(null);
const categorieProduit = ref('');

// Variables réactives pour les messages
const message = ref('');
const couleurMessage = ref('success'); // 'success' ou 'danger'

// Fonction pour envoyer le formulaire (Page 17)
const envoyerFormulaire = async () => {
  // Réinitialiser le message
  message.value = '';
  
  // Créer l'objet produit à envoyer
  const nouveauProduit = {
    title: nomProduit.value,
    price: prixProduit.value,
    category: categorieProduit.value
    // dummyjson attend 'title', 'price', 'category'
  };

  console.log('Envoi du produit:', nouveauProduit);
  
  try {
    // Appel POST à l'API de test (dummyjson)
    // Elle ne l'ajoutera pas vraiment, mais simulera une réponse
    const response = await axios.post('https://dummyjson.com/products/add', nouveauProduit);
    
    console.log('Réponse de l\'API (POST):', response.data);
    message.value = `Produit "${response.data.title}" (ID: ${response.data.id}) ajouté (simulation) !`;
    couleurMessage.value = 'success';

    // Vider le formulaire
    nomProduit.value = '';
    prixProduit.value = null;
    categorieProduit.value = '';

  } catch (e) {
    console.error('Erreur lors de l\'envoi (POST):', e);
    message.value = "Erreur: Impossible d'envoyer le formulaire.";
    couleurMessage.value = 'danger';
  }
};
</script>

<style scoped>
/* Tu peux ajouter du style ici */
</style>