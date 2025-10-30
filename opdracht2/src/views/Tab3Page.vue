<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mijn Tickets</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openBuyModal" fill="solid">
            <ion-icon slot="start" :icon="add" />
            Koop Tickets
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="welcome-card ion-padding">
        <ion-card>
          <ion-card-content>
            <p class="intro-text">
              Overzicht van alle gekochte concerttickets. Koop nieuwe tickets voor meerdere concerten tegelijk.
            </p>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-searchbar 
        v-model="searchText" 
        placeholder="Zoek op bezoeker of concert..." 
        :debounce="300"
        show-clear-button="always"
        class="search-bar"
        @ionInput="filterTickets()"
      />

      <ion-progress-bar v-if="loading" type="indeterminate" />

      <ion-list v-if="!loading && !error" lines="none">
        <ion-item-group v-if="filteredTickets.length === 0">
          <ion-item>
            <ion-label class="ion-text-center">
              <h2>Geen tickets gevonden</h2>
              <p>Koop je eerste ticket!</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-card v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
          <ion-card-header>
            <ion-card-subtitle>
              <ion-chip color="primary" outline>
                <ion-icon :icon="personCircle" />
                <ion-label>{{ ticket.first_name }} {{ ticket.last_name }}</ion-label>
              </ion-chip>
            </ion-card-subtitle>
            <ion-card-title class="concert-title">
              {{ ticket.artist }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list class="info-list">
              <ion-item lines="none">
                <ion-icon :icon="location" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Locatie</p>
                  <h3>{{ ticket.venue }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none">
                <ion-icon :icon="calendar" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Datum</p>
                  <h3>{{ formatDate(ticket.date) }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none" class="qty-item">
                <ion-icon :icon="ticketIcon" slot="start" color="success" />
                <ion-label>
                  <p class="label-text">Aantal tickets</p>
                  <h2 class="qty-amount">{{ ticket.qty }}</h2>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>

          <ion-row class="card-actions">
            <ion-col>
              <ion-button expand="block" color="danger" fill="outline" @click="handleDeleteTicket(ticket.id)">
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="secondary" @click="openBuyModal">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <!-- Buy Tickets Modal - Multiple Concerts -->
    <ion-modal :is-open="isBuyModalOpen" @didDismiss="closeBuyModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Tickets Kopen</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeBuyModal">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <!-- Selecteer bezoeker -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Stap 1: Kies Bezoeker</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-select 
                v-model="selectedVisitorId" 
                label="Bezoeker" 
                label-placement="stacked"
                interface="action-sheet"
                placeholder="Selecteer een bezoeker"
                :class="{ 'ion-invalid': showErrors && !selectedVisitorId }"
              >
                <ion-select-option v-for="visitor in allVisitors" :key="visitor.id" :value="visitor.id">
                  {{ visitor.first_name }} {{ visitor.last_name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <!-- Voeg concerten toe aan winkelmandje -->
        <ion-card>
          <ion-card-header>
            <ion-card-title>Stap 2: Voeg Concerten Toe</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-select 
                v-model="selectedConcertId" 
                label="Concert" 
                label-placement="stacked"
                interface="action-sheet"
                placeholder="Selecteer een concert"
              >
                <ion-select-option v-for="concert in allConcerts" :key="concert.id" :value="concert.id">
                  {{ concert.artist }} - {{ concert.venue }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-input 
                v-model.number="selectedQty" 
                label="Aantal" 
                label-placement="stacked"
                type="number"
                min="1"
                placeholder="1"
              />
            </ion-item>

            <ion-button 
              expand="block" 
              fill="outline"
              @click="addConcertToCart"
              class="ion-margin-top"
            >
              <ion-icon slot="start" :icon="addCircle" />
              Voeg toe aan winkelmandje
            </ion-button>
          </ion-card-content>
        </ion-card>

        <!-- Winkelmandje -->
        <ion-card v-if="cartConcerts.length > 0" class="cart-card">
          <ion-card-header>
            <ion-card-title>Winkelmandje</ion-card-title>
            <ion-card-subtitle>{{ cartConcerts.length }} concert(en)</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="none">
              <ion-item v-for="(item, index) in cartConcerts" :key="index" class="cart-item">
                <ion-label>
                  <h3>{{ getConcertName(item.concert_id) }}</h3>
                  <p>Aantal: {{ item.qty }}</p>
                </ion-label>
                <ion-button 
                  slot="end" 
                  fill="clear" 
                  color="danger" 
                  @click="removeFromCart(index)"
                >
                  <ion-icon :icon="trash" />
                </ion-button>
              </ion-item>
            </ion-list>

            <div class="cart-summary">
              <p><strong>Totaal tickets:</strong> {{ getTotalTickets() }}</p>
            </div>
          </ion-card-content>
        </ion-card>

        <!-- Bevestig aankoop -->
        <div class="ion-padding-top" v-if="cartConcerts.length > 0">
          <ion-button 
            expand="block" 
            size="large"
            color="success"
            @click="handleBuyAllTickets"
            :disabled="buying || !selectedVisitorId"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Koop Alle Tickets
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <ion-toast 
      :is-open="toast.open" 
      :message="toast.msg" 
      :color="toast.color" 
      :duration="2500"
      position="top"
      @didDismiss="toast.open = false"
    />
  </ion-page>
</template>

<script setup>
import { ref, inject } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButtons, IonButton, IonIcon, IonModal, IonInput, IonSelect, IonSelectOption,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonChip, IonSearchbar, IonProgressBar, IonRefresher, IonRefresherContent,
  IonItemGroup, IonRow, IonCol, IonFab, IonFabButton, IonToast,
  onIonViewWillEnter, alertController
} from '@ionic/vue';
import {
  add, trash, personCircle, location, calendar, ticket as ticketIcon, 
  checkmarkCircle, addCircle
} from 'ionicons/icons';

const axios = inject('axios');

// State variables - style prof: ref() simples
const tickets = ref([]);
const filteredTickets = ref([]);
const allVisitors = ref([]);
const allConcerts = ref([]);
const loading = ref(false);
const buying = ref(false);
const error = ref(null);
const isBuyModalOpen = ref(false);
const showErrors = ref(false);
const searchText = ref('');

// Pour acheter plusieurs tickets
const selectedVisitorId = ref(null);
const selectedConcertId = ref(null);
const selectedQty = ref(1);
const cartConcerts = ref([]); // liste des concerts a acheter

const toast = ref({ open: false, msg: '', color: 'success' });

// Helper functions - style prof: fonctions simples
function formatDate(d) {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length !== 3) return d;
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function showToast(message, color) {
  toast.value.open = true;
  toast.value.msg = message;
  toast.value.color = color;
}

// Trouver le nom du concert par ID
function getConcertName(concertId) {
  for (let i = 0, end = allConcerts.value.length; i < end; i++) {
    if (allConcerts.value[i].id === concertId) {
      return allConcerts.value[i].artist + ' - ' + allConcerts.value[i].venue;
    }
  }
  return 'Concert';
}

// Calculer total tickets dans le panier
function getTotalTickets() {
  let total = 0;
  for (let i = 0, end = cartConcerts.value.length; i < end; i++) {
    total = total + (cartConcerts.value[i].qty || 0);
  }
  return total;
}

// Filter tickets - style prof: boucle for simple
function filterTickets() {
  const term = searchText.value.trim().toLowerCase();
  
  // vider d'abord la liste
  filteredTickets.value = [];
  
  if (!term) {
    // pas de filtre, tout montrer
    for (let i = 0, end = tickets.value.length; i < end; i++) {
      filteredTickets.value.push(tickets.value[i]);
    }
    return;
  }
  
  // loop door alle tickets
  for (let i = 0, end = tickets.value.length; i < end; i++) {
    const t = tickets.value[i];
    const visitorName = (t.first_name + ' ' + t.last_name).toLowerCase();
    const artist = (t.artist || '').toLowerCase();
    const venue = (t.venue || '').toLowerCase();
    
    if (visitorName.includes(term) || artist.includes(term) || venue.includes(term)) {
      filteredTickets.value.push(t);
    }
  }
}

function openBuyModal() {
  showErrors.value = false;
  selectedVisitorId.value = null;
  selectedConcertId.value = null;
  selectedQty.value = 1;
  cartConcerts.value = [];
  isBuyModalOpen.value = true;
}

function closeBuyModal() {
  isBuyModalOpen.value = false;
  cartConcerts.value = [];
}

// Ajouter concert au panier
function addConcertToCart() {
  if (!selectedConcertId.value) {
    showToast('Selecteer een concert', 'warning');
    return;
  }
  
  if (!selectedQty.value || selectedQty.value < 1) {
    showToast('Vul een geldig aantal in', 'warning');
    return;
  }
  
  // check si concert deja dans panier
  let found = false;
  for (let i = 0, end = cartConcerts.value.length; i < end; i++) {
    if (cartConcerts.value[i].concert_id === selectedConcertId.value) {
      // update quantity
      cartConcerts.value[i].qty = cartConcerts.value[i].qty + selectedQty.value;
      found = true;
      break;
    }
  }
  
  if (!found) {
    // ajouter nouveau concert
    cartConcerts.value.push({
      concert_id: selectedConcertId.value,
      qty: selectedQty.value
    });
  }
  
  showToast('Concert toegevoegd aan winkelmandje', 'success');
  
  // reset selection
  selectedConcertId.value = null;
  selectedQty.value = 1;
}

// Retirer concert du panier
function removeFromCart(index) {
  if (index >= 0 && index < cartConcerts.value.length) {
    cartConcerts.value.splice(index, 1);
  }
}

// Load initial data - style prof: axios calls simples
function loadInitialData() {
  loading.value = true;
  error.value = null;
  
  // charger tickets
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Tickets status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        tickets.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          tickets.value.push(data[i]);
        }
        filterTickets();
      }
    })
    .catch(e => {
      console.error('Tickets API Error:', e);
      error.value = 'Laden van tickets mislukt';
    });
  
  // charger visitors
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Visitors status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        allVisitors.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          allVisitors.value.push(data[i]);
        }
      }
    })
    .catch(e => {
      console.error('Visitors API Error:', e);
    });
  
  // charger concerts
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Concerts status niet 200:', response.status);
        loading.value = false;
        return;
      }
      
      const data = response.data.data || response.data;
      if (data && Array.isArray(data)) {
        allConcerts.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          allConcerts.value.push(data[i]);
        }
      }
      
      loading.value = false;
    })
    .catch(e => {
      console.error('Concerts API Error:', e);
      loading.value = false;
    });
}

