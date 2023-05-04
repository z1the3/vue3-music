<template>
    <div class="search">
        <div class="search_warpper">
            <SearchInput v-model="query" @from-enter-result="getFromEnterResult"></searchInput>
        </div>
        <div class="search_content" v-show="!query">
            <div class="search_content_keys">
                <h1 class="search_content_keys_title">热门搜索</h1>
                <ul>
                    <li class="search_content_keys_item"
                    v-for="item in hotKeys"
                    :key="item.first"
                    @click="addQuery(item.first)"
                    >
                        <span>{{ item.first}}</span>

                    </li>
                </ul>
            </div>

        </div>
        <div class="search_result">
                <Suggest v-model="query" :show-singer="true" :resultFromEnter="resultFromEnter"
                @select-song="selectSong"
                ></Suggest>
            </div>
    </div>

</template>

<script setup>
import {ref,watch} from 'vue'
import {getHotKeys} from '../service/search'
import SearchInput from '../components/search/search-input.vue'
import Suggest from '../components/search/Suggest.vue'
import useSongListStore from '../store'
import {processSongs} from '../service/song'

const hotKeys = ref([])
const query = ref('')
const resultFromEnter = ref({})
const store = useSongListStore()


async function getHotKeys_(){
    const res = await getHotKeys()
    hotKeys.value = res.hotKeys
}


getHotKeys_()

function addQuery(key){
    query.value = key
}

function getFromEnterResult(res){
    resultFromEnter.value = res
}

async function selectSong(song){
    store.songsUrl[song.id]=`https://music.163.com/song/media/outer/url?id=${song.id}.mp3 `
    store.addSong(song)

}

</script>

<style lang="scss" scoped>
    .search{
        position: fixed;
        width: 100%;
        top: 88px;
        bottom: 0;
        display: flex;
        flex-direction: column;
        .search_wrapper{
            margin: 20px;
        }
        .search_content{
            margin-top:10px ;
            flex: 1;
            overflow: hidden;
            .search_content_keys{
                margin: 0 20px 20px 20px;
                .search_content_keys_title{
                    margin-bottom: 20px;
                    font-size: $font-size-medium;
                    color: $color-text-l;
                }
                .search_content_keys_item{
                    display: inline-block;
                    padding: 5px 10px;
                    margin: 0 20px 10px 0;
                    border-radius: 6px;
                    background: $color-highlight-background;
                    font-size: $font-size-medium;
                    color: $color-text-d;
                }
            }
        }
        .search_result {
            flex: 1;
            overflow: hidden;
            margin-top: 15px;
        }
    }

</style>