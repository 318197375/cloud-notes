<template>


  <div id="background">
    <div class="message-page">
      <div class="left-layout">
        <div class="message-center">消息中心</div>
        <div class="message-types" >
          <el-menu background-color="rgba(255, 255, 255, 0)" @select="handleMenuItemSelect" :default-active="defaultActive">
            <el-menu-item v-for="type in messageTypes" :key="type.id" :index="type.id" >{{ type.name }}</el-menu-item>
          </el-menu>
        </div>
      </div>
      <el-divider direction="vertical"></el-divider>
      <el-backtop target=".right-layout"></el-backtop>

      <div class="right-layout">
        <div class="operation-bar">
          <div class="selected-type">{{ selectedMessageType }}</div>

          <div class="read-status">
            <el-button @click="changeStatusRead()" :class="{ active: unRead }">未读</el-button>
            <el-button @click="changeStatusUnRead()" :class="{ active: !unRead }">已读</el-button>
          </div>
        </div>

        <el-divider></el-divider>

        <div class="message-list" v-if="show === `comment`">
          <div class="message-item" v-for="comment in (unRead ? commentMessages : readCommentMessages)" :key="comment.messageId" @click="toArticleShow(comment.noteId)">
            <div class="avatar">
              <el-avatar :src="comment.userAvatar" :size="60" shape="circle"></el-avatar>
            </div>

            <div class="message-content">
              <div class="user-name">{{ comment.userName }} 回复了我的{{comment.beCommentContent === null ? '笔记' : '评论'}}</div>
              <div class="reply-content" v-if="comment.beCommentContent !== null">我:  {{ comment.beCommentContent }}</div>

              <div class="reply-content">{{comment.userName}}:  {{ comment.commentContent }}</div>
              <div class="message-info">{{ comment.messageSendTime  | formatDate }}</div>
            </div>
          </div>

          <span v-if="commentMessages.length === 0 && unRead"> 暂时还没有未读消息! </span>

          <div class="load-more-btn" v-if="readCommentMessages.length !== 0 && !noMoreComment">
            <button @click="已读评论()">加载更多</button>
          </div>
        </div>

        <div class="message-list" v-if="show === `like`" >
          <div class="message-item" v-for="like in (unRead ? likeMessages : readLikeMessages)" :key="like.likeContent" @click="toArticleShow(like.noteId)">
            <div class="avatar">
              <el-avatar :src="like.userAvatar" :size="60" shape="circle"></el-avatar>
            </div>

            <div class="message-content">
              <div class="user-name">{{ like.userName }}<template v-if="unRead">等 共 {{ like.count }} 人</template>点赞了我的 {{like.commentId == null ? "笔记" : "评论"}}</div>
              <div class="reply-content">我: {{ like.likeContent }}</div>
              <div class="message-info">{{ like.messageSendTime | formatDate }}</div>
            </div>
          </div>
          <span v-if="likeMessages.length === 0 && unRead"> 暂时还没有未读消息! </span>

          <div class="load-more-btn" v-if="readLikeMessages.length !== 0 && !noMoreLike">
            <button @click="已读点赞()">加载更多</button>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatDate } from "@/util/public";
import api from '@/api/public'

