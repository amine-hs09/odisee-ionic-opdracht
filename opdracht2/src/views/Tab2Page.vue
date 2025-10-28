<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Bezoekers</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal" aria-label="Nieuwe bezoeker toevoegen">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Bezoekers</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-text color="medium" class="ion-padding-start ion-padding-end">
         <p>Klik op '+' om een nieuwe bezoeker toe te voegen. Klik op het potlood om te wijzigen of de prullenbak om te verwijderen.</p>
      </ion-text>

      <ion-list>
        <ion-item v-if="loading">
          <ion-label>Laden...</ion-label>
          <ion-spinner name="crescent"></ion-spinner>
        </ion-item>
        <ion-item v-if="error">
          <ion-label color="danger">{{ error }}</ion-label>
        </ion-item>

        <ion-item v-for="visitor in visitors" :key="visitor.id">
          <ion-label>
            <h2>{{ visitor.first_name }} {{ visitor.last_name }}</h2>
            <p>{{ visitor.email }}</p>
            <p>Geboren: {{ visitor.birth_date }}</p>
          </ion-label>
          <div slot="end" class="button-group">
            <ion-button fill="clear" color="medium" size="small" @click="openEditModal(visitor)" aria-label="Wijzig bezoeker">
              <ion-icon slot="icon-only" :icon="pencil"></ion-icon>
            </ion-button>
            <ion-button fill="clear" color="danger" size="small" @click="handleDeleteVisitor(visitor.id)" aria-label="Verwijder bezoeker">
               <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-button>
          </div>
        </ion-item>

        <ion-item v-if="!loading && visitors.length === 0 && !error">
          <ion-label>Geen bezoekers gevonden.</ion-label>
        </ion-item>
      </ion-list>

      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar color="secondary">
            <ion-title>{{ editingVisitorId ? 'Bezoeker Wijzigen' : 'Nieuwe Bezoeker' }}</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closeModal">Annuleren</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
           <form @submit.prevent="handleSaveVisitor">
             <ion-item>
              <ion-input label="Voornaam" label-placement="stacked" v-model="newVisitorData.first_name" required placeholder="Jan"></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="Achternaam" label-placement="stacked" v-model="newVisitorData.last_name" required placeholder="Janssens"></ion-input>
            </ion-item>
             <ion-item>
              <ion-input label="Geboortedatum" label-placement="stacked" type="date" v-model="newVisitorData.birth_date" required></ion-input>
            </ion-item>
            <ion-item>
              <ion-input label="E-mailadres" label-placement="stacked" type="email" v-model="newVisitorData.email" required placeholder="jan.janssens@example.com"></ion-input>
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

const visitors = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const newVisitorData = ref({ first_name: '', last_name: '', birth_date: '', email: '' });
const editingVisitorId = ref(null);

const axios = inject('axios');

const openAddModal = () => {
  editingVisitorId.value = null;
  newVisitorData.value = { first_name: '', last_name: '', birth_date: '', email: '' };
  isModalOpen.value = true;
};

const openEditModal = (visitor) => {
  editingVisitorId.value = visitor.id;
  newVisitorData.value = { ...visitor };
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  editingVisitorId.value = null;
};

const showToastMessage = async (message, color = 'dark', duration = 2000) => {
    const toast = await toastController.create({ message, duration, color, position: 'bottom' });
    await toast.present();
};

const loadVisitors = async () => {
  loading.value = true;
  error.value = null;
  if (!axios) { error.value = "Axios error."; loading.value = false; return; }
  try {
    const response = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php'); //
    if (response.data && Array.isArray(response.data.data)) {
      visitors.value = response.data.data;
    } else { error.value = "Geen data."; console.warn("API response:", response.data); }
  } catch (e) { console.error("API Error:", e); error.value = "Laden mislukt.";
  } finally { loading.value = false; }
};

const handleSaveVisitor = async () => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  
  if (!newVisitorData.value.first_name || !newVisitorData.value.last_name || !newVisitorData.value.email || !newVisitorData.value.birth_date) {
      showToastMessage("Gelieve alle velden in te vullen.", 'warning');
      return;
  }
  
  try {
    let response;
    let successMessage = '';
    if (editingVisitorId.value) {
      const dataToUpdate = { ...newVisitorData.value, id: editingVisitorId.value };
      response = await axios.put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', dataToUpdate); //
      successMessage = response.data.message || 'Bezoeker bijgewerkt!';
    } else {
      response = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', newVisitorData.value); //
      successMessage = response.data.message || 'Bezoeker toegevoegd!';
    }
    showToastMessage(successMessage, 'success');
    closeModal();
    loadVisitors();
  } catch (err) {
    console.error("Fout bij opslaan:", err);
    showToastMessage(err.response?.data?.message || err.message || 'Opslaan mislukt.', 'danger', 3000);
  }
};

const handleDeleteVisitor = async (visitorId) => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  const alert = await alertController.create({
    header: 'Bevestigen',
    message: 'Weet u zeker dat u deze bezoeker wilt verwijderen?',
    buttons: [
      { text: 'Annuleren', role: 'cancel' },
      {
        text: 'Verwijderen',
        role: 'destructive',
        handler: async () => {
          try {
            const response = await axios.delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', {
              data: { id: visitorId } //
            });
            showToastMessage(response.data.message || 'Bezoeker verwijderd!', 'success');
            loadVisitors();
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
  loadVisitors();
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