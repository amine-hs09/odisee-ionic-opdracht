<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/" />
        </ion-buttons>
        <ion-title>Slides</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content class="ion-padding">
      <div v-if="images.length === 0" class="empty">
        Aucun slide trouvé. Exporte les pages du PDF dans `src/assets/slides/` (slide1.png, slide2.png ...)
      </div>

      <div v-else class="viewer">
        <div class="controls">
          <ion-button @click="prev" :disabled="currentIndex === 0">Précédent</ion-button>
          <div class="counter">{{ currentIndex + 1 }} / {{ images.length }}</div>
          <ion-button @click="next" :disabled="currentIndex === images.length - 1">Suivant</ion-button>
        </div>

        <div class="slide-wrap">
          <img :src="images[currentIndex]" class="slide-image" alt="slide" />
        </div>

        <div class="thumbs">
          <button v-for="(img, i) in images" :key="i" :class="['thumb', { active: i === currentIndex }]" @click="goTo(i)">
            <img :src="img" alt="thumb" />
          </button>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup>
import { ref } from 'vue'
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonButton, IonButtons, IonBackButton } from '@ionic/vue'

// Import all images in the slides folder (png/jpg/jpeg). The folder must exist.
const modules = import.meta.glob('../assets/slides/*.{png,jpg,jpeg}', { eager: true })

// Convert to array of URLs and sort by filename (so slide1, slide2 ...)
const images = Object.keys(modules)
  .map(k => ({ path: k, url: modules[k].default }))
  .sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true }))
  .map(x => x.url)

const currentIndex = ref(0)

function prev() {
  if (currentIndex.value > 0) currentIndex.value--
}
function next() {
  if (currentIndex.value < images.length - 1) currentIndex.value++
}
function goTo(i) {
  currentIndex.value = i
}

// images is defined above and used directly in the template
</script>

<style scoped>
.empty{ text-align:center; margin-top:40px; color:var(--ion-color-medium); }
.viewer{ display:flex; flex-direction:column; gap:12px; align-items:center }
.controls{ display:flex; gap:12px; align-items:center }
.counter{ font-weight:600 }
.slide-wrap{ width:100%; display:flex; justify-content:center }
.slide-image{ max-width:100%; height:auto; border:1px solid #ddd; border-radius:6px }
.thumbs{ display:flex; gap:8px; overflow:auto; padding:8px; width:100%; }
.thumb{ border: none; background: transparent; padding:0; opacity:0.7 }
.thumb.active{ outline:2px solid var(--ion-color-primary); opacity:1 }
.thumb img{ width:80px; height:auto; display:block }
</style>
