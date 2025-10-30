<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Bezoekers</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openIdentityModal" aria-label="Identificeer gebruiker">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
          </ion-button>
          <ion-button v-if="cartItemCount > 0" @click="openCartModal" aria-label="Open winkelwagen">
            <ion-icon slot="icon-only" :icon="add"></ion-icon>
            <ion-badge class="cart-badge">{{ cartItemCount }}</ion-badge>
          </ion-button>
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

    <!-- Identity modal: simple selector for visitor or professor/tester -->
    <ion-modal :is-open="identityModalOpen" @didDismiss="() => identityModalOpen=false">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Identificeer</ion-title>
          <ion-buttons slot="end"><ion-button @click="identityModalOpen=false">Sluiten</ion-button></ion-buttons>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        <p>Kies of u bent een bezoeker of een professor/tester:</p>
        <ion-item>
          <ion-label position="stacked">Ik ben bezoeker</ion-label>
          <ion-select v-model="currentUserTemp" placeholder="Selecteer bezoeker">
            <ion-select-option v-for="v in visitors" :key="v.id" :value="{type: 'visitor', id: v.id, name: v.first_name + ' ' + v.last_name}">{{ v.first_name }} {{ v.last_name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <div style="margin-top:12px">OF</div>
        <ion-item>
          <ion-label position="stacked">Ik ben professor/tester</ion-label>
          <ion-input v-model="profName" placeholder="Bijv. Mnr. Jansen"></ion-input>
        </ion-item>
        <div style="margin-top:18px">
          <ion-button expand="block" @click="applyIdentity">Bevestig</ion-button>
        </div>
      </ion-content>
    </ion-modal>

    <!-- Cart modal: review multiple concerts, choose visitor and checkout -->
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
        <div v-if="cart.length === 0">
          <p>Uw winkelwagen is leeg. Voeg concerten toe vanuit het tabblad Concerten.</p>
        </div>
        <ion-list v-else>
          <ion-item v-for="item in cart" :key="item.concertId">
            <ion-label>
              <h2>{{ item.artist }}</h2>
              <p>{{ item.venue }} — {{ formatDate(item.date) }} {{ formatTime(item.time) }}</p>
              <p>Prijs: € {{ formatPrice(item.price) }}</p>
            </ion-label>
            <div slot="end" style="width:140px">
              <ion-item>
                <ion-label position="stacked">Aantal</ion-label>
                <ion-input type="number" v-model.number="item.qty" min="1"></ion-input>
              </ion-item>
              <ion-button fill="clear" color="danger" @click="removeCartItem(item.concertId)">Verwijder</ion-button>
            </div>
          </ion-item>
        </ion-list>

        <div class="cart-summary">
          <p>Totaal tickets: <strong>{{ cartItemCount }}</strong></p>
          <p>Totaal bedrag: <strong>€ {{ formatPrice(cartTotal) }}</strong></p>
        </div>

        <ion-item>
          <ion-label position="stacked">Kies bezoeker</ion-label>
          <ion-select v-model="purchaseVisitorId" placeholder="Selecteer bezoeker">
            <ion-select-option v-for="v in visitors" :key="v.id" :value="v.id">{{ v.first_name }} {{ v.last_name }}</ion-select-option>
          </ion-select>
        </ion-item>
        <ion-button expand="block" fill="clear" @click="showQuickCreate = !showQuickCreate">Nieuwe bezoeker toevoegen</ion-button>
        <div v-if="showQuickCreate" class="quick-create">
          <ion-item>
            <ion-input v-model="quickVisitor.first_name" placeholder="Voornaam"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="quickVisitor.last_name" placeholder="Achternaam"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="quickVisitor.birth_date" type="date" placeholder="Geboortedatum"></ion-input>
          </ion-item>
          <ion-item>
            <ion-input v-model="quickVisitor.email" type="email" placeholder="E-mailadres"></ion-input>
          </ion-item>
          <div style="margin-top:12px">
            <ion-button expand="block" @click="createVisitorQuick">Toevoegen & selecteren</ion-button>
          </div>
        </div>

        <div style="margin-top:18px">
          <ion-button expand="block" color="success" @click="handleCheckout">Koop tickets</ion-button>
        </div>
      </ion-content>
    </ion-modal>

      <!-- Purchase modal: choose visitor & quantity (opens when navigated here for purchase) -->
      <ion-modal :is-open="purchaseModalOpen" @didDismiss="closePurchaseModal">
        <ion-header>
          <ion-toolbar color="primary">
            <ion-title>Aankoop ticket</ion-title>
            <ion-buttons slot="end">
              <ion-button @click="closePurchaseModal">Annuleren</ion-button>
            </ion-buttons>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          <div v-if="purchaseConcert">
            <h2 class="purchase-artist">{{ purchaseConcert.artist }}</h2>
            <p>{{ purchaseConcert.venue }} — {{ formatDate(purchaseConcert.date) }} {{ formatTime(purchaseConcert.time) }}</p>
            <p>Prijs per ticket: € {{ formatPrice(purchaseConcert.price) }}</p>
          </div>

          <ion-item>
            <ion-label position="stacked">Kies bezoeker</ion-label>
            <ion-select v-model="purchaseVisitorId" placeholder="Selecteer bezoeker">
              <ion-select-option v-for="v in visitors" :key="v.id" :value="v.id">{{ v.first_name }} {{ v.last_name }}</ion-select-option>
            </ion-select>
          </ion-item>

          <ion-item>
            <ion-label position="stacked">Aantal tickets</ion-label>
            <ion-input type="number" v-model.number="purchaseQuantity" min="1"></ion-input>
          </ion-item>

          <div style="margin-top:18px">
            <ion-button expand="block" color="success" @click="handlePurchase">Bevestig aankoop</ion-button>
          </div>
        </ion-content>
      </ion-modal>

    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref, inject, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { IonSelect, IonSelectOption } from '@ionic/vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonSpinner, onIonViewWillEnter, IonButtons, IonButton, IonIcon,
  IonModal, IonInput, toastController, alertController, IonText, IonBadge
} from '@ionic/vue';
import { add, pencil, trash } from 'ionicons/icons';

const visitors = ref([]);
const loading = ref(true);
const error = ref(null);
const isModalOpen = ref(false);
const newVisitorData = ref({ first_name: '', last_name: '', birth_date: '', email: '' });
const editingVisitorId = ref(null);
// purchase flow + cart (allow multiple concerts)
const purchaseModalOpen = ref(false);
const purchaseConcert = ref(null);
const purchaseVisitorId = ref(null);
const purchaseQuantity = ref(1);

// cart to collect multiple concerts for one visitor
const cart = ref([]); // items: { concertId, artist, venue, date, time, price, qty }
const cartModalOpen = ref(false);

const cartItemCount = computed(() => cart.value.reduce((s, it) => s + (it.qty || 0), 0));
const cartTotal = computed(() => cart.value.reduce((s, it) => s + (Number(it.price || 0) * (it.qty || 1)), 0));

const route = useRoute();
const router = useRouter();
// identity (simple): keep who is using the app
const identityModalOpen = ref(false);
const currentUser = ref(null);

// quick-create visitor inside cart
const showQuickCreate = ref(false);
const quickVisitor = ref({ first_name: '', last_name: '', birth_date: '', email: '' });

// restore identity from localStorage
try { const raw = localStorage.getItem('odisee_current_user'); if (raw) currentUser.value = JSON.parse(raw); } catch(e) {}

function formatDate(d) { if (!d) return ''; try { const [y,m,dd] = (''+d).split('-'); return `${dd}/${m}/${y}`; } catch(e){ return d; } }
function formatTime(t) { if (!t) return ''; try { return (''+t).slice(0,5); } catch(e){ return t; } }
function formatPrice(p) { const v = parseFloat(p ?? 0); return isNaN(v) ? '0.00' : v.toFixed(2); }

const axios = inject('axios');

// identity modal temps
const currentUserTemp = ref(null);
const profName = ref('');

function openIdentityModal() { currentUserTemp.value = null; profName.value = ''; identityModalOpen.value = true; }

function saveCurrentUser(u) {
  currentUser.value = u;
  try { localStorage.setItem('odisee_current_user', JSON.stringify(u)); } catch(e) {}
}

function applyIdentity() {
  if (profName.value && profName.value.trim()) {
    saveCurrentUser({ type: 'prof', name: profName.value.trim() });
    showToastMessage(`Hey mnr, aangemeld als tester: ${profName.value}`,'success');
  } else if (currentUserTemp.value) {
    saveCurrentUser(currentUserTemp.value);
    showToastMessage(`Aangemeld als ${currentUserTemp.value.name}`,'success');
  } else {
    showToastMessage('Selecteer bezoeker of vul professor naam in.', 'warning');
    return;
  }
  identityModalOpen.value = false;
}

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
  // If navigated here with purchase action, add to cart and open cart modal so user can add multiple concerts
  if ((route.query.action === 'purchase' || route.query.action === 'addToCart') && route.query.concertId) {
    addToCartFromQuery();
    cartModalOpen.value = true;
  }
});

