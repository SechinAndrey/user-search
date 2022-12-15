<script setup>
import SearchInput from "../components/AutocompleteSearch.vue";
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
  <div class="page-container">
    <div class="search-wrap">
      <SearchInput />
    </div>
    <div class="flex flex-col items-center">
      <UserResults />
    </div>
  </div>
</template>
