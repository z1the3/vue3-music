<template>
  <div class="progressCircle">
    <svg
      :width="radius"
      :height="radius"
      viewBOX="0 0 100 100"
      version="1.1"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle
        class="progressCircle_background"
        :r="16"
        :cx="16"
        :cy="16"
        fill="transparent"
      />
      <!-- 进度条，叠加在背景圆环上 -->
      <circle
        class="progressCircle_bar"
        :r="16"
        :cx="16"
        :cy="16"
        fill="transparent"
        :stroke-dasharray="DASHARRAY"
        :stroke-dashoffset="dashOffset"
      />
    </svg>
    <slot></slot>
  </div>
</template>


<script setup>
import { computed } from "vue";
const props = defineProps({
  radius: {
    type: Number,
    default: 100,
  },
  progress: {
    type: Number,
    default: 1,
  },
});

const DASHARRAY = Math.PI * 32;
const dashOffset = computed(() => {
  // 线性负相关
//   return 1;
  return (1 - props.progress) * DASHARRAY;
});
</script>

<style lang="scss" scoped>
.progressCircle {
  position: relative;
  circle {
    stroke-width: 3px;
    transform-origin: center;
    &.progressCircle_background {
      transform: scale(0.9);
      stroke: $color-theme-d;
    }
    &.progressCircle_bar {
      transform: scale(0.9) rotate(-90deg);
      stroke: $color-theme;
    }
  }
}
</style>