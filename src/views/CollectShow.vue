<template>
  <div id="background">
    <div class="message-page">
      <div class="left-layout">
        <div class="message-center">收藏中心</div>
        <div class="message-types" >
          <el-menu background-color="rgba(255, 255, 255, 0)" @select="handleMenuItemSelect" :default-active="defaultActive">
            <el-menu-item v-for="type in collectTypes" :key="type.id" :index="type.id" >{{ type.name }}</el-menu-item>
          </el-menu>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <el-backtop target=".right-layout"></el-backtop>

      <div class="right-layout">
        <div class="operation-bar">
          <div class="selected-type">{{ selectedCollectType }}</div>
        </div>

        <el-divider></el-divider>
        <div class="message-list" v-if="show === `note`">
          <div class="message-item" v-for="(note, index) in noteCollect" :key="note.noteId" >
            <NoteCard :note="note" @click="toArticleShow(note.noteId)"/>


            <el-button style="font-size: 16px; margin-right: 10px" type="text" icon="el-icon-delete" @click="deleteNoteCollect(note.noteId, index)">删除</el-button>

          </div>

          <div class="load-more-btn" v-if="noteCollect.length !== 0 && !noMoreNote">
            <button @click="获取收藏的笔记()">加载更多</button>
          </div>
        </div>

        <div class="message-list" v-if="show === `comment`" >
          <div class="message-item" v-for="(comment, index) in commentCollect" :key="comment.commentId" >
            <div class="comment" @click="toArticleShow(comment.noteId)">
              <!--      评论头-->
              <div class="info">
                <!--        头像-->
                <el-avatar  :src="comment.userAvatar" @error="errorHandler"></el-avatar>

                <!--        信息-->
                <div class="right">
                  <div class="name">{{comment.userName}}</div>

                  <div class="date">{{comment.commentCreateDate | formatDate}}</div>
                </div>
              </div>

              <!--      评论体 -->
              <div class="content">
                <span class="to-name" v-if="comment.toUserId">@{{comment.toUserName}}</span>
                {{comment.commentContent}}
              </div>
            </div>

            <el-button style="font-size: 16px;" type="text" icon="el-icon-delete" @click="deleteCommentCollect(comment.commentId, index)">删除</el-button>
          </div>

          <div class="load-more-btn" v-if="commentCollect !== 0 && !noMoreComment">
            <button @click="获取收藏的评论()">加载更多</button>
          </div>

        </div>
      </div>
    </div>
  </div>


</template>

<script>
import { formatDate } from "@/util/public";
import api from '@/api/public'
import Like from '@/components/Like.vue'
import NoteCard from '@/components/NoteCard.vue'
import Vue from 'vue'

