import Vue from 'vue'
import Router from 'vue-router'
import Index from './views/Index.vue'
import Meeting from './views/Meeting.vue'
import LoginPage from './views/sidebar/LoginPage.vue'
import VideoPage from './views/sidebar/VideoPage.vue'
import AudioPage from './views/sidebar/AudioPage.vue';
import DefinitionPage from './views/sidebar/DefinitionPage.vue';
import ServerPage from './views/sidebar/ServerPage.vue';
Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/index',
      name: 'index',
      component: Index,
      children: [
        {
          path: 'login',
          name: 'login',
          component: LoginPage
        },
        {
          path: 'video',
          name: 'video',
          component: VideoPage
        },
        {
          path: 'audio',
          name: 'audio',
          component: AudioPage
        },
        {
          path: 'definition',
          name: 'definition',
          component: DefinitionPage
        },
        {
          path: 'server',
          name: 'server',
          component: ServerPage
        },
      ]
    },
    {
      path: '/meeting',
      name: 'meeting',
      component: Meeting
    },
    {
      path: '',
      component: Index
    },


  ]
})



