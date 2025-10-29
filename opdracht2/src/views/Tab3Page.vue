<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Tickets</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tickets</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Nieuw Ticket Kopen</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <form @submit.prevent="handleBuyTicket">
            <ion-item>
              <ion-select label="Kies Bezoeker" label-placement="stacked" v-model="newTicketData.visitor_id" required interface="alert" placeholder="Selecteer een bezoeker">
                <ion-select-option v-for="visitor in allVisitors" :key="visitor.id" :value="visitor.id">
                  {{ visitor.first_name }} {{ visitor.last_name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-select label="Kies Concert" label-placement="stacked" v-model="newTicketData.concert_id" required interface="alert" placeholder="Selecteer een concert">
                <ion-select-option v-for="concert in allConcerts" :key="concert.id" :value="concert.id">
                  {{ concert.artist }} - {{ concert.venue }}
                </ion-select-option>
              </ion-select>
            </ion-item>
            <ion-item>
              <ion-input label="Aantal Tickets" label-placement="stacked" type="number" min="1" v-model.number="newTicketData.qty" required placeholder="1"></ion-input>
            </ion-item>
            <ion-button type="submit" expand="block" class="ion-margin-top">Koop Ticket</ion-button>
          </form>
        </ion-card-content>
      </ion-card>

      <ion-text color="medium" class="ion-padding-start ion-padding-end">
         <p>Hieronder ziet u de lijst met reeds gekochte tickets.</p>
      </ion-text>

      {/* Liste des tickets (existante) */}
      <ion-list>
        <ion-item v-if="loading">
          <ion-label>Laden...</ion-label>
          <ion-spinner name="crescent"></ion-spinner>
        </ion-item>
        <ion-item v-if="error">
          <ion-label color="danger">{{ error }}</ion-label>
        </ion-item>

        <ion-item v-for="ticket in tickets" :key="ticket.id">
          <ion-label>
            <h2>{{ ticket.first_name }} {{ ticket.last_name }}</h2>
            <p>Concert: {{ ticket.artist }} ({{ ticket.venue }})</p>
            <p>Aantal: {{ ticket.qty }}</p>
          </ion-label>
           <div slot="end" class="button-group">
            {/* Bouton Supprimer pour les tickets */}
            <ion-button fill="clear" color="danger" size="small" @click="handleDeleteTicket(ticket.id)" aria-label="Verwijder ticket">
               <ion-icon slot="icon-only" :icon="trash"></ion-icon>
            </ion-button>
          </div>
        </ion-item>

        <ion-item v-if="!loading && tickets.length === 0 && !error">
          <ion-label>Geen tickets gevonden.</ion-label>
        </ion-item>
      </ion-list>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, inject } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonSpinner, onIonViewWillEnter, IonButtons, IonButton, IonIcon,
  IonModal, IonInput, toastController, alertController, IonText,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonSelect, IonSelectOption // Nouveaux imports
} from '@ionic/vue';
import { trash, add } from 'ionicons/icons'; // 'add' est pour le style, 'trash' pour supprimer

const tickets = ref([]);
const allVisitors = ref([]); // Pour le dropdown
const allConcerts = ref([]); // Pour le dropdown
const loading = ref(true);
const error = ref(null);
const newTicketData = ref({ visitor_id: null, concert_id: null, qty: 1 });

const axios = inject('axios');

const showToastMessage = async (message, color = 'dark', duration = 2000) => {
    const toast = await toastController.create({ message, duration, color, position: 'bottom' });
    await toast.present();
};

const loadInitialData = async () => {
  loading.value = true;
  error.value = null;
  if (!axios) { error.value = "Axios error."; loading.value = false; return; }
  
  try {
    // Charger les 3 listes en parallèle
    const [ticketsRes, visitorsRes, concertsRes] = await Promise.all([
      axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php'), //
      axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php'), //
      axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php')  //
    ]);

    if (ticketsRes.data && Array.isArray(ticketsRes.data.data)) {
      tickets.value = ticketsRes.data.data;
    } else { console.warn("Tickets API response:", ticketsRes.data); }
    
    if (visitorsRes.data && Array.isArray(visitorsRes.data.data)) {
      allVisitors.value = visitorsRes.data.data;
    } else { console.warn("Visitors API response:", visitorsRes.data); }

    if (concertsRes.data && Array.isArray(concertsRes.data.data)) {
      allConcerts.value = concertsRes.data.data;
    } else { console.warn("Concerts API response:", concertsRes.data); }

  } catch (e) {
    console.error("API Error:", e);
    error.value = "Laden van data mislukt.";
  } finally {
    loading.value = false;
  }
};

const handleBuyTicket = async () => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  
  if (!newTicketData.value.visitor_id || !newTicketData.value.concert_id || newTicketData.value.qty < 1) {
      showToastMessage("Gelieve alle velden correct in te vullen.", 'warning');
      return;
  }
  
  try {
    const response = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', newTicketData.value); //
    showToastMessage(response.data.message || 'Ticket gekocht!', 'success');
    
    // Reset formulaire
    newTicketData.value = { visitor_id: null, concert_id: null, qty: 1 };
    
    // Herlaad enkel de ticketlijst (sneller dan alles)
    loadTicketsListOnly(); 
    
  } catch (err) {
    console.error("Fout bij kopen ticket:", err);
    showToastMessage(err.response?.data?.message || err.message || 'Aankoop mislukt.', 'danger', 3000);
  }
};

// Fonction séparée pour juste rafraîchir les tickets (après achat/delete)
const loadTicketsListOnly = async () => {
    if (!axios) return;
    try {
        const ticketsRes = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php'); //
        if (ticketsRes.data && Array.isArray(ticketsRes.data.data)) {
            tickets.value = ticketsRes.data.data;
        }
    } catch (e) {
        console.error("Fout bij herladen tickets:", e);
    }
};

const handleDeleteTicket = async (ticketId) => {
  if (!axios) { showToastMessage("Axios niet beschikbaar.", 'danger'); return; }
  const alert = await alertController.create({
    header: 'Bevestigen',
    message: 'Weet u zeker dat u dit ticket wilt verwijderen?',
    buttons: [
      { text: 'Annuleren', role: 'cancel' },
      {
        text: 'Verwijderen',
        role: 'destructive',
        handler: async () => {
          try {
            const response = await axios.delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', {
              data: { id: ticketId } //
            });
            showToastMessage(response.data.message || 'Ticket verwijderd!', 'success');
            loadTicketsListOnly(); // Herlaad enkel tickets
          } catch (err) {
            console.error("Fout bij verwijderen ticket:", err);
            showToastMessage(err.response?.data?.message || err.message || 'Verwijderen mislukt.', 'danger', 3000);
          }
        }
      }
    ]
  });
  await alert.present();
};

// Charger toutes les données (tickets, visiteurs, concerts) quand la page s'affiche
onIonViewWillEnter(() => {
  loadInitialData();
});
</script>

<style scoped>
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