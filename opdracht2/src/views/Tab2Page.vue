<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mijn Bezoekers</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openIdentityModal" fill="solid">
            <ion-icon slot="start" :icon="person" />
            Identificeer
          </ion-button>
          <ion-button v-if="cartItemCount > 0" @click="openCartModal" fill="solid" color="secondary">
            <ion-icon slot="start" :icon="cart" />
            <ion-badge>{{ cartItemCount }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="currentUser">
        <ion-chip color="success">
          <ion-icon :icon="currentUser.type === 'prof' ? schoolOutline : personCircle" />
          <ion-label>{{ currentUser.name }}</ion-label>
        </ion-chip>
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
              Beheer hier alle concertbezoekers. Voeg nieuwe bezoekers toe of pas bestaande gegevens aan.
            </p>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-searchbar 
        v-model="searchText" 
        placeholder="Zoek op naam of email..." 
        :debounce="300"
        show-clear-button="always"
        class="search-bar"
        @ionInput="filterVisitors()"
      />

      <ion-progress-bar v-if="loading" type="indeterminate" />

      <ion-list v-if="!loading && !error" lines="none">
        <ion-item-group v-if="filteredVisitors.length === 0">
          <ion-item>
            <ion-label class="ion-text-center">
              <h2>Geen bezoekers gevonden</h2>
              <p>Voeg je eerste bezoeker toe!</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-card v-for="visitor in filteredVisitors" :key="visitor.id" class="visitor-card">
          <ion-card-header>
            <ion-card-title class="visitor-name">
              {{ visitor.first_name }} {{ visitor.last_name }}
            </ion-card-title>
          </ion-card-header>

          <ion-card-content>
            <ion-list class="info-list">
              <ion-item lines="none">
                <ion-icon :icon="mail" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Email</p>
                  <h3>{{ visitor.email }}</h3>
                </ion-label>
              </ion-item>

              <ion-item lines="none">
                <ion-icon :icon="calendar" slot="start" color="primary" />
                <ion-label>
                  <p class="label-text">Geboortedatum</p>
                  <h3>{{ formatDate(visitor.birth_date) }}</h3>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>

          <ion-row class="card-actions">
            <ion-col>
              <ion-button expand="block" fill="outline" @click="openEditModal(visitor)">
                <ion-icon slot="start" :icon="pencil" />
                Wijzigen
              </ion-button>
            </ion-col>
            <ion-col>
              <ion-button expand="block" color="danger" fill="outline" @click="handleDeleteVisitor(visitor.id)">
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

    <!-- Add/Edit Visitor Modal -->
    <ion-modal :is-open="isModalOpen" @didDismiss="closeModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>{{ editingVisitorId ? 'Bezoeker wijzigen' : 'Nieuwe bezoeker' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeModal">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list>
          <ion-item>
            <ion-input 
              v-model="newVisitorData.first_name" 
              label="Voornaam" 
              label-placement="stacked"
              placeholder="Bijv. Jan"
              :counter="true"
              maxlength="50"
              error-text="Vul de voornaam in"
              :class="{ 'ion-invalid': showErrors && !newVisitorData.first_name }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="newVisitorData.last_name" 
              label="Achternaam" 
              label-placement="stacked"
              placeholder="Bijv. Janssens"
              :counter="true"
              maxlength="50"
              error-text="Vul de achternaam in"
              :class="{ 'ion-invalid': showErrors && !newVisitorData.last_name }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="newVisitorData.birth_date" 
              label="Geboortedatum" 
              label-placement="stacked"
              type="date"
              error-text="Selecteer een geboortedatum"
              :class="{ 'ion-invalid': showErrors && !newVisitorData.birth_date }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="newVisitorData.email" 
              label="E-mailadres" 
              label-placement="stacked"
              type="email"
              placeholder="naam@voorbeeld.be"
              :counter="true"
              maxlength="100"
              error-text="Vul een geldig e-mailadres in"
              :class="{ 'ion-invalid': showErrors && !newVisitorData.email }"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
          <ion-button 
            expand="block" 
            size="large"
            @click="handleSaveVisitor"
            :disabled="saving"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            {{ editingVisitorId ? 'Wijzigingen opslaan' : 'Bezoeker toevoegen' }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Identity Modal -->
    <ion-modal :is-open="identityModalOpen" @didDismiss="identityModalOpen = false">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Wie ben je?</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="identityModalOpen = false">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-card>
          <ion-card-content>
            <p class="identity-intro">Identificeer jezelf om door te gaan</p>
          </ion-card-content>
        </ion-card>

        <ion-list>
          <ion-list-header>
            <ion-label>Ik ben een bezoeker</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-select 
              v-model="currentUserTemp" 
              placeholder="Selecteer je naam"
              interface="action-sheet"
            >
              <ion-select-option 
                v-for="v in visitors" 
                :key="v.id" 
                :value="{type: 'visitor', id: v.id, name: v.first_name + ' ' + v.last_name}"
              >
                {{ v.first_name }} {{ v.last_name }}
              </ion-select-option>
            </ion-select>
          </ion-item>

          <div class="divider ion-padding">
            <ion-text color="medium">
              <p>— OF —</p>
            </ion-text>
          </div>

          <ion-list-header>
            <ion-label>Ik ben een professor/tester</ion-label>
          </ion-list-header>
          <ion-item>
            <ion-input 
              v-model="profName" 
              placeholder="Bijv. Prof. Jansen"
              label="Naam"
              label-placement="stacked"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
          <ion-button expand="block" size="large" @click="applyIdentity">
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Bevestigen
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Cart Modal -->
    <ion-modal :is-open="cartModalOpen" @didDismiss="closeCartModal">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Winkelwagen</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="closeCartModal">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <ion-card>
            <ion-card-content class="ion-text-center">
              <ion-icon :icon="cartOutline" size="large" color="medium" />
              <p>Je winkelwagen is leeg</p>
              <p class="small-text">Voeg concerten toe vanuit het Concerten tabblad</p>
            </ion-card-content>
          </ion-card>
        </div>

        <ion-list v-else lines="none">
          <ion-card v-for="item in cartItems" :key="item.concertId" class="cart-item">
            <ion-card-header>
              <ion-card-title>{{ item.artist }}</ion-card-title>
              <ion-card-subtitle>
                {{ item.venue }}
              </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="cart-item-details">
                <p><ion-icon :icon="calendar" /> {{ formatDate(item.date) }} om {{ formatTime(item.time) }}</p>
                <p><ion-icon :icon="card" /> € {{ formatPrice(item.price) }} per ticket</p>
              </div>
              
              <ion-item lines="none" class="qty-item">
                <ion-label>Aantal tickets</ion-label>
                <ion-input 
                  type="number" 
                  v-model.number="item.qty" 
                  min="1"
                  class="qty-input"
                />
              </ion-item>

              <ion-button 
                expand="block" 
                fill="clear" 
                color="danger" 
                @click="removeCartItem(item.concertId)"
              >
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-list>

        <ion-card v-if="cartItems.length > 0" class="summary-card">
          <ion-card-content>
            <div class="summary-row">
              <span>Totaal tickets:</span>
              <strong>{{ cartItemCount }}</strong>
            </div>
            <div class="summary-row total">
              <span>Totaal bedrag:</span>
              <strong>€ {{ formatPrice(cartTotal) }}</strong>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="cartItems.length > 0">
          <ion-list>
            <ion-list-header>
              <ion-label>Selecteer bezoeker</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-select 
                v-model="purchaseVisitorId" 
                placeholder="Kies een bezoeker"
                interface="action-sheet"
              >
                <ion-select-option v-for="v in visitors" :key="v.id" :value="v.id">
                  {{ v.first_name }} {{ v.last_name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>

          <ion-button 
            expand="block" 
            fill="outline" 
            @click="showQuickCreate = !showQuickCreate"
            class="ion-margin-top"
          >
            <ion-icon slot="start" :icon="addCircleOutline" />
            Nieuwe bezoeker toevoegen
          </ion-button>

          <ion-card v-if="showQuickCreate" class="quick-create-card">
            <ion-card-header>
              <ion-card-title>Snelle bezoeker toevoegen</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-input 
                    v-model="quickVisitor.first_name" 
                    label="Voornaam"
                    label-placement="stacked"
                    placeholder="Voornaam"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="quickVisitor.last_name"
                    label="Achternaam"
                    label-placement="stacked"
                    placeholder="Achternaam"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="quickVisitor.birth_date"
                    label="Geboortedatum"
                    label-placement="stacked"
                    type="date"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="quickVisitor.email"
                    label="Email"
                    label-placement="stacked"
                    type="email"
                    placeholder="naam@voorbeeld.be"
                  />
                </ion-item>
              </ion-list>
              <ion-button expand="block" @click="createVisitorQuick" class="ion-margin-top">
                <ion-icon slot="start" :icon="checkmarkCircle" />
                Toevoegen en selecteren
              </ion-button>
            </ion-card-content>
          </ion-card>

          <ion-button 
            expand="block" 
            color="success" 
            size="large"
            @click="handleCheckout"
            class="ion-margin-top"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Tickets kopen
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
import { useRoute, useRouter } from 'vue-router';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonButtons, IonButton, IonIcon, IonModal, IonInput, IonSelect, IonSelectOption,
  IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonCardSubtitle,
  IonBadge, IonChip, IonSearchbar, IonProgressBar, IonRefresher, IonRefresherContent,
  IonItemGroup, IonRow, IonCol, IonFab, IonFabButton, IonListHeader, IonText, IonToast,
  onIonViewWillEnter, alertController
} from '@ionic/vue';
import {
  add, pencil, trash, person, cart, mail, calendar, checkmarkCircle,
  personCircle, schoolOutline, cartOutline, addCircleOutline, card as cardIcon
} from 'ionicons/icons';

const axios = inject('axios');
const route = useRoute();
const router = useRouter();

// State variables - style prof: ref() simples
const visitors = ref([]);
const filteredVisitors = ref([]);
const loading = ref(false);
const saving = ref(false);
const error = ref(null);
const isModalOpen = ref(false);
const showErrors = ref(false);
const searchText = ref('');
const newVisitorData = ref({ first_name: '', last_name: '', birth_date: '', email: '' });
const editingVisitorId = ref(null);

const cartItems = ref([]);
const cartModalOpen = ref(false);
const purchaseVisitorId = ref(null);
const cartItemCount = ref(0);
const cartTotal = ref(0);

const identityModalOpen = ref(false);
const currentUser = ref(null);
const currentUserTemp = ref(null);
const profName = ref('');

const showQuickCreate = ref(false);
const quickVisitor = ref({ first_name: '', last_name: '', birth_date: '', email: '' });

const toast = ref({ open: false, msg: '', color: 'success' });

// Restore identity from localStorage
try {
  const raw = localStorage.getItem('odisee_current_user');
  if (raw) {
    currentUser.value = JSON.parse(raw);
  }
} catch (e) {
  console.log('localStorage error:', e);
}

// Helper functions - style prof: fonctions simples
function formatDate(d) {
  if (!d) return '';
  const parts = String(d).split('-');
  if (parts.length !== 3) return d;
  return parts[2] + '/' + parts[1] + '/' + parts[0];
}

function formatTime(t) {
  if (!t) return '';
  return String(t).slice(0, 5);
}

function formatPrice(p) {
  const v = parseFloat(p);
  if (isNaN(v)) return '0.00';
  return v.toFixed(2);
}

function showToast(message, color) {
  toast.value.open = true;
  toast.value.msg = message;
  toast.value.color = color;
}

// Filter visitors - style prof: boucle for simple
function filterVisitors() {
  const term = searchText.value.trim().toLowerCase();
  
  // vider d'abord la liste
  filteredVisitors.value = [];
  
  if (!term) {
    // pas de filtre, tout montrer
    for (let i = 0, end = visitors.value.length; i < end; i++) {
      filteredVisitors.value.push(visitors.value[i]);
    }
    return;
  }
  
  // loop door alle bezoekers
  for (let i = 0, end = visitors.value.length; i < end; i++) {
    const v = visitors.value[i];
    const fullName = (v.first_name + ' ' + v.last_name).toLowerCase();
    const email = (v.email || '').toLowerCase();
    
    if (fullName.includes(term) || email.includes(term)) {
      filteredVisitors.value.push(v);
    }
  }
}

// Calculate cart totals - style prof: loop simple
function updateCartTotals() {
  let count = 0;
  let total = 0;
  
  for (let i = 0, end = cartItems.value.length; i < end; i++) {
    const item = cartItems.value[i];
    const qty = item.qty || 0;
    const price = Number(item.price) || 0;
    
    count = count + qty;
    total = total + (price * qty);
  }
  
  cartItemCount.value = count;
  cartTotal.value = total;
}

function openAddModal() {
  showErrors.value = false;
  editingVisitorId.value = null;
  newVisitorData.value = { first_name: '', last_name: '', birth_date: '', email: '' };
  isModalOpen.value = true;
}

function openEditModal(visitor) {
  showErrors.value = false;
  editingVisitorId.value = visitor.id;
  newVisitorData.value = {
    first_name: visitor.first_name,
    last_name: visitor.last_name,
    birth_date: visitor.birth_date,
    email: visitor.email
  };
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  editingVisitorId.value = null;
}

function openIdentityModal() {
  currentUserTemp.value = null;
  profName.value = '';
  identityModalOpen.value = true;
}

function saveCurrentUser(u) {
  currentUser.value = u;
  try {
    localStorage.setItem('odisee_current_user', JSON.stringify(u));
  } catch (e) {
    console.log('localStorage save error:', e);
  }
}

function applyIdentity() {
  if (profName.value && profName.value.trim()) {
    // professor/tester
    const user = { type: 'prof', name: profName.value.trim() };
    saveCurrentUser(user);
    showToast('Aangemeld als ' + profName.value, 'success');
    identityModalOpen.value = false;
  } else if (currentUserTemp.value) {
    // bezoeker
    saveCurrentUser(currentUserTemp.value);
    showToast('Welkom ' + currentUserTemp.value.name + '!', 'success');
    identityModalOpen.value = false;
  } else {
    showToast('Selecteer een bezoeker of vul je naam in', 'warning');
  }
}

// Load visitors - style prof: simpele axios call
function loadVisitors() {
  loading.value = true;
  error.value = null;
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php')
    .then(response => {
      // controleer de response
      if (response.status !== 200) {
        console.log('Status niet 200:', response.status);
        error.value = 'Laden mislukt';
        loading.value = false;
        return;
      }
      
      // check of data er is
      const data = response.data.data;
      if (!data || !Array.isArray(data)) {
        console.log('Data is geen array');
        error.value = 'Geen data';
        loading.value = false;
        return;
      }
      
      // vul de visitors array
      visitors.value = [];
      for (let i = 0, end = data.length; i < end; i++) {
        visitors.value.push(data[i]);
      }
      
      // filter toepassen
      filterVisitors();
      
      loading.value = false;
    })
    .catch(e => {
      console.error('API Error:', e);
      error.value = 'Er ging iets mis bij het laden';
      showToast('Laden mislukt', 'danger');
      loading.value = false;
    });
}

function handleRefresh(event) {
  loadVisitors();
  event.target.complete();
}

function handleSaveVisitor() {
  showErrors.value = true;
  
  // validatie
  if (!newVisitorData.value.first_name || !newVisitorData.value.first_name.trim()) {
    showToast('Vul de voornaam in', 'warning');
    return;
  }
  if (!newVisitorData.value.last_name || !newVisitorData.value.last_name.trim()) {
    showToast('Vul de achternaam in', 'warning');
    return;
  }
  if (!newVisitorData.value.email || !newVisitorData.value.email.trim()) {
    showToast('Vul het e-mailadres in', 'warning');
    return;
  }
  if (!newVisitorData.value.birth_date) {
    showToast('Selecteer een geboortedatum', 'warning');
    return;
  }

  saving.value = true;

  if (editingVisitorId.value) {
    // update bezoeker
    const dataToUpdate = {
      id: editingVisitorId.value,
      first_name: newVisitorData.value.first_name,
      last_name: newVisitorData.value.last_name,
      birth_date: newVisitorData.value.birth_date,
      email: newVisitorData.value.email
    };
    
    axios
      .put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', dataToUpdate)
      .then(response => {
        showToast('Bezoeker succesvol gewijzigd', 'success');
        closeModal();
        loadVisitors();
        saving.value = false;
      })
      .catch(e => {
        console.error('Update error:', e);
        showToast('Wijzigen mislukt', 'danger');
        saving.value = false;
      });
  } else {
    // nieuwe bezoeker
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', newVisitorData.value)
      .then(response => {
        showToast('Bezoeker succesvol toegevoegd', 'success');
        closeModal();
        loadVisitors();
        saving.value = false;
      })
      .catch(e => {
        console.error('Create error:', e);
        showToast('Toevoegen mislukt', 'danger');
        saving.value = false;
      });
  }
}

async function handleDeleteVisitor(visitorId) {
  const alert = await alertController.create({
    header: 'Bezoeker verwijderen?',
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
            .delete('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', {
              data: { id: visitorId }
            })
            .then(response => {
              showToast('Bezoeker verwijderd', 'medium');
              loadVisitors();
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

// Cart functions - style prof
function addToCart(item, qty) {
  const id = String(item.id || item.concertId || item.concert_id);
  
  // zoek of item al in winkelwagen zit
  let found = false;
  for (let i = 0, end = cartItems.value.length; i < end; i++) {
    if (String(cartItems.value[i].concertId) === id) {
      cartItems.value[i].qty = (cartItems.value[i].qty || 0) + qty;
      found = true;
      break;
    }
  }
  
  if (!found) {
    // nieuw item toevoegen
    cartItems.value.push({
      concertId: id,
      artist: item.artist,
      venue: item.venue,
      date: item.date,
      time: item.time,
      price: item.price,
      qty: qty
    });
  }
  
  updateCartTotals();
}

function addToCartFromQuery() {
  try {
    const q = route.query;
    const item = {
      concertId: q.concertId,
      artist: q.artist,
      venue: q.venue,
      date: q.date,
      time: q.time,
      price: q.price
    };
    const qty = q.qty ? Number(q.qty) : 1;
    addToCart(item, qty);
    // clear query
    router.replace({ path: route.path, query: {} });
  } catch (e) {
    console.log('addToCartFromQuery error:', e);
  }
}

function openCartModal() {
  cartModalOpen.value = true;
}

function closeCartModal() {
  cartModalOpen.value = false;
}

function removeCartItem(concertId) {
  const id = String(concertId);
  
  // zoek index van item
  let indexToRemove = -1;
  for (let i = 0, end = cartItems.value.length; i < end; i++) {
    if (String(cartItems.value[i].concertId) === id) {
      indexToRemove = i;
      break;
    }
  }
  
  if (indexToRemove >= 0) {
    cartItems.value.splice(indexToRemove, 1);
    updateCartTotals();
  }
}
function createVisitorQuick() {
  // validatie
  if (!quickVisitor.value.first_name || !quickVisitor.value.last_name || 
      !quickVisitor.value.birth_date || !quickVisitor.value.email) {
    showToast('Vul alle velden in', 'warning');
    return;
  }

  axios
    .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', quickVisitor.value)
    .then(response => {
      showToast('Bezoeker toegevoegd!', 'success');
      loadVisitors();
      
      // selecteer de nieuwe bezoeker
      if (response.data && response.data.id) {
        purchaseVisitorId.value = response.data.id;
      }
      
      showQuickCreate.value = false;
      quickVisitor.value = { first_name: '', last_name: '', birth_date: '', email: '' };
    })
    .catch(e => {
      console.error('Quick create error:', e);
      showToast('Toevoegen mislukt', 'danger');
    });
}

function handleCheckout() {
  // validatie
  if (!purchaseVisitorId.value) {
    showToast('Selecteer een bezoeker', 'warning');
    return;
  }
  
  if (cartItems.value.length === 0) {
    showToast('Winkelwagen is leeg', 'warning');
    return;
  }

  // loop door alle items en verstuur ze
  for (let i = 0, end = cartItems.value.length; i < end; i++) {
    const item = cartItems.value[i];
    const payload = {
      visitor_id: purchaseVisitorId.value,
      concert_id: item.concertId,
      quantity: item.qty
    };
    
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', payload)
      .then(response => {
        console.log('Ticket gekocht:', response.data);
      })
      .catch(e => {
        console.log('Ticket API error voor item:', item, e);
      });
  }
  
  showToast('Tickets succesvol gekocht!', 'success');
  
  // leeg winkelwagen
  cartItems.value = [];
  purchaseVisitorId.value = null;
  updateCartTotals();
  closeCartModal();
}

// Lifecycle - style prof
onIonViewWillEnter(() => {
  loadVisitors();
  
  // check if purchase action from query
  if ((route.query.action === 'purchase' || route.query.action === 'addToCart') && route.query.concertId) {
    addToCartFromQuery();
    cartModalOpen.value = true;
  }
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

.visitor-card {
  margin: 12px 16px;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0,0,0,0.1);
}

.visitor-name {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-dark);
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
  margin: 8px;
}

.identity-intro {
  font-size: 16px;
  text-align: center;
  color: var(--ion-color-medium-shade);
  margin: 0;
}

.divider {
  text-align: center;
  margin: 16px 0;
}

.divider p {
  font-weight: 600;
  font-size: 14px;
}

.empty-cart {
  margin-top: 20px;
}

.empty-cart ion-icon {
  font-size: 64px;
  margin-bottom: 12px;
}

.empty-cart p {
  margin: 8px 0;
  color: var(--ion-color-medium-shade);
}

.small-text {
  font-size: 14px;
}

.cart-item {
  margin-bottom: 16px;
  border-radius: 16px;
}

.cart-item-details {
  margin: 12px 0;
}

.cart-item-details p {
  display: flex;
  align-items: center;
  gap: 8px;
  margin: 8px 0;
  font-size: 15px;
}

.cart-item-details ion-icon {
  color: var(--ion-color-primary);
}

.qty-item {
  --background: var(--ion-color-light);
  --border-radius: 8px;
  margin: 12px 0;
  --padding-start: 12px;
}

.qty-input {
  text-align: right;
  font-size: 18px;
  font-weight: 600;
}

.summary-card {
  margin: 16px 0;
  border-radius: 12px;
  background: var(--ion-color-light);
}

.summary-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 0;
  font-size: 16px;
}

.summary-row.total {
  padding-top: 12px;
  border-top: 2px solid var(--ion-color-medium);
  margin-top: 8px;
  font-size: 20px;
}

.summary-row strong {
  color: var(--ion-color-primary);
}

.summary-row.total strong {
  color: var(--ion-color-success);
  font-size: 24px;
}

.quick-create-card {
  margin-top: 16px;
  border-radius: 12px;
}

ion-list-header {
  font-weight: 700;
  font-size: 16px;
  padding: 16px 0 8px;
}

@media (prefers-color-scheme: dark) {
  .visitor-card,
  .cart-item,
  .summary-card,
  .quick-create-card {
    box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  }
}
</style>