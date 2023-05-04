<template>
    <transition name="mini">
        <div class="miniPlayer"
        v-show="!fullScreen"
        @click="showFullPlayer">
        <!-- 复用useCd逻辑 -->
            <div class="miniPlayer_cdWrapper" >
                <div class="miniPlayer_cdWrapper_cd" 
                 ref="cdRef">
                    <img :src="currentSong.pic" 
                    width="40"
                    height="40"
                    ref="cdImageRef"
                    :class="cdCls">
                </div>
            </div>
                <h2 class="miniPlayer_name">{{currentSong.name  }}</h2>
                <p class="miniPlayer_desc">{{currentSong.singer?.[0].name}}</p>

                <div class="miniPlayer_control">
                    <!-- 如果不加stop，点击事件会冒泡到外层 -->
                    <!-- 触发上层点击事件 -->
                    <ProgressCircle
                        :progress="progress"
                        :radius="32">
                        <i class="icon-mini"
                        :class="miniPlayIcon"
                        
                        @click.stop="togglePlay"
                        
                        ></i>
                        
                    </ProgressCircle>

                </div>
                <div class="miniPlayer_control"
                @click.stop="showPlaylist">
                    <i class="icon-playlist"></i>
                </div>
                <Playlist ref="playListRef"></Playlist>

        </div>
    </transition>  
</template>


<script setup>
    import Playlist from './playlist.vue'
    import useSongListStore from '../../store/index.js'
    import {computed,ref} from 'vue'
    import ProgressCircle from './ProgressCircle.vue'
    import useCd from './use-cd'
    const props = defineProps({
        progress:{
            type: Number,
            default: 0
        },
        togglePlay:{
            type: Function,
        }
    })
    const playListRef = ref(null)
    const store = useSongListStore()
    const currentIndex = computed(() => store.currentIndex);
    const playList = computed(() => store.playList);
    const fullScreen = computed(()=>store.fullScreen)
    const currentSong = computed(()=>store.currentSong)

    const {cdCls,cdImageRef,cdRef} = useCd()



    function showFullPlayer(){
        store.setFullScreen(true)
    }

    function showPlaylist() {
        playListRef.value.listRef.__vnode.ctx.show()

    }
    // function togglePlay(){
    //     store.togglePause()
    // }
    const isPlaying = computed(()=>store.playing)
    const miniPlayIcon = computed(()=>{
        return isPlaying.value?'icon-pause-mini':'icon-play-mini'
    })
</script>

<style lang="scss" scoped>
.miniPlayer{
    display: flex;
    align-items: center;
    position: fixed;
    justify-content: space-between;
    left: 0;
    bottom: 0;
    z-index: 180;
    width: 100%;
    height: 60px;
    background: $color-highlight-background;
    .miniPlayer_cdWrapper{
        flex: 0 0 40px;
        width: 40px;
        height: 40px;
        padding: 0 10px 0 20px;
        .miniPlayer_cdWrapper_cd{
            height: 100%;
            width: 100%;
            img {
                border-radius: 50%;
                &.playing {
                    animation: rotate 10s linear infinite;
                }
                &.pause {
                    /* 控制播放暂停 */
                    animation-play-state: paused;
                }
            }

        }
    }
    .miniPlayer_name {
        margin-bottom: 2px;
        @include no-wrap();
        font-size: $font-size-medium;
        color: $color-text;
    }
    .miniPlayer_desc{
        @include no-wrap();
        font-size: $font-size-small;
        color: $color-text-d;
    }

    .miniPlayer_control {
        flex: 0 0 30px;
        width: 30px;
        padding: 0 10px;
        .icon-playlist{
            position: relative;
            top: -2px;
            font-size: 28px;
            color: $color-theme-d;
        }
        .icon-mini{
            position: absolute;
            left: 0;
            top: 0;
            color: $color-theme-d;
            font-size: 32px;
        }
    }
    &.mini-enter-active{
        transition: all 0.6s cubic-bezier(0.45,0,0.55,1);
    }
    &.mini-leave-active{
        transition: all 0s;
    }
    &.mini-enter-from, &.mini-leave-to {
        opacity: 0;
        /* 从y轴100%位置移动来 */
        transform: translate3d(0,100%,0);
    }
}
</style>