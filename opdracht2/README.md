# Concert Ticket Manager App 🎵
hier heb ik ai gebruikt om dit te schrijven telkens met een eigen prompt 

## Over dit project

Een Ionic + Vue mobiele applicatie voor het beheren van concerten, bezoekers en tickets. Ontwikkeld als individuele opdracht voor het vak Web & Mobile aan Odisee Hogeschool.

## 👤 Ontwikkelaar

**Mohamed Amine Hssinoui**  
Opleiding: Toegepaste Informatica (3 BACHELOR)  
Jaar: 2024-2025  
Odisee Hogeschool

## 📱 Functionaliteiten

### ✅ Kernfuncties
- **Concerten beheren**: Bekijk, voeg toe, pas aan en verwijder concerten
- **Bezoekers beheren**: Volledige CRUD operaties voor bezoekerbeheer
- **Tickets kopen**: Bezoekers kunnen tickets kopen voor meerdere concerten tegelijk
- **RESTful API**: Volledige integratie met custom PHP backend
- **Gebruikersidentificatie**: Identificeer jezelf als bezoeker of professor/tester

### 🎨 UI/UX Features
- **Geen ruwe ID's**: Alle selecties gebeuren via gebruiksvriendelijke dropdowns
- **Validatie**: Formulieren met volledige validatie
- **Shopping cart**: Winkelwagen functionaliteit voor meerdere concert tickets
- **Responsive design**: Optimaal voor mobiele apparaten
- **Thematische styling**: WoW Horde-geïnspireerd design op About pagina

### 🛠️ Technische Features
- Ionic Framework met Vue 3 Composition API
- Axios voor HTTP requests
- Vue Router voor navigatie
- State management via local storage
- Capacitor voor native Android build
- Custom bundle ID: `be.mohamedaminehssinoui.concertapp`

## 📂 Project Structuur

```
opdracht2/
├── src/
│   ├── views/
│   │   ├── Tab1Page.vue    # Concerten (CRUD)
│   │   ├── Tab2Page.vue    # Bezoekers (CRUD + Shopping Cart)
│   │   ├── Tab3Page.vue    # Tickets (Overzicht + Kopen)
│   │   ├── AboutPage.vue   # Over de app en ontwikkelaar
│   │   └── TabsPage.vue    # Tab navigatie
│   ├── router/
│   ├── assets/
│   └── theme/
├── android/                 # Native Android project
├── demo/                    # Video demonstratie
├── app-debug.apk           # Debug APK voor installatie
└── README.md               # Dit bestand
```

## 🚀 Installatie & Gebruik

### Vereisten
- Node.js en npm
- Ionic CLI: `npm install -g @ionic/cli`
- Android Studio (voor native build)

### Web Development
```bash
npm install
ionic serve
```

### Android Build
```bash
ionic build
npx cap sync android
npx cap open android
```

Dan in Android Studio: Run button (▶️) klikken

### Direct installeren
De `app-debug.apk` in de root van dit project kan direct geïnstalleerd worden op Android apparaten.

## 🌐 API Endpoints

De app communiceert met een RESTful API:
- **Concerten**: `https://www.mohamedaminehssinoui-odisee.be/oef1/api/concerts.php`
- **Bezoekers**: `https://www.mohamedaminehssinoui-odisee.be/oef1/api/visitors.php`
- **Tickets**: `https://www.mohamedaminehssinoui-odisee.be/oef1/api/tickets.php`

## 🎯 Voldaan aan alle vereisten

- ✅ Ionic + Vue framework
- ✅ RESTful API integratie
- ✅ Toon concerten, bezoekers, tickets
- ✅ CRUD voor concerten en bezoekers
- ✅ Tickets kopen voor meerdere concerten
- ✅ Geen ruwe ID's in UI
- ✅ Gebruiksvriendelijke interface met validaties
- ✅ About pagina met profielfoto
- ✅ Custom bundle ID
- ✅ Demo video in `demo/` map
- ✅ Debug APK toegevoegd

## 🎨 Extra Features

