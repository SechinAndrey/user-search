<script setup>
import { computed, reactive, onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { baseUrl } from "@/api/userApiUrls";
import { useAxios } from "@vueuse/integrations/useAxios";

const route = useRoute();
const { params } = route;

const user = reactive({});
const isUserLoading = ref(true);

onMounted(async () => {
  const { data, isLoading } = await useAxios(`${baseUrl}/${params.id}`);
  Object.assign(user, data.value.data[params.id]);
  console.log(user);
  isUserLoading.value = isLoading.value;
});

const createdAt = computed(() => {
  return new Date(user.created_at).toLocaleDateString("ru-RU");
});
const battles_count = computed(() => user?.statistics?.pvp?.battles_count || 0);
const wins = computed(() => user?.statistics?.pvp?.wins) || 0;
const winsPercentage = computed(() => {
  return +((wins.value / battles_count.value) * 100).toFixed(2) || 0;
});
const exp = computed(
  () =>
    +(
      user?.statistics?.pvp?.premium_exp / user?.statistics?.pvp?.battles_count
    ).toFixed(2) || 0
);
const frags = computed(() => user?.statistics?.pvp?.frags);
const maxFrags = computed(() => user?.statistics?.pvp?.max_frags);
const survived = computed(() => user?.statistics?.pvp?.survived);

const mainStatistics = computed(() => {
  return [
    {
      title: "Проведено боёв",
      value: battles_count.value,
    },
    {
      title: "Победы",
      value: winsPercentage.value + "%",
    },
    {
      title: "Опыт",
      value: exp.value,
    },
    {
      title: "Кораблей за бой",
      value: maxFrags.value,
    },
    {
      title: "Уничтожил / уничтожен",
      value:
        +(frags.value / battles_count.value - survived.value).toFixed(2) || 0,
    },
  ];
});
</script>

<template>
  <div class="page-container">
    <div class="basic-block" v-if="Object.keys(user).length">
      <h1>{{ user.name }}</h1>
      <h3>Дата регистрации: {{ createdAt }}</h3>
      <div
        v-show="Object.keys(user.statistics).length"
        class="flex flex-col justify-between sm:flex-row text-center"
      >
        <div v-for="statistic in mainStatistics" :key="statistic.title">
          <h2>{{ statistic.value }}</h2>
          <p>{{ statistic.title }}</p>
        </div>
      </div>
    </div>
    <div class="basic-block text-center" v-else-if="isUserLoading">
      <b>Loading...</b>
    </div>
    <div
      v-show="
        !isUserLoading &&
        (!user || !user.statistics || !Object.keys(user.statistics).length)
      "
      class="basic-block text-center"
    >
      Для отображения статистики нужно сыграть больше игр
    </div>
  </div>
</template>
