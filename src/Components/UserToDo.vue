<script setup>
import { useCollection, useCurrentUser } from "vuefire";
import { query, where, collection, getFirestore } from 'firebase/firestore';

import ToDo from "./ToDo.vue";

const db = getFirestore();
const user = useCurrentUser();

const q = query(
  collection(db, "toDoList"), 
  where("userId", "==", user.value.uid)
);

const toDoList = useCollection(q);
</script>

<template>
  <ToDo :toDoList="toDoList" :isAdmin="false"/>
</template>
