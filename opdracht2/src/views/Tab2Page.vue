<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-title>Mijn Bezoekers</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="ouvrirModaallIdentiteee" fill="solid">
            <ion-icon slot="start" :icon="personn" />
            Identificeer
          </ion-button>
          <ion-button v-if="compteurArticllesCharrioott > 0" @click="ouvrirModaallCharrioott" fill="solid" color="secondary">
            <ion-icon slot="start" :icon="charriioott" />
            <ion-badge>{{ compteurArticllesCharrioott }}</ion-badge>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar v-if="utilisatteurActuell">
        <ion-chip color="success">
          <ion-icon :icon="utilisatteurActuell.type === 'prof' ? schoolOutline : personCircle" />
          <ion-label>{{ utilisatteurActuell.name }}</ion-label>
        </ion-chip>
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
              Beheer hier alle concertbezoekers. Voeg nieuwe bezoekers toe of pas bestaande gegevens aan.
            </p>
          </ion-card-content>
        </ion-card>
      </div>

      <ion-searchbar 
        v-model="recherrcheTxxtt" 
        placeholder="Zoek op naam of email..." 
        :debounce="300"
        show-clear-button="always"
        class="search-bar"
        @ionInput="filltrerGuerrierrs()"
      />

      <ion-progress-bar v-if="enChargementt" type="indeterminate" />

      <ion-list v-if="!enChargementt && !erreurr" lines="none">
        <ion-item-group v-if="guerrierrsFilttres.length === 0">
          <ion-item>
            <ion-label class="ion-text-center">
              <h2>Geen bezoekers gevonden</h2>
              <p>Voeg je eerste bezoeker toe!</p>
            </ion-label>
          </ion-item>
        </ion-item-group>

        <ion-card v-for="visitor in guerrierrsFilttres" :key="visitor.id" class="visitor-card">
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
                  <h3>{{ formatterrDatee(visitor.birth_date) }}</h3>
                </ion-label>
              </ion-item>
            </ion-list>
          </ion-card-content>

          <ion-row class="card-actions">
            <ion-col>
              <ion-button expand="block" fill="outline" @click="ouvrirModaallEditionn(visitor)">
                <ion-icon slot="start" :icon="pencil" />
                Wijzigen
              </ion-button>
            </ion-col>
            <ion-col>
              <ion-button expand="block" color="danger" fill="outline" @click="gererrrSuppriimerGuerrierr(visitor.id)">
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-col>
          </ion-row>
        </ion-card>
      </ion-list>

      <ion-fab vertical="bottom" horizontal="end" slot="fixed">
        <ion-fab-button color="secondary" @click="ouvrirModaallAjoututt">
          <ion-icon :icon="add" />
        </ion-fab-button>
      </ion-fab>
    </ion-content>


    <ion-modal :is-open="modalOuvertte" @didDismiss="ferrrmerModall">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>{{ idGuerrierrEnEditionn ? 'Bezoeker wijzigen' : 'Nieuwe bezoeker' }}</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="ferrrmerModall">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <ion-list>
          <ion-item>
            <ion-input 
              v-model="donneesGuerrierr.first_name" 
              label="Voornaam" 
              label-placement="stacked"
              placeholder="Bijv. Jan"
              :counter="true"
              maxlength="50"
              error-text="Vul de voornaam in"
              :class="{ 'ion-invalid': afficherrErrorrs && !donneesGuerrierr.first_name }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="donneesGuerrierr.last_name" 
              label="Achternaam" 
              label-placement="stacked"
              placeholder="Bijv. Janssens"
              :counter="true"
              maxlength="50"
              error-text="Vul de achternaam in"
              :class="{ 'ion-invalid': afficherrErrorrs && !donneesGuerrierr.last_name }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="donneesGuerrierr.birth_date" 
              label="Geboortedatum" 
              label-placement="stacked"
              type="date"
              error-text="Selecteer een geboortedatum"
              :class="{ 'ion-invalid': afficherrErrorrs && !donneesGuerrierr.birth_date }"
            />
          </ion-item>

          <ion-item>
            <ion-input 
              v-model="donneesGuerrierr.email" 
              label="E-mailadres" 
              label-placement="stacked"
              type="email"
              placeholder="naam@voorbeeld.be"
              :counter="true"
              maxlength="100"
              error-text="Vul een geldig e-mailadres in"
              :class="{ 'ion-invalid': afficherrErrorrs && !donneesGuerrierr.email }"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
          <ion-button 
            expand="block" 
            size="large"
            @click="gererrrSauvegarrrdeGuerrierr"
            :disabled="enSauvegarrde"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            {{ idGuerrierrEnEditionn ? 'Wijzigingen opslaan' : 'Bezoeker toevoegen' }}
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>


    <ion-modal :is-open="modalIdentifiitt" @didDismiss="modalIdentifiitt = false">
      <ion-header>
        <ion-toolbar color="secondary">
          <ion-title>Wie ben je?</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="modalIdentifiitt = false">Sluiten</ion-button>
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
              v-model="utilisatteurTempporr" 
              placeholder="Selecteer je naam"
              interface="action-sheet"
            >
              <ion-select-option 
                v-for="v in guerrierrsListe" 
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
              v-model="nomProfessorr" 
              placeholder="Bijv. Prof. Jansen"
              label="Naam"
              label-placement="stacked"
            />
          </ion-item>
        </ion-list>

        <div class="ion-padding-top">
          <ion-button expand="block" size="large" @click="appliquerIdenntiteee">
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Bevestigen
          </ion-button>
        </div>
      </ion-content>
    </ion-modal>


    <ion-modal :is-open="charriottOuvertt" @didDismiss="ferrrmerModaallCharrioott">
      <ion-header>
        <ion-toolbar color="primary">
          <ion-title>Buit-kar</ion-title>
          <ion-buttons slot="end">
            <ion-button @click="ferrrmerModaallCharrioott">Sluiten</ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>

      <ion-content class="ion-padding">
        <div v-if="articllesCharrioott.length === 0" class="empty-cart">
          <ion-card>
            <ion-card-content class="ion-text-center">
              <ion-icon :icon="cartOutline" size="large" color="medium" />
              <p>Je kar is leeg</p>
              <p class="small-text">Voeg concerten toe vanuit het Concerten tabblad</p>
            </ion-card-content>
          </ion-card>
        </div>

        <ion-list v-else lines="none">
          <ion-card v-for="item in articllesCharrioott" :key="item.concertId" class="cart-item">
            <ion-card-header>
              <ion-card-title>{{ item.artist }}</ion-card-title>
              <ion-card-subtitle>
                {{ item.venue }}
              </ion-card-subtitle>
            </ion-card-header>
            <ion-card-content>
              <div class="cart-item-details">
                <p><ion-icon :icon="calendar" /> {{ formatterrDatee(item.date) }} om {{ formatterrHeuuree(item.time) }}</p>
                <p><ion-icon :icon="card" /> € {{ formatterrPrrixx(item.price) }} per ticket</p>
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
                @click="supprimerArticllCharrioott(item.concertId)"
              >
                <ion-icon slot="start" :icon="trash" />
                Verwijderen
              </ion-button>
            </ion-card-content>
          </ion-card>
        </ion-list>

        <ion-card v-if="articllesCharrioott.length > 0" class="summary-card">
          <ion-card-content>
            <div class="summary-row">
              <span>Totaal tickets:</span>
              <strong>{{ compteurArticllesCharrioott }}</strong>
            </div>
            <div class="summary-row total">
              <span>Totaal bedrag:</span>
              <strong>€ {{ formatterrPrrixx(totalCharrioott) }}</strong>
            </div>
          </ion-card-content>
        </ion-card>

        <div v-if="articllesCharrioott.length > 0">
          <ion-list>
            <ion-list-header>
              <ion-label>Selecteer bezoeker</ion-label>
            </ion-list-header>
            <ion-item>
              <ion-select 
                v-model="idGuerrierAchaatt" 
                placeholder="Kies een bezoeker"
                interface="action-sheet"
              >
                <ion-select-option v-for="v in guerrierrsListe" :key="v.id" :value="v.id">
                  {{ v.first_name }} {{ v.last_name }}
                </ion-select-option>
              </ion-select>
            </ion-item>
          </ion-list>

          <ion-button 
            expand="block" 
            fill="outline" 
            @click="afficherrCreationRappidee = !afficherrCreationRappidee"
            class="ion-margin-top"
          >
            <ion-icon slot="start" :icon="addCircleOutline" />
            Nieuwe bezoeker toevoegen
          </ion-button>

          <ion-card v-if="afficherrCreationRappidee" class="quick-create-card">
            <ion-card-header>
              <ion-card-title>Snelle bezoeker toevoegen</ion-card-title>
            </ion-card-header>
            <ion-card-content>
              <ion-list>
                <ion-item>
                  <ion-input 
                    v-model="guerrierRappidee.first_name" 
                    label="Voornaam"
                    label-placement="stacked"
                    placeholder="Voornaam"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="guerrierRappidee.last_name"
                    label="Achternaam"
                    label-placement="stacked"
                    placeholder="Achternaam"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="guerrierRappidee.birth_date"
                    label="Geboortedatum"
                    label-placement="stacked"
                    type="date"
                  />
                </ion-item>
                <ion-item>
                  <ion-input 
                    v-model="guerrierRappidee.email"
                    label="Email"
                    label-placement="stacked"
                    type="email"
                    placeholder="naam@voorbeeld.be"
                  />
                </ion-item>
              </ion-list>
              <ion-button expand="block" @click="creerrrGuerrierRappidee" class="ion-margin-top">
                <ion-icon slot="start" :icon="checkmarkCircle" />
                Toevoegen en selecteren
              </ion-button>
            </ion-card-content>
          </ion-card>

          <ion-button 
            expand="block" 
            color="success" 
            size="large"
            @click="faireAchatt"
            class="ion-margin-top"
          >
            <ion-icon slot="start" :icon="checkmarkCircle" />
            Tickets kopen
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
  add, pencil, trash, person as personn, cart as charriioott, mail, calendar, checkmarkCircle,
  personCircle, schoolOutline, cartOutline, addCircleOutline, card as card
} from 'ionicons/icons';

