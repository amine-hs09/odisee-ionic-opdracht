<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Concerten</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openAddModal">
            <ion-icon :icon="add" />
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <ion-searchbar v-model="search" placeholder="Zoek op artiest of locatie" :debounce="300" aria-label="Zoek concerten" class="big-search" />

      <div class="controls">
        <ion-segment v-model="segment" aria-label="Filter concerten" class="big-segment">
          <ion-segment-button value="all">Alle <ion-badge class="seg-badge">{{ concerts.length }}</ion-badge></ion-segment-button>
          <ion-segment-button value="upcoming">Komend <ion-badge class="seg-badge">{{ upcomingCount }}</ion-badge></ion-segment-button>
          <ion-segment-button value="past">Voorbij <ion-badge class="seg-badge">{{ pastCount }}</ion-badge></ion-segment-button>
        </ion-segment>
      </div>

      <template v-if="loading">
        <ion-skeleton-text animated style="width:100%; height:18px; margin:8px 0" />
      </template>

      <template v-if="error && !loading">
        <ion-card color="danger" class="ion-margin">
          <ion-card-content>
            <p>{{ error }}</p>
            <ion-button expand="block" @click="loadConcerts">Opnieuw proberen</ion-button>
          </ion-card-content>
        </ion-card>
      </template>

      <ion-list>
        <ion-card v-for="c in filteredConcerts" :key="c.id" class="concert-card" role="article" :aria-label="`Concert ${c.artist} in ${c.venue}`">
          <ion-card-header>
            <ion-card-title class="large-title">
              <span class="artist-emoji" aria-hidden="true">🧑‍🎤</span>
              <span class="artist-name">{{ c.artist }}</span>
              <ion-badge class="status-badge" :color="isUpcoming(c) ? 'success' : 'medium'">{{ isUpcoming(c) ? 'Komend' : 'Voorbij' }}</ion-badge>
            </ion-card-title>
            <ion-card-subtitle class="large-sub">
              <span class="loc-emoji" aria-hidden="true">📍</span>
              <span class="venue-text">{{ c.venue }}</span>
              <span class="sep"> — </span>
              <span class="date-emoji" aria-hidden="true">📅</span>
              <span class="date-text">{{ formatDate(c.date) }}</span>
              <span class="time-emoji" aria-hidden="true">🕒</span>
              <span class="time-text">{{ formatTime(c.time) }}</span>
            </ion-card-subtitle>
          </ion-card-header>
          <ion-card-content>
            <div class="price-row">
              <div class="price-label"><span class="money-emoji" aria-hidden="true">💰</span> Prijs</div>
              <div class="price-value"><span class="price-emoji" aria-hidden="true">🪙</span> € {{ formatPrice(c.price) }}</div>
            </div>
          </ion-card-content>
          <!-- Custom separator / quick action for elderly users -->
          <ion-item lines="full" button class="separator" @click="quickPurchase(c)">
            <ion-label class="separator-label">Acheter ce concert — appuyez ici pour être guidé</ion-label>
            <ion-badge color="tertiary">Acheter</ion-badge>
          </ion-item>

          <div class="card-actions">
            <div class="action-col">
              <ion-button expand="block" size="large" fill="outline" @click="openEditModal(c)" :aria-label="`Wijzig concert ${c.artist}`">
                <ion-icon slot="start" :icon="pencil" />
                <span class="btn-emoji" aria-hidden="true">✏️</span>
                Wijzig
              </ion-button>
            </div>
            <div class="action-col">
                <ion-button expand="block" size="large" color="danger" @click="confirmDelete(c.id)" :aria-label="`Verwijder concert ${c.artist}`">
                  <ion-icon slot="start" :icon="trash" />
                  <span class="btn-emoji" aria-hidden="true">🗑️</span>
                  Verwijder
                </ion-button>
            </div>
          </div>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button @click="openAddModal" size="large" aria-label="Nieuw concert toevoegen">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>

      <!-- Modal form -->
      <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
        <ion-header>
          <ion-toolbar>
            <ion-title>{{ editingConcertId ? 'Concert Wijzigen' : 'Nieuw concert' }}</ion-title>
            <ion-buttons slot="end"><ion-button @click="closeModal">Annuleren</ion-button></ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <ion-list>
            <ion-item>
              <ion-label class="form-label" position="stacked">Artiest <span aria-hidden="true">*</span></ion-label>
              <ion-input v-model="form.artist" placeholder="bv. John Doe" class="big-input" aria-required="true" />
            </ion-item>
            <ion-note color="danger" v-if="showErrors && !form.artist">Artiest is verplicht</ion-note>

            <ion-item>
              <ion-label class="form-label" position="stacked">Locatie <span aria-hidden="true">*</span></ion-label>
              <ion-input v-model="form.venue" placeholder="bv. Stadsschouwburg" class="big-input" aria-required="true" />
            </ion-item>
            <ion-note color="danger" v-if="showErrors && !form.venue">Locatie is verplicht</ion-note>

            <ion-item>
              <ion-label class="form-label" position="stacked">Prijs (€)</ion-label>
              <ion-input v-model.number="form.price" type="number" inputmode="decimal" placeholder="25.50" class="big-input" />
            </ion-item>
            <ion-note color="danger" v-if="showErrors && (form.price === null || form.price < 0)">Voer een geldige prijs in</ion-note>

            <ion-item>
              <ion-label class="form-label" position="stacked">Datum</ion-label>
              <ion-input v-model="form.date" type="date" class="big-input" />
            </ion-item>
            <ion-item>
              <ion-label class="form-label" position="stacked">Tijd</ion-label>
              <ion-input v-model="form.time" type="time" class="big-input" />
            </ion-item>

            <div style="margin-top:18px">
              <ion-button expand="block" size="large" @click="handleSaveConcert" :disabled="saving">{{ editingConcertId ? 'Opslaan' : 'Toevoegen' }}</ion-button>
            </div>
          </ion-list>
        </ion-content>
      </ion-modal>

      <ion-toast :is-open="toast.open" :message="toast.msg" :color="toast.color" duration="2000" />
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, computed, inject } from 'vue';
import axiosLib from 'axios';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonButton, IonIcon,
  IonList, IonItem, IonLabel, IonNote, IonText, IonToast, IonModal, IonInput,
  IonDatetime, IonDatetimeButton, IonSearchbar, IonSegment, IonSegmentButton,
  IonRefresher, IonRefresherContent, IonSkeletonText, IonCard, IonCardHeader,
  IonCardContent, IonCardTitle, IonFab, IonFabButton, IonItemSliding, IonItemOptions,
  IonItemOption, onIonViewWillEnter, alertController, IonListHeader
} from '@ionic/vue';
import { add, pencil, trash } from 'ionicons/icons';
import { IonBadge } from '@ionic/vue';
import { useRouter } from 'vue-router';

