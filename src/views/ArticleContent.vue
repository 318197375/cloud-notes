<template>
  <div>
    <!-- markdown编辑器组件 -->
    <v-md-editor v-model="text"
                 :left-toolbar="leftToobar"
                 :disabled-menus="[]"
                 @upload-image="handleUploadImage"
                 style="text-align: left"
                 @save="saveContent"

    />

<!--     这也是编辑器组件，不过使用了预览模式，就可以预览markdown-->
    <v-md-editor v-model="html" height="400px" mode="preview"  style="text-align: left"/>

<!--     预览html的组件-->
    <v-md-preview-html :html="html" preview-class="vuepress-markdown-body"></v-md-preview-html>
  </div>
</template>

<script>
// xss是将markdown转为html的库
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'
import api from '@/api/public'
import fileSave from '@/api/fileSave'

export default {


  name: 'MarkDownEdit',

  created () {
    this.noteInfoPO._id = this.$route.query.noteId;
    this.note.noteId = this.noteInfoPO._id

    api.获取笔记内容(this.note)
      .then((res) => {
        this.text = res.data.info
      })
      .catch((error) => {
        this.$message.error(error.message)
      });

  },

  components: {},
  props: {},
  data() {
    return {
      // 左侧工具栏的配置，配什么，显示什么
      leftToobar: 'undo redo clear | h bold italic strikethrough quote | ul ol table hr | link image emoji code | save',
      text: '', // markdown 文本
      html: '', // 转换后，用于显示的html

      noteInfoPO: {
        _id: null,
        info: ""
      },

      note: {
        noteId: null
      }
    }
  },
  watch: {
    text(value) {
    },
  },
  methods: {
    saveContent() {
      // 这里编写保存逻辑，可以使用axios等工具将数据提交到后端进行保存
      // this.$message.success(this.text)

      // 将markdown转为html
      // console.log(this.html)
      // this.$message.success(this.text)
      // this.noteInfoPO.info = xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(this.text))

      this.noteInfoPO.info = this.text

      api.保存笔记内容(this.noteInfoPO)
        .then((res) => {
          this.$message.success(res.message)

        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },

    async handleUploadImage (event, insertImage, files) {
      // 1、拿到 files 之后上传到文件服务器，然后向编辑框中插入对应的内容
      console.log(files)

      for (const file of files) {
        const form = new FormData();
        form.append("image", file);


        await fileSave.存储图片(form)
          .then((res) => {
debugger
            insertImage({
              url: res.data,
              desc: file.name,
              width: 'auto',
              height: 'auto',
            })
          })
          .catch((error) => {
            this.$message.error(error.message)
          })


      }

      // 图片上传成功后，在markdown中插入图片
      // 此处只做示例
      // 在markdown中插入图片



    },
  }
}
</script>

<style>
.v-md-editor__toolbar {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-pack: justify;
  -webkit-justify-content: space-between;
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  padding: 6px;
  border-bottom: 1px solid #ddd;
  position: fixed;
  z-index: 999;
  background-color: white;
  top: 0;
}

.v-md-editor__main {
  display: -webkit-box;
  display: -webkit-flex;
  display: flex;
  -webkit-box-flex: 1;
  -webkit-flex: 1;
  flex: 1;
  width: 100%;
  overflow: hidden;
  margin-top: 20px;
}
</style>