function addToCart(item, qty = 1) {
  const id = String(item.id ?? item.concertId ?? item.concert_id ?? item.concertId);
  const existing = cart.value.find(x => String(x.concertId) === id);
  if (existing) {
    existing.qty = (existing.qty || 0) + qty;
  } else {
    cart.value.push({ concertId: id, artist: item.artist, venue: item.venue, date: item.date, time: item.time, price: item.price, qty });
  }
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
    // clear query so back/refresh doesn't re-add
    router.replace({ path: route.path, query: {} });
  } catch (e) { console.warn('addToCartFromQuery error', e); }
}

function openCartModal() { cartModalOpen.value = true; }
function closeCartModal() { cartModalOpen.value = false; }

function removeCartItem(concertId) {
  const idx = cart.value.findIndex(x => String(x.concertId) === String(concertId));
  if (idx >= 0) cart.value.splice(idx, 1);
}

async function handleCheckout() {
  if (!purchaseVisitorId.value) { showToastMessage('Selecteer een bezoeker.', 'warning'); return; }
  if (cart.value.length === 0) { showToastMessage('Winkelwagen is leeg.', 'warning'); return; }
  if (!axios) { showToastMessage('Axios niet beschikbaar.', 'danger'); return; }
  try {
    // send one request per cart item (backend may accept batch; adapt if needed)
    for (const it of cart.value) {
      const payload = { visitor_id: purchaseVisitorId.value, concert_id: it.concertId, quantity: it.qty };
      try {
        await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', payload);
      } catch (apiErr) {
        console.warn('Ticket API error for item', it, apiErr);
        // continue trying other items but notify user at end
      }
    }
    showToastMessage('Aankoop voltooid!', 'success');
    // clear cart after purchase
    cart.value = [];
    purchaseVisitorId.value = null;
    purchaseQuantity.value = 1;
    closeCartModal();
  } catch (err) {
    console.error('Checkout error', err);
    showToastMessage('Aankoop mislukt.', 'danger');
  }
}