const injectedAxios = inject('axios'); // try injected axios (if app configured)
const axios = injectedAxios ?? axiosLib;

// UI state
const loading = ref(true);
const saving = ref(false);
const error = ref(null);
const isModalOpen = ref(false);
const showErrors = ref(false);
const toast = ref({ open: false, msg: '', color: 'success', position: 'bottom' });

// data
const concerts = ref([]);
const search = ref('');
const segment = ref('all'); // all | upcoming | past
const editingConcertId = ref(null);

// form model
const form = ref({ artist: '', date: '', time: '', venue: '', price: null });

// Dates
const todayIso = new Date().toISOString().slice(0, 10);
const maxDate = '2100-12-31';

// ===== Helpers
const isValid = computed(() => {
  return !!form.value.artist?.trim()
    && !!form.value.venue?.trim()
    && !!form.value.date
    && !!form.value.time
    && form.value.price !== null
    && Number(form.value.price) >= 0;
});

const filteredConcerts = computed(() => {
  const term = search.value.trim().toLowerCase();
  const now = new Date();
  return concerts.value.filter(c => {
    const matches = !term
      || c.artist?.toLowerCase().includes(term)
      || c.venue?.toLowerCase().includes(term);
    if (!matches) return false;

    if (segment.value === 'upcoming') return isAfterOrSame(dayFrom(c.date), dayFrom(now));
    if (segment.value === 'past') return isBefore(dayFrom(c.date), dayFrom(now));
    return true;
  });
});

