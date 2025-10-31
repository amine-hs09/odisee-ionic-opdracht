<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mijn Tickets</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="ouvrirModaallAchatt" fill="solid">
            <ion-icon slot="start" :icon="add" />
            Koop Tickets
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="gererrrActuallisationn">
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
        v-model="recherrcheTxxtt" 
        placeholder="Zoek op bezoeker of concert..." 
        :debounce="300"
        show-clear-button="always"
        class="search-bar"
        @ionInput="filltrerTickkets()"
      />

      <ion-progress-bar v-if="enChargementt" type="indeterminate" />

      <ion-list v-if="!enChargementt && !erreurr" lines="none">
        <ion-item-group v-if="tickkettsFilttres.length === 0">
          <ion-item>
            <ion-label class="ion-text-center">
              <h2>Geen tickets gevonden</h2>
              <p>Koop je eerste ticket!</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-card v-for="ticket in tickkettsFilttres" :key="ticket.id" class="ticket-card">
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

              <ion-item lines="none">
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
              <ion-button expand="block" color="danger" fill="outline" @click="gererrrSuppriimerTickkett(ticket.id)">
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="secondary" @click="ouvrirModaallAchatt">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    <ion-modal :is-open="modalAchattOuvertte" @didDismiss="ferrrmerModaallAchatt">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Tickets Kopen</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="ferrrmerModaallAchatt">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-header>
            <ion-card-title>Stap 1: Kies Bezoeker</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-select 
                v-model="idGuerrierSelectionnee" 
                label="Bezoeker" 
                label-placement="stacked"
                interface="action-sheet"
                placeholder="Selecteer een bezoeker"
                :class="{ 'ion-invalid': afficherrErrorrs && !idGuerrierSelectionnee }"
              >
                <ion-select-option v-for="visitor in toussLesGuerrierrs" :key="visitor.id" :value="visitor.id">
                  {{ visitor.first_name }} {{ visitor.last_name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-card-content>
        </ion-card>

        <ion-card>
          <ion-card-header>
            <ion-card-title>Stap 2: Voeg Concerten Toe</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-item>
              <ion-select 
                v-model="idConcceerrtSelectionnee" 
                label="Concert" 
                label-placement="stacked"
                interface="action-sheet"
                placeholder="Selecteer een concert"
              >
                <ion-select-option v-for="concert in toussLesConcceerrtts" :key="concert.id" :value="concert.id">
                  {{ concert.artist }} - {{ concert.venue }}
                </ion-select-option>
              </ion-select>
            </ion-item>

            <ion-item>
              <ion-input 
                v-model.number="quantiteeSelectionnee" 
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

        <ion-card v-if="paanierConcceerrtts.length > 0" class="cart-card">
          <ion-card-header>
            <ion-card-title>Winkelmandje</ion-card-title>
            <ion-card-subtitle>{{ paanierConcceerrtts.length }} concert(en)</ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <ion-list lines="none">
              <ion-item v-for="(item, index) in paanierConcceerrtts" :key="index" class="cart-item">
                <ion-label>
                  <h3>{{ obtenirNommConcceerrt(item.concert_id) }}</h3>
                  <p>Aantal: {{ item.qty }}</p>
                </ion-label>
                <ion-button 
                  slot="end" 
                  fill="clear" 
                  color="danger" 
                  @click="rettirerDuPaanierr(index)"
                >
                  <ion-icon :icon="trash" />
                </ion-button>
              </ion-item>
            </ion-list>

            <div class="cart-summary">
              <p><strong>Totaal tickets:</strong> {{ obtenirTotaalTickkets() }}</p>
            </div>
          </ion-card-content>
        </ion-card>

        <div class="ion-padding-top" v-if="paanierConcceerrtts.length > 0">
          <ion-button 
            expand="block" 
            size="large"
            color="success"
            @click="gererrrAchattTousLesTickkets"
            :disabled="enAchatt || !idGuerrierSelectionnee"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Koop Alle Tickets
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <ion-toast 
      :is-open="notiffiCombatt.open" 
      :message="notiffiCombatt.msg" 
      :color="notiffiCombatt.color" 
      :duration="2500"
      position="top"
      @didDismiss="notiffiCombatt.open = false"
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

const tickkettsListe = ref([]);
const tickkettsFilttres = ref([]);
const toussLesGuerrierrs = ref([]);
const toussLesConcceerrtts = ref([]);
const enChargementt = ref(false);
const enAchatt = ref(false);
const erreurr = ref(null);
const modalAchattOuvertte = ref(false);
const afficherrErrorrs = ref(false);
const recherrcheTxxtt = ref('');

const idGuerrierSelectionnee = ref(null);
const idConcceerrtSelectionnee = ref(null);
const quantiteeSelectionnee = ref(1);
const paanierConcceerrtts = ref([]);

const notiffiCombatt = ref({ open: false, msg: '', color: 'success' });

function formatDate(d) {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length !== 3) return d;
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function showToast(message, color) {
  notiffiCombatt.value.open = true;
  notiffiCombatt.value.msg = message;
  notiffiCombatt.value.color = color;
}

function obtenirNommConcceerrt(concceerrtIdd) {
  for (let i = 0, end = toussLesConcceerrtts.value.length; i < end; i++) {
    if (toussLesConcceerrtts.value[i].id === concceerrtIdd) {
      return toussLesConcceerrtts.value[i].artist + ' - ' + toussLesConcceerrtts.value[i].venue;
    }
  }
  return 'Concert';
}

function obtenirTotaalTickkets() {
  let total = 0;
  for (let i = 0, end = paanierConcceerrtts.value.length; i < end; i++) {
    total = total + (paanierConcceerrtts.value[i].qty || 0);
  }
  return total;
}

function filltrerTickkets() {
  const term = recherrcheTxxtt.value.trim().toLowerCase();
  
  tickkettsFilttres.value = [];
  
  if (!term) {
    for (let i = 0, end = tickkettsListe.value.length; i < end; i++) {
      tickkettsFilttres.value.push(tickkettsListe.value[i]);
    }
    return;
  }
  
  for (let i = 0, end = tickkettsListe.value.length; i < end; i++) {
    const t = tickkettsListe.value[i];
    const visitorName = (t.first_name + ' ' + t.last_name).toLowerCase();
    const artist = (t.artist || '').toLowerCase();
    const venue = (t.venue || '').toLowerCase();
    
    if (visitorName.includes(term) || artist.includes(term) || venue.includes(term)) {
      tickkettsFilttres.value.push(t);
    }
  }
}

function ouvrirModaallAchatt() {
  afficherrErrorrs.value = false;
  idGuerrierSelectionnee.value = null;
  idConcceerrtSelectionnee.value = null;
  quantiteeSelectionnee.value = 1;
  paanierConcceerrtts.value = [];
  modalAchattOuvertte.value = true;
}

function ferrrmerModaallAchatt() {
  modalAchattOuvertte.value = false;
  paanierConcceerrtts.value = [];
}

function addConcertToCart() {
  if (!idConcceerrtSelectionnee.value) {
    showToast('Selecteer een concert', 'warning');
    return;
  }
  
  if (!quantiteeSelectionnee.value || quantiteeSelectionnee.value < 1) {
    showToast('Vul een geldig aantal in', 'warning');
    return;
  }
  
  let found = false;
  for (let i = 0, end = paanierConcceerrtts.value.length; i < end; i++) {
    if (paanierConcceerrtts.value[i].concert_id === idConcceerrtSelectionnee.value) {
      paanierConcceerrtts.value[i].qty = paanierConcceerrtts.value[i].qty + quantiteeSelectionnee.value;
      found = true;
      break;
    }
  }
  
  if (!found) {
    paanierConcceerrtts.value.push({
      concert_id: idConcceerrtSelectionnee.value,
      qty: quantiteeSelectionnee.value
    });
  }
  
  showToast('Concert toegevoegd aan winkelmandje', 'success');
  
  idConcceerrtSelectionnee.value = null;
  quantiteeSelectionnee.value = 1;
}

function rettirerDuPaanierr(index) {
  if (index >= 0 && index < paanierConcceerrtts.value.length) {
    paanierConcceerrtts.value.splice(index, 1);
  }
}

function chargeerDonneesInittiallees() {
  enChargementt.value = true;
  erreurr.value = null;
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Tickets status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        tickkettsListe.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          tickkettsListe.value.push(data[i]);
        }
        filltrerTickkets();
      }
    })
    .catch(e => {
      console.error('Tickets API Error:', e);
      erreurr.value = 'Laden van tickets mislukt';
    });
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Visitors status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        toussLesGuerrierrs.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          toussLesGuerrierrs.value.push(data[i]);
        }
      }
    })
    .catch(e => {
      console.error('Visitors API Error:', e);
    });
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Concerts status niet 200:', response.status);
        enChargementt.value = false;
        return;
      }
      
      const data = response.data.data || response.data;
      if (data && Array.isArray(data)) {
        toussLesConcceerrtts.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          toussLesConcceerrtts.value.push(data[i]);
        }
      }
      
      enChargementt.value = false;
    })
    .catch(e => {
      console.error('Concerts API Error:', e);
      enChargementt.value = false;
    });
}

