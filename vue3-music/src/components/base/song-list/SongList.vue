<template>
    <ul class="songList">
        <li class="songList_item"
        v-for="(song,index) in songs"
        :key="song.id"
        @click="selectItem(song,index)">
            <div class="songList_content">
                <h2 class="songList_content_name">
                    {{ song.name }}
                </h2>
                <p class="desc">
                    {{ getDesc(song) }}
                </p>
            </div>

        </li>
    </ul>
</template>

<script setup>
const props = defineProps({
    songs:{
        type:Array,
        default(){
            return []
        }
    }
})
const emit = defineEmits(['select'])
const mergeSinger = (singers)=>{
    let res = ''
    singers.map((singer)=>{
        res+=`${singer.name} `
    })
    return res
}

const getDesc = (song) => {
    return `${mergeSinger(song.singer)}         ${song.album}`
}


const selectItem=(song,index) =>{
    emit('select', {song,index})
}
</script>

<style lang="scss" scoped>
    .songList{
        .songList_item{
            display: flex;
            align-items: center;
            box-sizing: border-box;
            height: 64px;
            font-size: $font-size-medium;
            .songList_item_content{
                flex: 1;
                line-height: hidden;
                overflow: hidden;
                /* @mixin no-wrap() {
                    text-overflow: ellipsis;
                    overflow: hidden;
                    white-space: nowrap;
                } */
                .songList_item_content_name{
                    @include no-wrap();
                    color: $color-text;
                    
                }
                .desc {
                    @include no-wrap();
                    margin-top: 4px;
                    color: $color-text-d;
                }
            }
        }
    }

</style>