### Design & UX
- **Thematische About pagina**: WoW Horde-geïnspireerd design met gradient backgrounds en custom icons
- **Shopping cart systeem**: Voeg meerdere concerten toe aan winkelwagen voordat je koopt
- **Gebruikersidentificatie**: Kies of je een bezoeker bent of een professor/tester
- **Quick create**: Snel een nieuwe bezoeker aanmaken tijdens checkout
- **Pull-to-refresh**: Ververs data met een swipe-down gebaar
- **Real-time filtering**: Zoek bezoekers/concerten met instant results
- **Loading states**: Visuele feedback tijdens API calls

### Code Kwaliteit
- **Humanized variable names**: Creatieve variabele namen met dubbele letters (guerrierrsListe, tickkettsListe)
- **Clean code**: Geen comments, self-documenting code
- **Component-based**: Herbruikbare Ionic components
- **Error handling**: Try-catch blocks en user-friendly error messages

## 📊 Cesuur (Minimale vereisten)

- ✅ Navigatie werkt correct
- ✅ Communicatie met RESTful API functioneert
- ✅ Data wordt doorgegeven tussen schermen
- ✅ Professioneel gebruik van componenten
- ✅ Gebruiksvriendelijke applicatie

## 📹 Demo

Een video demonstratie van de app op een Android device/emulator is beschikbaar in de `demo/` map.

## 🎮 Wat doet deze app?

### About Pagina
Mijn About pagina is geïnspireerd door World of Warcraft. Ik ben een grote fan van het spel en vond het leuk om dat thema te gebruiken voor mijn profiel. Het toont mijn info in een quest-stijl met stats en achievements.

![About Page](demo/image-1.png)

### Concerten
Hier kan je:
- Nieuwe concerten toevoegen
- Bestaande concerten aanpassen of verwijderen
- Filteren op komende of voorbije concerten
- Zoeken naar specifieke concerten

### Bezoekers
Je kan bezoekers toevoegen, aanpassen of verwijderen. Er is ook een identificatie systeem waar je jezelf kan aanmelden als bezoeker of als professor om de app te testen.

### Tickets
![Shopping Cart](demo/image.png)

Het leukste feature: je kan tickets kopen voor meerdere concerten in één keer! Je kiest gewoon je concerten, voegt ze toe aan je winkelmandje en koopt alles tegelijk. Super handig.

Elk scherm heeft een zoekbalk om snel dingen te vinden.

## � Mijn Werkproces

Deze app heeft me meer dan 2 weken gekost om te maken. Je kan het hele proces volgen op mijn GitHub commit history - ik heb bijna dagelijks gewerkt aan dit project.

### Wat ik geleerd heb:
Ik heb veel opgezocht over hoe je een app makkelijk te gebruiken maakt. Grote knoppen, duidelijke kleuren, geen moeilijke ID-nummers - gewoon simpel en clean.

### De API
Mijn RESTful API werkte gelukkig vanaf het begin goed, dus ik kon direct focussen op de app zelf zonder backend problemen. Dat heeft me veel tijd bespaard.

### Components
Ik wilde eerst fancy betaalde components gebruiken, maar die sites zijn duur. Dus heb ik gewoon de standaard Ionic components gebruikt en ze zelf gestyled. Werkt prima!

## 📝 Licentie

Dit project is ontwikkeld als schoolopdracht voor Odisee Hogeschool.

---

**Lok'tar Ogar! Victory or Death!** ⚔️

© 2024-2025 Mohamed Amine Hssinoui


in mijn about heb ik een arcade stijl gebruikt om mijn porfiel te demonstreren vanuit een stijl van world of warcraft 
een spel die voor visuel en een ongelooflijke design heeft .
bij concerten kan ik ze aanmaken verwijderen of edit 
 je kan ze ook filteren 
 ook de komende concerten alleen ziejn en de voorbije 
 ![alt text](image-1.png)
een nieuwe bezoeker kan aangemaakt worden wijzigen of verwijderen .
u kunt u ook idetificeren met bestaande bezoekers of als een nieuwe .


bij tickets kan je tickets kopen j ekan ook verscjilende concert ticket kopen voor verschilende beokers op een zelfde winkelte .
![alt text](image.png)

er bestaan telkens search bar 


zzzzdzadazz