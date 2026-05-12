<script setup>
import { ref } from "vue";
import { useCurrentUser } from "vuefire";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import {supabase} from '../supabase';

import Reminders from "./Reminders.vue";


const db = getFirestore();
const user = useCurrentUser();
const props = defineProps(['toDoList', 'isAdmin']);

var text = ref("");
const fileInput = ref(null);

var fileUpload;
var uploadError = false;

async function addToList(){
  var uploadedUrl = await uploadFile();
  if (!uploadedUrl) {
    await addDoc(collection(db, "toDoList"),
    {
      name: text.value, 
      finished: false,
      userId: user.value.uid,
      userEmail: user.value.email,
      priority: 2,
      fileUrl: null,
      fileName: null
    });
  }else{
    await addDoc(collection(db, "toDoList"),
    {
      name: text.value, 
      finished: false,
      userId: user.value.uid,
      userEmail: user.value.email,
      priority: 2,
      fileUrl: uploadedUrl,
      fileName: fileUpload.name
    });
  }
  text.value = "";
  fileUpload = null;
  if (fileInput.value) {
    fileInput.value.value = null;
  }
}

function addFile(e){
  console.log(e.target.files);
  fileUpload = e.target.files[0];
  console.log("Archivo seleccionado: " + fileUpload.name);
  console.log("Path: " + fileUpload.value);
  console.log("fileUpload: " + fileUpload);
}

async function uploadFile() {
  var fileUrl = "";
   if(fileUpload){
    // Before writing to the database, upload the file to supabase storage
    const { data, error } = await supabase.storage.from('Files').upload(fileUpload.name, fileUpload.value);
    if (error) {
      uploadError = true;
      console.log("Error");
    } else {
      const { data } = supabase.storage.from('Files').getPublicUrl(fileUpload.name)
      fileUrl = data.publicUrl;
      uploadError = false;
      console.log("Exito");
    }
  }

  return fileUrl;
}
</script>

<template>
  <div class="todo-wrapper">
    <div class="todo-container">
      <h1 v-if="!props.isAdmin" class="todo-title">To-Do List</h1>
      <h1 v-else class="todo-title">Manage To-Do Lists</h1>
      
      <div v-if="!props.isAdmin" class="todo-bar">
        <form @submit.prevent="addToList" class="todo-form">
          <input 
            type="text"
            v-model="text"
            placeholder="What needs to be done?"
            class="todo-input-text"
          >
          <div class="todo-actions">
            <input type="file" ref="fileInput" @change="addFile" class="todo-input-file">
            <button type="submit" class="todo-btn-add"><i class="bi bi-plus-circle-fill"></i>Add Task</button>
          </div>
        </form>
      </div>

      
      <!-- Reminders -->
      <div class="todo-list-wrapper">
        <Reminders :toDoList="props.toDoList" :isAdmin="props.isAdmin"/>
      </div>
    </div>
  </div>
</template>

<style scoped>
.todo-wrapper {
  width: 100%;
  max-width: 800px;
}

.todo-container {
  display: grid;
  gap: var(--spacing-lg);
  background-color: white;
  padding: 2rem;
  border-radius: var(--radius);
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
}

.todo-title {
  text-align: center;
  color: var(--color-orange);
  font-size: 3rem;
}

@media (max-width: 768px) {
  .todo-title {
    font-size: 2rem;
  }
}

.todo-bar {
  background-color: var(--color-bg);
  padding: var(--spacing-md);
  border-radius: var(--radius);
  border-left: 5px solid var(--color-magenta);
}

.todo-form {
  display: grid;
  gap: var(--spacing-sm);
}

.todo-input-text {
  width: 100%;
  font-size: 1.2rem;
}

.todo-actions {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: var(--spacing-md);
  align-items: center;
}

@media (max-width: 768px) {
  .todo-actions {
    grid-template-columns: 1fr;
  }
}

.todo-input-file {
  font-size: 0.9rem;
}

.todo-btn-add {
  background-color: var(--color-magenta);
  font-size: 1.2rem;
  padding: 0.5rem 1.5rem;
}

.todo-btn-add:hover {
  background-color: var(--color-red);
}

.todo-list-wrapper {
  margin-top: var(--spacing-md);
}
</style>