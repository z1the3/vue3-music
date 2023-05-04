<template>
  <div class="suggest" v-loading:[loadingText]="loading">
    <!-- v-no-result="noResult"> -->
    <ul class="suggestList" v-show="!stopSuggestion">
      <li
        class="suggestList_item"
        v-show="singer"
        @click="selectSuggest(singer)"
      >
        <div class="suggestList_item_icon">
          <i class="icon-mine"></i>
        </div>
        <div class="suggestList_item_name">
          <p class="text">{{ singer?.name }}</p>
        </div>
      </li>
      <li
        class="suggestList_item"
        v-for="song in songs"
        :key="song.id"
        @click="selectSuggest(song)"
      >
        <div class="suggestList_item_icon">
          <i class="icon-music"></i>
        </div>
        <div class="suggestList_item_name">
          <p class="text">{{ song.name }}</p>
        </div>
      </li>
    </ul>

    <scroll class="resultList" v-show="stopSuggestion">
      <div>
        <li class="resultList_item" v-for="song in processArtists(result.songs)" :key="song.id"
        @click="selectSong(song)">
        <div class="resultList_item_icon">
          <i class="icon-music"></i>
        </div>
        <div class="resultList_item_name">
          <p class="text">{{song.artistsNames}}{{song.name  }}</p>
        </div>
      </li>
      </div>

    </scroll>
    </div>
</template>
<script setup>
import { ref, watch, computed, nextTick } from "vue";
import { useSearchResult } from "./use-search-result";
import { searchSuggest } from "../../service/search";
import { processArtists } from "./util.js";
import scroll from '../base/scroll/Scroll.vue'
const { stopSuggestion, searchResult, result } = useSearchResult();
const props = defineProps({
  showSinger: {
    type: Boolean,
    default: true,
  },
  modelValue: {
    type: String,
  },
  resultFromEnter:{
    type:Object
  }
});

const emits = defineEmits(['select-song']);

const singer = ref(null);
const songs = ref([]);
const hasMore = ref(true);
const loadingText = ref("");

// 取出歌手,只能有一个
function processSinger(singers) {
  return singers[0];
}

function selectSong(song){
  emits('select-song',song)
}
async function selectSuggest(suggest) {
  emits("update:modelValue", suggest?.name);
  await nextTick();
  await searchResult(suggest?.name);
}


const loading = computed(() => {
  return !singer && !songs.length && query;
});

// suggest
async function searchFirst() {
  if (stopSuggestion.value) return;
  let result = await searchSuggest(props.modelValue);
  result = result.suggest.result;

  if (props.showSinger && result.artists && result.songs) {
    songs.value = processArtists(result.songs);
    singer.value = processSinger(result.artists);
  } else if (result.songs) {
    songs.value = processArtists(result.songs);
    singer.value = null;
  }
  hasMore.value = result.hasMore;
}
//
watch(
  () => props.modelValue,
  (newQuery) => {
    // 如果newQuery为空也不给建议
    stopSuggestion.value = false;
    
    if (!newQuery) {
      songs.value = [];
      singer.value = null;
      return;
    }
    searchFirst();
  }
);

watch(()=>props.resultFromEnter,(newRes)=>{
  if(newRes.songs){
    stopSuggestion.value = true
    result.value = newRes
  }
})
</script>


<style lang="scss" scoped>
.suggest {
  height: 100%;
  overflow: hidden;
  .suggestList {
    padding: 0 30px;
    .suggestList_item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .suggestList_item_icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .suggestList_item_name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
  .resultList {
    padding: 0 30px;
    width: 100%;
  height: 100%;
  overflow: scroll;
    .resultList_item {
      display: flex;
      align-items: center;
      padding-bottom: 20px;
      .resultList_item_icon {
        flex: 0 0 30px;
        width: 30px;
        [class^="icon-"] {
          font-size: 14px;
          color: $color-text-d;
        }
      }
      .resultList_item_name {
        flex: 1;
        font-size: $font-size-medium;
        color: $color-text-d;
        overflow: hidden;
        .text {
          @include no-wrap();
        }
      }
    }
  }
}
</style>