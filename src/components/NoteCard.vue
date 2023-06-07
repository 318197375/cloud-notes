<template>
  <el-card class="article-card"
           shadow="hover" @click.native="toShow()"

  >
    <div class="card-content">
      <div class="article-img">
        <el-image :src="note.noteAvatar" class="avatar-image" :fit="`contain`"></el-image>
      </div>
      <div class="article-info">
        <div class="article-title">{{ note.noteTitle }}</div>
        <el-descriptions column="3">
          <el-descriptions-item label="作者" ><span @click="toUserPage">{{ note.userName }} </span> </el-descriptions-item>
          <el-descriptions-item label="标签" span="2">
            <el-tag style="margin-left: 10px"
                    v-for="tag in tags"
                    :key="tag">
              {{tag}}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item label="发布时间" span="1">{{ note.noteCreateTime | formatDate }}</el-descriptions-item>
          <el-descriptions-item label="修改时间" span="1">{{ note.noteUpdateTime | formatDate }}</el-descriptions-item>
          <el-descriptions-item label="笔记类型" span="1">
            <el-tag style="margin-left: 10px"
                    v-for="tag in visibility"
                    :key="tag">
              {{tag}}
            </el-tag>
          </el-descriptions-item>

          <el-descriptions-item label="阅读人数">{{ note.noteReadersNum }}</el-descriptions-item>
          <el-descriptions-item label="点赞人数">{{ note.noteLikeNum }}</el-descriptions-item>
          <el-descriptions-item label="收藏人数">{{ note.noteCollectNum }}</el-descriptions-item>
        </el-descriptions>
      </div>
    </div>
  </el-card>
</template>

<script>
import { formatDate } from "@/util/public";

export default {
  name: "NoteCard",
  props: {
    note: Object
  },

  created () {

    let noteTag = this.note.noteTag
    this.tags = noteTag.split('=');

    if(this.note.noteVisibility === 12001) {
      this.visibility = ['私有笔记']
    } else {
      this.visibility = ['公开笔记']
    }
  },
  data() {
    return {
      tags: [],
      visibility: []
    }
  },

  filters: {
    formatDate
  },

  methods: {
    toShow() {
      this.$router.push({
        path: '/ArticleShow',
        query: { note: JSON.stringify(this.note) }
      })
    },

    toUserPage() {

      this.$router.push({
        path: '/User',
        query: {
          id: this.note.userId
        }
      });
    }
  }
};
</script>

<style>
@import "@/assets/css/public.less";

</style>
