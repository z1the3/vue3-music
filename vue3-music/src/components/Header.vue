<template>
    <div class="header">
        <span class="header_icon"></span>
        <h1 class="header_text">music</h1>
    </div>
</template>


<script setup>

</script>

<style lang="scss" scoped>
    .header {
        height: 44px;
        text-align: center;
        color: $color-theme;
        font-size: 0;
        .header_icon{
            display:inline-block;
            vertical-align: top;
            margin-top:6px;
            width: 30px;
            height: 32px;
            margin-right: 9px;
            @include bg-image('logo');
            background-size: 30px 32px;
        }
        .header_text{
            display: inline-block;
            vertical-align: top;
            line-height: 44px;
            font-size: $font-size-large;
        }
    }

</style>