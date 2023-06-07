<!--评论模块-->
<template>

  <div >
    <!--        添加新评论按钮-->
    <div class="write-reply" v-if="false" @click="showInputClick(null, null)" >
      <div style="  margin: auto;">
        <i class="el-icon-edit" style="  margin: auto;"></i>
        <span class="add-comment" style="  margin: auto;">添加一条新评论吧</span>
      </div>
    </div>


    <div class="container">
      <div class="comment">
        <!--      评论头-->
        <div class="info">
          <!--        头像-->
          <el-avatar  :src="commentInfo.rootComment.userAvatar" @error="errorHandler"></el-avatar>


          <!--        信息-->
          <div class="right">
            <div class="name">{{commentInfo.rootComment.userName}}</div>
            <div class="date">{{commentInfo.rootComment.commentCreate | formatDate}}</div>
          </div>
        </div>

        <!--      评论体 -->
        <div class="content">{{commentInfo.rootComment.commentContent}}
        </div>

        <!--  赞数量-->
        <div class="control">
          <span>{{commentInfo.rootComment.commentCreateDate | formatDate}}</span>


          <!--        点赞-->
          <Like :commentId="commentInfo.rootComment.commentId"
                :likeNum="commentInfo.rootComment.commentLikeNum"
                :clickLike="commentInfo.rootComment.clickLike"
          ></Like>

          <Collect :commentId="commentInfo.rootComment.commentId"
                   :collectNum="commentInfo.rootComment.commentCollectNum"
                   :clickCollect="commentInfo.rootComment.clickCollect"
          ></Collect>


          <!--        回复-->
          <span class="comment-reply" @click="showInputClick(commentInfo, null)">
            <i class="iconfont icon-comment"></i>
            <span>回复</span>
          </span>

          <span class="comment-reply-delete"
                @click="deleteClick(commentInfo.rootComment.commentId)"
                v-if="commentInfo.rootComment.selfComment">
            <i class="iconfont icon-comment"></i>
            <span>删除</span>
          </span>
        </div>

        <!--        <CommentLeaf-->
        <!--          :item="commentInfo"-->
        <!--        ></CommentLeaf>-->

        <div>
          <!--      子评论-->
          <div v-if="!showMoreComment" class="reply">
            <!--        子评论组件-->
            <div class="item" v-for="leaf in commentInfo.comments">

              <!--          子评论头部, 发出者 -> @者, 内容-->
              <div class="reply-content">
                <el-avatar size="small" :src="leaf.userAvatar" @error="errorHandler" style="margin-right: 5px"></el-avatar>

                <span class="from-name">{{leaf.userName}}</span><span>: </span>
                <span class="to-name">@{{leaf.toUserName}}</span>
                <span>{{leaf.commentContent}}</span>
              </div>

              <!--        时间信息以及回复按钮  -->
              <div class="reply-bottom">
                <span>{{leaf.commentCreateDate | formatDate}}</span>

                <Like :commentId="leaf.commentId"
                      :likeNum="leaf.commentLikeNum"
                      :clickLike="leaf.clickLike"
                ></Like>

                <Collect :commentId="leaf.commentId"
                         :collectNum="leaf.commentCollectNum"
                         :clickCollect="leaf.clickCollect"
                ></Collect>

                <span class="reply-text" @click="showInputClick(commentInfo, leaf)">
                <i class="iconfont icon-comment"></i>
                <span>回复</span>
          </span>

                <span class="reply-text-delete" @click="deleteClick(leaf.commentId)" v-if="leaf.selfComment">
                  <i class="iconfont icon-comment"></i>
                  <span>删除</span>
               </span>
              </div>
            </div>


            <!--        添加新评论按钮-->
            <div class="write-reply" v-if="commentInfo.comments.length <= 0" @click="showInputClick(commentInfo, null)">
              <i class="el-icon-edit"></i>
              <span class="add-comment">添加新评论</span>
            </div>
          </div>

          <div  v-if="showMoreComment" class="reply"
               v-infinite-scroll="load"
               infinite-scroll-disabled="disabled"
               infinite-scroll-distance='1'

          >
            <!--        子评论组件-->
            <div class="item" v-for="leaf in commentInfo.comments">

              <!--          子评论头部, 发出者 -> @者, 内容-->
              <div class="reply-content">
                 <el-avatar size="small" :src="leaf.userAvatar" @error="errorHandler" style="margin-right: 5px"></el-avatar>

                <span class="from-name">{{leaf.userName}}</span><span>: </span>
                <span class="to-name">@{{leaf.toUserName}}</span>
                <span>{{leaf.commentContent}}</span>
              </div>

              <!--        时间信息以及回复按钮  -->
              <div class="reply-bottom">
                <span>{{leaf.commentCreateDate | formatDate}}</span>

                <Like :commentId="leaf.commentId"
                      :likeNum="leaf.commentLikeNum"
                      :clickLike="leaf.clickLike"
                ></Like>

                <Collect :commentId="leaf.commentId"
                         :collectNum="leaf.commentCollectNum"
                         :clickCollect="leaf.clickCollect"
                ></Collect>

                <span class="reply-text" @click="showInputClick(commentInfo, leaf)">
                <i class="iconfont icon-comment"></i>
                <span>回复</span>
          </span>

                <span class="reply-text-delete" @click="deleteClick(leaf.commentId)" v-if="leaf.selfComment">
                  <i class="iconfont icon-comment"></i>
                  <span>删除</span>
               </span>
              </div>
            </div>


            <!--        添加新评论按钮-->
            <div class="write-reply" v-if="commentInfo.comments.length <= 0" @click="showInputClick(commentInfo, null)">
              <i class="el-icon-edit"></i>
              <span class="add-comment">添加新评论</span>
            </div>



            <div class="load-more-btn">
              <p v-if="loading">加载中...</p>
              <p v-if="noMore" style="margin-bottom: 10px">没有更多了</p>
            </div>

          </div>

          <div class="load-more-btn" v-if="commentInfo.comments.length >= 3 && !showMoreComment" >
            <button @click="isMoreComment">查看更多的{{commentInfo.total - 3}}条评论</button>
          </div>
        </div>

        <el-divider></el-divider>
      </div>

    </div>


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

