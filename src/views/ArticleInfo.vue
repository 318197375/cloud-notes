<template>
  <div>
    <el-backtop target=".main-container"></el-backtop>

  <div class="article-info" >
    <div class="article-search" v-if="notes.length !== 0">
      <el-input placeholder="在已加载的笔记中搜索" style="width: 70%; margin: auto" v-model="searchValue"></el-input>
      <el-button type="primary" style=" width:20%; height: 30px; margin: auto" @click="searchNote()">搜索</el-button>
    </div>

    <div   v-infinite-scroll="load"
           infinite-scroll-disabled="disabled" style="margin: auto">
      <div v-for="(item, index) in notes" key="item.noteId" class="article-card-info-class" v-if="showAll">
        <NoteCard  :key="item.noteId" :note="item"/>
        <div class="card-extra">
          <el-button type="text" icon="el-icon-s-tools" @click="editArticle(item)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteArticle(item, index)">删除</el-button>
          <el-button type="text" icon="el-icon-edit" @click="updateArticle(item.noteId)">编写</el-button>
          <el-button type="text" icon="el-icon-edit" @click="downLoad(item.noteId, item.noteTitle,item.userName)">下载</el-button>
        </div>
      </div>

      <div v-for="(item, index) in searchNotes" key="item.noteId" class="article-card-info-class" v-if="!showAll">
        <NoteCard  :key="item.noteId" :note="item"/>
        <div class="card-extra">
          <el-button type="text" icon="el-icon-s-tools" @click="editArticle(item)">编辑</el-button>
          <el-button type="text" icon="el-icon-delete" @click="deleteArticle(item, index)">删除</el-button>
          <el-button type="text" icon="el-icon-edit" @click="updateArticle(item.noteId)">编写</el-button>
          <el-button type="text" icon="el-icon-edit" @click="downLoad(item.noteId, item.noteTitle,item.userName)">下载</el-button>
        </div>
      </div>

      <div class="load-more-btn">
        <p v-if="loading">加载中...</p>
        <i v-if="noMore" style="margin-bottom: 10px">没有<i v-if="notes.length === 0" style="margin-bottom: 10px">笔记, 去创建一篇吧</i><i v-if="notes.length !== 0" style="margin-bottom: 10px">更多了</i></i>
      </div>

    </div>




    <el-button slot="reference" icon="el-icon-plus" class="in-btn" @click="openDrawer"/>


    <el-dialog :visible.sync="drawerVisible"
               title="创建笔记"
               @close="handleClose"
               :before-close="beforeDrawerClose">
      <article-create/>
    </el-dialog>

    <el-dialog :visible.sync="updateVisible"
               title="修改笔记"
               @close="handleClose"
               :before-close="beforeDrawerClose">
      <article-update :note="selectNote"/>
    </el-dialog>

<!--    <el-dialog :visible.sync="drawerVisible"-->
<!--               title="修改笔记"-->
<!--               @close="handleClose"-->
<!--               :before-close="beforeDrawerClose">-->
<!--      <article-create/>-->
<!--    </el-dialog>-->

  </div>


  </div>


</template>

<script>
import ArticleCreate from '@/views/ArticleCreate'
import ArticleUpdate from '@/components/ArticleUpdate.vue'
import api from '@/api/public'
import { setNoteInfo, beforeDrawerClose, handleClose, formatDate } from "@/util/public";
import NoteCard from "@/components/NoteCard.vue";
import {saveAs} from 'file-saver';
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'

