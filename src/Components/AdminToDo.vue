<script setup>
import { useCollection } from "vuefire";
import { collection, getFirestore } from 'firebase/firestore';

import ToDo from "./ToDo.vue";

const db = getFirestore();
const adminList = useCollection(collection(db, "toDoList"));

</script>

<template>
  <ToDo :toDoList="adminList" :isAdmin="true"/>
</template>
