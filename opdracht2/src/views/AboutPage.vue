<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="horde-toolbar">
        <ion-buttons slot="start">
          <ion-back-button default-href="/" color="light"></ion-back-button>
        </ion-buttons>
        <ion-title class="horde-title">mijn opdracht 2</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="horde-content">
      <ion-refresher slot="fixed" @ionRefresh="handleRefresh">
        <ion-refresher-content></ion-refresher-content>
      </ion-refresher>

     
      <div class="horde-banner">
        <div class="horde-symbol">⚔️</div>
        <ion-avatar class="profile-avatar">
          <ion-img :src="amineImage" alt="Profile image of Amine"></ion-img>
        </ion-avatar>
        <h1 class="hero-name">Mohamed Amine Hssinoui</h1>
        
        <p class="guild-name">🏛️ Odisee Hogeschool</p>
      </div>

      <!-- Stats Card -->
      <ion-card class="stats-card">
        <ion-card-header>
          <ion-card-title class="section-title">
            <ion-icon :icon="trophy" class="title-icon" />
          OVER MIJ
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-grid>
            <ion-row>
              <ion-col size="6">
                <div class="stat-box">
                  <ion-icon :icon="school" class="stat-icon" color="warning" />
                  <div class="stat-label">Opleiding</div>
                  <div class="stat-value">Toegepaste Informatica</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-box">
                  <ion-icon :icon="calendar" class="stat-icon" color="success" />
                  <div class="stat-label">Leeftijd</div>
                  <div class="stat-value">21 jaar</div>
                  <p style="font-size: 12px; color: #AAA; margin-top: 4px;">14 september 2003</p>
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="6">
                <div class="stat-box">
                  <ion-icon :icon="rocket" class="stat-icon" color="tertiary" />
                  <div class="stat-label">Level</div>
                  <div class="stat-value">Student 3 BACHELOR</div>
                </div>
              </ion-col>
              <ion-col size="6">
                <div class="stat-box">
                  <ion-icon :icon="construct" class="stat-icon" color="danger" />
                  <div class="stat-label">Specialisatie</div>
                  <div class="stat-value">Web & Mobile</div>
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <div class="stat-box">
                  <ion-icon :icon="football" class="stat-icon" color="primary" />
                  <div class="stat-label">Hobbies & Passies</div>
                  <div class="stat-value">⚽ Voetbal - FC Barcelona & Chelsea</div>
                  <p style="font-size: 13px; color: #CCC; margin-top: 8px;">
                    🚗 Automobiel liefhebber 🎵 Muziek (alle genres)
                  </p>
                </div>
              </ion-col>
            </ion-row>
            <ion-row>
              <ion-col size="12">
                <div class="stat-box">
                  <ion-icon :icon="briefcase" class="stat-icon" color="warning" />
                  <div class="stat-label">Toekomstdroom</div>
                  <div class="stat-value">🏢 Werken bij Audi of eigen business</div>
                </div>
              </ion-col>
            </ion-row>
          </ion-grid>
        </ion-card-content>
      </ion-card>

      
      <ion-card class="quest-card">
        <ion-card-header>
          <ion-card-title class="section-title">
            <ion-icon :icon="flag" class="title-icon" />
            Huidige Quest
          </ion-card-title>
          <ion-card-subtitle>Concert Ticket Manager App</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p class="quest-description">
            Deze app is gebouwd als onderdeel van het vak Web & Mobile. Hieronder vind je de belangrijkste vereisten en afleverinstructies voor de individuele oefening (kort en duidelijk).
          </p>

          <div class="quest-progress">
            <ion-progress-bar :value="questProgress" color="success"></ion-progress-bar>
            <p class="progress-text">Quest Progress: {{ Math.round(questProgress * 100) }}%</p>
          </div>

          <ion-list class="objectives-list" lines="none">
            <ion-item>
              <ion-label>
                <h3 class="objective-title">Belangrijkste vereisten</h3>
                <p>- Gebruik Ionic + Vue</p>
                <p>- Koppel aan jouw RESTful API (concerten, bezoekers, tickets)</p>
                <p>- Toon gegevens van concerten, bezoekers en tickets</p>
                <p>- CRUD voor concerten en bezoekers (toevoegen, aanpassen, verwijderen)</p>
                <p>- Een bezoeker kan tickets kopen voor meerdere concerten; een concert heeft meerdere tickets</p>
                <p>- Toon geen ruwe ID's; gebruik gebruiksvriendelijke UI/validatie</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3 class="objective-title">Artefacten & extra's</h3>
                <p>- Voeg een 'About' scherm toe met korte toelichting + profielfoto (je hebt al een profielfoto toegevoegd)</p>
                <p>- Voeg in je repo een map <code>demo</code> met een video van de app op een Android toestel/emulator</p>
                <p>- Voeg een debug APK (app-debug.apk) toe aan de repo</p>
                <p>- Voeg extra's toe in een README.md in de root</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3 class="objective-title">Praktisch</h3>
                <p>- Waarde: 5/20 punten</p>
                <p>- Deadline: ma 3/11 12:00</p>
                <p>- Deel de private repo met de docent en nodig de docent uit (uitnodiging vervalt na 7 dagen)</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-label>
                <h3 class="objective-title">Cesuur / Minimale vereisten</h3>
                <p>- Navigatie werkt</p>
                <p>- App communiceert met jouw RESTful API</p>
                <p>- Data kan worden doorgegeven tussen schermen (state-management)</p>
                <p>- Professioneel gebruik van componenten en gebruiksvriendelijkheid</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

   
      <ion-card class="abilities-card">
        <ion-card-header>
          <ion-card-title class="section-title">
            <ion-icon :icon="flash" class="title-icon" />
            Abilities
            
          </ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="none">
            <ion-item v-for="ability in abilities" :key="ability.name" class="ability-item">
              <ion-icon :icon="ability.icon" slot="start" :color="ability.color" class="ability-icon" />
              <ion-label>
                <h3 class="ability-name">{{ ability.name }}</h3>
                <p class="ability-desc">{{ ability.description }}</p>
              </ion-label>
              <ion-badge :color="ability.color" slot="end">Lvl {{ ability.level }}</ion-badge>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>


      <div class="horde-footer">
        <ion-chip color="danger" class="footer-chip">
          <ion-icon :icon="heart" />
          <ion-label>Gemaakt met vue en ionic</ion-label>
        </ion-chip>
        
        <p class="footer-copyright"> 2024-2025 Mohamed Amine Hssinoui 3it</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue';
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButtons, IonBackButton,
  IonAvatar, IonImg, IonIcon, IonLabel, IonList, IonItem, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonCardContent, IonChip, IonBadge, IonCheckbox,
  IonGrid, IonRow, IonCol, IonProgressBar, IonRefresher, IonRefresherContent
} from '@ionic/vue';
import {
  code, trophy, school, calendar, rocket, construct, flag, flash, gift, heart,
  musicalNotes, people, ticket, logoVue, phonePortrait, cloud, football, briefcase
} from 'ionicons/icons';