const axios = inject('axios');
const route = useRoute();
const router = useRouter();

const guerrierrsListe = ref([]);
const guerrierrsFilttres = ref([]);
const enChargementt = ref(false);
const enSauvegarrde = ref(false);
const erreurr = ref(null);
const modalOuvertte = ref(false);
const afficherrErrorrs = ref(false);
const recherrcheTxxtt = ref('');
const donneesGuerrierr = ref({ first_name: '', last_name: '', birth_date: '', email: '' });
const idGuerrierrEnEditionn = ref(null);

const articllesCharrioott = ref([]);
const charriottOuvertt = ref(false);
const idGuerrierAchaatt = ref(null);
const compteurArticllesCharrioott = ref(0);
const totalCharrioott = ref(0);

const modalIdentifiitt = ref(false);
const utilisatteurActuell = ref(null);
const utilisatteurTempporr = ref(null);
const nomProfessorr = ref('');

const afficherrCreationRappidee = ref(false);
const guerrierRappidee = ref({ first_name: '', last_name: '', birth_date: '', email: '' });

const notiffiCombatt = ref({ open: false, msg: '', color: 'success' });

try {
  const donneesBrutess = localStorage.getItem('odisee_current_user');
  if (donneesBrutess) {
    utilisatteurActuell.value = JSON.parse(donneesBrutess);
  }
} catch (errreur) {
  console.log('Fout in opslag:', errreur);
}

