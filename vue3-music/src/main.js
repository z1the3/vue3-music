import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import {createPinia} from 'pinia'
// import store from './store'
import lazyPlugin from 'vue3-lazy'
import loadingDirective from './components/base/loading/directive'
import noResultDirective from './components/base/no-result/directive'

// 引入全局样式文件
// import '../scss/index.scss'
import './assets/scss/index.scss'


// createApp(App).use(store).use(router).mount('#app')
createApp(App).use(router).
use(lazyPlugin,{
    // require语法，vite可以识别作为loader
    loading: require('./assets/images/default.png')
})
.use(createPinia())
.directive('loading',loadingDirective)
.directive('no-result',noResultDirective)
.mount('#app')

 