// Load only tickets - style prof
function loadTicketsOnly() {
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Tickets status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        tickets.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          tickets.value.push(data[i]);
        }
        filterTickets();
      }
    })
    .catch(e => {
      console.error('Tickets reload error:', e);
    });
}

function handleRefresh(event) {
  loadInitialData();
  event.target.complete();
}

// Acheter tous les tickets du panier
function handleBuyAllTickets() {
  showErrors.value = true;
  
  // validatie
  if (!selectedVisitorId.value) {
    showToast('Selecteer een bezoeker', 'warning');
    return;
  }
  
  if (cartConcerts.value.length === 0) {
    showToast('Winkelmandje is leeg', 'warning');
    return;
  }

  buying.value = true;
  
  // loop door alle concerts in panier
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0, end = cartConcerts.value.length; i < end; i++) {
    const item = cartConcerts.value[i];
    const payload = {
      visitor_id: selectedVisitorId.value,
      concert_id: item.concert_id,
      qty: item.qty
    };
    
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', payload)
      .then(response => {
        successCount++;
        console.log('Ticket gekocht:', response.data);
        
        // als laatste item, toon resultaat
        if (successCount + errorCount === end) {
          finalizePurchase(successCount, errorCount);
        }
      })
      .catch(e => {
        errorCount++;
        console.error('Buy ticket error:', e);
        
        // als laatste item, toon resultaat
        if (successCount + errorCount === end) {
          finalizePurchase(successCount, errorCount);
        }
      });
  }
}