import amineImage from '../assets/amine.jpeg';
const objectives = ref([
  { id: 1, name: 'Concerten beheren', completed: true },
  { id: 2, name: 'Bezoekers toevoegen', completed: true },
  { id: 3, name: 'Tickets kopen', completed: true },
  { id: 4, name: 'RESTful API integratie', completed: true },
  { id: 5, name: 'Ionic componenten gebruiken', completed: true }
]);


const abilities = ref([
  { name: 'Vue ', description: 'Frontend framework', icon: logoVue, color: 'success',  },
  { name: 'Ionic ', description: 'Mobile UI', icon: phonePortrait, color: 'primary',  },
  { name: 'RESTful API', description: 'Backend communicatie', icon: cloud, color: 'warning', },
  { name: 'JavaScript', description: 'Programming language', icon: code, color: 'tertiary', }
]);


const questProgress = ref(0);

function calculateProgress() {
  let completed = 0;
  let total = objectives.value.length;
  
  for (let i = 0, end = objectives.value.length; i < end; i++) {
    if (objectives.value[i].completed) {
      completed = completed + 1;
    }
  }
  
  questProgress.value = completed / total;
}


calculateProgress();

function handleRefresh(event) {

  calculateProgress();
  event.target.complete();
}
</script>

<style scoped>

