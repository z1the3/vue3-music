

<template>
  <Header></Header>
  <Tab></Tab>
  <router-view></router-view>
  <Player></Player>
</template>

<script setup>
import Header from './components/Header.vue'
import Tab from './components/Tab.vue'
import Player from './components/Player/Player.vue'
</script>



<style scoped>

</style>
