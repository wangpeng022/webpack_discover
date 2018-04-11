import Vue from 'vue'
import Router from 'vue-router'
import core from '@/components/core'
import test from '@/components/test'

Vue.use(Router)

export default new Router({
  // mode:"history",
  routes: [
    {
      path: '/',
      name: 'test',
      component: test
    },
    {
      path: '/core',
      name: 'core',
      component: core
    }
  ]
})
