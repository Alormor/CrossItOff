<script setup>
import { getAuth, signOut } from "firebase/auth";
import { useCurrentUser } from 'vuefire';
import { useRouter } from "vue-router";

const auth = getAuth();
const router = useRouter();
const user = useCurrentUser();

const admin = "admin@correo.com";

function logout(){
  signOut(auth).then(() => {
    // Sign-out successful.
    router.push("/");

  }).catch((error) => {
    // An error happened.
  });
}
</script>


<template>
  <div class="app-layout">
    <header class="header">
      <div class="heading">
        <h1 class="heading__title"><RouterLink to="/">Cross It Off!</RouterLink></h1>
      </div>

      <nav class="nav">
        <ul class="nav-list">
          <li class="nav-item"><RouterLink to="/">Home</RouterLink></li>
          <li v-if="!user" class="nav-item"><RouterLink to="/login">Login</RouterLink></li>
          <li v-if="!user" class="nav-item"><RouterLink to="/register">Register</RouterLink></li>
          <li v-if="user" class="nav-item"><RouterLink to="/todolist">To-Do List</RouterLink></li>
          <li v-if="user && user.email == admin" class="nav-item admin"><RouterLink to="/admin">Admin</RouterLink></li>
        </ul>

        <div class="nav-container" v-if="user">
          <div class="nav-container__user">
            <p class="nav-container__user-name" v-if="user.displayName">{{ user.displayName }}</p>
            <p class="nav-container__user-name" v-else>{{ user.email }}</p>
          </div>
          <button class="nav-container__logout" @click="logout">Logout</button>
        </div>
      </nav>
    </header>

    <main class="main-content">
      <RouterView />
    </main>

    <footer class="footer">
      <p>Created by Abraham Lorenzo Moreno</p>
      <p>Code available in <a href="https://github.com/alormor/CrossItOff" target="_blank"><i class="bi bi-github"></i> GitHub</a></p>
    </footer>
  </div>
</template>

<style scoped>
.app-layout {
  display: grid;
  grid-template-rows: auto 1fr auto;
  min-height: 100vh;
}

.header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: var(--color-yellow);
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  gap: var(--spacing-md);
}

@media (max-width: 768px) {
  .header {
    grid-template-columns: 1fr;
  }
}

.heading__title {
  margin: 0;
  color: var(--color-magenta);
  font-size: 2.5rem;
}

.nav {
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--spacing-lg);
  align-items: center;
}

.nav-list {
  display: grid;
  grid-auto-flow: column;
  gap: var(--spacing-md);
  list-style: none;
  margin: 0;
  padding: 0;
}

.nav-item a {
  color: var(--color-dark);
  font-family: var(--font-fun);
  font-size: 1.2rem;
  padding: 0.5rem;
}

.nav-item a.router-link-active {
  color: var(--color-red);
  border-bottom: 3px solid var(--color-red);
}

.nav-container {
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--spacing-md);
  align-items: center;
}

@media (max-width: 768px) {
  .nav {
    grid-template-columns: 1fr;
  }
}

.nav-container__user-name {
  font-weight: bold;
  color: var(--color-dark);
  margin: 0;
}

.nav-container__logout {
  background-color: var(--color-red);
}

.nav-container__logout:hover {
  background-color: var(--color-magenta);
}

.main-content {
  padding: var(--spacing-lg);
  display: grid;
  justify-items: center;
}

.footer {
  display: grid;
  gap: var(--spacing-sm);
  justify-items: center;
  padding: var(--spacing-lg);
  background-color: var(--color-dark);
  color: var(--color-yellow);
  text-align: center;
}

.footer a {
  color: var(--color-cyan);
}

.footer a:hover {
  color: var(--color-orange);
}
</style>