function formatterrDatee(d) {
  if (!d) return '';
  const partiies = String(d).split('-');
  if (partiies.length !== 3) return d;
  return partiies[2] + '/' + partiies[1] + '/' + partiies[0];
}

function formatterrHeuuree(t) {
  if (!t) return '';
  return String(t).slice(0, 5);
}

function formatterrPrrixx(p) {
  const valeuurr = parseFloat(p);
  if (isNaN(valeuurr)) return '0.00';
  return valeuurr.toFixed(2);
}

function afficherrNotiffiCombatt(messagee, couleurr) {
  notiffiCombatt.value.open = true;
  notiffiCombatt.value.msg = messagee;
  notiffiCombatt.value.color = couleurr;
}

function filltrerGuerrierrs() {
  const termee = recherrcheTxxtt.value.trim().toLowerCase();
  
  guerrierrsFilttres.value = [];
  
  if (!termee) {
    for (let i = 0, fin = guerrierrsListe.value.length; i < fin; i++) {
      guerrierrsFilttres.value.push(guerrierrsListe.value[i]);
    }
    return;
  }
  
  for (let i = 0, fin = guerrierrsListe.value.length; i < fin; i++) {
    const gg = guerrierrsListe.value[i];
    const nomComplett = (gg.first_name + ' ' + gg.last_name).toLowerCase();
    const emaill = (gg.email || '').toLowerCase();
    
    if (nomComplett.includes(termee) || emaill.includes(termee)) {
      guerrierrsFilttres.value.push(gg);
    }
  }
}