function finalizePurchase(successCount, errorCount) {
  buying.value = false;
  
  if (errorCount === 0) {
    showToast('Alle tickets succesvol gekocht!', 'success');
  } else if (successCount > 0) {
    showToast(successCount + ' tickets gekocht, ' + errorCount + ' mislukt', 'warning');
  } else {
    showToast('Aankoop mislukt', 'danger');
  }
  
  closeBuyModal();
  loadTicketsOnly();
}

async function handleDeleteTicket(ticketId) {
  const alert = await alertController.create({
    header: 'Ticket verwijderen?',
    message: 'Deze actie kan niet ongedaan worden gemaakt.',
    buttons: [
      {
        text: 'Annuleren',
        role: 'cancel'
      },
      {
        text: 'Verwijderen',
        role: 'destructive',
        handler: () => {
          axios
            .delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', {
              data: { id: ticketId }
            })
            .then(response => {
              showToast('Ticket verwijderd', 'medium');
              loadTicketsOnly();
            })
            .catch(e => {
              console.error('Delete error:', e);
              showToast('Verwijderen mislukt', 'danger');
            });
        }
      }
    ]
  });
  await alert.present();
}

// Lifecycle - style prof
onIonViewWillEnter(() => {
  loadInitialData();
});
</script>

<style scoped>
ion-content {
  --padding-bottom: 80px;
}

