<script setup>
import { ref } from 'vue';
import GanttChart from '@/components/GanttChart/GanttChart.vue';

const viewMode = ref('daily');
</script>

<template>
  <div class="home-page-wrapper">
    <GanttChart v-model:viewMode="viewMode" />
  </div>
</template>

<style scoped lang="scss">
.home-page-wrapper {
  height: 100%;
  width: 100%;
  display: grid;
  overflow: hidden;
}
</style>
