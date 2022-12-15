<script setup>
import { ref, computed } from "vue";
import DataTable from "./DataTable.vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
const router = useRouter();

const store = useStore();

const headers = ref(["id", "spa_id", "name", "battlesCount", "winRate"]);

const userList = computed(() => {
  return store.getters.usersList.map((user, index) => {
    const battlesCount = user?.statistics?.pvp?.battles_count || "-";
    const winCount = user?.statistics?.pvp?.wins || "-";
    const winRate = +((winCount / battlesCount) * 100).toFixed(2) || "-";

    return {
      id: index,
      spa_id: user.spa_id,
      name: user.name,
      battlesCount: battlesCount,
      winRate: winRate,
    };
  });
});

const canShowMore = computed(() => {
  return store.getters.canLoadMore;
});

const onRowClick = (user) => {
  router.push({
    name: "user",
    params: { id: user?.spa_id, name: user?.name },
  });
};

const isLoading = computed(() => {
  return store.getters.isLoading;
});
const showMore = () => {
  store.dispatch("fetchUsers", store.getters.searchQuery);
};
</script>

<template>
  <DataTable
    v-show="userList.length"
    :headers="headers"
    :rows="userList"
    :on-row-click="onRowClick"
  />
  <button
    v-show="canShowMore && userList.length"
    @click="showMore"
    :class="{ btn_primary__loading: isLoading }"
    class="btn_primary mt-4"
  >
    Show More
  </button>
</template>
