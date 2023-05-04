<template>
  <div class="recommend" v-loading:[loadingText]="loading">
    <!-- scroll只对内部第一个组件有效，所以包一层 -->
    <Scroll class="scroll_container">
      <div>
        <div class="recommend_slider_wrapper">
          <div class="recommend_slider_content">
            <Slider v-if="sliders.length" :sliders="sliders"></Slider>
          </div>
        </div>
        <div class="recommend_list">
          <h1 class="recommend_list_title" v-show="!loading">热门歌单推荐</h1>
          <ul>
            <li
              v-for="item in albums"
              class="recommend_list_item"
              :key="item.id"
            >
              <div class="recommend_list_icon">
                <!--  使用懒加载 -->
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="recommend_list_text">
                <h2 class="name">
                  {{ item.username }}
                </h2>
                <p class="title">
                  {{ item.title }}
                </p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Scroll>
  </div>
</template>

<script setup>
import { getRecommend } from "../service/recommend";
import Slider from "../components/base/slider/Slider.vue";
import Scroll from "../components/base/scroll/Scroll.vue";

import { computed, ref } from "vue";
let sliders = ref([]);
let albums = ref([]);
let loadingText = ref('正在载入中....')

const loading = computed(()=>{
  return !sliders.value.length && !albums.value.length
})
const getRecommend_ = async () => {
  const result = await getRecommend();
  console.log(result)
  sliders.value = result.sliders;
  albums.value = result.albums;
};
getRecommend_();
</script>


<style lang="scss" scoped>
.recommend {
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  overflow: scroll;
  .scroll_container {
    height: 100%;
    overflow: hidden;
    .recommend_slider_wrapper {
      position: relative;
      width: 100%;
      height: 0;
      padding-top: 40%;
      overflow: hidden;
      .recommend_slider_content {
        position: absolute;
        width: 100%;
        height: 100%;
        left: 0;
        top: 0;
      }
    }
    .recommend_list {
      .recommend_list_title {
        height: 65px;
        line-height: 65px;
        text-align: center;
        font-size: $font-size-medium;
        color: $color-theme;
      }
      .recommend_list_item {
        display: flex;
        box-sizing: border-box;
        align-items: center;
        padding: 0 20px 20px 20px;
        .recommend_list_icon {
          flex: 0 0 60px;
          width: 60px;
          padding-right: 20px;
        }
        .recommend_list_text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          flex: 1;
          line-height: 20px;
          overflow: hidden;
          font-size: $font-size-medium;
          .name {
            margin-bottom: 10px;
            color: $color-text;
          }
          .title {
            color: $color-text-d;
          }
        }
      }
    }
  }
}
</style>