// 组件
import VueMarkdownEditor from '@kangc/v-md-editor'
import VueMarkdownPriview from '@kangc/v-md-editor/lib/preview'
import VMdPreviewHtml from '@kangc/v-md-editor/lib/preview-html'


// 组件样式
import '@kangc/v-md-editor/lib/style/base-editor.css'
import '@kangc/v-md-editor/lib/style/preview.css'
import '@kangc/v-md-editor/lib/style/preview-html.css'

// 插件
import createEmojiPlugin from '@kangc/v-md-editor/lib/plugins/emoji/index'
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index'

// 插件样式
import '@kangc/v-md-editor/lib/plugins/emoji/emoji.css'

// 主题
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js'
import '@kangc/v-md-editor/lib/theme/style/github.css'

// 语言高亮
import hljs from 'highlight.js/lib/core'
import json from 'highlight.js/lib/languages/javascript'
import javascript from 'highlight.js/lib/languages/javascript'
import java from 'highlight.js/lib/languages/java'
import http from 'highlight.js/lib/languages/http'
import css from 'highlight.js/lib/languages/css'
import cpp from 'highlight.js/lib/languages/cpp'
import python from 'highlight.js/lib/languages/python'
import kotlin from 'highlight.js/lib/languages/kotlin'
import go from 'highlight.js/lib/languages/go'

// 高亮的语言
hljs.registerLanguage('json', json)
hljs.registerLanguage('java', java)
hljs.registerLanguage('javascript', javascript)
hljs.registerLanguage('http', http)
hljs.registerLanguage('css', css)
hljs.registerLanguage('cpp', cpp)
hljs.registerLanguage('python', python)
hljs.registerLanguage('kotlin', kotlin)
hljs.registerLanguage('go', go)

// 使用主题
VueMarkdownEditor.use(githubTheme, {
  Hljs: hljs
})

// 使用插件
VueMarkdownEditor.use(createEmojiPlugin())
VueMarkdownEditor.use(createLineNumbertPlugin())

// 注册组件
Vue.use(VueMarkdownEditor)
Vue.use(VueMarkdownPriview)
Vue.use(VMdPreviewHtml)


import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import InfiniteScroll from 'element-ui/lib/infinite-scroll'

Vue.config.productionTip = false
Vue.use(ElementUI, { size: 'small', zIndex: 3000 });
Vue.use(InfiniteScroll)

new Vue({
  router,
  store,
  http: {
    headers: {
      token: window.localStorage.getItem('token')
    }
  },
  render: h => h(App)
}).$mount('#app')
