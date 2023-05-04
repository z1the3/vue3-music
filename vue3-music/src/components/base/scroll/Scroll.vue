<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script setup>
import useSroll from "./use-scroll";
import { ref ,defineExpose} from "vue";
const emits = defineEmits(["scroll"]);
const props = defineProps({
  click: {
    type: Boolean,
    default() {
      return true;
    },
  },
  //   默认为0，滚动时不会派发事件
  probeType: {
    type: Number,
    default: 0,
  },
});
const rootRef = ref(null);
const scroll = useSroll(rootRef, props, emits);
// 手动暴露ref
defineExpose({
  scroll
})
</script>