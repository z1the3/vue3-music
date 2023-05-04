<template>
    <div class="progressBar" ref="root" @click="onClick">
        <div class="progressBar_inner">
            <div class="progressBar_inner_progress"
            :style="progressStyle"
            ref="progressRef">

            </div>
            <div class="progressBar_inner_btn"
             :style="btnStyle"
             @touchstart.prevent="onTouchStart"
             @touchmove.prevent="onTouchMove"
             @touchend.prevent="onTouchEnd">
                <div class="btn" ></div>
            </div>

        </div>
        
    </div>
</template>

<script setup>
import {getCurrentInstance, watch,computed,ref, nextTick} from 'vue'

const PROGRESS_BTN_WIDTH = 16
const props = defineProps({
    progress:{
        type:Number,
        default:0
    }
})
const progressRef = ref(null)
const emits = defineEmits([
    'progress-changing','progress-changed'
])

const offset = ref(0)
const root = ref(null)
const curProgress = computed(()=>props.progress)
const progressStyle = computed(()=>{
    return `width:${offset.value}px`
})
const btnStyle = computed(()=>{
    return `transform:translate3d(${offset.value}px,0,0)`
})

const touch = {}
const onTouchStart = (e) => {
    touch.x1 = e.touches[0].pageX
    // 获得黄条长度,黄条为progress ref
    touch.beginWidth = progressRef.value.clientWidth 
}

const onTouchMove = (e) => {
    const delta = e.touches[0].pageX - touch.x1
    const tempWidth = touch.beginWidth + delta
    const barWidth = root.value.clientWidth - PROGRESS_BTN_WIDTH
    const progress = Math.min(1,Math.max(tempWidth/barWidth,0))
    // 双向改变progress
    offset.value = barWidth * progress
    emits('progress-changing',progress)
}

const onTouchEnd = (e) => {
    
    const barWidth = root.value.clientWidth - PROGRESS_BTN_WIDTH
    const rect = root.value.getBoundingClientRect()

    const delta = e.changedTouches[0].pageX - rect.x
    const progress = delta / barWidth
    emits('progress-changed',progress)
}

const onClick = (e) => {
    const rect = root.value.getBoundingClientRect()
    const offsetWidth = e.x - rect.left
    const barWidth = root.value.clientWidth - PROGRESS_BTN_WIDTH
    const progress = offsetWidth/ barWidth
    emits('progress-changed',progress)

}

// 复用函数，在主播放器dom加载完成后再对barWidth进行加载
// 这样会加载两次（第一次为不正常，第二次为正常
function setOffset(progress){
        const barWidth = root.value.clientWidth - PROGRESS_BTN_WIDTH
        offset.value = barWidth * progress

}
const this_ = getCurrentInstance()
this_.setOffset = setOffset

watch(curProgress,async (newProgress)=>{
    setOffset(newProgress)
})


defineExpose({root})


</script>
<style lang="scss" scoped>
    .progressBar{
        height: 30px;
        .progressBar_inner{
            position: relative;
            top: 13px;
            height: 4px;
            background: rgba(0,0,0,0.3);
            .progressBar_inner_progress{
                position: absolute;
                height: 100%;
                background: $color-theme;
            }
            .progressBar_inner_btn{
                position: absolute;
                left: -8px;
                top: -13px;
                width: 30px;
                height: 30px;
                .btn{
                    position: relative;
                    top: 7px;
                    left: 7px;
                    box-sizing: border-box;
                    width: 16px;
                    height: 16px;
                    border: 3px solid $color-text;
                    border-radius: 50%;
                    background: $color-theme;
                }
            }
        }
    }


</style>