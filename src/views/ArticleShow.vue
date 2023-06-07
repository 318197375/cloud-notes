<template>
  <div >
    <el-backtop target=".show-main-container" :visibility-height=600></el-backtop>

    <div class="show-main-container" >
      <div class="show-class">
        <NoteCard :note="note"/>
      </div>


      <div class="show-class">
        <!--     预览html的组件-->
<!--        <v-md-preview-html-->
<!--          :html="html"-->
<!--          class="vuepress-class"-->
<!--          preview-class="vuepress-markdown-body"-->
<!--          style="text-align: left">-->
<!--        </v-md-preview-html>-->

        <v-md-editor v-model="text"
                     height="400px" mode="preview"
                     style="text-align: left; height: auto; "
        />
      </div>

      <div class="show-class-info">
        <div class="left-part">
          <div class="write-reply" v-if="true" @click="showInputClick(null, null)" >
            <div style="  margin: auto;">
              <i class="el-icon-edit" style="  margin: auto;"></i>
              <span class="add-comment" style="  margin: auto;">添加一条新评论吧</span>
            </div>
          </div>
        </div>
        <div class="right-part">
          <Like :noteId="this.note.noteId"
                :likeNum="this.note.noteLikeNum"
                :clickLike="this.note.clickLike"
                @update-click-like="updateClickLike"
          >
          </Like>

          <Collect :noteId="this.note.noteId"
                   :collectNum="this.note.noteCollectNum"
                   :clickCollect="this.note.clickCollect"
                   @update-click-collect="updateClickCollect"
          ></Collect>


        </div>
      </div>
      <!--        添加新评论按钮-->


      <div  class="show-class"
            v-infinite-scroll="getRootTow"
            infinite-scroll-disabled="disabled"
            infinite-scroll-distance='1'
      >

        <Comment v-for="(item, index) in commentData"
                 :key="index"
                 :commentInfo="item"
                 :noteId="note.noteId"
                 ref="comment"
                 @reply="reply"
        >
        </Comment>

        <p v-if="loading">加载中...</p>
        <p v-if="noMore">没有更多了</p>


        <transition name="fade" class="my-el-textarea__inner" >
          <div class="input-wrapper" v-if="this.showInput" >
            <el-input class="gray-bg-input"
                      v-model="inputComment"
                      type="textarea"
                      :rows="10"
                      placeholder="写下你的评论"
                      ref="commentInput"
            >
            </el-input>

            <div class="btn-control">
              <el-button class="btn" type="primary" plain @click="commitComment">确定</el-button>

              <el-button class="cancel" type="warning" plain @click="cancel">取消</el-button>
            </div>
          </div>
        </transition>
      </div>


    </div>

  </div>

</template>


<script>
import api from '@/api/public'
import VueMarkdownEditor, { xss } from '@kangc/v-md-editor'
import { setNoteInfo, beforeDrawerClose, handleClose, formatDate, showCommentInput } from '@/util/public'
import NoteCard from "@/components/NoteCard.vue";
import Like from '@/components/Like'
import Collect from '@/components/Collect'


