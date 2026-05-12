<script setup>
import { ref, computed } from "vue";
import { updateDoc, deleteDoc, doc, getFirestore } from 'firebase/firestore';
import { supabase } from '../supabase.js';

const db = getFirestore();
const props = defineProps(['toDoList', 'isAdmin']);

var editText = ref("");
var editing = ref(false);
var confirmDel = ref(false);
var curIndex = ref(-1);

function startEdit(task, index){
  editText.value = task.name;
  curIndex.value = index;

  editing.value = true;
  confirmDel.value = false;
}

async function editTask(id){
  await updateDoc(doc(db, "toDoList", id),{
    name: editText.value,
  });
  
  editing.value = false;
}

function confirmDelete(index){
  curIndex.value = index;
  confirmDel.value = true;
  editing.value = false;
}

async function deleteTask(id, index){
  
  if(props.toDoList[index].fileName){
    console.log("entra");
    
    var fileDelete = props.toDoList[index].fileName;
    console.log(fileDelete);
    const { data, error } = await supabase
    .storage
    .from('Files')
    .remove([fileDelete]);
    console.log(error);
  }
  

  await deleteDoc(doc(db, "toDoList", id));

  confirmDel.value = false;
}

function cancelAction(){
  confirmDel.value = false;
  editing.value = false;
}

function deleteFinishedTasks(){
  const tasks = [...props.toDoList];

  tasks.filter(task => task.finished).map(task =>
    deleteDoc(doc(db, "toDoList", task.id))
  )
}

function deleteAll() {
  const tasks = [...props.toDoList];
  tasks.map(task =>
    deleteDoc(doc(db, "toDoList", task.id))
  )
}

function setPriority(id, priority){
  updateDoc(doc(db, "toDoList", id),{
    priority: priority,
  });
}

async function toggleFinished(task) {
  await updateDoc(doc(db, "toDoList", task.id), {
    finished: !task.finished 
  });
}

const sortListByPriority = computed(() => {
  return [...props.toDoList].sort((a, b) => b.priority - a.priority);
});

const totalTasks = computed(() => {
  return props.toDoList.length;
});

const remainingTasks = computed(() => {
  return props.toDoList.filter(task => !task.finished).length;
});
</script>

<template>
  <div class="reminders-container">
    <div class="reminders-header">
      <p class="reminders-count">{{ remainingTasks }} / {{ totalTasks }} remaining</p>
      <div class="reminders-bulk-actions">
        <button @click="deleteFinishedTasks()" class="btn-bulk"><i class="bi bi-check2-circle"></i> Clear {{ totalTasks - remainingTasks }} Crossed</button>
        <button @click="deleteAll()" class="btn-bulk btn-danger"><i class="bi bi-trash-fill"></i> Delete All</button>
      </div>
    </div>

    <!-- Tasks -->
    <ul class="task-list">
      <li v-for="(task, index) in sortListByPriority" :key="task.id" class="task-item" :class="'priority-' + task.priority">
        <!-- Edit -->
        <section v-if="editing && index == curIndex" class="task-edit">
          <input 
            type="text" 
            v-model="editText"
            @keyup.enter="editTask(task.id)"
            class="task-edit-input"
          >
          <div class="task-edit-actions">
            <button @click="editTask(task.id)" class="btn-save"><i class="bi bi-save"></i>Save</button>
            <button @click="cancelAction()" class="btn-cancel">Cancel</button>
          </div>
        </section>

        <!-- View -->
        <section v-else class="task-view">
          <div class="task-content">
            <label class="task-checkbox-label">
              <input 
                type="checkbox" 
                :checked="task.finished"
                @change="toggleFinished(task)"
                class="task-checkbox"
              >
              <span :class="{crossed:task.finished}" class="task-name">
                {{ task.name }} 
                <small v-if="props.isAdmin" class="task-admin-info"> - {{ task.userEmail }}</small>
              </span>
            </label>

            <div v-if="task.fileUrl" class="task-attachment">
              <p class="task-name">{{ task.fileName }}</p>
              <a :href="`${task.fileUrl}?download=`"download target="_blank" class="task-file-link"><i class="bi bi-paperclip"></i>Download File</a>
            </div>
          </div>

          <div class="task-actions">
            <button @click="startEdit(task, index)" class="btn-icon"><i class="bi bi-pencil-square"></i></button>
            <button @click="confirmDelete(index)" class="btn-icon btn-icon-danger"><i class="bi bi-trash"></i></button>
          </div>
        </section>

        <!-- Delete confirmation -->
        <div v-if="confirmDel && index == curIndex" class="task-confirm">
          <p>Delete this task?</p>
          <div class="task-confirm-actions">
            <button @click="deleteTask(task.id, index)" class="btn-danger">Yes, Delete</button>
            <button @click="cancelAction()">Cancel</button>
          </div>
        </div>

        <!-- Priority selector -->
        <div class="task-priority-bar">
          <button @click="setPriority(task.id, 1)" :class="{active:task.priority == 1}" class="btn-prio prio-1">Low</button>
          <button @click="setPriority(task.id, 2)" :class="{active:task.priority == 2}" class="btn-prio prio-2">Normal</button>
          <button @click="setPriority(task.id, 3)" :class="{active:task.priority == 3}" class="btn-prio prio-3">High</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.reminders-container {
  display: grid;
  gap: var(--spacing-md);
}

