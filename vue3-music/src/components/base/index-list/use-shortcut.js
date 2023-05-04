import { computed, nextTick, ref,onMounted } from 'vue'
export default function useShortcut(props, groupRef,scrollRef) {
    // const scrollRef = ref(null)
    const shortcutList = computed(() => {
        return props.data.map((group) => {
            return group.title
        })
    })
    const ANCHOR_HEIGHT = 18
    const touch = {}
    function onShortcutTouchStart(e) {
            const anchorIndex = parseInt(e.target.dataset.index)
            touch.y1 = e.touches[0].pageY
            touch.anchorIndex = anchorIndex
            scrollTo(anchorIndex)
        }

    function onShortcutTouchMove(e){
            touch.y2 = e.touches[0].pageY
            // 或0是正数向下取整的一种写法
            const delta= (touch.y2-touch.y1)/ANCHOR_HEIGHT|0
            const anchorIndex= touch.anchorIndex+delta
            scrollTo(anchorIndex)
    }
    function scrollTo(anchorIndex){
        if(isNaN(anchorIndex)) return
        anchorIndex = Math.max(
            0,Math.min(shortcutList.value.length-1,anchorIndex)
        )
        const targetEl = groupRef.value.children[anchorIndex]
        const scroll = scrollRef.value.scroll
        scroll.scrollToElement(targetEl,0)
    }

    
    return {
        shortcutList,
        // scrollRef,
        onShortcutTouchStart,
        onShortcutTouchMove
    }
}