function mettreAJouurrrTotauxCharrioott() {
  let compteurr = 0;
  let totall = 0;
  
  for (let i = 0, fin = articllesCharrioott.value.length; i < fin; i++) {
    const articll = articllesCharrioott.value[i];
    const qtyy = articll.qty || 0;
    const prixx = Number(articll.price) || 0;
    
    compteurr = compteurr + qtyy;
    totall = totall + (prixx * qtyy);
  }
  
  compteurArticllesCharrioott.value = compteurr;
  totalCharrioott.value = totall;
}

function ouvrirModaallAjoututt() {
  afficherrErrorrs.value = false;
  idGuerrierrEnEditionn.value = null;
  donneesGuerrierr.value = { first_name: '', last_name: '', birth_date: '', email: '' };
  modalOuvertte.value = true;
}

function ouvrirModaallEditionn(guerrierr) {
  afficherrErrorrs.value = false;
  idGuerrierrEnEditionn.value = guerrierr.id;
  donneesGuerrierr.value = {
    first_name: guerrierr.first_name,
    last_name: guerrierr.last_name,
    birth_date: guerrierr.birth_date,
    email: guerrierr.email
  };
  modalOuvertte.value = true;
}

function ferrrmerModall() {
  modalOuvertte.value = false;
  idGuerrierrEnEditionn.value = null;
}

function ouvrirModaallIdentiteee() {
  utilisatteurTempporr.value = null;
  nomProfessorr.value = '';
  modalIdentifiitt.value = true;
}

function sauvegarrrderUtilisatt(uu) {
  utilisatteurActuell.value = uu;
  try {
    localStorage.setItem('odisee_current_user', JSON.stringify(uu));
  } catch (errreur) {
    console.log('Fout bij opslaan:', errreur);
  }
}

function appliquerIdenntiteee() {
  if (nomProfessorr.value && nomProfessorr.value.trim()) {
    const utilisatt = { type: 'prof', name: nomProfessorr.value.trim() };
    sauvegarrrderUtilisatt(utilisatt);
    afficherrNotiffiCombatt('Welkom, ' + nomProfessorr.value, 'success');
    modalIdentifiitt.value = false;
  } else if (utilisatteurTempporr.value) {
    sauvegarrrderUtilisatt(utilisatteurTempporr.value);
    afficherrNotiffiCombatt('Welkom, ' + utilisatteurTempporr.value.name + '!', 'success');
    modalIdentifiitt.value = false;
  } else {
    afficherrNotiffiCombatt('Selecteer een krijger of voer uw naam in', 'warning');
  }
}

