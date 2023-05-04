<template>
  <div class="player" v-show="playList.length">
    <!-- 全屏切换过渡效果,transition组件暴露钩子 -->
    <transition name="full"
    @enter="enter"
    @after-enter="afterEnter"
    @leave="leave"
    @after-leave="afterLeave"
     >

      <div class="player-full" v-show="fullScreen">
        <div class="player-full_background">
        <img class="img" :src="currentSong?.pic" />
      </div>
      <div class="player-full_top">
        <div class="player-full_top_back">
          <i class="icon-back" @click="goBack"></i>
        </div>
        <h1 class="player-full_top_title">{{ currentSong?.name }}</h1>
        <h2 class="player-full_top_subtitle">
          {{ currentSong?.singer?.[0].name }}
        </h2>
      </div>
      <div class="player-full_middle">
        <!-- 控制左滑隐藏 -->
        <div class="player-full_middle-l" 
        :style="middleLStyle"
        @touchstart.prevent="onMiddleTouchStart"
        @touchmove.prevent="onMiddleTouchMove"
        @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="player-full_middle-l_cdWrapper" ref="cdWrapperRef">
            <div class="player-full_middle-l_cdWrapper_cd" ref="cdRef">
              <img
                :src="currentSong?.pic"
                class="image"
                :class="cdCls"
                ref="cdImageRef"
              />
            </div>
          </div>
        </div>

        <Scroll
          class="player-full_middle-r"
          @click="seekBottom = true"
          ref="lyricScrollRef"
          :style="middleRStyle"
          @touchstart.prevent="onMiddleTouchStart"
          @touchmove.prevent="onMiddleTouchMove"
          @touchend.prevent="onMiddleTouchEnd"
        >
          <div class="player-full_middle-r_lyricWrapper">
            <div v-if="currentLyric" ref="lyricListRef">
              <p
                class="player-full_middle-r_lyricWrapper_text"
                :class="{ current: currentLineNum === index }"
                v-for="(line, index) in currentLyric.lines"
                :key="line.num"
              >
                {{ line.txt }}
              </p>
            </div>
          </div>
        </Scroll>
      </div>
      <div class="player-full_bottom" @click="seekBottom = true">
        <div class="player-full_bottom_dotWrapper">
            <span class="player-full_bottom_dot" :class="{'active':currentShow==='cd'}"></span>
            <span class="player-full_bottom_dot" :class="{'active':currentShow==='lyric'}"></span>
        </div>
        <transition name="seek" v-show="seekBottom">
          <div class="container">
            <div class="player-full_bottom_progress">
              <span class="time time-l">{{ formatTime(currentTime) }}</span>
              <div class="player-full_bottom_progress_bar">
                <ProgressBar
                  ref="barRef"
                  :progress="progress"
                  @progress-changing="onProgressChanging"
                  @progress-changed="onProgressChanged"
                >
                </ProgressBar>
              </div>
              <span class="time time-r">{{
                formatTime(currentSong?.duration / 1000)
              }}</span>
            </div>

            <div class="player-full_bottom_operators">
              <div class="icon i-left" :class="disableCls">
                <!-- 切换播放模式，icon不能写死 -->
                <i @click="changeMode" :class="modeIcon"></i>
              </div>
              <div class="icon i-left" :class="disableCls">
                <i class="icon-prev" @click="prev"></i>
              </div>

              <div class="icon i-center" :class="disableCls">
                <i :class="playIcon" @click="togglePlay"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i class="icon-next" @click="next"></i>
              </div>
              <div class="icon i-right" :class="disableCls">
                <i
                  @click="toggleFavorite(currentSong)"
                  class="icon-not-favorite"
                  :class="getFavoriteIcon(currentSong)"
                ></i>
              </div>
            </div>
          </div>
        </transition>
      </div>
      </div>

    </transition>
    <MiniPlayer :progress="progress"
    :toggle-play="togglePlay"></MiniPlayer>
    <!-- 原生dom事件，pause,电脑待机时触发 -->
    <!-- 事件canPlay，由于歌曲是流式数据，要缓冲完成才能播放 -->
    <!-- 这里可以在可播放时触发函数 -->
    <!-- 事件error,播放错误时触发,应该把ready改为true,否则永远卡死 -->
    <!-- 歌曲播放结束，根据模式跳转 -->
    <audio
      ref="audioRef"
      @pause="pause"
      @canplay="ready"
      @error="error"
      @timeupdate="updateTime"
      @ended="next"
    ></audio>
  </div>
</template>

<script setup>
import useSongListStore from "../../store";
import { watch, ref, computed, onUpdated, nextTick, watchEffect } from "vue";
import useMode from "./use-mode";
import useFavorite from "./use-favorite";
import useCd from "./use-cd";
import useLyric from "./use-lyric";
import useMiddleInteravtive from './use-middle-interactive'
import useAnimation from './use-animation'

