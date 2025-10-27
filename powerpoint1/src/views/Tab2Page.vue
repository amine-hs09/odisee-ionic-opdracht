<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2 - Produits (API)</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2 - Produits (API)</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Indicateur de chargement -->
      <ion-list v-if="loading">
        <ion-item>
          <ion-label>Chargement des produits...</ion-label>
          <ion-spinner slot="end"></ion-spinner>
        </ion-item>
      </ion-list>
      
      <!-- Affichage en cas d'erreur -->
      <ion-item v-if="!loading && erreur">
         <ion-label color="danger">{{ erreur }}</ion-label>
      </ion-item>

      <!-- Liste des produits (maintenant chargée depuis l'API) -->
      <ion-list v-if="!loading && !erreur">
        <!-- On utilise v-for pour boucler sur la liste 'produits' (Page 9) -->
        <ion-item v-for="produit in produits" :key="produit.id">
          <ion-label>
            <h2>{{ produit.title }}</h2> <!-- dummyjson utilise 'title' -->
            <p>Prix: {{ produit.price }}€ - Catégorie: {{ produit.category }}</p> <!-- 'price' et 'category' -->
          </ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, inject } from 'vue'; // !! Importer ref et inject
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonSpinner, // Ajouté pour le chargement
  onIonViewWillEnter // Ajouté pour charger les données (Page 6)
} from '@ionic/vue';

// Injecter Axios (fourni dans main.js)
const axios = inject('axios');

// Variables réactives (Page 8-9)
const produits = ref([]); // Commencer avec une liste vide
const loading = ref(true);
const erreur = ref(null);

// Fonction pour charger les produits (Page 16)
const loadProduits = async () => {
  try {
    loading.value = true;
    erreur.value = null;
    
    // On utilise une API de test (dummyjson)
    const response = await axios.get('https://dummyjson.com/products');
    
    produits.value = response.data.products; // Mettre à jour la liste réactive (Page 8)
    console.log('Produits chargés:', produits.value);
    
  } catch (e) {
    console.error('Erreur lors du chargement:', e);
    erreur.value = "Erreur: Impossible de charger les produits.";
  } finally {
    loading.value = false;
  }
};

// Hook de cycle de vie Ionic (Page 6)
onIonViewWillEnter(() => {
  console.log('Tab2Page: onIonViewWillEnter');
  loadProduits(); // Charger les données à chaque fois qu'on entre dans l'onglet
});
</script>

<style scoped>
/* Tu peux ajouter du style ici */
</style>