export default {
  data() {
    return {
      defaultActive: 1,

      messageTypes: [
        { id: 1, name: '回复我的' },
        { id: 2, name: '收到的赞' },
        { id: 3, name: '系统通知' }
      ],
      messages: [
        // Other message items...
      ],

      messageCounter: {
        totalMessage: 0,
        likeTotal: 0,
        commentTotal: 0,
        bulletinTotal: 0,
      },


      likeMessages: [],
      readLikeMessages: [],

      readLikeMessagesPage: {
        pageSize: 10,
        pageNum: 1
      },

      commentMessages: [
      ],

      readCommentMessages: [
      ],

      readCommentMessagesPage: {
        pageSize: 10,
        pageNum: 1
      },



      messageInfoDTOS: [],

      message: {
        comment: [],
        like: [],
        bulletin: [],
        totalMessage: 0
      },

      selectedMessageType: "回复我的",


      unRead: true,
      doParseComment: false,
      doParseLike: false,
      doParseBulletin: false,

      show: "comment",

      loading: false,
      noMoreLike: false,
      noMoreComment: false,
    };
  },

  filters: {
    formatDate
  },

  created () {
    const messageCounter = this.$route.params.messageCounter;
    const defaultActive = this.$route.params.defaultActive;

    if(messageCounter !== "[object Object]") {
      this.messageCounter = messageCounter
      this.defaultActive = defaultActive
    } else {
      this.defaultActive = 1;
      api.获取消息数量()
        .then((res) => {
          this.messageCounter.totalMessage = res.data.totalMessage;
          this.messageCounter.likeTotal = res.data.likeTotal;
          this.messageCounter.commentTotal = res.data.commentTotal;
          this.messageCounter.bulletinTotal = res.data.bulletinTotal;
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    }

    this.handleMenuItemSelect(this.defaultActive);
  },

  methods: {

    changeStatusRead() {
      this.unRead = true;
      this.handleMenuItemSelect(this.defaultActive);

    },

    changeStatusUnRead() {
      this.unRead = false;
      this.handleMenuItemSelect(this.defaultActive);

    },

    async handleMenuItemSelect(index) {


      this.selectedMessageType = this.messageTypes[index-1].name
      this.defaultActive = index;

      if(this.unRead === true) {
        if(index === 1) {
          await this.未读评论()
        } else if(index === 2) {
          await this.未读点赞();
        } else if (!this.doParseBulletin) {
          // 解析系统通知
          this.doParseBulletin = true
        }
      } else {
        if(index === 1) {
          this.readCommentMessages = [];
          await this.已读评论()
        } else if(index === 2) {
          this.readLikeMessages = [];
          await this.已读点赞()
        } else if (!this.doParseBulletin) {
          // 解析系统通知
          this.doParseBulletin = true
        }
      }


    },

    async 未读评论() {
      if(!this.doParseComment) {
        let comments = [];
        // 解析评论
        await api.获取用户消息_评论()
          .then((res) => {


            comments = res.data.comment
          })
          .catch((error) => {
            this.$message.error(error.message)
          })

        // 用于记录评论点赞的信息

        if (comments.length !== 0) {

          for (const comment of comments) {
            const commentInfo = {
              messageId: null,
              messageSendUser: null,
              messageSendTime: null,

              commentContent: null,
              beCommentContent: null,

              userAvatar: "",
              userName: "",

              noteId: null,
              commentId: null,
            };

            commentInfo.messageId = comment.messageId;
            commentInfo.messageSendUser = comment.messageSendUser
            commentInfo.messageSendTime = comment.messageSendTime

            let messageContent = comment.messageContent
            commentInfo.commentId = messageContent;

            let pid = null;

            const commentApi = {
              commentId: messageContent
            }
            await api.通过ID获取评论信息(commentApi)
              .then((res) => {

                commentInfo.commentContent = res.data.commentContent;
                commentInfo.noteId = res.data.noteId;
                pid = res.data.pid;

              })
              .catch((error) => {
                this.$message.error(error.message)
              })

            if(pid !== null) {
              commentApi.commentId = pid;
              await api.通过ID获取评论信息(commentApi)
                .then((res) => {
                  commentInfo.beCommentContent = res.data.commentContent;
                })
                .catch((error) => {
                  this.$message.error(error.message)
                })
            }


            await api.获取用户信息(commentInfo.messageSendUser)
              .then((res) => {
                commentInfo.userName = res.data.userName;
                commentInfo.userAvatar = res.data.userAvatar;
              })
              .catch((error) => {
                this.$message.error(error.message)
              });

            this.commentMessages.push(commentInfo);
          }
        }

        this.doParseLike = true;
        this.show = "comment";
      }
    },

    async 未读点赞() {
      let like = [];


      if(!this.doParseLike) {
        // 获取未读点赞消息
        await api.获取用户消息_点赞()
          .then((res) => {

            like = res.data.like
          })
          .catch((error) => {
            this.$message.error(error.message)
          })

        if (like.length !== 0) {
          // 解析点赞
          // 根据like的messagePO的messageType来划分类型: 评论(13102)还是笔记(13101)点赞, 得到两个List, noteLike和commentLike
          let noteLike = [];
          let commentLike = [];

          like.forEach((item) => {

            if (item.messageType === 13102) {
              // 评论点赞
              commentLike.push(item);
            } else if (item.messageType === 13101) {
              // 笔记点赞
              noteLike.push(item);
            }
          });

          // 对两个Like进行处理, 选中like的messagePO中的messageContent值,
          // 将相同的值的like进行处理: count计数
          // 选中messagePO中messageSendTime最大的, 记录下messageSendUser和messageSendTime

          // 处理评论点赞
          let commentLikeInfo = {}; // 用于记录评论点赞的信息
          commentLike.forEach((likeItem) => {

            let messageContent = likeItem.messageContent;

            if (!commentLikeInfo[messageContent]) {
              commentLikeInfo[messageContent] = {
                count: 1,
                messageSendUser: likeItem.messageSendUser,
                messageSendTime: likeItem.messageSendTime,
                commentId: messageContent
              };
            } else {
              commentLikeInfo[messageContent].count++;
              if (likeItem.messageSendTime > commentLikeInfo[messageContent].messageSendTime) {
                commentLikeInfo[messageContent].messageSendUser = likeItem.messageSendUser;
                commentLikeInfo[messageContent].messageSendTime = likeItem.messageSendTime;
              }
            }
          });

          // 处理笔记点赞
          let noteLikeInfo = {}; // 用于记录笔记点赞的信息
          noteLike.forEach((likeItem) => {

            let messageContent = likeItem.messageContent;

            if (!noteLikeInfo[messageContent]) {
              noteLikeInfo[messageContent] = {
                count: 1,
                messageSendUser: likeItem.messageSendUser,
                messageSendTime: likeItem.messageSendTime,
                noteId: messageContent
              };
            } else {
              noteLikeInfo[messageContent].count++;
              if (likeItem.messageSendTime > noteLikeInfo[messageContent].messageSendTime) {
                noteLikeInfo[messageContent].messageSendUser = likeItem.messageSendUser;
                noteLikeInfo[messageContent].messageSendTime = likeItem.messageSendTime;
              }
            }
          });

          // 最终得到了分组后的评论点赞和笔记点赞的计数和信息
          this.likeMessages = Object.values(noteLikeInfo);
          this.likeMessages = this.likeMessages.concat(Object.values(commentLikeInfo))

          // 循环拼接其他信息
          for (const message of this.likeMessages) {
            await api.获取用户信息(message.messageSendUser)
              .then((res) => {
                message.userName = res.data.userName;
                message.userAvatar = res.data.userAvatar;
              })
              .catch((error) => {
                this.$message.error(error.message)
              });

            if (message.commentId == null) {
              const noteDTO = {
                noteId: null
              }

              noteDTO.noteId = message.noteId;

              // 获取笔记的标题
              await api.通过ID获取笔记信息(noteDTO)
                .then((res) => {
                  message.likeContent = res.data.noteTitle;
                })
                .catch((error) => {
                  this.$message.error(error.message)
                });
            } else {
              // 获取评论的内容
              const commentDTO = {
                commentId: null
              }

              commentDTO.commentId = message.commentId;
              await api.通过ID获取评论信息(commentDTO)
                .then((res) => {

                  message.likeContent = res.data.commentContent;
                  message.noteId = res.data.noteId;
                })
                .catch((error) => {
                  this.$message.error(error.message)
                });
            }
          }
        }

        this.doParseLike = true;
        this.show = "like";
      }
    },

    async 已读评论() {
      debugger
      let comments = [];
      // 解析评论
      await api.获取用户消息_评论_已读(this.readCommentMessagesPage)
        .then((res) => {
          if(res.data === null || res.data.length === 0) {
            this.noMoreComment = true;
            this.$message.warning("没有更多了!")
          } else {
            comments = res.data
            this.readCommentMessagesPage.pageNum++;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        })


      if (comments.length !== 0) {

        for (const comment of comments) {

          // 用于记录评论点赞的信息
          const commentInfo = {
            messageId: null,
            messageSendUser: null,
            messageSendTime: null,

            commentContent: null,
            beCommentContent: null,

            userAvatar: "",
            userName: "",

            noteId: null,
            commentId: null,
          };

          commentInfo.messageId = comment.messageId;
          commentInfo.messageSendUser = comment.messageSendUser
          commentInfo.messageSendTime = comment.messageSendTime

          let messageContent = comment.messageContent
          commentInfo.commentId = messageContent;

          let pid = null;

          const commentApi = {
            commentId: messageContent
          }
          await api.通过ID获取评论信息(commentApi)
            .then((res) => {

              commentInfo.commentContent = res.data.commentContent;
              commentInfo.noteId = res.data.noteId;
              pid = res.data.pid;

            })
            .catch((error) => {
              this.$message.error(error.message)
            })

          if(pid !== null) {
            commentApi.commentId = pid;
            await api.通过ID获取评论信息(commentApi)
              .then((res) => {
                commentInfo.beCommentContent = res.data.commentContent;
              })
              .catch((error) => {
                this.$message.error(error.message)
              })
          }


          await api.获取用户信息(commentInfo.messageSendUser)
            .then((res) => {
              commentInfo.userName = res.data.userName;
              commentInfo.userAvatar = res.data.userAvatar;
            })
            .catch((error) => {
              this.$message.error(error.message)
            });



          this.readCommentMessages.push(commentInfo);
        }
      }

      debugger

      this.show = "comment";
    },

    async 已读点赞() {
      let like = [];

      // 获取未读点赞消息
       api.获取用户消息_点赞_已读(this.readLikeMessagesPage)
        .then((res) => {
          if(res.data === null || res.data.length === 0) {
            this.noMoreLike = true;
            this.$message.warning("没有更多了!")
          } else {
            like = res.data
            this.readLikeMessagesPage.pageNum++;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        })



      if (like.length !== 0) {
        // 解析点赞
        // 根据like的messagePO的messageType来划分类型: 评论(13102)还是笔记(13101)点赞, 得到两个List, noteLike和commentLike
        let noteLike = [];
        let commentLike = [];


        like.forEach((item) => {
          const likeInfo = {
            messageSendUser: item.messageSendUser,
            messageSendTime: item.messageSendTime,
            commentId: null,
            noteId: null
          }


          if (item.messageType === 13102) {
            // 评论点赞
            likeInfo.commentId = item.messageContent

          } else if (item.messageType === 13101) {
            // 笔记点赞
            likeInfo.noteId = item.messageContent
          }
          this.readLikeMessages.push(likeInfo);
        });

        // 最终得到了分组后的评论点赞和笔记点赞的计数和信息


        // 循环拼接其他信息
        for (const message of this.readLikeMessages) {
          await api.获取用户信息(message.messageSendUser)
            .then((res) => {
              message.userName = res.data.userName;
              message.userAvatar = res.data.userAvatar;
            })
            .catch((error) => {
              this.$message.error(error.message)
            });

          if(message.commentId == null) {
            const noteDTO = {
              noteId: null
            }

            noteDTO.noteId = message.noteId;

            // 获取笔记的标题
            await api.通过ID获取笔记信息(noteDTO)
              .then((res) => {
                message.likeContent = res.data.noteTitle;
              })
              .catch((error) => {
                this.$message.error(error.message)
              });
          } else {
            // 获取评论的内容
            const commentDTO = {
              commentId: null
            }

            commentDTO.commentId = message.commentId;
            await api.通过ID获取评论信息(commentDTO)
              .then((res) => {

                message.likeContent = res.data.commentContent;
                message.noteId = res.data.noteId;
              })
              .catch((error) => {
                this.$message.error(error.message)
              });
          }
        }
      }

      this.show = "like";
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
    }
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
//line-height: 30px;

  padding: 0 10px;
  display: flex;
  align-items: center;
  margin: 10px 10px 10px 10px;
  background-color: rgba(255, 255, 255, 1);
  border-radius: 10px;
}

.selected-type {
  margin-right: 10px;
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
</style>
