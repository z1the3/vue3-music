<template>
    <div class="loading">
        <div class="loading_content">
            <img src="./default.png" width="24" height="24">
            <p class="desc">{{title}}</p>
        </div>
    </div>

</template>
<script>
export default { name: 'loading' }
</script>

<script setup>
import {ref,getCurrentInstance} from 'vue'
    const title = ref('')
    const setTitle = (title_)=>{
        title.value = title_
    }
    getCurrentInstance().setTitle = setTitle


</script>


<style lang="scss" scoped>
    .loading{
        /* 由于绝对定位的父级必须不能是static,应该是
        relative或fixed,所以可以对自定义指令进行优化
        能够给父级增加样式，保证这玩意居中 */
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate3d(-50%,-50%,0);

        .loading_content{
            text-align: center;
            .desc{
                line-height: 20px;
                font-size: $font-size-small;
                color: $color-text-l;
            }
        }

    }

</style>
