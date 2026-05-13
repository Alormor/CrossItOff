import { createApp } from 'vue'
import { initializeApp } from 'firebase/app'
import { VueFire, VueFireAuth  } from 'vuefire'
import { createWebHistory, createRouter } from 'vue-router'
import { getAuth, onAuthStateChanged } from "firebase/auth";

import App from './App.vue'
import LandingPage from './Components/LandingPage.vue'
import Login from './Components/Login.vue';
import Register from './Components/Register.vue';
import AdminToDo from './Components/AdminToDo.vue';
import UserToDo from './Components/UserToDo.vue';

import './assets/style.css'



const firebaseConfig = {
  apiKey: "AIzaSyCbWj77m61ko_nOM9F8LzFWXafISCO0qg8",
  authDomain: "todolist-bc0ca.firebaseapp.com",
  projectId: "todolist-bc0ca",
  storageBucket: "todolist-bc0ca.firebasestorage.app",
  messagingSenderId: "1026695119807",
  appId: "1:1026695119807:web:ef80ec49232a028684170a",
  measurementId: "G-CB18PWJW6P"
};

// Initialize Firebase
const firebaseApp = initializeApp(firebaseConfig);
const auth = getAuth(firebaseApp);

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      resolve(user);
    }, reject);
  });
};

const routes = [
  { path: '/', component: LandingPage, meta: { requiresAuth: false }},
  { path: '/login', component: Login, meta: { OnlyGuests: true}},
  { path: '/register', component: Register, meta: { OnlyGuests: true}},
  { path: '/todolist', component: UserToDo, meta: { requiresAuth: true }, meta: {logged:true}},
  { path: '/admin', component: AdminToDo, meta: { requiresAuth: true }, meta: {logged:true}}
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(async (to, from) => {
  const user = await getCurrentUser(); 
  if(!to.meta.logged && user){
    return '/todolist';
  }

  if (to.meta.requiresAuth && !user) {
    return '/';
  }

  if (to.meta.OnlyGuests && user) {
    return '/';
  }

  return true;
});

const app = createApp(App)

app.use( VueFire, {
    firebaseApp,
    modules: [VueFireAuth()],
});

app.use(router)

app.mount('#app')