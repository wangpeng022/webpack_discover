<template>
  <div id="cpeco_center">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
/* 公共样式 */

* {
    margin: 0;
    padding: 0;

}
body{
    user-select: none;
}

a {
    text-decoration: none;
}

ul li {
    list-style: none;
}
body ::-webkit-scrollbar { width: 10px; height: 10px; }
body ::-webkit-scrollbar-track { background-color: #fff; -webkit-border-radius: 8px; }
body ::-webkit-scrollbar-thumb { -webkit-border-radius: 5px; background: #e6e6e6; border: none; }
body ::-webkit-scrollbar-thumb:vertical:hover { background-color: #a6a6a6; border: none; }
body ::-webkit-scrollbar-thumb:hover { background-color: #a6a6a6; border: none; }

[v-cloak]{
    display:none;
}
</style>
