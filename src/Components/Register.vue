<script setup>
import { ref } from "vue";
import { getAuth, signInWithPopup, GoogleAuthProvider, createUserWithEmailAndPassword, OAuthProvider } from "firebase/auth";
import { useRouter } from "vue-router";
    
const auth = getAuth();
const router = useRouter();

const providerGoogle = new GoogleAuthProvider();
const providerMicrosoft = new OAuthProvider('microsoft.com');

const ERROR_MESSAGES = {
    'auth/invalid-email': 'Wrong email format.',
    'auth/email-already-in-use': 'This email is already in use.',
    'auth/weak-password': 'Try a stronger password (at least 6 characters).',
    'auth/missing-password': 'Password is required.'
};  

var authError = ref("");

var email = ref("");
var password = ref("");
var passwordConfirm = ref("");
var wrongPass = ref(false);

var success = ref(false);

function verifyPassword(){
    success.value = false;
    wrongPass.value = false;
    authError.value = "";
    
    if(password.value == passwordConfirm.value)
        registerUser();
    else{
        wrongPass.value = true;
        authError.value = "Passwords do not match.";
    }
        
}

function registerUser(){
    createUserWithEmailAndPassword(auth, email.value, password.value)
    .then((userCredential) => {
        success.value = true;
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        authError.value = ERROR_MESSAGES[error.code] || 'An unexpected error occurred. Try later or contact support.';
    });
}


function loginGoogle(){
  signInWithPopup(auth, providerGoogle)
  .then((result) => {
    // This gives you a Google Access Token. You can use it to access the Google API.
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential.accessToken;
    router.push("/");

    // The signed-in user info.
  }).catch((error) => {
    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    // The AuthCredential type that was used.
    const credential = GoogleAuthProvider.credentialFromError(error);
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
    console.log(errorMessage);
  });

}
</script>

<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <h2 class="auth-title">Create Account</h2>
      
      <div class="auth-form">
        <div class="input-group">
          <label class="auth-label">Email</label>
          <input type="email"
              v-model="email"
              class="auth-input"
              placeholder="email@example.com"
              @keyup.enter="verifyPassword()"
          >
        </div>

        <div class="input-group">
          <label class="auth-label">Password</label>
          <input 
              type="password"
              v-model="password"
              class="auth-input"
              placeholder="••••••••"
              @keyup.enter="verifyPassword()"
          >
        </div>

        <div class="input-group">
          <label class="auth-label">Confirm Password</label>
          <input 
              type="password"
              v-model="passwordConfirm"
              class="auth-input"
              placeholder="••••••••"
              @keyup.enter="verifyPassword()"
          >
        </div>

        <button @click="verifyPassword()" class="btn-primary">Register</button>
        <p v-if="authError != ''" class="auth-error"><i class="bi bi-exclamation-circle-fill"></i> {{ authError }}</p>
        <p v-if="success" class="auth-success"><i class="bi bi-check-circle-fill"></i> Account created successfully!</p>
      </div>

      <div class="auth-divider">
        <span>OR</span>
      </div>

      <div class="auth-socials">
          <button @click="loginGoogle" class="btn-social btn-google"><i class="bi bi-google"></i> Register with Google</button>
          <button @click="loginMicrosoft" class="btn-social btn-microsoft"><i class="bi bi-windows"></i> Register with Microsoft</button>
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
  border-top: 6px solid var(--color-cyan);
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
  background-color: var(--color-cyan);
}

.btn-primary:hover {
  background-color: var(--color-secondary);
}

.auth-error {
  color: var(--color-red);
  background-color: #ffebee;
  padding: 0.5rem;
  border-radius: 4px;
  font-size: 0.9rem;
  text-align: center;
}

.auth-success {
  color: #2e7d32;
  background-color: #e8f5e9;
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