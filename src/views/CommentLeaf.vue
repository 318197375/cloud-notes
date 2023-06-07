<template>
  <div>
    <!--      子评论-->
    <div class="reply" v-if="!showMoreComment" v-infinite-scroll="load">
      <!--        子评论组件-->
      <div class="item" v-for="leaf in item.comments"0>

        <!--          子评论头部, 发出者 -> @者, 内容-->
        <div class="reply-content">
          <!--              <img class="avatar" :src="leaf.userAvatar" width="36" height="36"/>-->
          <!--              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>-->
          <el-avatar size="small" :src="leaf.avatar" @error="errorHandler" style="margin-right: 5px"></el-avatar>

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

          <span class="reply-text" @click="showInputClick(item, leaf)">
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
      <div class="write-reply" v-if="item.comments.length <= 0" @click="showInputClick(item, null)">
        <i class="el-icon-edit"></i>
        <span class="add-comment">添加新评论</span>
      </div>
    </div>


<!--    <ul class="infinite-list, ul" v-infinite-scroll="load" style="padding-left: 0;" v-if="showMoreComment">-->
<!--&lt;!&ndash;      <li v-for="i in count" class="infinite-list-item">{{ i }}</li>&ndash;&gt;-->
<!--      &lt;!&ndash;      子评论&ndash;&gt;-->
<!--      <div class="reply">-->
<!--        &lt;!&ndash;        子评论组件&ndash;&gt;-->
<!--        <div class="item" v-for="leaf in item.comments">-->
<!--          &lt;!&ndash;          子评论头部, 发出者 -> @者, 内容&ndash;&gt;-->
<!--          <div class="reply-content">-->
<!--            &lt;!&ndash;              <img class="avatar" :src="leaf.userAvatar" width="36" height="36"/>&ndash;&gt;-->
<!--            &lt;!&ndash;              <el-avatar src="https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png"></el-avatar>&ndash;&gt;-->
<!--            <el-avatar size="small" :src="leaf.avatar" @error="errorHandler" style="margin-right: 5px"></el-avatar>-->

<!--            <span class="from-name">{{leaf.userName}}</span><span>: </span>-->
<!--            <span class="to-name">@{{leaf.toUserName}}</span>-->
<!--            <span>{{leaf.commentContent}}</span>-->
<!--          </div>-->

<!--          &lt;!&ndash;        时间信息以及回复按钮  &ndash;&gt;-->
<!--          <div class="reply-bottom">-->
<!--            <span>{{leaf.commentCreateDate | formatDate}}</span>-->

<!--            <Like :commentId="leaf.commentId"-->
<!--                  :likeNum="leaf.commentLikeNum"-->
<!--                  :clickLike="leaf.clickLike"-->
<!--            ></Like>-->

<!--            <span class="reply-text" @click="showInputClick(item, leaf)">-->
<!--                <i class="iconfont icon-comment"></i>-->
<!--                <span>回复</span>-->
<!--              </span>-->

<!--            <span class="reply-text-delete" @click="deleteClick(leaf.commentId)" v-if="leaf.selfComment">-->
<!--                <i class="iconfont icon-comment"></i>-->
<!--                <span>删除</span>-->
<!--              </span>-->
<!--          </div>-->
<!--        </div>-->
<!--      </div>-->
<!--    </ul>-->

<!--    <div class="infinite-list-wrapper" style="overflow:auto" v-if="showMoreComment">-->
<!--      <ul-->
<!--        class="list"-->
<!--        v-infinite-scroll="load"-->
<!--        infinite-scroll-disabled="disabled">-->
<!--        <li v-for="i in count" class="list-item">{{ i }}</li>-->
<!--      </ul>-->
<!--      <p v-if="loading">加载中...</p>-->
<!--      <p v-if="noMore">没有更多了</p>-->
<!--    </div>-->

<!--    <div class="infinite-list-wrapper" style="overflow:auto" v-if="showMoreComment">-->
<!--      <ul-->
<!--        class="list"-->
<!--        v-infinite-scroll="load"-->
<!--        infinite-scroll-disabled="disabled">-->
<!--        <li v-for="i in count" class="list-item">{{ i }} {{i}}</li>-->
<!--      </ul>-->
<!--      <p v-if="loading">加载中...</p>-->
<!--      <p v-if="noMore">没有更多了</p>-->
<!--    </div>-->





    <div class="load-more-btn" >
      <button @click="isMoreComment">查看更多的{{item.total}}条评论</button>
    </div>
  </div>

</template>

<script>
import { beforeDrawerClose, deleteComment, formatDate, showCommentInput } from '@/util/public'

export default {
  name: 'CommentLeaf',

  created () {
    console.log(this.item)
  },

  props: {
    item: {
      type: Object,
      require: true
    }
  },

  data() {
    return {
      showMoreComment: false,
      showInput: false,
      count: 10,
      loading: false
    }
  },


  methods: {
    showInputClick(root, leaf) {
      showCommentInput(root, leaf, this);
    },

    deleteClick(commentId) {
      deleteComment(commentId, this);
    },

    isMoreComment() {
      this.showMoreComment = !this.showMoreComment;
    },

    load () {


      this.loading = true
      setTimeout(() => {
        this.count += 2
        this.loading = false
      }, 2000)
    },

    noMore () {


      return this.count >= 200
    },
    disabled () {

      return this.loading || this.noMore
    }
  }
}
</script>


<style scoped lang="scss">

</style>
