<template>
  <div class="musicList">
    <div class="musicList_back" @click="goBack">
      <i class="musicList_back_icon">{{ `<` }}</i>
    </div>
    <h1 class="musicList_title">{{ title }}</h1>
    <div class="musicList_bgImage" :style="bgImageStyle" ref="bgImage">
      <div class="playBtn_wrapper" :style="playBtnStyle">
        <div class="playBtn_btn" @click="random">
          <i class="playBtn_btn_icon"></i>
          <span class="playBtn_btn_text">随机播放全部</span>
        </div>
      </div>
      <div class="musicList_bgImage_filter" :style="filterStyle"></div>
    </div>
    <Scroll
      class="musicList_scroll"
      :style="scrollStyle"
      v-loading="loading"
      v-no-result:[noResultText]="noResult"
      :probe-type="3"
      @scroll="onScroll"
    >
      <div class="musicList_scroll_wrapper">
        <song-list :songs="songs" @select="selectItem"></song-list>
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import Scroll from "./base/scroll/Scroll.vue";
import SongList from "./base/song-list/SongList.vue";
import useSongListStore from "../store";

const props = defineProps({
  songs: {
    type: Array,
    default() {
      return [];
    },
  },
  title: String,
  pic: String,
  // 更新逻辑在上层组件里，可以通过props拿到
  loading: Boolean,
  // 修改noResult组件的文案
  noResult: {
    type: String,
    default() {
      return "没找到捏";
    },
  },
});

const router = useRouter();
const goBack = () => {
  router.back();
};

const bgImage = ref();

// 当离顶部某个位置时，去除overflow:hidden
// 定义一个常量
const RESERVED_HEIGHT = 40;
// 往上能滚的最大距离
const maxTranslateY = ref(0);
const scrollY = ref(0);
const imageHeight = ref(0);
const bgImageStyle = computed(() => {
  let zIndex = 0;
  // 元素的height为0，padding-bottom为百分比；
  // 该元素的高度等于父元素端度乘于该元素的padding-bottom百分比
  let paddingTop = `70%`;
  let height = 0;
  let translateZ = 0;
  if (scrollY.value > maxTranslateY.value) {
    // 正常情况下z-index可以覆盖，但是在iphone上得用translateZ
    zIndex = 10;
    paddingTop = 0;
    height = `${RESERVED_HEIGHT}px`;
    translateZ = 1;
  }
  // 向下拉，图片有放大效果
  let scale = 1;
  if (scrollY.value < 0) {
    scale = 1 + Math.abs(scrollY.value / imageHeight.value);
  }
  return {
    transform: `scale(${scale})`,
    zIndex,
    paddingTop,
    height,
    backgroundImage: `url(${props.pic})`,
  };
});
const scrollStyle = computed(() => {
  return { top: `${imageHeight.value}px` };
});

const filterStyle = computed(() => {
  let blur = 0;
  // 同一个变量用多次可以先保存局部变量，
  // 优化性能，否则会多次触发依赖收集
  const scrollY_ = scrollY.value;
  const imageHeight_ = imageHeight.value;
  if (scrollY_ >= 0) {
    blur =
      Math.min(maxTranslateY.value / imageHeight_, scrollY_ / imageHeight_) *
      20;
  }
  return {
    backdropFilter: `blur(${blur}px)`,
  };
});

const noResultText = props.noResult;
const noResult = computed(() => {
  return !props.loading && !props.songs.length;
});

const songList = useSongListStore();
const selectItem = ({ song, index }) => {
  songList.selectPlay({ list: props.songs, index });
};

// 按钮隐藏
const playBtnStyle = computed(() => {
  let display = "";
  if (scrollY.value >= maxTranslateY.value) {
    display = "none";
  }
  return {
    display,
  };
});
const random = () => {
  const songs = props.songs;
  songList.randomPlay({ list: songs });
};

// 实时知道scollY的值
const onScroll = (pos) => {
  scrollY.value = -pos.y;
};
onMounted(() => {
  // 根据图片高度，给列表添加动态的top值
  imageHeight.value = bgImage.value.clientHeight;
  // 往上能滚的最大距离
  maxTranslateY.value = imageHeight.value - RESERVED_HEIGHT;
});
</script>

<style lang="scss" scoped>
.musicList {
  position: relative;
  height: 100%;
  .musicList_back {
    position: absolute;
    top: 0;
    z-index: 20;
    .musicList_back_icon {
      display: block;
      padding: 10px;
      font-size: $font-size-large-x;
      color: $color-theme;
    }
  }

  .musicList_title {
    position: absolute;
    top: 0;
    left: 10%;
    width: 80%;
    z-index: 20;
    transform: translateZ(2px);
    @include no-wrap();
    text-align: center;
    line-height: 40px;
    font-size: $font-size-large;
    color: $color-text;
  }
  .musicList_bgImage {
    position: relative;
    width: 100%;
    height: 300px;
    transform-origin: top;
    background-size: cover;
    .playBtn_wrapper {
      position: absolute;
      bottom: 20px;
      z-index: 10;
      width: 100%;
      .playBtn {
        box-sizing: border-box;
        width: 135px;
        padding: 7px 0;
        margin: 0 auto;
        text-align: center;
        border: 1px solid $color-theme;
        color: $color-theme;
        border-radius: 100px;
        font-size: 0;
        .playBtn_icon {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .playBtn_text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
    }
    .musicList_bgImage_filter {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(7, 17, 27, 0.4);
    }
  }
  .musicList_scroll {
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 0;
    /* overflow: hidden; */
    .musicList_scroll_wrapper {
      padding: 20px 30px;
      background: $color-background;
    }
  }
}
</style>