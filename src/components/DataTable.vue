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
  onRowClick: {
    type: Function,
    default: (row) => {
      console.log("onRowClick", row);
    },
  },
});
</script>

<template>
  <table class="data-table">
    <thead>
      <tr>
        <th
          v-for="header in headers"
          :key="header.key || header"
          :style="{ width: header.width || 'auto' }"
        >
          <i v-show="header.icon" :class="header.icon"></i>
          {{ header.displayText || header }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr @click="onRowClick(row)" v-for="row in rows" :key="row.id">
        <td v-for="header in headers" :key="header">
          {{ row[header.key] || row[header] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style lang="scss">
@import "../assets/styles/variables.scss";

.data-table {
  width: 100%;
  text-align: left;

  & > thead {
    background-color: $table-header-bg;
    i {
      vertical-align: bottom;
    }
  }

  th,
  td {
    padding: 0.5rem;
  }

  tr {
    border-top: 1px solid $white-transparent-08;
    border-bottom: 1px solid $white-transparent-08;
    box-shadow: 0 -1px $black-transparent-20;
  }

  tbody {
    tr:hover {
      cursor: pointer;
      border-top: 1px solid $cadetblue-transparent-20;
      border-bottom: 1px solid $cadetblue-transparent-20;
      background: linear-gradient(
        $cadetblue-transparent-05,
        transparent,
        $cadetblue-transparent-05
      );
    }
  }
}
</style>