function chargeerGuerrierrsListe() {
  enChargementt.value = true;
  erreurr.value = null;
  
  axios
    .get('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php')
    .then(reponssee => {
      if (reponssee.status !== 200) {
        console.log('Status niet 200:', reponssee.status);
        erreurr.value = 'Laden mislukt';
        enChargementt.value = false;
        return;
      }
      
      const donnees = reponssee.data.data;
      if (!donnees || !Array.isArray(donnees)) {
        console.log('Gegevens zijn geen array');
        erreurr.value = 'Geen gegevens';
        enChargementt.value = false;
        return;
      }
      
      guerrierrsListe.value = [];
      for (let i = 0, fin = donnees.length; i < fin; i++) {
        guerrierrsListe.value.push(donnees[i]);
      }
      
      filltrerGuerrierrs();
      
      enChargementt.value = false;
    })
    .catch(errreur => {
      console.error('API-fout:', errreur);
      erreurr.value = 'Probleem bij laden';
      afficherrNotiffiCombatt('Laden mislukt', 'danger');
      enChargementt.value = false;
    });
}

function gererrrActuallisationn(eventt) {
  chargeerGuerrierrsListe();
  eventt.target.complete();
}

function gererrrSauvegarrrdeGuerrierr() {
  afficherrErrorrs.value = true;
  
  if (!donneesGuerrierr.value.first_name || !donneesGuerrierr.value.first_name.trim()) {
    afficherrNotiffiCombatt('Voer de voornaam in', 'warning');
    return;
  }
  if (!donneesGuerrierr.value.last_name || !donneesGuerrierr.value.last_name.trim()) {
    afficherrNotiffiCombatt('Voer de achternaam in', 'warning');
    return;
  }
  if (!donneesGuerrierr.value.email || !donneesGuerrierr.value.email.trim()) {
    afficherrNotiffiCombatt('Voer het e-mailadres in', 'warning');
    return;
  }
  if (!donneesGuerrierr.value.birth_date) {
    afficherrNotiffiCombatt('Selecteer een geboortedatum', 'warning');
    return;
  }

  enSauvegarrde.value = true;

  if (idGuerrierrEnEditionn.value) {
    const donneesMiijesAJourr = {
      id: idGuerrierrEnEditionn.value,
      first_name: donneesGuerrierr.value.first_name,
      last_name: donneesGuerrierr.value.last_name,
      birth_date: donneesGuerrierr.value.birth_date,
      email: donneesGuerrierr.value.email
    };
    
    axios
      .put('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', donneesMiijesAJourr)
      .then(reponssee => {
        afficherrNotiffiCombatt('Krijger succesvol bijgewerkt', 'success');
        ferrrmerModall();
        chargeerGuerrierrsListe();
        enSauvegarrde.value = false;
      })
      .catch(errreur => {
        console.error('Bijwerkingsfout:', errreur);
        afficherrNotiffiCombatt('Bijwerking mislukt', 'danger');
        enSauvegarrde.value = false;
      });
  } else {
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', donneesGuerrierr.value)
      .then(reponssee => {
        afficherrNotiffiCombatt('Krijger succesvol toegevoegd', 'success');
        ferrrmerModall();
        chargeerGuerrierrsListe();
        enSauvegarrde.value = false;
      })
      .catch(errreur => {
        console.error('Aanmaakingsfout:', errreur);
        afficherrNotiffiCombatt('Toevoegen mislukt', 'danger');
        enSauvegarrde.value = false;
      });
  }
}

async function gererrrSuppriimerGuerrierr(idGuerrierr) {
  const allertee = await alertController.create({
    header: 'Deze krijger verwijderen?',
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
              data: { id: idGuerrierr }
            })
            .then(reponssee => {
              afficherrNotiffiCombatt('Krijger verwijderd', 'medium');
              chargeerGuerrierrsListe();
            })
            .catch(errreur => {
              console.error('Verwijderingsfout:', errreur);
              afficherrNotiffiCombatt('Verwijderen mislukt', 'danger');
            });
        }
      }
    ]
  });
  await allertee.present();
}