function chargeerTickkettsSeulementt() {
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php')
    .then(response => {
      if (response.status !== 200) {
        console.log('Tickets status niet 200:', response.status);
        return;
      }
      
      const data = response.data.data;
      if (data && Array.isArray(data)) {
        tickkettsListe.value = [];
        for (let i = 0, end = data.length; i < end; i++) {
          tickkettsListe.value.push(data[i]);
        }
        filltrerTickkets();
      }
    })
    .catch(e => {
      console.error('Tickets reload error:', e);
    });
}

function gererrrActuallisationn(event) {
  chargeerDonneesInittiallees();
  event.target.complete();
}

function gererrrAchattTousLesTickkets() {
  afficherrErrorrs.value = true;
  
  if (!idGuerrierSelectionnee.value) {
    showToast('Selecteer een bezoeker', 'warning');
    return;
  }
  
  if (paanierConcceerrtts.value.length === 0) {
    showToast('Winkelmandje is leeg', 'warning');
    return;
  }

  enAchatt.value = true;
  
  let successCount = 0;
  let errorCount = 0;
  
  for (let i = 0, end = paanierConcceerrtts.value.length; i < end; i++) {
    const item = paanierConcceerrtts.value[i];
    const payload = {
      visitor_id: idGuerrierSelectionnee.value,
      concert_id: item.concert_id,
      qty: item.qty
    };
    
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', payload)
      .then(response => {
        successCount++;
        console.log('Ticket gekocht:', response.data);
        
        if (successCount + errorCount === end) {
          finaliiserAchatt(successCount, errorCount);
        }
      })
      .catch(e => {
        errorCount++;
        console.error('Buy ticket error:', e);
        
        if (successCount + errorCount === end) {
          finaliiserAchatt(successCount, errorCount);
        }
      });
  }
}

function finaliiserAchatt(successCount, errorCount) {
  enAchatt.value = false;
  
  if (errorCount === 0) {
    showToast('Alle tickets succesvol gekocht!', 'success');
  } else if (successCount > 0) {
    showToast(successCount + ' tickets gekocht, ' + errorCount + ' mislukt', 'warning');
  } else {
    showToast('Aankoop mislukt', 'danger');
  }
  
  ferrrmerModaallAchatt();
  chargeerTickkettsSeulementt();
}

async function gererrrSuppriimerTickkett(tickketIdd) {
  const allertee = await alertController.create({
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
              data: { id: tickketIdd }
            })
            .then(response => {
              showToast('Ticket verwijderd', 'medium');
              chargeerTickkettsSeulementt();
            })
            .catch(e => {
              console.error('Delete error:', e);
              showToast('Verwijderen mislukt', 'danger');
            });
        }
      }
    ]
  });
  await allertee.present();
}

onIonViewWillEnter(() => {
  chargeerDonneesInittiallees();
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