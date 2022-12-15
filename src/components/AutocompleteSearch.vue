<script setup>
import { ref, computed, onUnmounted, watch } from "vue";
import { watchThrottled, useEventListener } from "@vueuse/core";
import { autocompleteUrl } from "../api/userApiUrls.js";
import { useAxios } from "@vueuse/integrations/useAxios";
import { useStore } from "vuex";
import { useRouteQuery } from "@vueuse/router";
import { useRouter } from "vue-router";

const store = useStore();
const router = useRouter();

/* data fetching */
const searchTextFromUrl = useRouteQuery("search", "");
const searchText = ref("");
searchText.value = searchTextFromUrl.value;

const { data, execute, isFinished } = useAxios();

const userList = computed(() => {
  return data.value?.data?.slice(0, 10) || [];
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
const onSearchInputBlur = () => {
  setTimeout(() => {
    isSearchInputFocused.value = false;
  }, 200);
};

/* select handler */
const onSelectHandler = (user) => {
  router.push({
    name: "user",
    params: { id: user?.spa_id, name: user?.name },
  });
};

/* enter handler */
const onEnterHandler = () => {
  if (selectedIndex.value > -1) {
    onSelectHandler(userList.value[selectedIndex.value]);
  } else {
    // request to search
    searchTextFromUrl.value = searchText.value;
    store.dispatch("fetchUsers", searchText.value);
  }
};

/* cleanup */
const clearResults = () => {
  searchText.value = "";
  searchTextFromUrl.value = "";
  store.commit("clear");
};

onUnmounted(() => {
  handleKeydownCleanup();
});
</script>

<template>
  <div class="autocomplete-search">
    <div class="autocomplete-search_wrap">
      <input
        type="text"
        v-model="searchText"
        @focus="onSearchInputFocused"
        @blur="onSearchInputBlur"
        @keydown.enter="onEnterHandler"
        placeholder="Введите имя игрока"
      />
      <button
        v-show="searchText.length > 0"
        @click="clearResults"
        class="autocomplete-search_clear_btn i-lucide-x"
      ></button>
      <ul
        v-show="isShowSuggestions"
        class="autocomplete-search_suggestions_list"
      >
        <li
          v-for="(user, index) in userList"
          @click="onSelectHandler(user)"
          :key="user.spa_id"
          :class="{
            'autocomplete-search_suggestions_items__hover':
              index == selectedIndex,
          }"
          class="autocomplete-search_suggestions_items"
        >
          {{ user.name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<style lang="scss">
@import "@/assets/styles/variables.scss";
@import "@/assets/styles/mixins.scss";

.autocomplete-search {
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 2% 10%;
  position: relative;

  &_suggestions_list {
    top: 37px;
    left: 0;
    right: 0;
    border-top: none;
    position: absolute;
    backdrop-filter: blur(8px);
    background: $dark-gray;
    border: 1px solid $gray;
  }

  &_suggestions_items {
    padding: 10px 10px;
    opacity: 0.8;

    &__hover,
    &:hover {
      background: $table-hover-gradient;
    }
  }

  &_wrap {
    position: relative;
  }

  &_clear_btn {
    position: absolute;
    padding: 10px;
    height: 100% !important;
    cursor: pointer;
    opacity: 0.7;

    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
    }
  }
}
</style>
