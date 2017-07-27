<template>
  <div id="app">
    <top-nav></top-nav>
    <router-view></router-view>
    <div id="SOHUCS" sid="ripplebot"></div>
  </div>
</template>

<script>
import TopNav from '@/components/TopNav'

export default {
  name: 'app',
  components: {
    'top-nav': TopNav
  },
  mounted () {
    (function(){ 
    var appid = 'cyt82VAsa'; 
    var conf = 'prod_ff6336d3a1416c527929be3ad50b1b8a'; 
    var width = window.innerWidth || document.documentElement.clientWidth; 
    if (width < 960) { 
    window.document.write('<script id="changyan_mobile_js" charset="utf-8" type="text/javascript" src="https://changyan.sohu.com/upload/mobile/wap-js/changyan_mobile.js?client_id=' + appid + '&conf=' + conf + '"><\/script>'); } else { var loadJs=function(d,a){var c=document.getElementsByTagName("head")[0]||document.head||document.documentElement;var b=document.createElement("script");b.setAttribute("type","text/javascript");b.setAttribute("charset","UTF-8");b.setAttribute("src",d);if(typeof a==="function"){if(window.attachEvent){b.onreadystatechange=function(){var e=b.readyState;if(e==="loaded"||e==="complete"){b.onreadystatechange=null;a()}}}else{b.onload=a}}c.appendChild(b)};loadJs("https://changyan.sohu.com/upload/changyan.js",function(){window.changyan.api.config({appid:appid,conf:conf})}); } })();
  }
}
</script>

<style>
  #app {
    padding-bottom: 80px;
  }
  #SOHUCS {
    margin-left: 8.33333% !important;
    width: 80% !important;
  }
</style>