import Comment from './Comment.vue'
export default {
  name: 'ArticleShow',

  components: {
    NoteCard,
    Comment,
    Like,
    Collect
  },

  beforeCreate () {
  },

  created () {
    debugger
    // this.commentData = CommentData.comment.data;
    // this.note.noteId = this.$route.query.noteId;
    this.note = JSON.parse(this.$route.query.note);


    api.获取指定笔记的基础信息(this.note)
      .then((res) => {
        debugger
        this.note = res.data;
      })
      .catch((error) => {
        this.$message.error(error.message)
      });



    api.获取笔记内容(this.note)
      .then((res) => {
        this.text = res.data.info
        this.html = xss.process(VueMarkdownEditor.themeConfig.markdownParser.render(this.text));
      })
      .catch((error) => {
        this.$message.error(error.message)
      });


    this.notePage.noteId = this.note.noteId;
    // this.getRootComment();
  },

  data() {
    return {
      inputComment: '',
      showInput: false,

      num: 0,
      loading: false,
      noMore: false,


      commentData: [],
      note: {
        noteId: null,
      },

      notePage: {
        noteId: null,
        pageSize: 10,
        pageNum: 1
      },

      addComment: {
        commentId: null,
        noteId: null,
        toUserId: null,
        rootId: null,
        pid: null,
        commentContent: "",
      },


      text: '',
      html: ''
    }
  },

  methods: {
    updateClickLike(value) {
      this.clickLike = value;
    },

    updateClickCollect(value) {
      this.clickCollect = value
    },

    reply(data) {
      debugger
      this.commentData = [];

      this.notePage.pageNum = 0;
      this.getRootComment();
    },

    showInputClick(root, leaf) {
      showCommentInput(root, leaf, this);
    },

    getRootTow() {
      console.log(this.noMore)
      this.num = this.num + 1;
      this.loading = true;

      setTimeout(() => {
        this.getRootComment()
      }, 0);
    },

    getRootComment() {
      api.获取根评论(this.notePage)
        .then((res) => {
          debugger

          if (res.data === null || res.data.length === 0) {
            this.noMore = true
          } else {
            if(this.commentData === null) {
              this.commentData = [];
            }

            this.commentData = this.commentData.concat(res.data);
            this.notePage.pageNum += 1;
          }

          this.loading = false
        })
        .catch((error) => {
          debugger
          this.loading = false
          this.$message.error(error.message)
        });
    },

    /**
     * 点击取消按钮
     */
    cancel() {

      this.$confirm("确定要关闭编辑窗口吗？未保存的信息将丢失!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        this.showInput = false
      }).catch(() => {});
    },



    /**
     * 提交评论
     */
    commitComment() {
      debugger

      this.addComment.noteId = this.note.noteId;
      this.addComment.commentContent = this.inputComment;

      api.添加评论(this.addComment)
        .then((res) => {
          this.$message.success(res.message)
          this.showInput = false;

          this.notePage.pageNum = 0;
          this.commentData = null;
          this.getRootComment();
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },

  },

  filters: {
    formatDate
  },

  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },


}
</script>

<style >
@import "@/assets/css/public.less";


.show-class {

  display: flex;
  flex-direction: column;
  /*height: 100%;*/

  width: 80%;
  margin: 20px auto auto auto;

  border: #1890ff;
  box-shadow: 0 0 10px  rgba(0, 0, 0, 0.2);

  /*overflow: auto;*/
  /*-ms-overflow-style: -ms-autohiding-scrollbar;*/
}

.show-class-info {

  display: flex;
  flex-direction: row;
  /*height: 100%;*/

  width: 80%;
  margin: 20px auto auto auto;

  border: #1890ff;
  box-shadow: 0 0 10px  rgba(0, 0, 0, 0.2);

  /*overflow: auto;*/
  /*-ms-overflow-style: -ms-autohiding-scrollbar;*/
}
.show-class-3 {
  /*height: calc(100vh - 20px);*/

  /*display: flex;*/
  /*flex-direction: column;*/
  /*height: 100vh;*/
  /*width: 80%;*/
  /*margin: 20px auto auto auto;*/

  /*border: #1890ff;*/
  /*box-shadow: 0 0 10px  rgba(0, 0, 0, 0.2);*/

  /*overflow:visible;*/
  /*height: 100vh;*/

  /*overflow: auto;*/
  height: 100vh;
  /*-ms-overflow-style: -ms-autohiding-scrollbar;*/
}

.vuepress-class {
  margin: 20px;
}

.show-class-main {
  /*overflow: auto;*/
}



.show-main-container {
  height: calc(100vh - 20px);
  overflow: auto;
  background-color: #F3F5FA;
}

.write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #909399;
  padding: 10px;
  cursor: pointer;

}

:hover {
  color: #303133;
}
.el-icon-edit {
  margin-right: 5px;

}


.input-wrapper {
  position: fixed;
  bottom: 0;
  width: 85%;
  /* position:fixed;
  z-index:999; */
  display: flex;
  height: 200px;
  margin: 10px;

  /* border: 1px solid deepskyblue; */
  justify-content: flex-end;
  align-items: center;
  padding: 10px;
}

.input-wrapper .btn-control {
  width: 10%;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-end;
  padding-top: 10px;
}

.input-wrapper .btn-control .cancel {
  font-size: 16px;
  /* color: $text-normal; */
  cursor: pointer;
  margin-bottom: 10px;
}

.input-wrapper .btn-control .cancel:hover {
  color: #333;
}

.input-wrapper .btn-control .btn {
  font-size: 16px;
  margin-bottom: 20px;
}

.gray-bg-input {
  /* margin-top: 5px; */
  width: 90%;
}

.left-part {
  flex: 1;
  display: flex;
  /*align-items: center;*/
  margin-left: 10px;
}

.right-part {
  flex: 1;
  display: flex;
  /*align-items: flex-end;*/
  /*justify-content: flex-end;*/
  margin: auto;
}
</style>
