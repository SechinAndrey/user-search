<script setup>
import SearchInput from "../components/SearchInput.vue";
import UserResults from "../components/UserResults.vue";
import { useRouteQuery } from "@vueuse/router";
import { useStore } from "vuex";
const store = useStore();

const searchText = useRouteQuery("search", "");
if (searchText.value) {
  store.dispatch("fetchUsers", searchText.value);
}
</script>

<template>
  <div>
    <h1>Search</h1>
    <SearchInput />
    <UserResults />
  </div>
</template>
