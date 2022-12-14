<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { baseUrl } from "@/api/userApiUrls";
import { useAxios } from "@vueuse/integrations/useAxios";

const route = useRoute();
const { params } = route;
const user = ref({});

onMounted(async () => {
  const { data } = await useAxios(`${baseUrl}/${params.id}`);
  user.value = data.value?.data[params.id];
  console.log(user.value);
});
</script>

<template>
  <div>
    <h1>{{ user.name }}</h1>
  </div>
</template>
