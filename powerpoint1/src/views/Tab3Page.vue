<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3 - Expérimentation</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true" class="ion-padding">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3 - Expérimentation</ion-title>
        </ion-toolbar>
      </ion-header>

      <h2>Cycle de vie Ionic (Page 6)</h2>
      <p>Ouvre la console (F12) et navigue entre les onglets pour voir les messages des hooks.</p>

      <ion-card>
        <ion-card-header>
          <ion-card-title>Composant Card</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          Ici, tu peux tester d'autres composants Ionic.
        </ion-card-content>
      </ion-card>

    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  // Importer les hooks de cycle de vie Ionic (Page 6)
  onIonViewWillEnter,
  onIonViewDidEnter,
  onIonViewWillLeave,
  onIonViewDidLeave
} from '@ionic/vue';

// -- Cycle de vie (Page 6) --
onIonViewWillEnter(() => {
  console.log('Tab3Page: onIonViewWillEnter (va entrer)');
});

onIonViewDidEnter(() => {
  console.log('Tab3Page: onIonViewDidEnter (est entré)');
});

onIonViewWillLeave(() => {
  console.log('Tab3Page: onIonViewWillLeave (va quitter)');
});

onIonViewDidLeave(() => {
  console.log('Tab3Page: onIonViewDidLeave (a quitté)');
});
</script>

<style scoped>
/* Tu peux ajouter du style ici */
</style>