export default {
  components: { NoteCard, Like },
  data() {
    return {
      defaultActive: 1,

      collectTypes: [
        { id: 1, name: '收藏笔记' },
        { id: 2, name: '收藏评论' },
      ],

      noteCollectPage: {
        pageSize: 10,
        pageNum: 1
      },

      commentCollectPage: {
        pageSize: 10,
        pageNum: 1
      },

      noteCollect: [
      ],
      commentCollect: [
      ],



      selectedCollectType: "收藏笔记",


      unRead: true,
      doParseComment: false,
      doParseNote: false,

      show: "note",

      noMoreNote: false,
      noMoreComment: false,
    };
  },

  filters: {
    formatDate
  },

  created () {
    debugger
    const defaultActive = parseInt(this.$route.params.defaultActive, 10);

    this.defaultActive = defaultActive

    this.handleMenuItemSelect(this.defaultActive);
  },

  methods: {

    async handleMenuItemSelect(index) {
      debugger
      this.selectedCollectType = this.collectTypes[index-1].name
      if(index === 1) {
        if(!this.doParseNote) {
          this.noteCollect = []
          await this.获取收藏的笔记();
          this.doParseNote = true;
        }
        this.show= "note"

      } else if(index === 2) {
        if(!this.doParseComment) {
          this.commentCollect = []
          await this.获取收藏的评论();
          this.doParseComment = true;
        }
        this.show= "comment"

      }
    },

    async 获取收藏的笔记 () {
      debugger
      // 获取收藏体
      let collects = [];
      await api.获取收藏的笔记(this.noteCollectPage)
        .then((res) => {
          debugger
          if (res.data === null || res.data.length === 0) {
            this.noMore = true;
            this.$message.warning("没有更多了!")

          } else {
            collects = res.data;
            this.noteCollectPage.pageNum += 1;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      // 获取笔记信息
      if (collects.length !== 0) {
        for (const collect of collects) {
          const note = {
            noteId: collect.noteId
          }

          await api.通过ID获取笔记信息(note)
            .then((res) => {

              debugger
              this.noteCollect.push(res.data);
            })
            .catch((error) => {
              this.$message.error(error.message)
            });
        }
      }
    },

    async 获取收藏的评论 () {
      debugger
      // 获取收藏体
      let collects = [];
      await api.获取收藏的评论(this.commentCollectPage)
        .then((res) => {
          if (res.data === null || res.data.length === 0) {
            this.noMore = true;
            this.$message.warning("没有更多了!")

          } else {
            collects = res.data;
            this.commentCollectPage.pageNum += 1;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      // 获取评论信息
      if (collects.length !== 0) {
        for (const collect of collects) {
          const comment = {
            commentInfo: null,
            userInfo: null
          }

          const getComment = {
            commentId: collect.commentId
          }

          await api.通过ID获取评论信息(getComment)
            .then((res) => {
              this.commentCollect.push(res.data);
            })
            .catch((error) => {
              this.$message.error(error.message)
            });


        }
      }
    },

    toArticleShow(noteId) {

      const note =  {
        noteId: noteId
      }

      this.$router.push({
        path: '/ArticleShow',
        query: {
          note: JSON.stringify(note)
        }
      });
    },

    deleteNoteCollect(noteCollect, index) {
      const collect = {
        noteId: noteCollect
      };

      api.取消收藏(collect)
        .then((res) => {
          this.$message.success(res.message)
          Vue.delete(this.noteCollect, index);

        }).catch((error) => {
        this.$message.error(error.message)
      });
    },

    deleteCommentCollect(commentCollect, index) {
      const collect = {
        commentId: commentCollect
      };

      api.取消收藏(collect)
        .then((res) => {
          this.$message.success(res.message)
          this.commentCollect.splice(index, 1)
        }).catch((error) => {
        this.$message.error(error.message)
      });
    },


    errorHandler() {
      return true
    },
  }
};
</script>

<style>
#background {
  width: 100%;
  background-image: url("../../src/assets/images/背景图片.jpg");
  background-color: #f0f0f0; /* 设置备用背景颜色 */
  background-repeat: no-repeat; /* 不重复 */
  background-size: 100% 100%; /* 百分百填充 */
  border: none; /* 移除边框 */
  padding: 0; /* 移除内边距 */


  position:fixed;
}

.message-page {
  width: 80%;
  margin: auto;
  display: flex;
  height: 100vh;

}

.left-layout {
  width: 10%;
//height: 100vh;
  background-color: rgba(255, 255, 255, 0.6); /* 半透明的白色背景，透明度为0.5 */
}

.right-layout {
  background-color: rgba(255, 255, 255, 0.5);

  width: 90%;

  height: 100vh;
  overflow: auto;

//position:fixed;

}

.message-center {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
  margin-top: 10px;
}

.message-types {

}

.operation-bar {
  height: 50px;
  line-height: 30px;

  padding: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  margin: 10px 10px 10px 10px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
}

.selected-type {
  //margin-right: 10px;
  font-weight: bold;
}

.read-status {
  margin: auto;
}

.read-status .el-button.active {
  color: #409EFF;
}

.message-list {
//padding-top: 10px;
  margin: 0 10px 0 10px;

}

.message-item {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
  border: #409EFF solid 1px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
}

.avatar {
  width: 10%;
  margin-top: 10px;
  margin-bottom: 10px;
}

.message-content {
  width: 90%;
  padding-left: 10px;
  text-align: left;
}

.user-name {
  font-weight: bold;
  margin-top: 5px;
  margin-bottom: 5px;
}

.reply-info {
  margin-bottom: 5px;
}

.delete-action {
  color: #999;
  cursor: pointer;
}

.el-divider {
  background-color: #b6d7fb;
  height: 1px;
  margin: 5px 0 5px 0;
}

.load-more-btn button {
  color: #c0504d;
  background-color: transparent;
  border: none;
  font-size: 16px;
  cursor: pointer;
  margin-bottom: 10px;
}

.comment {
  display: flex;
  flex-direction: column;
  padding: 10px;
  border-bottom: 1px solid #F2F6FC;
  width: 92%;
}

.comment .info {
  display: flex;
  align-items: center;
}

.comment .info .avatar {
  border-radius: 50%;
}

.comment .info .right {
  display: flex;
  flex-direction: column;
  margin-left: 10px;
}

.comment .info .right .name {
  font-size: 16px;
  color: #303133;
  margin-bottom: 5px;
  font-weight: 500;
  text-align: left;
}

.comment .info .right .date {
  font-size: 12px;
  color: #909399;
}

.comment .content {
  font-size: 16px;
  color: #303133;
  line-height: 20px;
  padding: 10px 0;
  text-align: left;
  margin-top: 5px;
}

.comment .control {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: #909399;
}

.comment .control .like {
  display: flex;
  align-items: center;
  margin-right: 20px;
  cursor: pointer;
}

.comment .control .like.active,
.comment .control .like:hover {
  color: #409EFF;
}

.comment .control .like .iconfont {
  font-size: 14px;
  margin-right: 5px;
}

.comment .control .comment-reply {
  display: flex;
  align-items: center;
  cursor: pointer;
  margin-left: 10px;
}

.comment .control .comment-reply:hover {
  color: #333;
}

.comment .control .comment-reply .iconfont {
  font-size: 16px;
  margin-right: 5px;
}

.comment .control .comment-reply-delete {
  display: flex;
  align-items: center;
  cursor: pointer;
  color: #d1675a;
}

.comment .control .comment-reply-delete:hover {
  color: #333;
}

.comment .control .comment-reply-delete .iconfont {
  font-size: 16px;
  margin-right: 20px;
}

.to-name {
  color: #409EFF;
  margin-left: 5px;
  margin-right: 5px;
}

</style>