.welcome-card {
  padding: 12px 16px 8px;
}

.intro-text {
  font-size: 15px;
  color: var(--ion-color-medium-shade);
  line-height: 1.5;
  margin: 0;
}

.search-bar {
  padding: 8px 16px;
  --border-radius: 12px;
  --box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.ticket-card {
  margin: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.concert-title {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-dark);
  margin-top: 4px;
}

.info-list {
  background: transparent;
  padding: 0;
}

.info-list ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --min-height: 48px;
  margin-bottom: 8px;
}

.label-text {
  font-size: 13px;
  font-weight: 600;
  color: var(--ion-color-medium);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 2px;
}

.info-list h3 {
  font-size: 17px;
  font-weight: 600;
  color: var(--ion-color-dark);
  margin: 4px 0 0 0;
}

.qty-item {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--ion-color-light);
}

.qty-amount {
  font-size: 24px;
  font-weight: 700;
  color: var(--ion-color-success);
  margin: 4px 0 0 0;
}

.card-actions {
  padding: 0 16px 12px;
  gap: 8px;
}

.card-actions ion-button {
  font-weight: 600;
  font-size: 15px;
  --border-width: 2px;
}

ion-fab-button {
  --box-shadow: 0 4px 16px rgba(0,0,0,0.2);
}

ion-modal ion-list {
  background: transparent;
  padding: 8px 0;
}

ion-modal ion-item {
  --background: var(--ion-color-light);
  --border-radius: 12px;
  margin-bottom: 16px;
  --padding-start: 16px;
}

ion-modal ion-card {
  margin-bottom: 16px;
  border-radius: 12px;
}

ion-input, ion-select {
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-size: 16px;
}

ion-input.ion-invalid, ion-select.ion-invalid {
  --highlight-color-invalid: var(--ion-color-danger);
}

ion-chip {
  font-weight: 600;
  height: 28px;
}

.cart-card {
  background: var(--ion-color-light);
}

.cart-item {
  --background: var(--ion-background-color);
  --border-radius: 8px;
  margin-bottom: 8px;
}

.cart-summary {
  margin-top: 16px;
  padding-top: 12px;
  border-top: 2px solid var(--ion-color-medium);
  font-size: 16px;
}

.cart-summary p {
  margin: 8px 0;
}

@media (prefers-color-scheme: dark) {
  .ticket-card {
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
}
</style>