.reminders-header {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background-color: var(--color-dark);
  color: white;
  padding: 1rem;
  border-radius: var(--radius);
}

.reminders-count {
  font-family: var(--font-fun);
  font-size: 1.2rem;
  margin: 0;
}

.reminders-bulk-actions {
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--spacing-sm);
}

.btn-bulk {
  background-color: var(--color-cyan);
  font-size: 0.9rem;
}

.btn-danger {
  background-color: var(--color-red);
}

.task-list {
  list-style: none;
  padding: 0;
  display: grid;
  gap: var(--spacing-sm);
}

.task-item {
  display: grid;
  gap: var(--spacing-sm);
  background-color: white;
  border: 2px solid #eee;
  border-radius: var(--radius);
  padding: var(--spacing-md);
  transition: transform 0.2s;
}

.task-item:hover {
  transform: scale(1.01);
  box-shadow: 0 4px 8px rgba(0,0,0,0.05);
}

/* Priority Indicators */
.priority-3 { border-left: 6px solid var(--color-red); }
.priority-2 { border-left: 6px solid var(--color-orange); }
.priority-1 { border-left: 6px solid var(--color-cyan); }

.task-view {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: start;
  gap: var(--spacing-md);
}

.task-checkbox-label {
  display: grid;
  grid-template-columns: auto 1fr;
  align-items: center;
  gap: var(--spacing-sm);
  cursor: pointer;
}

.task-checkbox {
  width: 1.5rem;
  height: 1.5rem;
  accent-color: var(--color-magenta);
}

.task-name {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--color-dark);
}

.crossed {
  text-decoration: line-through;
  color: #888;
}

.task-admin-info {
  color: var(--color-magenta);
  font-family: var(--font-fun);
}

.task-attachment {
  margin-top: var(--spacing-sm);
  margin-left: 2rem;
  display: grid;
  gap: var(--spacing-sm);
  justify-items: start;
}

.task-file-link {
  font-size: 0.9rem;
  color: var(--color-cyan);
}

.task-actions {
  display: grid;
  grid-auto-flow: column;
  gap: 0.5rem;
}

.btn-icon {
  background-color: transparent;
  color: var(--color-cyan);
  padding: 0.5rem;
  font-size: 1.2rem;
}
.btn-icon:hover { background-color: #f0f0f0; }

.btn-icon-danger { color: var(--color-red); }

.task-edit {
  display: grid;
  gap: var(--spacing-sm);
}

.task-edit-input {
  width: 100%;
}

.task-edit-actions {
  display: grid;
  grid-template-columns: auto auto;
  justify-content: start;
  gap: var(--spacing-sm);
}

.btn-save { background-color: var(--color-magenta); }
.btn-cancel { background-color: #ccc; color: var(--color-dark); }

.task-confirm {
  display: grid;
  grid-template-columns: 1fr auto;
  align-items: center;
  background-color: #ffebee;
  padding: var(--spacing-sm);
  border-radius: var(--radius);
  color: var(--color-red);
  font-weight: bold;
}

.task-confirm-actions {
  display: grid;
  grid-template-columns: auto auto;
  gap: var(--spacing-sm);
}

.task-priority-bar {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2px;
  margin-top: var(--spacing-sm);
}

.btn-prio {
  font-size: 0.8rem;
  padding: 0.25rem;
  background-color: #f0f0f0;
  color: #666;
  border-radius: 0;
}

.btn-prio:first-child { border-radius: var(--radius) 0 0 var(--radius); }
.btn-prio:last-child { border-radius: 0 var(--radius) var(--radius) 0; }

.prio-1.active { background-color: var(--color-cyan); color: white; }
.prio-2.active { background-color: var(--color-orange); color: white; }
.prio-3.active { background-color: var(--color-red); color: white; }
</style>