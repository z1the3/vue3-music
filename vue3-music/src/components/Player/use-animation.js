// 切换时将左下角小CD生成动画移动到右上角，需要计算位置，生成动画帧
import animations from 'create-keyframe-animation'
import { ref } from 'vue'

export default function useAnimation() {
    const cdWrapperRef = ref(null)
    // 定义标志位，防止快速点击，产生两段动画发生冲突，leave到一半时不能触发enter
    let entering = false
    let leaving = false
    function enter(el,done) {
        if(leaving){
            afterLeave()
        }
        enter = true
        const {x,y,scale} = getPosAndScale()
        const animation = {
            0: {
                transform:`translate3d(${x}px,${y}px,0) scale(${scale})`
            },
            100:{
                transform: 'translate3d(0,0,0) scale(1)'
            }
        }

        animations.registerAnimation({
            name: 'move',
            animation,
            presets:{
                duration: 600,
                easing: 'cubic-bezier(0.45,0,0.55,1)'
            }
        })
        // 需要手动传入done
        animations.runAnimation(cdWrapperRef.value,'move',done)

    }

    function afterEnter() {
        enter = false
        // 该钩子里做一些清理操作
        animations.unregisterAnimation('move')
        cdWrapperRef.value.animation = ''

    }

    function leave(el,done) {
        // 手动执行
        if(entering){
            afterEnter()
        }
        leave = true
        const {x,y,scale} = getPosAndScale()
        const cdWrapperEl = cdWrapperRef.value
        cdWrapperEl.style.transition = 'all .6s cubic-bezier(0.45,0,0.55,1)'
        cdWrapperEl.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale})`
        // 监听该事件，执行移除监听和done*
        cdWrapperEl.addEventListener('transitionend',next)
        function next(){
            cdWrapperEl.removeEventListener('transitionend',next)
            done()
        }
    }

    function afterLeave() {
        leave = false
        const cdWrapperEl = cdWrapperRef.value
        cdWrapperEl.style.transition = ''
        cdWrapperEl.style.transform = ''


    }

    // 计算偏移量和减小量，从右上到左下
    function getPosAndScale() {
        const targetWidth = 40
        const littlePaddingLeft = 40
        const littlePaddingBottom = 30
        const bigPaddingTop = 80
        // 大CD的宽度
        const width = window.innerWidth * 0.8
        // x轴方向移动距离，负向
        const x = -(window.innerWidth / 2 - littlePaddingLeft)
        // y轴方向移动距离，正向。半径相同，所以大CD的宽度也是高度
        const y = window.innerHeight - bigPaddingTop - width / 2 - littlePaddingBottom

        const scale = targetWidth / width

        return {
            x,
            y,
            scale
        }
    }
    return {
        cdWrapperRef,
        enter,
        afterEnter, leave,
        afterLeave
    }

}