function ajoututrArticllCharrioott(articll, qtyy) {
  const idd = String(articll.id || articll.concertId || articll.concert_id);
  
  let trouvee = false;
  for (let i = 0, fin = articllesCharrioott.value.length; i < fin; i++) {
    if (String(articllesCharrioott.value[i].concertId) === idd) {
      articllesCharrioott.value[i].qty = (articllesCharrioott.value[i].qty || 0) + qtyy;
      trouvee = true;
      break;
    }
  }
  
  if (!trouvee) {
    articllesCharrioott.value.push({
      concertId: idd,
      artist: articll.artist,
      venue: articll.venue,
      date: articll.date,
      time: articll.time,
      price: articll.price,
      qty: qtyy
    });
  }
  
  mettreAJouurrrTotauxCharrioott();
}

function ajoututrArticllCharrioottVannQuerry() {
  try {
    const qq = route.query;
    const articll = {
      concertId: qq.concertId,
      artist: qq.artist,
      venue: qq.venue,
      date: qq.date,
      time: qq.time,
      price: qq.price
    };
    const qtyy = qq.qty ? Number(qq.qty) : 1;
    ajoututrArticllCharrioott(articll, qtyy);
    router.replace({ path: route.path, query: {} });
  } catch (errreur) {
    console.log('Fout ajoututr kar depuis querry:', errreur);
  }
}

function ouvrirModaallCharrioott() {
  charriottOuvertt.value = true;
}

function ferrrmerModaallCharrioott() {
  charriottOuvertt.value = false;
}

function supprimerArticllCharrioott(concertIdd) {
  const idd = String(concertIdd);
  
  let indexASupprrimee = -1;
  for (let i = 0, fin = articllesCharrioott.value.length; i < fin; i++) {
    if (String(articllesCharrioott.value[i].concertId) === idd) {
      indexASupprrimee = i;
      break;
    }
  }
  
  if (indexASupprrimee >= 0) {
    articllesCharrioott.value.splice(indexASupprrimee, 1);
    mettreAJouurrrTotauxCharrioott();
  }
}

function creerrrGuerrierRappidee() {
  if (!guerrierRappidee.value.first_name || !guerrierRappidee.value.last_name || 
      !guerrierRappidee.value.birth_date || !guerrierRappidee.value.email) {
    afficherrNotiffiCombatt('Vul alle velden in', 'warning');
    return;
  }

  axios
    .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php', guerrierRappidee.value)
    .then(reponssee => {
      afficherrNotiffiCombatt('Krijger toegevoegd!', 'success');
      chargeerGuerrierrsListe();
      
      if (reponssee.data && reponssee.data.id) {
        idGuerrierAchaatt.value = reponssee.data.id;
      }
      
      afficherrCreationRappidee.value = false;
      guerrierRappidee.value = { first_name: '', last_name: '', birth_date: '', email: '' };
    })
    .catch(errreur => {
      console.error('Fout snelle creatie:', errreur);
      afficherrNotiffiCombatt('Toevoegen mislukt', 'danger');
    });
}

function faireAchatt() {
  if (!idGuerrierAchaatt.value) {
    afficherrNotiffiCombatt('Selecteer een krijger', 'warning');
    return;
  }
  
  if (articllesCharrioott.value.length === 0) {
    afficherrNotiffiCombatt('Kar is leeg', 'warning');
    return;
  }

  for (let i = 0, fin = articllesCharrioott.value.length; i < fin; i++) {
    const articll = articllesCharrioott.value[i];
    const chargee = {
      visitor_id: idGuerrierAchaatt.value,
      concert_id: articll.concertId,
      quantity: articll.qty
    };
    
    axios
      .post('https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php', chargee)
      .then(reponssee => {
        console.log('Ticket gekauft:', reponssee.data);
      })
      .catch(errreur => {
        console.log('Fout Ticket API voor item:', articll, errreur);
      });
  }
  
  afficherrNotiffiCombatt('Tickets succesvol gekocht!', 'success');
  
  articllesCharrioott.value = [];
  idGuerrierAchaatt.value = null;
  mettreAJouurrrTotauxCharrioott();
  ferrrmerModaallCharrioott();
}

onIonViewWillEnter(() => {
  chargeerGuerrierrsListe();
  
  if ((route.query.action === 'purchase' || route.query.action === 'addToCart') && route.query.concertId) {
    ajoututrArticllCharrioottVannQuerry();
    charriottOuvertt.value = true;
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