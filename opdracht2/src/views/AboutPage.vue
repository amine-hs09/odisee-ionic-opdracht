<template>
  <ion-page>
    <ion-header>
      <ion-toolbar color="primary">
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>Over de App</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true" class="ion-padding">
      <div class="profile-section">
        <ion-avatar class="large-avatar">
          <ion-img src="https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Mohamed Amine Hssinoui"></ion-img>
        </ion-avatar>
        <h1 class="developer-name">Mohamed Amine Hssinoui</h1>
        <p class="developer-title">Student Toegepaste Informatica</p>
        <p class="developer-school">Odisee Hogeschool</p>
      </div>

      <ion-card>
        <ion-card-header>
          <ion-card-title class="card-title-large">Concert Ticket App</ion-card-title>
          <ion-card-subtitle>Versie 1.0 - 2024-2025</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <p class="description-text">
            Deze app helpt u om concerttickets te beheren. U kunt concerten bekijken,
            bezoekers toevoegen en tickets kopen. De app is gemaakt voor het vak
            Web & Mobile aan de Odisee Hogeschool.
          </p>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title class="card-title-large">Wat kunt u doen?</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item>
              <ion-icon :icon="musicalNotesOutline" slot="start" color="primary" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">Concerten</h2>
                <p class="feature-description">Bekijk alle concerten en voeg nieuwe toe</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="peopleOutline" slot="start" color="secondary" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">Bezoekers</h2>
                <p class="feature-description">Beheer alle bezoekersinformatie</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="ticketOutline" slot="start" color="tertiary" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">Tickets</h2>
                <p class="feature-description">Koop tickets voor uw favoriete concerten</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <ion-card>
        <ion-card-header>
          <ion-card-title class="card-title-large">Technologie</ion-card-title>
        </ion-card-header>
        <ion-card-content>
          <ion-list lines="full">
            <ion-item>
              <ion-icon :icon="phonePortraitOutline" slot="start" color="primary" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">Ionic Framework</h2>
                <p class="feature-description">Voor mobiele apps</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="logoVue" slot="start" color="success" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">Vue 3</h2>
                <p class="feature-description">JavaScript framework</p>
              </ion-label>
            </ion-item>

            <ion-item>
              <ion-icon :icon="cloudOutline" slot="start" color="warning" class="large-icon"></ion-icon>
              <ion-label class="ion-text-wrap">
                <h2 class="feature-title">RESTful API</h2>
                <p class="feature-description">Verbinding met de database</p>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>

      <div class="footer-info">
        <ion-text color="medium" class="ion-text-center">
          <p class="footer-text">Ontwikkeld met Ionic en Vue</p>
          <p class="footer-text">© 2024-2025 Mohamed Amine Hssinoui</p>
        </ion-text>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButtons,
  IonBackButton,
  IonAvatar,
  IonImg,
  IonText,
  IonIcon,
  IonLabel,
  IonList,
  IonItem,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonCardContent
} from '@ionic/vue';

import {
  musicalNotesOutline,
  cloudOutline,
  ticketOutline,
  peopleOutline,
  phonePortraitOutline,
  logoVue
} from 'ionicons/icons';
</script>

<style scoped>
.profile-section {
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(135deg, #3880ff 0%, #5260ff 100%);
  margin: -16px -16px 20px -16px;
  border-radius: 0 0 20px 20px;
  color: white;
}

.large-avatar {
  width: 120px;
  height: 120px;
  margin: 0 auto 20px;
  border: 4px solid white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.developer-name {
  font-size: 28px;
  font-weight: 700;
  margin: 0 0 10px 0;
  color: white;
}

.developer-title {
  font-size: 18px;
  margin: 5px 0;
  opacity: 0.95;
}

.developer-school {
  font-size: 16px;
  margin: 5px 0 0 0;
  opacity: 0.9;
}

ion-card {
  margin-bottom: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.card-title-large {
  font-size: 22px;
  font-weight: 700;
  color: var(--ion-color-dark);
}

.description-text {
  font-size: 16px;
  line-height: 1.6;
  color: var(--ion-color-dark);
  margin: 0;
}

ion-list {
  background: transparent;
  padding: 0;
}

ion-item {
  --padding-start: 0;
  --inner-padding-end: 0;
  --min-height: 70px;
  margin-bottom: 8px;
}

.large-icon {
  font-size: 32px;
  margin-right: 16px;
}

.feature-title {
  font-size: 18px;
  font-weight: 600;
  margin: 0 0 6px 0;
  color: var(--ion-color-dark);
}

.feature-description {
  font-size: 15px;
  line-height: 1.4;
  color: var(--ion-color-medium);
  margin: 0;
}

.footer-info {
  margin: 30px 0 20px;
  text-align: center;
}

.footer-text {
  font-size: 15px;
  margin: 8px 0;
}

@media (max-width: 576px) {
  .large-avatar {
    width: 100px;
    height: 100px;
  }

  .developer-name {
    font-size: 24px;
  }

  .developer-title,
  .developer-school {
    font-size: 16px;
  }

  .card-title-large {
    font-size: 20px;
  }

  .description-text {
    font-size: 15px;
  }

  .feature-title {
    font-size: 17px;
  }

  .feature-description {
    font-size: 14px;
  }
}
</style>
