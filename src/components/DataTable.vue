<script setup>
// eslint-disable-next-line
defineProps({
  headers: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  showIndex: {
    type: Boolean,
    default: true,
  },
});
</script>

<template>
  <table>
    <thead>
      <tr>
        <th v-for="header in headers" :key="header">
          {{ header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="row.id">
        <td v-if="showIndex">{{ index + 1 }}</td>
        <td v-for="header in headers" :key="header">
          {{ row[header] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