</template>

<script>
import Vue from 'vue'
import { beforeDrawerClose, deleteComment, formatDate, showCommentInput } from '@/util/public'
import api from '@/api/public'
import Like from '@/components/Like'
import Collect from '@/components/Collect'
import CommentLeaf from '@/views/CommentLeaf'

export default {
  name: 'Comment',

  filters: {
    formatDate
  },

  props: {
    commentInfo: {
      type: Object,
      required: true
    },

    noteId: {
      type: String,
      required: true
    },
  },
  components: {
    Like,
    Collect,
    CommentLeaf
  },

  data() {
    return {
      loading: false,
      noMore: false,

      inputComment: '',
      showInput: false,
      isUp: false,

      showMoreComment: false,



      thisRoot: null,
      thisLeaf: null,

      toUserName: '',

      addComment: {
        commentId: null,
        noteId: null,
        toUserId: null,
        rootId: null,
        pid: null,
        commentContent: "",
      },

      deleteCommentInfo: {
        commentId: null,
        test: "?"
      },

      notePage: {
        noteId: null,
        pageSize: 10,
        pageNum: 1
      },

      leafRootPage: {
        noteId: null,
        rootId: null,
        pageSize: 10,
        pageNum: 1
      }
    }
  },


  methods: {
    load() {
      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {

        this.leafRootPage.noteId = this.noteId;
        this.leafRootPage.rootId = this.commentInfo.rootComment.commentId
        //调用接口，此时页数+1，查询下一页数据
        api.获取子评论(this.leafRootPage)
          .then((res) => {
            debugger

            if(res.data === null || res.data.length === 0) {
              this.noMore = true;

            } else {
              this.commentInfo.comments = this.commentInfo.comments.concat(res.data);
              this.leafRootPage.pageNum++;
            }


            this.loading = false;
          })
          .catch((error) => {
            this.$message.error(error.message)
            this.loading = false;
          });
      }, 200);
    },

    showInputClick(root, leaf) {
      showCommentInput(root, leaf, this);
    },

    deleteClick(commentId) {
        this.$confirm("确定要删除评论吗?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {

          this.addComment.commentId = commentId;
          api.删除评论(this.addComment)
            .then((res) => {
              this.$message.success(res.message)

              this.$emit('reply', null);

            })
            .catch((error) => {
              this.$message.error(error.message)
            });
        }).catch(() => {});

    },

    handleClick () {
      this.isUp = !this.isUp
    },

    isMoreComment() {

      this.showMoreComment = true;

      this.commentInfo.comments = null;

      this.leafRootPage.noteId = this.noteId;
      this.leafRootPage.rootId = this.commentInfo.rootComment.commentId

      api.获取子评论(this.leafRootPage)
        .then((res) => {
          this.commentInfo.comments = res.data;
          this.leafRootPage.pageNum++;
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

    },



    beforeDrawerClose(done) {
      this.$confirm("确定要关闭编辑窗口吗？未保存的信息将丢失!", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        done();
      }).catch(() => {});
    },

    // /**
    //  * 点赞
    //  */
    // likeClick(item) {
    //   if (item.isLike === null) {
    //     Vue.$set(item, "isLike", true);
    //     item.likeNum++
    //   } else {
    //     if (item.isLike) {
    //       item.likeNum--
    //     } else {
    //       item.likeNum++
    //     }
    //     item.isLike = !item.isLike;
    //   }
    // },
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

      this.addComment.noteId = this.noteId;
      this.addComment.commentContent = this.inputComment;

      if(this.thisRoot == null) {


      } else {
        this.addComment.rootId = this.thisRoot.commentId;

        if(this.thisLeaf == null) {
          this.addComment.toUserId = this.thisRoot.userId;
        } else {
          this.addComment.pid = this.thisLeaf.pid
          this.addComment.toUserId = this.thisLeaf.userId;

        }
      }

      api.添加评论(this.addComment)
        .then((res) => {
          this.$message.success(res.message)
          this.showInput = false;

          this.notePage.noteId = this.noteId

          this.$emit('reply', null);
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },



    errorHandler() {
      return true
    },





  },

  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },


  created() {

  },
}
</script>
<style scoped lang="scss">
@import "../../public/scss/index";

