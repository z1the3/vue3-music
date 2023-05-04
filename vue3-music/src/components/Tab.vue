<template>
  <div class="tab">
    <router-link
      class="tab_item"
      v-for="tab in tabs"
      :key="tab.path"
      :to="tab.path"
    >
    <span class="tab_item_link">
        {{ tab.name }}
    </span>
    </router-link>
  </div>
</template>

<script setup>
import { reactive } from "vue";


    const tabs = reactive([
        // {
        //     name:'推荐',
        //     path:'/recommend'
        // },
        {
            name:'歌手',
            path:'/singer'
        },
        // {
        //     name:'排行',
        //     path:'/top'
        // },
        {
            name:'搜索',
            path:'/search'
        }
    ])
</script>

<style lang="scss" scoped>
    .tab{
        display: flex;
        height: 44px;
        line-height: 44px;
        font-size: $font-size-medium;
        .tab_item{
            flex: 1;
            text-align: center;
            .tab_item_link{
                padding-bottom: 5px;
                color: $color-text-l;
            }
            &.router-link-active{
                .tab_item_link{
                    color: $color-theme;
                    border-bottom: 2px solid $color-theme;
                }
            }
        }
    }
</style>