const upcomingCount = computed(() => concerts.value.filter(c => isUpcoming(c)).length);
const pastCount = computed(() => concerts.value.filter(c => !isUpcoming(c)).length);

function isUpcoming(c) {
  try {
    const d = new Date(c.date);
    const today = new Date();
    // compare only date portion
    const a = new Date(d.getFullYear(), d.getMonth(), d.getDate());
    const b = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    return a.getTime() >= b.getTime();
  } catch (e) { return false; }
}

const router = useRouter();

function quickPurchase(concert) {
  // navigate to visitors tab with purchase action and concert details in query
  router.push({ path: '/tabs/tab2', query: {
    action: 'purchase',
    concertId: concert.id,
    artist: concert.artist,
    venue: concert.venue,
    date: concert.date,
    time: concert.time,
    price: concert.price
  }});
}

function dayFrom(d) { const x = new Date(d); return new Date(x.getFullYear(), x.getMonth(), x.getDate()); }
function isBefore(a, b){ return a.getTime() < b.getTime(); }
function isAfterOrSame(a, b){ return a.getTime() >= b.getTime(); }
function formatDate(d) { if (!d) return ''; const [y,m,dd] = d.split('-'); return `${dd}/${m}/${y}`; }
function formatTime(t) { if (!t) return ''; return t.slice(0,5); }
function formatPrice(p) { const v = parseFloat(p ?? 0); return v.toFixed(2); }

// Normalisation vers API
function normalizeDate(isoDate) {
  if (!isoDate) return '';
  const d = new Date(isoDate);
  const y = d.getFullYear();
  const m = String(d.getMonth()+1).padStart(2,'0');
  const dd = String(d.getDate()).padStart(2,'0');
  return `${y}-${m}-${dd}`;
}
function normalizeTime(isoTime) {
  if (!isoTime) return '';
  const t = isoTime.split('T')[1] || isoTime;
  const [hh, mm='00', ss='00'] = t.split(':');
  return `${hh}:${mm}:${ss.slice(0,2)}`;
}

// Toast helper
async function presentToast(message, color='success', position='bottom') {
  toast.value = { open: true, msg: message, color, position };
}

// Actions UI
function openAddModal() {
  showErrors.value = false;
  editingConcertId.value = null;
  form.value = {
    artist: '',
    venue: '',
    price: null,
    date: todayIso,
    time: '20:00'
  };
  isModalOpen.value = true;
}
function openEditModal(concert) {
  showErrors.value = false;
  editingConcertId.value = concert.id;
  const hhmm = (concert.time ?? '20:00').slice(0,5);
  form.value = {
    artist: concert.artist ?? '',
    venue: concert.venue ?? '',
    price: Number(concert.price ?? 0),
    date: concert.date ?? todayIso,
    time: hhmm
  };
  isModalOpen.value = true;
}
function closeModal() { isModalOpen.value = false; editingConcertId.value = null; }

// API
async function loadConcerts() {
  loading.value = true; error.value = null;
  try {
    const res = await axios.get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php');
    const arr = Array.isArray(res.data?.data) ? res.data.data : (Array.isArray(res.data) ? res.data : []);
    concerts.value = arr;
  } catch (e) {
    console.error(e);
    error.value = 'Laden mislukt. Controleer je verbinding of probeer later opnieuw.';
  } finally {
    loading.value = false;
  }
}

async function handleSaveConcert() {
  showErrors.value = true;
  if (!isValid.value) { await presentToast('Vul alle velden correct in.', 'warning', 'middle'); return; }
  saving.value = true;
  try {
    const payload = {
      artist: form.value.artist.trim(),
      date: normalizeDate(form.value.date),
      time: normalizeTime(form.value.time),
      venue: form.value.venue.trim(),
      price: Number(form.value.price)
    };
    let res;
    if (editingConcertId.value) {
      res = await axios.put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', { id: editingConcertId.value, ...payload });
      await presentToast(res.data?.message || 'Concert bijgewerkt!', 'success', 'top');
    } else {
      res = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', payload);
      await presentToast(res.data?.message || 'Concert toegevoegd!', 'success', 'top');
    }
    closeModal();
    await loadConcerts();
  } catch (e) {
    console.error(e);
    await presentToast(e?.response?.data?.message || 'Opslaan mislukt.', 'danger', 'middle');
  } finally {
    saving.value = false;
  }
}