.horde-content {
  --background: linear-gradient(180deg, #1a0f0f 0%, #2d1818 100%);
}

.horde-toolbar {
  --background: linear-gradient(90deg, #000000 0%, #DC143C 100%);
  --color: #ff0e0e;
}

.horde-title {
  font-family: 'Georgia', serif;
  font-weight: 700;
  font-size: 20px;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.5);
}


.horde-banner {
  background: linear-gradient(135deg, #8B0000 0%, #DC143C 50%, #B22222 100%);
  padding: 34px 20px;
  text-align: center;
  position: relative;
  box-shadow: 0 4px 12px rgba(0,0,0,0.4);
  border-bottom: 3px solid #FFD700;
}

.horde-symbol {
  font-size: 48px;
  margin-bottom: 16px;
  filter: drop-shadow(0 2px 4px rgba(0,0,0,0.5));
}

.profile-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 16px;
  border: 4px solid #FFD700;
  box-shadow: 0 4px 16px rgba(255, 215, 0, 0.4);
}

.hero-name {
  font-size: 28px;
  font-weight: 700;
  color: #FFD700;
  margin: 0 0 12px 0;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.7);
  font-family: 'Georgia', serif;
}

.class-chip {
  font-weight: 700;
  font-size: 16px;
  height: 32px;
}

.guild-name {
  font-size: 16px;
  color: #FFF;
  margin: 12px 0 0 0;
  opacity: 0.9;
}

ion-card {
  margin: 16px;
  border-radius: 12px;
  background: linear-gradient(135deg, #2a1a1a 0%, #1a0f0f 100%);
  border: 2px solid #8B0000;
  box-shadow: 0 4px 12px rgba(139, 0, 0, 0.3);
}

.section-title {
  font-size: 22px;
  font-weight: 700;
  color: #FFD700;
  display: flex;
  align-items: center;
  gap: 8px;
  font-family: 'Georgia', serif;
}

.title-icon {
  font-size: 28px;
  color: #DC143C;
}

ion-card-subtitle {
  color: #CCC;
  font-size: 16px;
  margin-top: 8px;
}


.stat-box {
  background: rgba(139, 0, 0, 0.2);
  border: 1px solid #8B0000;
  border-radius: 8px;
  padding: 16px;
  text-align: center;
  margin: 4px;
}

.stat-icon {
  font-size: 32px;
  margin-bottom: 8px;
}

.stat-label {
  font-size: 13px;
  color: #CCC;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 4px;
}

.stat-value {
  font-size: 16px;
  font-weight: 700;
  color: #FFD700;
}

.quest-description {
  font-size: 16px;
  line-height: 1.6;
  color: #DDD;
  margin: 0 0 16px 0;
}

.quest-progress {
  margin: 16px 0;
}

.progress-text {
  font-size: 14px;
  color: #FFD700;
  text-align: center;
  margin-top: 8px;
  font-weight: 600;
}

.objectives-list {
  background: transparent;
  margin-top: 16px;
}

.objectives-list ion-item {
  --background: rgba(139, 0, 0, 0.15);
  --border-radius: 8px;
  margin-bottom: 8px;
}

.objective-title {
  font-size: 16px;
  color: #DDD;
  font-weight: 600;
}


.ability-item {
  --background: rgba(139, 0, 0, 0.15);
  --border-radius: 8px;
  margin-bottom: 8px;
  --padding-start: 12px;
}

.ability-icon {
  font-size: 32px;
}

.ability-name {
  font-size: 18px;
  font-weight: 700;
  color: #FFD700;
  margin: 0 0 4px 0;
}

.ability-desc {
  font-size: 14px;
  color: #CCC;
  margin: 0;
}

.horde-footer {
  text-align: center;
  padding: 32px 20px;
  margin-top: 20px;
}

.footer-chip {
  font-weight: 700;
  font-size: 16px;
  margin-bottom: 12px;
}

.footer-text {
  font-size: 16px;
  color: #FFD700;
  font-weight: 700;
  margin: 12px 0;
  font-family: 'Georgia', serif;
}

.footer-copyright {
  font-size: 14px;
  color: #CCC;
  margin: 8px 0;
}


ion-list {
  background: transparent;
}

ion-item {
  --background: transparent;
  --color: #DDD;
  --padding-start: 0;
  --inner-padding-end: 0;
}

ion-card-content {
  color: #DDD;
}


ion-checkbox {
  --size: 24px;
  --checkbox-background-checked: #228B22;
}

@media (prefers-color-scheme: dark) {
}
</style>