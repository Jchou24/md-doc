import VueCompositionAPI from '@vue/composition-api'
import vuetify from './plugins/vuetify'

// for icon
import '@mdi/font/css/materialdesignicons.css'

import VueViewer from 'v-viewer'
import 'viewerjs/dist/viewer.css'

import 'jctk-page-preview-scrollbar'
import 'jctk-page-preview-scrollbar/dist/jctk-page-preview-scrollbar.css'

import App from './App.vue'

export default (vue, opts = { theme: 'default' }) => {    
    vue.use(VueCompositionAPI)
    vue.use(VueViewer)
    vue.use(VueCompositionAPI)
  
    new vue({
        vuetify,
        data:{
            opts
        },
        render: h => h(App)
    }).$mount('#app')
};