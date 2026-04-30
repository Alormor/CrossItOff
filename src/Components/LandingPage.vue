<script setup>
import { useCurrentUser } from 'vuefire';

const user = useCurrentUser();
</script>

<template>
  <div class="landing">
    <div class="landing__hero">
      <h1 class="landing__title">Make a To-Do List</h1>
      <h2 class="landing__subtitle">And cross it off!</h2>
      
      <div class="landing__puns">
        <p>Doin' it doesn't feel half so good as crossing it off.</p>
        <p>Stop stressing, start crossing.</p>
        <p>List it. Do it. Cross it.</p>
      </div>
    </div>

    <div class="landing__actions" v-if="user">
      <p>Before you start your day, <span><RouterLink to="/todolist" class="landing__link">you know you got to make a plan!</RouterLink></span></p>
    </div>
    <div class="landing__actions" v-else>
      <p class="landing__cta">Ready to get productive?</p>
      <div class="landing__buttons">
        <RouterLink to="/login" class="btn btn--primary">Login</RouterLink>
        <RouterLink to="/register" class="btn btn--secondary">Register</RouterLink>
      </div>
    </div>
  </div>
</template>

<style scoped>
.landing {
  display: grid;
  gap: var(--spacing-lg);
  text-align: center;
  max-width: 800px;
  width: 100%;
}

.landing__hero {
  background-color: var(--color-cyan);
  padding: 3rem;
  border-radius: var(--radius);
  color: white;
  box-shadow: 0 8px 16px rgba(0,0,0,0.1);
}

.landing__title {
  font-size: 4rem;
  color: var(--color-yellow);
  text-shadow: 2px 2px 0 var(--color-dark);
  margin-bottom: var(--spacing-sm);
}

.landing__subtitle {
  color: white;
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
}

.landing__puns p {
  font-size: 1.2rem;
  margin: 0.5rem 0;
  font-family: var(--font-fun);
}

.landing__actions {
  display: grid;
  gap: var(--spacing-md);
  justify-items: center;
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius);
  border: 4px dashed var(--color-orange);
}

.landing__cta {
  font-size: 1.5rem;
  font-family: var(--font-fun);
  color: var(--color-magenta);
}

.landing__buttons {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
}

.btn {
  display: inline-block;
  padding: 1rem 2rem;
  border-radius: 2rem;
  font-size: 1.2rem;
  font-family: var(--font-fun);
  text-transform: uppercase;
}

.btn--primary {
  background-color: var(--color-magenta);
  color: white;
}

.btn--primary:hover {
  background-color: var(--color-red);
  color: white;
}

.btn--secondary {
  background-color: var(--color-yellow);
  color: var(--color-dark);
}

.btn--secondary:hover {
  background-color: var(--color-orange);
}

.landing__link {
  font-size: 1.5rem;
  color: var(--color-cyan);
  text-decoration: underline;
}
</style>