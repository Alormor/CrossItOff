<script setup>
import { ref } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithEmailAndPassword, OAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";

const auth = getAuth();
const router = useRouter();

const providerGoogle = new GoogleAuthProvider();
const providerMicrosoft = new OAuthProvider('microsoft.com');

const ERROR_MESSAGES = {
    'auth/invalid-email': 'Wrong email format.',
    'auth/user-not-found': 'User not found.',
    'auth/invalid-credential': 'Wrong email or password.',
    'auth/missing-password': 'Password is required.'
}; 

var authError = ref("");

var email = ref("");
var password = ref("");

function loginEmail(){
    authError.value = "";

    signInWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        router.push("/");
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        authError.value = ERROR_MESSAGES[errorCode] || 'An unexpected error occurred. Try later or contact support.';
    });
}

function loginGoogle(){
  signInWithPopup(auth, providerGoogle)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    
    router.push("/");
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
    // ...
  });
}

function loginMicrosoft(){
  signInWithPopup(auth, providerMicrosoft)
  .then((result) => {
    // User is signed in.
    // IdP data available in result.additionalUserInfo.profile.

    // Get the OAuth access token and ID Token
    const credential = OAuthProvider.credentialFromResult(result);
    const accessToken = credential.accessToken;
    const idToken = credential.idToken;
  })
  .catch((error) => {
    // Handle error.
    const errorCode = error.code;
    const errorMessage = error.message;
  });
}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Welcome Back!</h2>
      
      <div class="auth-form">
        <div class="input-group">
          <label class="auth-label">Email</label>
          <input type="email"
              v-model="email"
              class="auth-input"
              placeholder="email@example.com"
              @keydown.enter="loginEmail()"
          >
        </div>

        <div class="input-group">
          <label class="auth-label">Password</label>
          <input 
              type="password"
              v-model="password"
              class="auth-input"
              placeholder="••••••••"
              @keydown.enter="loginEmail()"
          >
        </div>

        <button @click="loginEmail" class="btn-primary">Login</button>
        <p v-if="authError != ''" class="auth-error"><i class="bi bi-exclamation-circle-fill"></i> {{ authError }}</p>
      </div>
      
      <div class="auth-divider">
        <span>OR</span>
      </div>

      <div class="auth-socials">
          <button @click="loginGoogle" class="btn-social btn-google"><i class="bi bi-google"></i> Continue with Google</button>
          <button @click="loginMicrosoft" class="btn-social btn-microsoft"><i class="bi bi-windows"></i> Continue with Microsoft</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-wrapper {
  display: grid;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.auth-card {
  background-color: white;
  padding: 2.5rem;
  border-radius: var(--radius);
  box-shadow: 0 8px 24px rgba(0,0,0,0.1);
  width: 100%;
  max-width: 400px;
  border-top: 6px solid var(--color-orange);
}

.auth-title {
  text-align: center;
  color: var(--color-magenta);
  font-size: 2rem;
  margin-bottom: var(--spacing-lg);
}

.auth-form {
  display: grid;
  gap: var(--spacing-md);
}

.input-group {
  display: grid;
  gap: 0.25rem;
}

.auth-label {
  font-weight: bold;
  color: var(--color-dark);
  font-size: 0.9rem;
}

.auth-input {
  width: 100%;
}

.btn-primary {
  width: 100%;
  padding: 0.75rem;
  font-size: 1.2rem;
  margin-top: var(--spacing-sm);
}

.auth-error {
  color: var(--color-red);
  background-color: #ffebee;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.auth-divider {
  display: grid;
  align-items: center;
  grid-template-columns: 1fr auto 1fr;
  gap: var(--spacing-md);
  margin: var(--spacing-lg) 0;
  color: #888;
  font-family: var(--font-fun);
}

.auth-divider::before,
.auth-divider::after {
  content: "";
  height: 1px;
  background-color: #ddd;
}

.auth-socials {
  display: grid;
  gap: var(--spacing-sm);
}

.btn-social {
  width: 100%;
  background-color: white;
  color: var(--color-dark);
  border: 2px solid #ddd;
  font-family: var(--font-body);
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.btn-social:hover {
  background-color: #f8f9fa;
  transform: none;
}

.btn-google i { color: #DB4437; }
.btn-microsoft i { color: #00A4EF; }
</style>