<template>
    <div class="noResult">
        <div class="noResult_content">
            <div class="noResult_content_icon"></div>
            <p class="noResult_content_text">{{ title }}</p>
        </div>
    </div>
</template>

<script>
export default { name: 'no-result' }
</script>

<script setup>
import {ref,getCurrentInstance} from 'vue'
    const title = ref('抱歉，没有结果')
    const setTitle = (title_)=>{
        title.value = title_
    }
    getCurrentInstance().setTitle = setTitle

</script>


<style lang="scss" scoped>
  .noResult {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate3d(-50%, -50%, 0);
    .noResult_content {
      text-align: center;
      .noResult_content_icon {
        width: 86px;
        height: 90px;
        margin: 0 auto;
        @include bg-image('no-result');
        background-size: 86px 90px;
      }
      .noResult_content_text {
        margin-top: 30px;
        font-size: $font-size-medium;
        color: $color-text-d;
      }
    }
  }
</style>