import { formatTime } from "../../assets/js/util";
import { PLAY_MODE } from "../../assets/js/constant";
import ProgressBar from "./ProgressBar.vue";
import MiniPlayer from "./MiniPlayer.vue";
import Scroll from "../../components/base/scroll/Scroll.vue";

const store = useSongListStore();
// 标志位，控制拖动时停止进度条和音乐时间同步的计算属性
let progressChanging = false;

const currentIndex = computed(() => store.currentIndex);
const playList = computed(() => store.playList);
const audioRef = ref(null);
const songReady = ref(false);
const currentTime = ref(0);
const seekBottom = ref(true);
const barRef = ref(null)


const { modeIcon } = useMode();
const { getFavoriteIcon, toggleFavorite } = useFavorite();
// 滑动相关逻辑
const {
  currentShow,
  middleLStyle,
  middleRStyle,
  onMiddleTouchEnd,
  onMiddleTouchMove,
  onMiddleTouchStart
} = useMiddleInteravtive()
// lyric相关逻辑
const {
  currentLyric,
  currentLineNum,
  playLyric,
  lyricListRef,
  lyricScrollRef,
} = useLyric({ songReady, currentTime });
const fullScreen = computed(() => store.fullScreen);
const currentSong = computed(() => {
  return playList.value[currentIndex.value];
})||{};

const isPlaying = computed(() => store.playing);
const playIcon = computed(() => {
  return isPlaying.value ? "icon-pause" : "icon-play";
});

function goBack() {
  store.setFullScreen(false);
  seekBottom.value = true
}
function togglePlay() {
  if (!songReady.value) return;
  store.togglePause();
}
function pause() {
  store.playing = false;
}

function ready() {
  songReady.value = true;
  playLyric();
}

function prev() {
  const list = playList.value;
  if (!songReady.value || !list.length) return;
  if (list.length === 1) {
    nextTick(() => {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.playing = true;
    });
    return;
  }
  let index = currentIndex.value - 1;
  if (index === -1) {
    index = list.length - 1;
  }
  store.currentIndex = index;
  if (!isPlaying.value) {
    store.playing = true;
  }
}

function next() {
  const list = playList.value;
  if (!songReady.value || !list.length) return;
  // 如果长度为1，则调整到播放起点
  if (list.length === 1) {
    nextTick(() => {
      const audioEl = audioRef.value;
      audioEl.currentTime = 0;
      audioEl.play();
      store.playing = true;
    });
    return;
  }
  let index = currentIndex.value + 1;
  if (index === list.length) {
    index = 0;
  }
  store.currentIndex = index;
  if (!isPlaying.value) {
    store.playing = true;
  }
}

function error() {
  songReady.value = true;
}

function changeMode() {
  const curMode = store.playMode;
  store.changeMode((curMode + 1) % 3);
}
// 歌曲未缓冲完给按钮添加灰色样式
const disableCls = computed(() => {
  return songReady.value ? "" : "disable";
});

// 计算播放进度
const progress = computed(() => {
  return currentTime.value / (currentSong.value?.duration / 1000);
});

function updateTime(e) {
  if (progressChanging) return;
  currentTime.value = e.target.currentTime;
  playLyric();
}

function onProgressChanging(progress) {
  progressChanging = true;
  currentTime.value = (currentSong.value.duration / 1000) * progress;
}

function onProgressChanged(progress) {
  progressChanging = false;
  audioRef.value.currentTime = currentTime.value =
    ((currentSong.value.duration / 1000) * progress) | 0;
  if (!isPlaying.value) {
    store.playing = true;
  }
}

// cd相关逻辑
const { cdCls, cdRef, cdImageRef } = useCd();

// 屏幕跳转cd东湖
const {cdWrapperRef,enter,afterEnter,leave,afterLeave} = useAnimation()

watch(isPlaying, (newPlaying) => {
  nextTick(() => {
    if (!songReady.value) {
      return;
    }
    const audioEl = audioRef.value;
    newPlaying ? audioEl.play() : audioEl.pause();
  });
});

watch(currentSong, (newSong) => {
  if (!newSong.id) {
    return;
  }
  songReady.value = false;
  currentTime.value = 0;
  nextTick(() => {
    const audioEl = audioRef.value;
    const songsUrl = store.songsUrl[String(currentSong.value.id)];
    audioEl.src = songsUrl;
    audioEl.play();
  });
});

watchEffect(() => {
  if (seekBottom.value) {
    return new Promise(() => {
      setTimeout(() => {
        if(fullScreen.value){
          seekBottom.value = false;
        }
      }, 4000);
    });
  }
});


// 当进入全屏时，等dom加载出来修改进度条,异步暂停
watch(fullScreen,async (newFullScreen)=>{
  if(newFullScreen){
    await nextTick()
    barRef.value.root.__vnode.ctx.setOffset(progress)
  }
})
</script>


