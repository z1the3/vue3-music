<template>
    <!-- 穿越到body组件上,body可以不被父元素样式影响 -->
    <teleport to='body'>
        <transition name="list-fade">
            <div class="list"
            v-show="visible && playlist.length"
            @click="hide"
            ref="listRef">
            <!-- 在这里加stop可以一起阻止下层冒泡 -->
                <div class="list_wrapper" @click.stop>
                    <div class="list_wrapper_header">
                        <h1 class="list_wrapper_header_title">
                                <!-- ***加入.stop，阻止内层点击事件冒泡到最外层而关闭窗口 -->
                                <i class="icon"
                                :class="modeIcon"
                                @click="changeMode"></i>
                                <span class="text">{{modeText}}</span>
                        </h1>
                    </div>
                    <scroll class="list_wrapper_content"
                    ref="scrollRef">
                    <!-- 删除某个item时，整个group会产生变化 -->
                    <!-- 相关在全局scss里 -->
                    <!-- 实际上是一个ul -->
                        <transition-group ref="itemListRef"
                        name="list"
                        tag="ul">
                            <li 
                            class="list_wrapper_content_item"
                            v-for="song in sequeceList"
                            :key="song.id"
                            @click="selectItem(song)"
                            >
                                <i class="current"
                                :class="getCurrentIcon(song)"
                                ></i>
                                
                                <span class="text">{{song.name}}</span>
                                <!-- ***加入.stop，阻止内层点击事件冒泡到最外层而关闭窗口 -->
                                <span class="favorite" @click.stop="toggleFavorite(song)">
                                    <i :class="getFavoriteIcon(song)"></i>
                                </span>
                                <span class="delete" @click.stop="removeSong(song)">
                                    <i class="icon-delete"></i>
                                </span>
                            </li>
                        </transition-group>


                    </scroll>
                    <div class="list_wrapper_footer" @click.stop="hide">
                        <span>关闭</span>
                    </div>
                </div>
            </div>
        </transition>
    </teleport>
</template>
<script setup>
import Scroll from '../base/scroll/Scroll.vue'
import {computed, ref,getCurrentInstance, nextTick,watch} from 'vue'
import useSingListStore from '../../store/index'
import useMode from './use-mode'
import useFavorite from './use-favorite'

const visible = ref(false)
// 控制列表滚动
const itemListRef = ref(null)
// 暴露出的ref
const listRef = ref(null)
const scrollRef = ref(null)
const store = useSingListStore()
const playlist = computed(()=>store.playList)
const sequeceList = computed(()=>store.sequenceList)
const currentSong = computed(()=>store.currentSong)


const {modeIcon,changeMode,modeText} = useMode()
const {getFavoriteIcon,toggleFavorite} = useFavorite()
const this_ = getCurrentInstance()
this_.show = show

function hide(){
    visible.value = false
}
async function show(){
    visible.value = true
    // 等到dom加载出来手动刷新
    await nextTick()
    refreshScroll()
    scrollToCurrent()
}

function getCurrentIcon(song){
    if(song.id===currentSong.value.id){
        return 'icon-play'
    }
}

function refreshScroll(){
    // 等到dom加载出来手动刷新
    scrollRef.value.scroll.refresh()
}

function scrollToCurrent(){
    const index = sequeceList.value.findIndex((song)=>{
        return currentSong.value.id === song.id
    })
    const target = itemListRef.value.$el.children[index]
    scrollRef.value.scroll.scrollToElement(target,300)
}


function selectItem(song) {
    const index = playlist.value.findIndex((item)=>{
        return song.id === item.id
    })
    store.currentIndex = index
    store.playing = true
}

function removeSong(song){
    store.removeSong(song)
}

watch(currentSong, async()=>{
    if(!visible.value) return
    await new Promise((resolve)=>setTimeout(()=>resolve,30))

    scrollToCurrent()
})
defineExpose({listRef})
</script>

<style lang="scss" scoped>
    .list{
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        z-index: 200;
        background-color: $color-background-d ;
        &.list-fade-enter-active,&.list-fade-leave-active{
            transition: opacity .3s;
            /* 只有过渡时才会给wrapper加上这个 */
            .list_wrapper{
                transition: all .3s;
            }
        }
        &.list-fade-enter-from,&.list-fade-leave-to{
            opacity: 0;
            .list_wrapper{
                transform: translate3d(0,100%,0);
            }
        }
        /* 模态框的思路 */
        .list_wrapper {
            position: fixed;
            left: 0;
            bottom: 0;
            z-index: 210;
            width: 100%;
            background-color: $color-highlight-background ;
            .list_wrapper_header{
                position: relative;
                padding: 20px 30px 10px 20px;
                .list_wrapper_header_title{
                    display: flex;
                    align-items: center;
                    .icon{
                        margin-right: 10px;
                        font-size: 24px;
                        color: $color-theme-d;
                    }
                    .text{
                        flex: 1;
                        font-size: $font-size-medium;
                        color: $color-text-l;
                    }
                    .clear{
                        /* 扩展图标的点击范围，可以用伪元素 */
                        @include extend-click();
                        .icon-clear{
                            font-size: $font-size-medium;
                            color: $color-text-d;
                        }
                    }

                }
            }
            .list_wrapper_content{
                max-height: 240px;
                overflow: hidden;
                .list_wrapper_content_item{
                    display: flex;
                    align-items: center;
                    height: 40px;
                    padding: 0 30px 0 20px;
                    overflow: hidden;
                    /* 图标 */
                    .current{
                        flex: 0 0 20px;
                        width: 20px;
                        font-size: $font-size-small;
                        color: $color-theme-d;
                    }
                    .text {
                        flex: 1;
                        @include no-wrap();
                        font-size: $font-size-medium;
                        color: $color-text-d;
                    }
                    .favorite {
                        @include extend-click();
                        margin-right: 15px;
                        font-size: $font-size-small;
                        color: $color-theme;
                        .icon-favorite {
                            color: $color-sub-theme;
                        }
                    }
                    .delete {
                        @include extend-click();
                        font-size: $font-size-small;
                        color: $color-theme;
                    }
                }
            }

        }

    }
</style>