async function confirmDelete(id) {
  const alert = await alertController.create({
    header: 'Verwijderen bevestigen',
    message: 'Weet u zeker dat u dit concert wilt verwijderen?',
    buttons: [
      { text: 'Annuleren', role: 'cancel' },
      {
        text: 'Verwijderen',
        role: 'destructive',
        handler: async () => {
          try {
            const res = await axios.delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php', { data: { id } });
            await presentToast(res.data?.message || 'Concert verwijderd', 'danger', 'bottom');
            await loadConcerts();
          } catch (e) {
            console.error(e);
            await presentToast(e?.response?.data?.message || 'Verwijderen mislukt.', 'danger', 'middle');
          }
        }
      }
    ]
  });
  await alert.present();
}

// lifecycle
onIonViewWillEnter(loadConcerts);
</script>

<style scoped>
/* Liste */
.list-row { --min-height: 72px; }
.title { font-weight: 800; font-size: 1.15rem; }
.muted { color: var(--ion-color-medium-shade); }

/* Accessibility: larger baseline */
ion-page, ion-content { font-size: 1.05rem; }

/* Bigger search and segment for older users */
.big-search { --padding-start: 12px; --padding-end: 12px; height: 52px; }
.big-segment { --min-height: 44px; margin-top:8px; }

/* Card visuals */
.large-title { font-size: 1.25rem; font-weight: 800; }
.large-sub { font-size: 1rem; color: var(--ion-color-medium); }
.concert-card { margin-bottom: 12px; padding-bottom: 6px; }
.price-row { display:flex; justify-content:space-between; align-items:center; font-size:1.1rem; margin-top:6px; }
.price-value { font-weight:700; }

/* Card action buttons larger and side-by-side */
.card-actions { display:grid; grid-template-columns: 1fr 1fr; gap:8px; padding: 12px; }
.action-col ion-button { --padding-top: 10px; --padding-bottom: 10px; font-size:1.05rem; }

/* Form inputs larger */
.big-input { font-size:1.05rem; padding: 10px 6px; }
.form-label { font-weight:700; font-size:1.05rem; }

/* Emoji and color decorations */
.artist-emoji { margin-right:8px; font-size:1.2rem; vertical-align:middle; }
.artist-name { color:#7b1fa2; font-weight:800; }
.price-emoji { margin-right:6px; font-size:1.05rem; }
.money-emoji { margin-right:6px; }
.price-value { color: #f1c40f; }
.loc-emoji, .date-emoji, .time-emoji { margin-right:6px; }
.venue-text, .date-text, .time-text { margin-right:8px; }
.btn-emoji { margin-left:6px; margin-right:6px; }

.seg-badge { margin-left:8px; --background: var(--ion-color-light); color: var(--ion-color-dark); font-weight:700; }
.status-badge { margin-left:12px; font-weight:700; }
.separator { background: var(--ion-color-step-50); border-radius:8px; margin:6px 0; --padding-start:12px; --padding-end:12px; }
.separator-label { font-weight:700; text-align:left; }

/* Modal look & spacing */
ion-modal ion-content {
  --padding-start: 16px; --padding-end: 16px; --padding-top: 12px; --padding-bottom: 16px;
}
.clean-list { border-radius: 12px; background: var(--ion-color-step-50, #1e1e1e); padding: 4px 8px; }
.clean-list .section-title { font-weight: 700; opacity: .9; padding-left: 8px; }
.field { --inner-padding-top: 8px; --inner-padding-bottom: 8px; }
.picker-row { margin-top: 4px; }

/* Footer du formulaire */
.sticky-footer {
  position: sticky;
  bottom: 0;
  background: transparent;
  padding: 12px 0 0 0;
}

/* Cartes */
ion-card { border-radius: 12px; }
</style>
