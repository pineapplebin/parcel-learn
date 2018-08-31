<template>
  <div id="app">
    <p>{{ msg }}</p>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        msg: 'hello world'
      }
    }
  }
</script>

<style lang="less">
  #app {
    font-size: 16px;
    font-weight: bold;
    color: darkcyan;
    text-align: center;
  }
</style>

