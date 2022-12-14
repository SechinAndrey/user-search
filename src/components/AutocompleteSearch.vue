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

/* enter handler */
const onEnterHandler = () => {
  if (selectedIndex.value > -1) {
    const user = userList.value[selectedIndex.value];
    router.push({
      name: "user",
      params: { id: user?.spa_id, name: user?.name },
    });
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
  <div class="autocomplete-search">
    <div class="autocomplete-search_wrap">
      <input
        type="text"
        v-model="searchText"
        @focus="onSearchInputFocused"
        @blur="isSearchInputFocused = false"
        @keydown.enter="onEnterHandler"
      />
      <button
        @click="searchText = ''"
        class="autocomplete-search_clear_btn i-carbon-close"
      ></button>
    </div>
    <ul v-show="isShowSuggestions" class="autocomplete-search_suggestions_list">
      <li
        v-for="(user, index) in userList"
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
</template>

<style lang="scss">
@import "@/assets/styles/mixins.scss";

.autocomplete-search {
  padding: 2% 10%;
  position: relative;
  display: flex;
  flex-direction: column;

  &_suggestions_list {
    position: relative;
    backdrop-filter: blur(8px);
    background: rgba(19, 22, 22, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.15);
    border-top: none;

    @include scrollbar;
  }

  &_suggestions_items {
    padding: 10px 10px;
    opacity: 0.8;
    color: white;

    &__hover,
    &:hover {
      background: linear-gradient(
        180deg,
        rgba(0, 255, 194, 0.2) 0%,
        rgba(52, 239, 194, 0.1) 34.04%,
        rgba(0, 255, 194, 0.1) 61.46%,
        rgba(29, 246, 194, 0.2) 99.98%,
        rgba(11, 253, 195, 0.3) 99.99%
      );
    }
  }

  &_wrap {
    position: relative;
  }

  &_clear_btn {
    position: absolute;
  }
}
</style>