<style lang="scss" scoped>
.player {
  .player-full {
    position: fixed;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 150;
    background: $color-background;
    .player-full_background {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      z-index: -1;
      opacity: 0.6;
      filter: blur(20px);

      .img {
        width: 100%;
        height: 100%;
      }
    }
    .player-full_top {
      position: relative;
      margin-bottom: 25px;
      .player-full_top_back {
        position: absolute;
        top: 0;
        left: 6px;
        z-index: 50;
      }
      .icon-back {
        display: block;
        padding: 9px;
        font-size: $font-size-large-x;
        color: $color-theme;
        transform: rotate(-90deg);
      }
      .player-full_top_title {
        width: 70%;
        margin: 0 auto;
        line-height: 40px;
        text-align: center;
        @include no-wrap();
        font-size: $font-size-large;
        color: $color-text;
      }
      .player-full_top_subtitle {
        line-height: 20px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-text;
      }
    }
    .player-full_middle {
      position: fixed;
      width: 460px;
      top: 80px;
      bottom: 170px;
      height: 376px;
      white-space: nowrap;
      font-size: 0;
      .player-full_middle-l {
        display: inline-block;
        vertical-align: top;
        position: relative;
        width: 100%;
        height: 0;
        padding-top: 80%;
        .player-full_middle-l_cdWrapper {
          position: absolute;
          left: 10%;
          top: 0;
          width: 80%;
          box-sizing: border-box;
          height: 100%;
          .player-full_middle-l_cdWrapper_cd {
            width: 100%;
            height: 100%;
            border-radius: 50%;
            .image {
              position: absolute;
              left: 0;
              top: 0;
              width: 100%;
              height: 100%;
              box-sizing: border-box;
              border-radius: 50%;
              border: 10px solid rgba(255, 255, 255, 0.1);
              &.playing {
                animation: rotate 20s linear infinite;
              }
            }
            /* rotate是自定义的keyframes,去全局sass里看 */
          }
        }
      }
      .player-full_middle-r {
        display: inline-block;
        vertical-align: top;
        width: 100%;
        height: 100%;
        overflow: hidden;
        .player-full_middle-r_lyricWrapper {
          width: 80%;
          /* height: 100%; */
          margin: 0 auto;
          overflow: hidden;
          text-align: center;
          .player-full_middle-r_lyricWrapper_text {
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
            &.current {
              color: $color-text;
            }
          }
          .player-full_middle-r_lyricWrapper_pureMusic {
            padding-top: 50%;
            line-height: 32px;
            color: $color-text-l;
            font-size: $font-size-medium;
          }
        }
      }
    }

    .player-full_bottom {
      position: absolute;
      bottom: 0px;
      width: 100%;
      height: 30%;
      .player-full_bottom_dotWrapper{
          text-align:center;
          font-size: 0;
          height: 20%;
          margin-top: 10%;
          .player-full_bottom_dot{
            display: inline-block;
            vertical-align:bottom;
            margin: 0 4px;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: $color-text-l;
            &.active {
            width: 20px;
            border-radius: 5px;
            background: $color-text-l;
          }
          }
  
        }

      .container {
        position: absolute;
        width: 100%;
        top: 35%;

        .player-full_bottom_progress {
          display: flex;
          align-items: center;
          width: 80%;
          margin: 0px auto;
          padding: 10px 0;
          .time {
            color: $color-text;
            font-size: $font-size-small;
            flex: 0 0 40px;
            line-height: 30px;
          }
          &.time-l {
            text-align: left;
          }
          &.time-r {
            text-align: right;
          }
          .player-full_bottom_progress_bar {
            flex: 1;
          }
        }
      }

      .player-full_bottom_operators {
        display: flex;
        align-items: center;
        .icon {
          flex: 1;
          color: $color-theme;
          &.disable {
            color: $color-theme-d;
          }
          i {
            font-size: 30px;
          }
        }
        .i-left {
          text-align: right;
        }
        .i-center {
          padding: 0 20px;
          text-align: center;
          i {
            font-size: 40px;
          }
        }
        .i-right {
          text-align: left;
        }
        .icon-favorite {
          color: $color-sub-theme;
        }
      }
    }

    /* full有关的动画 */
    &.full-enter-active,&.full-leave-active{
      /* 中间组件线性消失，上下组件贝塞尔曲线消失，并位移 */
      transition: all .6s;
      .player-full_top,.player-full_bottom{
        transition: all .6s cubic-bezier(0.45,0,0.55,1)
      }
    }
    &.full-enter-from,&.full-leave-to{
      opacity: 0;
      .player-full_top{
        transform: translate3d(0,-100px,0);
      }
      .player-full_bottom{
        transform: translate3d(0,100px,0);
      }
    }
  }
}
</style>