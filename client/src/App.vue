<template>
  <the-header></the-header>
  <router-view></router-view>
</template>

<script>
import TheHeader from "./TheHeader.vue";

export default {
  components: {
    TheHeader
  },
  name: 'App',
  
}
</script>

<style>
/* @import url("https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&display=swap"); */


* {
  box-sizing: border-box;
}

html {
  font-family: "Roboto", sans-serif;
}

body {
  margin: 0;
}
/* 
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */


</style>
