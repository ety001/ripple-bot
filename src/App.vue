<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav'

export default {
  name: 'app',
  components: {
    'top-nav': TopNav
  }
}
</script>

<style>
  #app {
    padding-bottom: 80px;
  }
</style>