export default {
  name: "ArticleInfo",
  components: {
    ArticleCreate,
    ArticleUpdate,
    NoteCard,
    saveAs
  },

  created () {
    // this.getNote();
  },

  data() {
    return {
      loading: false,
      noMore: false,
      drawerVisible: false,
      updateVisible: false,
      showAll: true,
      notes: [],
      searchNotes: [],
      page: {
        pageNum: 1,
        pageSize: 5,
        userId: null
      },

      searchValue: null,

      selectNote: {

      }
    };
  },

  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },

  methods: {
    beforeDrawerClose,
    handleClose,

    load() {

      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        debugger
        this.getNote(); //调用接口，此时页数+1，查询下一页数据
      }, 200);
    },

    async getNote() {
      api.获取指定用户的笔记基础信息(this.page)
        .then((res) => {
          setNoteInfo(res, this);
          this.loading = false;
        })
        .catch((error) => {
          this.loading = false;
          this.$message.error(error.message)
        })
    },

    editArticle(note) {
      debugger
      this.selectNote = note
      this.updateVisible = true;
    },
    deleteArticle(note, index) {

      this.$confirm("确定要删除笔记  [" + note.noteTitle + "]  吗?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        api.逻辑删除笔记(note)
          .then((res) => {
            // window.location.reload();
            this.$message.success(res.message)
            this.notes.splice(index, 1)
            // this.notes.deleteArticle(note)

          })
          .catch((error) => {
            this.$message.error(error.message)
          });

      }).catch(() => {});
    },

    updateArticle(noteId) {
      this.$router.push({
        path: '/ArticleContent',
        query: {
          noteId: noteId
        }
      });
    },

    showArticle(noteId) {
      const note = {
        noteId: noteId
      }

      this.$router.push({
        path: '/ArticleShow',
        query: { note: JSON.stringify(note) }
      })
    },

    async downLoad(noteId, noteTitle, userName) {
      const note = {
        noteId: noteId
      }

      let content = null;
      await api.获取笔记内容(note)
        .then((res) => {
          this.$message.success("文件请求成功,正在下载!")
          content = res.data.info
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      let blob = new Blob([content], {type:"text/plain;charset=utf-8"})
      saveAs(blob, noteTitle + "-by：" + userName + ".md");
    },

    openDrawer() {
      this.drawerVisible = true;
    },
    beforeClose(done) {
      this.$confirm('确定关闭抽屉吗？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },

    searchNote() {
      this.searchNotes = []
      if(this.searchValue !== null && this.searchValue !== '') {
        this.notes.forEach(note => {
          let noteTitle = note.noteTitle;
          let noteTag = note.noteTag;

          if (noteTitle.includes(this.searchValue) ||
            noteTag.includes(this.searchValue)) {
            // 符合条件的逻辑处理
            this.searchNotes.push(note)
          }
        })


        this.showAll = false;
      } else {
        this.showAll = true;
      }
    }
  },

  filters: {
    formatDate
  }
};
</script>

<style>
@import "@/assets/css/public.less";
.article-info {
  margin: auto;
  width: calc(80%);
  overflow: auto;

}

.in-btn {
  right: 20px;
  bottom: 20px;
  position: fixed;

  background-color: #409eff;
  color: white;
  font-size: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.article-search {
  height: 50px;
  width: 600px;
  margin: auto;
  display: flex;
  justify-content: space-between;
}
.article-search.el-input {
  width: 400px;
  margin-right: 10px;
}

.article-search.el-button {
  margin-left: 10px;
}


.card-content {
  display: flex;
  align-items: center;
}

.article-img {
  width: 200px;
  height: 120px;

  object-fit: cover;
  margin-right: 15px;
}


.card-extra {
  margin: 20px 20px 20px 20px;

  /*margin: auto;*/

  /*margin-left: auto; !* 让卡片额外区域靠右对齐 *!*/
  /*width: 20%;*/
  /*width: 100px;*/
  border:  1px solid #1890ff;
}


.card-extra .el-button {
  font-size: 15px;
  display: block;

  width: 100px;

  margin-left: auto;
  margin-top: 5px;
  margin-bottom: 5px; /* 可以添加一些垂直间距 */
}

.article-card-info-class {
  display: flex;

  margin: 20px 20px 20px 20px;
  /*width: calc(80%);*/
  border-color: #1890ff;
}
</style>
