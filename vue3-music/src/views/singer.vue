<template>
  <div class="singers" :[loadingText]="isLoading">
    <IndexList :data="singers" @select="selectSinger"> </IndexList>
    <!-- singerDetail组件,实现了动画切换 -->
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" :singer="selectedSinger"></component>
      </transition>
    </router-view>
  </div>
</template>

<script setup>
import { getSingerList } from "../service/singer";
import IndexList from "../components/base/index-list/IndexList.vue";
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { SINGER_KEY } from "../assets/js/constant";
import storage from "good-storage";

const singers = ref([]);
const selectedSinger = ref(null);
const loadingText = ref("正在载入...");
const router = useRouter();

async function getSingerList_() {
  const res = await getSingerList();
  singers.value = res.singers;
}
function selectSinger(singer) {
  selectedSinger.value = singer;
  // 做缓存
  cacheSinger(singer);
  router.push({ path: `/singer/${singer.id}` });
}

// 把歌手信息缓存到sessionStorage里
// 刷新时会取用，并对比
function cacheSinger(singer) {
  storage.session.set(SINGER_KEY, singer);
}
const isLoading = computed(() => !singers.value.length);
getSingerList_();
</script>


<style lang="scss" scoped>
.singers {
  /* 固定定位是元素固定于浏览器可视区的位置。
         主要使用场景： 可以在浏览器页面滚动时元素的位置不会改变
         为了不影响插件工作 */
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: hidden;
}
</style>