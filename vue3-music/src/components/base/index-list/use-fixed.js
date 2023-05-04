import {nextTick, ref,watch,computed} from 'vue'

export default function useFixed(props){
    const TITLE_HEIGHT = 30
    const groupRef = ref(null)
    const listHeights = ref([])
    const scrollY = ref(0)
    const currentIndex = ref(0)
    // 吸顶效果，给予fixed一个偏移量,利用transform
    const distance = ref(0)
    // dom一旦发生变化，重新计算
    // props变化，但dom并没有变化，所以await nextTick
    watch(()=>props.data,async()=>{
        await nextTick()
        calculate()
    })



    watch(scrollY,(newY)=>{
        if(newY<0){
            currentIndex.value = -1
            return
        }
        for(let i=0;i<listHeights.value.length - 1;i++){
            const heightTop = listHeights.value[i]
            const heightBottom = listHeights.value[i+1]
            if(newY>=heightTop&&newY<=heightBottom){
                currentIndex.value = i
                distance.value = heightBottom-newY

                return
            }
        }
    })


    const fixedTitle = computed(()=>{
        const currentGroup = props.data[currentIndex.value]
        return currentGroup?currentGroup.title:''
    })

    const fixedStyle = computed(()=>{
        const diff = (distance.value>0&&distance.value<TITLE_HEIGHT)
        ?distance.value - TITLE_HEIGHT: 0

        return {
            transform: `translate3d(0, ${diff}px,0)`
        }
    })
    function calculate(){
        // 拿到所有的子节点
        const list = groupRef.value.children
        // 计算滚动列表高度
        let height = 0
        // 清空数组
        listHeights.value.length = 0
        listHeights.value.push(0)

        for(let i = 0;i<list.length;i++){
            height += list[i].clientHeight
            listHeights.value.push(height)
            // [0,10,20,30]
        }
    }
    // pos.y最上面是0，下面是负值
    function onScroll(pos){
        scrollY.value = -pos?.y
    }
    return {
        groupRef,
        onScroll,
        fixedTitle,
        fixedStyle,
        currentIndex
    }
}