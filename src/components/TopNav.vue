<template>
  <el-row>
    <el-col :span="24">
      <el-menu theme="dark" :default-active="activeIndex" :router="true" class="el-menu-demo" mode="horizontal" @select="handleSelect">
        <el-menu-item index="/">首页</el-menu-item>
        <el-menu-item index="setting">设置</el-menu-item>
      </el-menu>
    </el-col>
  </el-row>
</template>

<script>
  export default {
    data () {
      return {
        activeIndex: '/'
      }
    },
    methods: {
      handleSelect (key, keyPath) {
        // console.log(key, keyPath)
        switch (key) {
          case '/':
            break
          case 'setting':
            break
        }
      }
    },
    mounted () {
    }
  }
</script>
