<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import { watchThrottled, useEventListener } from "@vueuse/core";
import { autocompleteUrl } from "../api/userApiUrls.js";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useStore } from "vuex";
import { useRouteQuery } from "@vueuse/router";

const store = useStore();

/* data fetching */
const searchTextFromUrl = useRouteQuery("search", "");
const searchText = ref("");
searchText.value = searchTextFromUrl.value;

const { data, execute, isFinished } = useAxios();

const userList = computed(() => {
  return data.value?.data || [];
});

let abortController;
watchThrottled(
  searchText,
  async (value) => {
    if (abortController) await abortController.abort();
    abortController = new AbortController();
    if (value.length > 2) {
      execute(`${autocompleteUrl}/${searchText.value}`, {
        signal: abortController.signal,
      });
    }
  },
  { throttle: 500 }
);

watch(isFinished, (value) => {
  if (value) {
    abortController = null;
    selectedIndex.value = -1;
  }
});

/* arrow navigating */
const selectedIndex = ref(0);
const maxIndex = computed(() => userList.value.length - 1);
const handleKeydown = (e) => {
  if (e.key === "ArrowDown") {
    selectedIndex.value =
      selectedIndex.value === maxIndex.value ? 0 : selectedIndex.value + 1;
  } else if (e.key === "ArrowUp") {
    selectedIndex.value =
      selectedIndex.value === 0 ? maxIndex.value : selectedIndex.value - 1;
  }
};
const handleKeydownCleanup = useEventListener(
  document,
  "keydown",
  handleKeydown
);

/* show/hide suggestions */
const isSearchInputFocused = ref(false);
const isShowSuggestions = computed(() => {
  return (
    searchText.value.length > 2 &&
    userList.value.length > 0 &&
    isSearchInputFocused.value
  );
});
const onSearchInputFocused = () => {
  isSearchInputFocused.value = true;
  selectedIndex.value = -1;
};

/* enter handler */
const onEnterHandler = () => {
  if (selectedIndex.value > -1) {
    console.log(userList.value[selectedIndex.value].name);
  } else {
    // request to search
    searchTextFromUrl.value = searchText.value;
    store.dispatch("fetchUsers", searchText.value);
  }
};

/* cleanup */
onUnmounted(() => {
  handleKeydownCleanup();
});
</script>

<template>
  <div>
    <input
      type="text"
      v-model="searchText"
      @focus="onSearchInputFocused"
      @blur="isSearchInputFocused = false"
      @keydown.enter="onEnterHandler"
    />
    <button @click="searchText = ''">Clear</button>
    <ul v-show="isShowSuggestions">
      <li
        v-for="(user, index) in userList"
        :key="user.spa_id"
        :class="{ selected: index == selectedIndex }"
      >
        {{ user.name }}
      </li>
    </ul>
  </div>
</template>

<style lang="scss">
.selected {
  background-color: #ccc;
  color: red;
}
</style>
