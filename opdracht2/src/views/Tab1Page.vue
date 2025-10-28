<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Concerten</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal" aria-label="Nieuw concert toevoegen">
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

      <ion-text color="medium" class="ion-padding-start ion-padding-end">
         <p>Klik op '+' om een nieuw concert toe te voegen. Klik op het potlood om te wijzigen of de prullenbak om te verwijderen.</p>
      </ion-text>

      <ion-list>
        <ion-item v-if="loading">
          <ion-label>Laden...</ion-label>
          <ion-spinner name="crescent"></ion-spinner>
        </ion-item>
        <ion-item v-if="error">
          <ion-label color="danger">{{ error }}</ion-label>
        </ion-item>

        <ion-item v-for="concert in concerts" :key="concert.id">
          <ion-label>
            <h2>{{ concert.artist }}</h2>
            <p>{{ concert.venue }} - {{ concert.date }}</p>
            <p>Prijs: €{{ parseFloat(concert.price).toFixed(2) }}</p>
          </ion-label>

          <div slot="end" class="button-group">
            <ion-button fill="clear" color="medium" size="small" @click="openEditModal(concert)" aria-label="Wijzig concert">
              <ion-icon slot="icon-only" :icon="pencil"></ion-icon>
            </ion-button>
            <ion-button fill="clear" color="danger" size="small" @click="handleDeleteConcert(concert.id)" aria-label="Verwijder concert">
               <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-button>
          </div>
        </ion-item>

        <ion-item v-if="!loading && concerts.length === 0 && !error">
          <ion-label>Geen concerten gevonden.</ion-label>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>{{ editingConcertId ? 'Concert Wijzigen' : 'Nieuw Concert' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Annuleren</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
           <form @submit.prevent="handleSaveConcert">
             <ion-item>
              <ion-input label="Artiest" label-placement="stacked" v-model="newConcertData.artist" required placeholder="Naam van artiest of band"></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Datum" label-placement="stacked" type="date" v-model="newConcertData.date" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Tijd" label-placement="stacked" type="time" v-model="newConcertData.time" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Locatie" label-placement="stacked" v-model="newConcertData.venue" required placeholder="Naam van de zaal/plaats"></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Prijs (€)" label-placement="stacked" type="number" step="0.01" v-model="newConcertData.price" required placeholder="bv. 25.50"></ion-input>
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
  IonSpinner, onIonViewWillEnter, IonButtons, IonButton, IonIcon,
  IonModal, IonInput, toastController, alertController, IonText
} from '@ionic/vue';
import { add, pencil, trash } from 'ionicons/icons';

const concerts = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const newConcertData = ref({ artist: '', date: '', time: '', venue: '', price: null });
const editingConcertId = ref(null);

const axios = inject('axios');

const openAddModal = () => {
  editingConcertId.value = null;
  newConcertData.value = { artist: '', date: '', time: '', venue: '', price: null };
  isModalOpen.value = true;
};

const openEditModal = (concert) => {
  editingConcertId.value = concert.id;
  newConcertData.value = { ...concert };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingConcertId.value = null;
};

const showToastMessage = async (message, color = 'dark', duration = 2000) => {
    const toast = await toastController.create({ message, duration, color, position: 'bottom' });
    await toast.present();
};

const loadConcerts = async () => {
  loading.value = true;
  error.value = null;
  if (!axios) { error.value = "Axios error."; loading.value = false; return; }
  try {
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php'); //
    if (response.data && Array.isArray(response.data.data)) {
      concerts.value = response.data.data;
    } else { error.value = "Geen data."; console.warn("API response:", response.data); }
  } catch (e) { console.error("API Error:", e); error.value = "Laden mislukt.";
  } finally { loading.value = false; }
};

const handleSaveConcert = async () => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  try {
    let response;
    let successMessage = '';
    if (editingConcertId.value) {
      const dataToUpdate = { ...newConcertData.value, id: editingConcertId.value };
      response = await axios.put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', dataToUpdate); //
      successMessage = response.data.message || 'Concert bijgewerkt!';
    } else {
      response = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', newConcertData.value); //
      successMessage = response.data.message || 'Concert toegevoegd!';
    }
    showToastMessage(successMessage, 'success');
    closeModal();
    loadConcerts();
  } catch (err) {
    console.error("Fout bij opslaan:", err);
    showToastMessage(err.response?.data?.message || err.message || 'Opslaan mislukt.', 'danger', 3000);
  }
};

const handleDeleteConcert = async (concertId) => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  const alert = await alertController.create({
    header: 'Bevestigen',
    message: 'Weet u zeker dat u dit concert wilt verwijderen?',
    buttons: [
      { text: 'Annuleren', role: 'cancel' },
      {
        text: 'Verwijderen',
        role: 'destructive',
        handler: async () => {
          try {
            const response = await axios.delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', {
              data: { id: concertId } //
            });
            showToastMessage(response.data.message || 'Concert verwijderd!', 'success');
            loadConcerts();
          } catch (err) {
            console.error("Fout bij verwijderen:", err);
            showToastMessage(err.response?.data?.message || err.message || 'Verwijderen mislukt.', 'danger', 3000);
          }
        }
      }
    ]
  });
  await alert.present();
};

onIonViewWillEnter(() => {
  loadConcerts();
});
</script>

<style scoped>
ion-modal ion-content {
  --padding-start: 16px;
  --padding-end: 16px;
  --padding-top: 16px;
  --padding-bottom: 16px;
}
.button-group {
  display: flex;
  align-items: center;
  gap: 0px;
}
ion-item h2 {
 font-size: 1.1em;
 font-weight: 600;
}
ion-item p {
 font-size: 0.9em;
 color: var(--ion-color-medium-shade);
}
</style>