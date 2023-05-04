<template>
    <div class="singer-detail">
        <MusicList
        :songs="songs"
        :title="title"
        :pic="pic"
        :loading="loading">

        </MusicList>
    </div>
</template>

<script setup>
import {getSingerDetail} from '../service/singer'
import MusicList from '../components/MusicList.vue'
import {ref,computed} from 'vue'
import {SINGER_KEY} from '../assets/js/constant'
import storage from 'good-storage'
import {useRoute,useRouter} from 'vue-router'
import useSongListStore from '../store'
const props = defineProps({
    singer:{
        type: Object,
        default(){
            return {}
        }
    }
})

const songs = ref([])
const songsUrl = ref({})
const loading = ref(true)
const route = useRoute()
const router = useRouter()

const computedSinger = (()=>{
    let res = null
    const singer_ = props.singer
    if(singer_){
        res = singer_
    }else{
        const cachedSinger = storage.session.get(SINGER_KEY)
        if(cachedSinger&&cachedSinger.id==route.params.id){
            res = cachedSinger
        }

    }
    return res
})
const pic = computed(()=>{
    const singer = computedSinger()
    return singer && singer.pic
})

const title = computed(()=>{
    const singer = computedSinger()

    return singer && singer.name
})


const store = useSongListStore()
async function getSingerDetail_(){
    const singer = computedSinger()
    if(!singer){
        // 拿到一级路由地址
        const path = route.matched[0].path
        router.push({path})
    }
    const result = await getSingerDetail(singer)
    songs.value = result.songs
    songs.value.map((song)=>{
        songsUrl.value[song.id]=`https://music.163.com/song/media/outer/url?id=${song.id}.mp3 `
        store.songsUrl = songsUrl
    })
    store.sequenceList = songs.value
    loading.value = false
} 
getSingerDetail_()


</script>

<style lang="scss" scoped>
    .singer-detail {
        position: fixed;
        z-index: 10;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
    }


</style>
