<template>
    <div class="circle flex-h" @click="updateClickLike" :class="isUp?'check':''">
      <div class="img-box" :class="isUp?'img-box-check':''">
        <img v-if="isUp" src="@/assets/images/afterLike.jpg" alt="" />
        <img v-else src="@/assets/images/like.jpg" alt="" />
      </div>

      <span style="margin: auto; font-size: 16px">{{this.likeNum}}</span>
    </div>
</template>

<script>
import api from '@/api/public'
export default {
  name: 'Like',

  created() {
    this.isUp = this.clickLike;
  },

  props: {
    noteId: {
      type: String,
      require: true
    },

    commentId: {
      type: String,
      require: true
    },

    likeNum: {
      type: String,
      require: true
    },

    clickLike: {
      type: Boolean,
      require: true
    }
  },

  data() {
    return {
      isUp: false,
      commentLike: {
        commentId: null
      },

      noteLike: {
        noteId: null
      }
    }
  },

  watch: {
    clickLike(newVal) {
      // parentValue的值变化后会执行这里的代码
      this.isUp = newVal;
    }
  },

  methods: {
    updateClickLike () {

      this.commentLike.commentId = this.commentId;
      this.noteLike.noteId = this.noteId;


      if(this.isUp) {
        if(this.noteId == null) {
          // 想要取消点赞
          api.取消点赞评论(this.commentLike)
              .then((res) => {
                this.$message.success(res.message)
                this.likeNum--;
                this.isUp = !this.isUp

              }).catch((error) => {
            this.$message.error(error.message)
          });
        } else {
          api.取消点赞笔记(this.noteLike)
              .then((res) => {
                this.$message.success(res.message)
                this.likeNum--;
                this.isUp = !this.isUp

              }).catch((error) => {
            this.$message.error(error.message)
          });
        }


      } else {
        if(this.noteId == null) {
          // 想要点赞
          api.点赞评论(this.commentLike)
              .then((res) => {
                this.$message.success(res.message)
                this.likeNum += 1;
                this.isUp = !this.isUp

              }).catch((error) => {
            this.$message.error(error.message)
          });

        } else {
          api.点赞笔记(this.noteLike)

              .then((res) => {
                this.$message.success(res.message)
                this.likeNum += 1;
                this.isUp = !this.isUp

              }).catch((error) => {
            this.$message.error(error.message)
          });
        }
      }

      this.$emit('update-click-like', this.clickLike);
    },
  }
}
</script>

<style lang='less' scoped>

.circle {
  display: flex;
  //flex-direction: row;
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0px 0px 0px 0px rgba(223, 46, 58, 0.5);
.img-box {
  width: 20px;
  height: 20px;
  margin: 5px;
  -moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none; // 防止快速点击图片被选中，可不加，为提高体验，博主加上了这几行代码。
    & img {
                          width: 100%;
                          height: 100%;
                        }
}
}
.check {
  -webkit-transition: box-shadow 0.5s;
  -moz-transition: box-shadow 0.5s;
  -o-transition: box-shadow 0.5s;
  transition: box-shadow 0.5s;
  box-shadow: 0px 0px 0px 1em rgba(226, 32, 44, 0);
}
.img-box-check {
  animation: anm 0.5s;
  -moz-animation: anm 0.5s;
  -webkit-animation: anm 0.5s;
  -o-animation: anm 0.5s;
}
@keyframes anm {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }
  50% {
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
    -moz-transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}

// 以下为处理兼容代码，可不看。

@-moz-keyframes anm {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }
  50% {
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
    -moz-transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}

@-webkit-keyframes anm {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }
  50% {
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
    -moz-transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}

@-o-keyframes anm {
  0% {
    transform: scale(0);
    -webkit-transform: scale(0);
    -moz-transform: scale(0);
  }
  50% {
    transform: scale(1.3);
    -webkit-transform: scale(1.3);
    -moz-transform: scale(1.3);
  }
  100% {
    transform: scale(1);
    -webkit-transform: scale(1);
    -moz-transform: scale(1);
  }
}
</style>
