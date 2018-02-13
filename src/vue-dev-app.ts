import Vue from 'vue'
import VueRouter, { RouteConfig } from 'vue-router'
Vue.use(VueRouter)

export const buildDevApp = function(routes : Array<RouteConfig>, rootRedirect : string | null) {
  const App = Vue.extend({
    render (h) {
      return h('router-view')
    }
  })

  let allRoutes : Array<RouteConfig> = routes

  if (rootRedirect) {
    allRoutes = allRoutes.concat([{
      path: '/',
      redirect: rootRedirect,
    }])
  }

  const router = new VueRouter({
    mode: 'history',
    routes: allRoutes
  })

  document.addEventListener('DOMContentLoaded', () => {
    const app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app')
  })
}