.container {

  padding: 0 10px;
  box-sizing: border-box;
  .comment {
    display: flex;
    flex-direction: column;
    padding: 10px;
    border-bottom: 1px solid $border-fourth;
    .info {
      display: flex;
      align-items: center;
      .avatar {
        border-radius: 50%;
      }
      .right {
        display: flex;
        flex-direction: column;
        margin-left: 10px;
        .name {
          font-size: 16px;
          color: $text-main;
          margin-bottom: 5px;
          font-weight: 500;
          text-align: left;
        }
        .date {
          font-size: 12px;
          color: $text-minor;
        }
      }
    }
    .content {
      font-size: 16px;
      color: $text-main;
      line-height: 20px;
      padding: 10px 0;
      text-align: left;
      margin-top: 5px;
      margin-bottom: 5px;

    }
    .control {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-minor;
      .like {
        display: flex;
        align-items: center;
        margin-right: 20px;
        cursor: pointer;
        &.active, &:hover {
          color: $color-main;
        }
        .iconfont {
          font-size: 14px;
          margin-right: 5px;
        }
      }
      .comment-reply {
        display: flex;
        align-items: center;
        cursor: pointer;

        margin-left: 10px;
        &:hover {
          color: $text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 5px;
        }
      }

      .comment-reply-delete {
        display: flex;
        align-items: center;
        cursor: pointer;
        color: $text-d1675a;
        &:hover {
          color: $text-333;
        }
        .iconfont {
          font-size: 16px;
          margin-right: 20px;
        }
      }
    }

  }
}




.write-reply {
  display: flex;
  align-items: center;
  font-size: 14px;
  color: $text-minor;
  padding: 10px;
  cursor: pointer;
  :hover {
    color: $text-main;
  }
  .el-icon-edit {
    margin-right: 5px;

  }
}

.input-wrapper {
  position: fixed;
  bottom: 0;
  width: 85%;
  //position:fixed;
  //z-index:999;
  display: flex;
  height: 200px;
  margin: 10px 10px 10px 10px;

  //border: 1px solid deepskyblue;
  justify-content: flex-end;
  align-items: center;

  padding: 10px;

  .btn-control {
    width: 10%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-end;
    padding-top: 10px;

    .cancel {
      font-size: 16px;
      //color: $text-normal;
      cursor: pointer;
      margin-bottom: 10px;

      &:hover {
        color: $text-333;
      }
    }

    .btn {
      font-size: 16px;
      margin-bottom: 20px;

    }
  }
}

.gray-bg-input{
  //margin-top: 5px;
  width: 90%;

}

.infinite-list-wrapper {


  .list-item {
    height: 300px;
  }
}


.reply {
  margin: 10px 0;
  border-left: 2px solid $border-first;
  max-height: 300px;
  overflow: auto;




  .item {
    margin: 0 10px;
    padding: 10px 0;
    border-bottom: 1px dashed $border-third;
    .reply-content {
      display: flex;
      align-items: center;
      font-size: 14px;
      color: $text-main;
      .from-name {
        //color: $color-main;
      }
      .to-name {
        color: $color-main;
        margin-left: 5px;
        margin-right: 5px;
      }
    }
    .reply-bottom {
      display: flex;
      align-items: center;
      margin-top: 6px;
      font-size: 12px;
      color: $text-minor;
      .reply-text {
        display: flex;
        align-items: center;
        margin-left: 10px;
        cursor: pointer;
        :hover {
          color: $text-333;
        }
        .icon-comment {
          margin-right: 5px;
        }
      }
      .reply-text-delete {
        display: flex;
        align-items: center;
        margin-left: 10px;
        cursor: pointer;
        color: $text-d1675a;

        :hover {
          color: $text-d1675a;
        }
        .icon-comment {
          margin-right: 5px;
        }
      }

    }
  }
  .write-reply {
    display: flex;
    align-items: center;
    font-size: 14px;
    color: $text-minor;
    padding: 10px;
    cursor: pointer;
    :hover {
      color: $text-main;
    }
    .el-icon-edit {
      margin-right: 5px;

    }
  }
  .fade-enter-active, fade-leave-active {
    transition: opacity 0.5s;
  }
  .fade-enter, .fade-leave-to {
    opacity: 0;
  }



}


</style>
