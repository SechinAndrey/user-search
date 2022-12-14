<script setup>
import { ref, computed } from "vue";
import DataTable from "./DataTable.vue";
import { useStore } from "vuex";

const store = useStore();

const headers = ref(["spa_id", "name", "battlesCount", "winRate"]);

const userList = computed(() => {
  return store.getters.usersList.map((user) => {
    const battlesCount = user?.statistics?.pvp?.battles_count || "-";
    const winCount = user?.statistics?.pvp?.wins || "-";
    const winRate = +((winCount / battlesCount) * 100).toFixed(2) || "-";

    return {
      spa_id: user.spa_id,
      name: user.name,
      battlesCount: user?.statistics?.pvp?.battles_count,
      winRate: winRate,
    };
  });
});
</script>

<template>
  <DataTable :headers="headers" :rows="userList" />
</template>
