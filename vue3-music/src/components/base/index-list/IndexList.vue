<template>
  <Scroll ref="scrollRef"
   class="indexList" 
   :probe-type="3"
    @scroll="onScroll">
    <div ref="groupRef">
      <div v-for="group in data"
       :key="group.title"
        class="indexList_group">
        <h2 class="indexList_group_title">{{ group.title }}</h2>
        <ul>
          <li
            v-for="item in group.list"
            :key="item.id"
            class="indexList_group_item"
            @click="onItemClick(item)"
          >
            <img v-lazy="item.pic" class="indexList_group_item_avatar" />
            <span class="indexList_group_item_name">
              {{ item.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- 固定标题 -->
    <div class="indexList_fixed" v-show="fixedTitle" :style="fixedStyle">
      <div class="indexList_fixed_title">
        {{ fixedTitle }}
      </div>
    </div>

    <!-- 右侧导航栏 -->
    <div class="indexList_shortcut"
    @touchstart.stop.prevent="onShortcutTouchStart"
    @touchmove.stop.prevent="onShortcutTouchMove"
    @touchend.stop.prevent>
      <ul>
        <li
          v-for="(item, index) in shortcutList"
          :key="item"
          :data-index="index"
          class="indexList_shortcut_item"
          :class="{ current: currentIndex === index }"

        >
          {{ item }}
        </li>
      </ul>
    </div>
  </Scroll>
</template>

<script setup>
/**
 * @author
 * @description 该组件是一个通用组件，list右侧具有索引，点击可导航
 * 上部index可以有吸顶效果
 * @date 2023-03-28 14:22
 * @version v1.0
 */
import Scroll from "../scroll/Scroll.vue";
import useFixed from "./use-fixed";
import useShortcut from './use-shortcut'
import { ref} from "vue";
const props = defineProps({
  data: {
    type: Array,
    default() {
      return [];
    },
  },
});
const scrollRef = ref(null)

// 一旦传进来的数组发生变化重新计算
const { groupRef, onScroll, fixedTitle, fixedStyle,currentIndex } = useFixed(props);
const {shortcutList,onShortcutTouchStart,onShortcutTouchMove} = useShortcut(props,groupRef,scrollRef)
const emit = defineEmits(['select'])

function onItemClick(item){
  emit('select',item)
}
</script>

<style lang="scss" scoped>
.indexList {
  /* 开启滚动 */
  width: 100%;
  height: 100%;
  overflow: scroll;
  background: $color-background;
  .indexList_group {
    height: 100%;
    overflow: hidden;
    padding-bottom: 30px;
    .indexList_group_title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
    .indexList_group_item {
      display: flex;
      align-items: center;
      padding: 20px 0 0 30px;
      .indexList_group_item_avatar {
        width: 50px;
        height: 50px;
        border-radius: 50%;
      }
      .indexList_group_item_name {
        margin-left: 50px;
        flex: 1;
      }
    }
  }
  .indexList_fixed {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    .indexList_fixed_title {
      height: 30px;
      line-height: 30px;
      padding-left: 20px;
      font-size: $font-size-small;
      color: $color-text-l;
      background: $color-highlight-background;
    }
  }
  .indexList_shortcut {
    position: absolute;
    right: 4px;
    top: 50%;
    transform: translateY(-50%);
    width: 20px;
    padding: 20px 0;
    border-radius: 10px;
    text-align: center;
    background: $color-background-d;
    font-family: Helvetica;
    .indexList_shortcut_item {
      padding: 3px;
      line-height: 1;
      color: $color-text-l;
      font-size: $font-size-small;
      &.current {
        color: $color-theme;
      }
    }
  }
}
</style>