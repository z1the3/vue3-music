<template>
    <div class="searchInput">
        <i class="icon-search"></i>
        <input type="text" class="searchInput_inner"
        v-model="query"
        :placeholder="placeholder"
        @keydown.enter="searchResult_(query)"
        />
        <i class="icon-dismiss"  v-show="query"
        @click="clear"></i>
    </div>
</template>

<script setup>
import { computed ,watch,ref} from "vue"
import {useSearchResult} from './use-search-result'
const props = defineProps({
    modelValue:{
        type: String,
    },
    placeholder:{
        type: String,
        default: '按下回车键搜索歌曲'
    }
})

const {searchResult,result} = useSearchResult()
const emit = defineEmits(['fromEnterResult'])
const query = ref(props.query)

function clear(){
    emit('update:modelValue','')
    // 如果点删除，直接强制触发，不然1000ms防抖会导致
    // loading组件报错

}

function searchResult_(query){
    searchResult(query)
}

const debounce = (fn,delay)=>{
    let timer = null
    return function(){
        let context = this,
        args = [...arguments]

        if(timer){
            clearTimeout(timer)
            timer = null
        }
        timer = setTimeout(()=>{
                fn.apply(context,args)
            },delay)
    }

}



const debouncer = debounce((newQuery)=>{
            emit('update:modelValue',newQuery)
        },300)




// 不能直接修改props,所以复制一份然后watch,触发v-model的事件
watch(query,(newQuery)=>{
    if(newQuery==='') {
        clear()
        return
    }
    debouncer(newQuery)

})


// props修改要能映射到query上,query只是通过ref获得了初始值
// 注意这里用getter
watch(()=>props.modelValue,(newVal)=>{
    query.value=newVal
})


watch(result,(newResult)=>{
    emit('fromEnterResult',newResult)
})



</script>

<style lang="scss" scoped>
    .searchInput {
        display: flex;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        padding: 0 6px;
        height: 32px;
        background: $color-highlight-background;
        border-radius: 6px;
        .icon-search{
            font-size: 24px;
            color: $color-text-d;
        }
        .searchInput_inner{
            flex: 1;
            margin: 0 5px;
            line-height: 18px;
            background: $color-highlight-background;
            color: $color-text;
            font-size: $font-size-medium;
            outline: 0;
            /* 伪元素 */
            &::placeholder{
                color: $color-text-d;
            }
        }
        .icon-dismiss{
            font-size: 16px;
            color: $color-text-d;
        }
    }


</style>