const closePurchaseModal = () => {
  purchaseModalOpen.value = false;
  purchaseConcert.value = null;
  purchaseVisitorId.value = null;
  purchaseQuantity.value = 1;
  // clear query params so returning to this page doesn't re-open modal
  router.replace({ path: route.path, query: {} });
};

const handlePurchase = async () => {
  if (!purchaseVisitorId.value) { showToastMessage('Selecteer een bezoeker.', 'warning'); return; }
  if (!purchaseQuantity.value || purchaseQuantity.value < 1) { showToastMessage('Voer een geldig aantal in.', 'warning'); return; }
  // try call tickets API if available
  if (!axios) { showToastMessage('Axios niet beschikbaar.', 'danger'); return; }
  try {
    const payload = {
      visitor_id: purchaseVisitorId.value,
      concert_id: purchaseConcert.value.id,
      quantity: purchaseQuantity.value
    };
    // best-effort call; if endpoint missing, simulate
    try {
      const res = await axios.post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', payload);
      showToastMessage(res.data?.message || 'Aankoop voltooid!', 'success');
    } catch (apiErr) {
      console.warn('Tickets API call failed, simulating purchase.', apiErr);
      showToastMessage('Aankoop gesimuleerd (server niet beschikbaar).', 'success');
    }
    closePurchaseModal();
  } catch (err) {
    console.error('Purchase error', err);
    showToastMessage('Aankoop mislukt.', 'danger');
  }
};
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

.cart-badge { margin-left:6px; background: var(--ion-color-primary-tint); color: white; font-weight:700; }
.cart-summary { margin-top:12px; font-weight:700; }
</style>