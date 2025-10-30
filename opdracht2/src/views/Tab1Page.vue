<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mijn Concerten</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal" fill="solid">
            <ion-icon slot="start" :icon="add" />
            Nieuw
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

      <div class="search-container">
        <ion-searchbar 
          v-model="zoekk" 
          placeholder="Zoek artiest of locatie..." 
          :debounce="300"
          show-clear-button="always"
        />
      </div>

  <ion-segment v-model="segg" mode="md">
        <ion-segment-button value="all">
          <ion-label>
            Alle
            <ion-badge color="light">{{ myConcerts.length }}</ion-badge>
          </ion-label>
        </ion-segment-button>
        <ion-segment-button value="upcoming">
          <ion-label>
            Komende
            <ion-badge color="success">{{ comingCnt }}</ion-badge>
          </ion-label>
        </ion-segment-button>
        <ion-segment-button value="past">
          <ion-label>
            Voorbij
            <ion-badge color="medium">{{ pastCnt }}</ion-badge>
          </ion-label>
        </ion-segment-button>
      </ion-segment>

      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-button fill="clear">
            <ion-icon slot="start" :icon="swapVertical" />
              <ion-select 
              v-model="sorta" 
              interface="action-sheet"
              placeholder="Sorteer op..."
              @ionChange="doSort()"
            >
              <ion-select-option value="date_desc">Nieuwste eerst</ion-select-option>
              <ion-select-option value="date_asc">Oudste eerst</ion-select-option>
              <ion-select-option value="price_desc">Prijs: hoog-laag</ion-select-option>
              <ion-select-option value="price_asc">Prijs: laag-hoog</ion-select-option>
            </ion-select>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>

  <ion-progress-bar v-if="isLoading" type="indeterminate" />

      <ion-list v-if="!isLoading && !error" lines="none">
        <ion-item-group v-if="concertsShownn.length === 0">
          <ion-item>
            <ion-label class="ion-text-center">
              <h2>Geen concerten gevonden</h2>
              <p>Voeg je eerste concert toe!</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

  <ion-card v-for="c in concertsShownn" :key="c.id" class="concert-card">
          <ion-card-header>
            <ion-card-subtitle>
              <ion-chip :color="isUpcom(c) ? 'success' : 'medium'" outline>
                <ion-icon :icon="isUpcom(c) ? calendar : checkmarkCircle" />
                <ion-label>{{ isUpcom(c) ? 'Komend evenement' : 'Afgelopen' }}</ion-label>
              </ion-chip>
            </ion-card-subtitle>
            <ion-card-title class="artist-title">
              {{ c.artist }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list class="info-list">
              <ion-item lines="none">
                <ion-icon :icon="location" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Locatie</p>
                  <h3>{{ c.venue }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none">
                <ion-icon :icon="calendar" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Datum</p>
                  <h3>{{ fmtDate(c.date) }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none">
                <ion-icon :icon="time" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Aanvang</p>
                  <h3>{{ fmtTime(c.time) }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none" class="price-item">
                <ion-icon :icon="card" slot="start" color="success" />
                <ion-label>
                  <p class="label-text">Ticket prijs</p>
                  <h2 class="price-amount">€ {{ fmtPrice(c.price) }}</h2>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>

          <ion-row class="card-actions">
            <ion-col>
              <ion-button expand="block" fill="outline" @click="openEditModal(c)">
                <ion-icon slot="start" :icon="pencil" />
                Wijzigen
              </ion-button>
            </ion-col>
            <ion-col>
              <ion-button expand="block" color="danger" fill="outline" @click="confirmDelete(c.id)">
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="secondary" @click="openAddModal">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>

    
    <ion-modal :is-open="modalIsOpen" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>{{ editingIdd ? 'Concert wijzigen' : 'Nieuw concert' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list>
          <ion-item>
            <ion-input 
              v-model="formm.artist" 
              label="Artiest" 
              label-placement="stacked"
              placeholder="Naam van de artiest"
              :counter="true"
              maxlength="100"
              error-text="Vul de naam van de artiest in"
              :class="{ 'ion-invalid': showErrs && !formm.artist }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="formm.venue" 
              label="Locatie" 
              label-placement="stacked"
              placeholder="Concertzaal of locatie"
              :counter="true"
              maxlength="100"
              error-text="Vul de locatie in"
              :class="{ 'ion-invalid': showErrs && !formm.venue }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="formm.date" 
              label="Datum" 
              label-placement="stacked"
              type="date"
              error-text="Selecteer een datum"
              :class="{ 'ion-invalid': showErrs && !formm.date }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="formm.time" 
              label="Aanvangstijd" 
              label-placement="stacked"
              type="time"
              error-text="Selecteer een tijd"
              :class="{ 'ion-invalid': showErrs && !formm.time }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model.number="formm.price" 
              label="Prijs (€)" 
              label-placement="stacked"
              type="number"
              inputmode="decimal"
              placeholder="0.00"
              min="0"
              step="0.01"
              error-text="Vul een geldige prijs in"
              :class="{ 'ion-invalid': showErrs && (formm.price === null || formm.price < 0) }"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
            <ion-button 
            expand="block" 
            size="large"
            @click="saveConcert" 
            :disabled="isSaving"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
              {{ editingIdd ? 'Wijzigingen opslaan' : 'Concert toevoegen' }}
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
import { ref, inject, watch } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonToast, IonInput, IonSearchbar, IonSegment, IonSegmentButton,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonFab, IonFabButton, IonChip, IonBadge, IonModal, IonProgressBar, IonSelect, IonSelectOption,
  IonRefresher, IonRefresherContent, IonItemGroup, IonRow, IonCol,
  onIonViewWillEnter, alertController
} from '@ionic/vue';
import { add, pencil, trash, calendar, time, location, card, checkmarkCircle, swapVertical } from 'ionicons/icons';

const axios = inject('axios');

 
const isLoading = ref(false);
const isSaving = ref(false);
const error = ref(null);
const modalIsOpen = ref(false);
const showErrs = ref(false);
const toast = ref({ open: false, msg: '', color: 'success' });

const myConcerts = ref([]);
const concertsShownn = ref([]);
const zoekk = ref('');
const segg = ref('all');
const sorta = ref('date_desc');
const editingIdd = ref(null);
const formm = ref({ artist: '', date: '', time: '', venue: '', price: null });

const comingCnt = ref(0);
const pastCnt = ref(0);

const todayIso = new Date().toISOString().slice(0, 10);

function fmtDate(d) {
  if (!d) return '';
  const parts = d.split('-');
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function fmtTime(t) {
  if (!t) return '';
  return t.slice(0, 5);
}

function fmtPrice(p) {
  const v = parseFloat(p);
  if (isNaN(v)) return '0.00';
  return v.toFixed(2);
}

function normDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return y + '-' + m + '-' + dd;
}

function normTime(isoTime) {
  if (!isoTime) return '';
  const t = isoTime.split('T')[1] || isoTime;
  const parts = t.split(':');
  return parts[0] + ':' + parts[1] + ':00';
}

function isUpcom(c) {
  const d = new Date(c.date);
  const today = new Date();
  const eventDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  const currentDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return eventDate >= currentDate;
}

function toasty(message, color) {
  toast.value.open = true;
  toast.value.msg = message;
  toast.value.color = color;
}

function doFilter() {
  const term = zoekk.value.trim().toLowerCase();
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  concertsShownn.value = [];
  
  for (let i = 0, end = myConcerts.value.length; i < end; i++) {
    const c = myConcerts.value[i];
    
    let matches = true;
    if (term) {
      const artist = (c.artist || '').toLowerCase();
      const venue = (c.venue || '').toLowerCase();
      matches = artist.includes(term) || venue.includes(term);
    }
    
    if (!matches) continue;
    
    if (segg.value === 'upcoming') {
      const d = new Date(c.date);
      const eventDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (eventDate < today) continue;
    } else if (segg.value === 'past') {
      const d = new Date(c.date);
      const eventDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      if (eventDate >= today) continue;
    }
    
    concertsShownn.value.push(c);
  }
  
  doSort();
}

function doSort() {
  const arr = concertsShownn.value;
  const len = arr.length;
  
  for (let i = 0; i < len - 1; i++) {
    for (let j = 0; j < len - i - 1; j++) {
      const a = arr[j];
      const b = arr[j + 1];
      
      let shouldSwap = false;
  if (sorta.value === 'date_desc') {
        const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
        const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
        shouldSwap = dateA < dateB;
      } else if (sorta.value === 'date_asc') {
        const dateA = new Date(a.date + 'T' + (a.time || '00:00'));
        const dateB = new Date(b.date + 'T' + (b.time || '00:00'));
        shouldSwap = dateA > dateB;
      } else if (sorta.value === 'price_desc') {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        shouldSwap = priceA < priceB;
      } else if (sorta.value === 'price_asc') {
        const priceA = Number(a.price) || 0;
        const priceB = Number(b.price) || 0;
        shouldSwap = priceA > priceB;
  }
      
      if (shouldSwap) {
        const temp = arr[j];
        arr[j] = arr[j + 1];
        arr[j + 1] = temp;
      }
    }
  }
}

function updCounts() {
  let upcoming = 0;
  let past = 0;
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  
  for (let i = 0, end = myConcerts.value.length; i < end; i++) {
    const c = myConcerts.value[i];
    const d = new Date(c.date);
    const eventDate = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    
    if (eventDate >= today) {
      upcoming++;
    } else {
      past++;
    }
  }
  
  comingCnt.value = upcoming;
  pastCnt.value = past;
}

function openAddModal() {
  showErrs.value = false;
  editingIdd.value = null;
  formm.value = {
    artist: '',
    venue: '',
    price: null,
    date: todayIso,
    time: '20:00'
  };
  modalIsOpen.value = true;
}

function openEditModal(concert) {
  showErrs.value = false;
  editingIdd.value = concert.id;
  formm.value = {
    artist: concert.artist || '',
    venue: concert.venue || '',
    price: Number(concert.price) || 0,
    date: concert.date || todayIso,
    time: (concert.time || '20:00').slice(0, 5)
  };
  modalIsOpen.value = true;
}

function closeModal() {
  modalIsOpen.value = false;
  editingIdd.value = null;
}

function loadConcerts() {
  isLoading.value = true;
  error.value = null;
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php')
    .then(response => {
      if (response.status !== 200) {
      console.log('Status niet 200:', response.status);
      error.value = 'Laden mislukt';
      isLoading.value = false;
      return;
      }
      
      const data = response.data.data || response.data;
      if (!Array.isArray(data)) {
      console.log('Data is geen array');
      error.value = 'Geen data';
      isLoading.value = false;
      return;
      }
      
      myConcerts.value = [];
      for (let i = 0, end = data.length; i < end; i++) {
        myConcerts.value.push(data[i]);
      }
      
      updCounts();
      doFilter();
      
  isLoading.value = false;
    })
    .catch(e => {
      console.error('API Error:', e);
      error.value = 'Er ging iets mis bij het laden';
      toasty('Laden mislukt', 'danger');
      isLoading.value = false;
    });
}

function handleRefresh(event) {
  loadConcerts();
  event.target.complete();
}

function saveConcert() {
  showErrs.value = true;

  if (!formm.value.artist || !formm.value.artist.trim()) {
    toasty('Vul de artiest in', 'warning');
    return;
  }
  if (!formm.value.venue || !formm.value.venue.trim()) {
    toasty('Vul de locatie in', 'warning');
    return;
  }
  if (!formm.value.date) {
    toasty('Selecteer een datum', 'warning');
    return;
  }
  if (!formm.value.time) {
    toasty('Selecteer een tijd', 'warning');
    return;
  }
  if (formm.value.price === null || formm.value.price < 0) {
    toasty('Vul een geldige prijs in', 'warning');
    return;
  }
  isSaving.value = true;

  const payload = {
    artist: formm.value.artist.trim(),
    date: normDate(formm.value.date),
    time: normTime(formm.value.time),
    venue: formm.value.venue.trim(),
    price: Number(formm.value.price)
  };

  if (editingIdd.value) {
    payload.id = editingIdd.value;
    axios
      .put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', payload)
      .then(response => {
        toasty('Concert succesvol gewijzigd', 'success');
        closeModal();
        loadConcerts();
        isSaving.value = false;
      })
      .catch(e => {
        console.error('Update error:', e);
        toasty('Wijzigen mislukt', 'danger');
        isSaving.value = false;
      });
  } else {
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', payload)
      .then(response => {
        toasty('Concert succesvol toegevoegd', 'success');
        closeModal();
        loadConcerts();
        isSaving.value = false;
      })
      .catch(e => {
        console.error('Create error:', e);
        toasty('Toevoegen mislukt', 'danger');
        isSaving.value = false;
      });
  }
}
//zzzzzzzz
async function confirmDelete(id) {
  const alert = await alertController.create({
    header: 'Concert verwijderen?',
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
            .delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', { data: { id: id } })
            .then(response => {
              toasty('Concert verwijderd', 'medium');
              loadConcerts();
            })
            .catch(e => {
              console.error('Delete error:', e);
              toasty('Verwijderen mislukt', 'danger');
            });
        }
      }
    ]
  });
  await alert.present();
}

onIonViewWillEnter(() => {
  loadConcerts();
});
watch([zoekk, segg], () => {
  doFilter();
});

watch(sorta, () => {
  doSort();
});

watch(myConcerts, () => {
  updCounts();
  doFilter();
}, { deep: true });
</script>

<style scoped>
ion-content {
  --padding-bottom: 80px;
}

.search-container {
  padding: 12px 16px 8px;
}

ion-searchbar {
  --border-radius: 12px;
  --box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

ion-segment {
  margin: 8px 16px 12px;
  --background: var(--ion-color-light);
}

ion-segment-button {
  --indicator-height: 3px;
  font-size: 15px;
  font-weight: 600;
}

ion-segment-button ion-label {
  display: flex;
  align-items: center;
  gap: 6px;
}

ion-badge {
  font-weight: 700;
  font-size: 12px;
}

.concert-card {
  margin: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.artist-title {
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

.price-item {
  margin-top: 8px;
  padding-top: 8px;
  border-top: 1px solid var(--ion-color-light);
}

.price-amount {
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

ion-input {
  --padding-top: 12px;
  --padding-bottom: 12px;
  font-size: 16px;
}

ion-input.ion-invalid {
  --highlight-color-invalid: var(--ion-color-danger);
}

ion-chip {
  font-weight: 600;
  height: 28px;
}

@media (prefers-color-scheme: dark) {
  .concert-card {
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
}
</style>