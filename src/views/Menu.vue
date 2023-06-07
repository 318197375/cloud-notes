<template >
  <div >
    <el-backtop target=".main-container"></el-backtop>

    <div class="main-container">
    <el-row class="header">
      <el-col  :span="5" style="margin-top: 5px">
        <i class="logo">云笔记</i>
<!--        <img class="logo" src="../assets/images/云笔记.png" alt="logo" >-->
      </el-col>

      <el-col :span="14" class = "header-center">
        <el-input
          class="search-input"
          placeholder="请输入搜索内容"
          suffix-icon="el-icon-search"
          v-model="searchValue"
          clearable
          @keyup.enter.native="searchNote()"
        ></el-input>


        <el-select v-model="value" class="search-select">
          <el-option
            v-for="item in searchTypes"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
      </el-col>

      <el-col :span="5" class="user-container">
        <el-dropdown trigger="hover" class="el-dropdown, dropdown-item" placement="bottom">
          <i class="el-icon-user" style="font-size: 40px"></i>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item @click.native="toUser()" class="el-dropdown-item-class">
              <i class="el-icon-user" style="font-size: 20px"/>个人中心
            </el-dropdown-item>

            <el-dropdown-item @click.native="logout()" >
              <i class="el-icon-switch-button" style="font-size: 20px"/>注销登录
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown >

        <el-dropdown trigger="hover" class="el-dropdown, dropdown-item" style="position: relative;"  placement="bottom" @click.native="toMessage(1)" >
          <el-badge :hidden="messageCounter.totalMessage === 0" :value="messageCounter.totalMessage" class="item" :max="99" >
            <i class="el-icon-message" style="font-size: 40px"></i>
          </el-badge>
          <!--           todo 完成提示信息的动态生成-->

          <el-dropdown-menu slot="dropdown" >

            <el-dropdown-item @click.native="toMessage(1)">
              <el-badge :hidden="messageCounter.commentTotal === 0" :value="messageCounter.commentTotal" class="item dropdown-item-class" :max="99" >
                <i class="el-icon-s-comment" style="font-size: 20px"/>回复
              </el-badge>
            </el-dropdown-item>
            <el-dropdown-item @click.native="toMessage(2)">
              <el-badge :hidden="messageCounter.likeTotal === 0" :value="messageCounter.likeTotal" class="item dropdown-item-class" :max="99">
                <i class="el-icon-view" style="font-size: 20px"/>收到的赞
              </el-badge>
            </el-dropdown-item>
            <el-dropdown-item @click.native="toMessage(3)">
              <el-badge :hidden="messageCounter.bulletinTotal === 0" :value="messageCounter.bulletinTotal" class="item dropdown-item-class" :max="99">
                <i class="el-icon-bell" style="font-size: 20px"/>系统通知
              </el-badge>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="hover" class="el-dropdown, dropdown-item" placement="bottom" @click.native="toCollect(1)">
          <i class="el-icon-star-off" style="font-size: 40px"></i>
          <el-dropdown-menu slot="dropdown" >
            <el-dropdown-item class="el-dropdown-item-class" @click.native="toCollect(1)">
              <i class="el-icon-reading" style="font-size: 20px"/>笔记收藏
            </el-dropdown-item>

            <el-dropdown-item @click.native="toCollect(2)">
              <i class="el-icon-s-comment" style="font-size: 20px"/>评论收藏
            </el-dropdown-item>
          </el-dropdown-menu>

        </el-dropdown>

        <el-dropdown trigger="hover" class="el-dropdown, dropdown-item" placement="bottom">
          <i class="el-icon-edit" style="font-size: 40px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toArticleInfo()" class="el-dropdown-item-class">
              <i class="el-icon-edit" style="font-size: 20px"/>笔记中心
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

        <el-dropdown trigger="hover" class="el-dropdown, dropdown-item" v-if="isAdmin === 'true'" placement="bottom" @click.native="toPowerManage(1)">
          <i class="el-icon-setting" style="font-size: 40px"></i>
          <el-dropdown-menu slot="dropdown">
            <el-dropdown-item @click.native="toPowerManage(1)">  <i class="el-icon-circle-close" style="font-size: 20px"/>权限管理</el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>

      </el-col>


    </el-row>

    <el-row class="body">
      <el-col :span="5" class="sidebar-left">
        <i class="el-icon-d-arrow-left" style="font-size: 20px; color: #409EFF; margin-top: 20px" @click="isMenu = true" v-if="!isMenu"> 回到主页</i>

        <div> . </div>
      </el-col>



      <el-col :span="20"
              class="main-content"
              v-if="isMenu"
              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"
      >
        <NoteCard v-for="(item, index) in notes" :key="item.noteId" :note="item"/>

        <div class="load-more-btn">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore" style="margin-bottom: 10px">没有更多了</p>
        </div>
      </el-col>

      <el-col :span="20"
              class="main-content"
              v-if="!isMenu"
      >
        <!--              v-infinite-scroll="load"
              infinite-scroll-disabled="disabled"-->
        <NoteCard v-for="(item, index) in searchNotes" :key="item.noteId" :note="item"/>

        <div class="load-more-btn">
          <p v-if="loading">加载中...</p>
          <p v-if="noMore" style="margin-bottom: 10px">没有更多了</p>
        </div>
      </el-col>


<!--      <el-col :span="5" class="sidebar-right">Right Sidebar</el-col>-->



    </el-row>
  </div>
  </div>

</template>

<script>
import { router } from '@/router'
import api from '@/api/public'
import { setNoteInfo, formatDate } from "@/util/public";
import NoteCard from "@/components/NoteCard.vue";

export default {
  components: {
    NoteCard
  },

  created () {
    // 判断token是否存在，如果不存在，则跳转到Login页面
    //
    // if (!localStorage.getItem('token')) {
    //   this.$message.warning("您未登录, 请先登录!")
    //   this.$router.push({
    //     path: '/Login'
    //   })
    // }

    debugger
    const isAdmin = this.$route.query.isAdmin;

    if(isAdmin !== null) {
      this.isAdmin = isAdmin;
      localStorage.setItem('isAdmin', this.isAdmin);
    } else {
      this.isAdmin = localStorage.getItem('isAdmin');
    }


    debugger
    // this.getNote();

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
  },

  computed: {
    disabled () {
      return this.loading || this.noMore
    }
  },

  methods: {
    // testPower() {
    //   api.test().then((res) => {
    //
    //     this.$message.success(res.message)
    //
    //   })
    //     .catch((error) => {
    //       this.$message.error(error.message)
    //     })
    // },

    load() {

      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        debugger
        this.getNote(); //调用接口，此时页数+1，查询下一页数据
      }, 200);
    },

    logout() {
      // 执行注销操作，例如清除本地存储中的 token
      localStorage.removeItem('token');

      this.$message({
        message: '注销成功!',
        type: 'success'
      })

      // 跳转到登录页面
      this.$router.push({
        path: '/Login'
      })
    },

    toUser() {
      this.$router.push({
        path: '/User',
      })
    },

    toArticleInfo() {
      this.$router.push({
        path: '/ArticleInfo'
      })
    },

    toMessage(defaultActive) {
      this.$router.push({
        name: 'Message',
        params: {
          messageCounter: this.messageCounter,
          defaultActive: defaultActive
        }
      })
    },


    toCollect(defaultActive) {
      this.$router.push({
        name: 'CollectShow',
        params: {
          defaultActive: defaultActive
        }
      })
    },

    toPowerManage(defaultActive) {
      this.$router.push({
        name: 'PowerManage',
        params: {
          defaultActive: defaultActive
        }
      })
    },



    async getNote() {

      await api.推荐文章(this.page)
        .then((res) => {
          setNoteInfo(res, this);
          this.loading = false;
        })
        .catch((error) => {
          debugger
          this.loading = false;
          this.$message.error(error.message)
        })
    },



    gotoUserPage(userId) {
      this.$router.push({
        path: '/User',
        query: {
          id: userId
        }
      });
    },

    searchNote() {
      const searchInfo = {
        noteTitle: null,
        userName: null,
        noteTag: null
      }
      if(this.value === 1) {
        searchInfo.noteTitle = this.searchValue;
      }else if(this.value === 2) {
        searchInfo.userName = this.searchValue;
      } else if(this.value === 3) {
        searchInfo.noteTag = this.searchValue;
      }

      api.条件查询笔记(searchInfo)
        .then((res) => {
          this.searchNotes = res.data;
          this.isMenu = false;
        })
        .catch((error) => {

          this.$message.error(error.message)
        })
    },


  },

  data() {
    return {
      messageCounter: {
        totalMessage: 0,
        likeTotal: 0,
        commentTotal: 0,
        bulletinTotal: 0,
      },

      isAdmin: 'false',
      isMenu: true,

      loading: false,
      noMore: false,

      page: {
        pageNum: 1,
        pageSize: 10
      },
      searchValue: null,
      searchTypes: [
        {
          value: 1,
          label: "根据标题搜索"
        },
        {
          value: 2,
          label: "根据作者搜索"
        },
        {
          value: 3,
          label: "根据标签搜索"
        }
      ],

      value: 1,
      notes: [],

      searchNotes: []
    };
  },

  filters: {
    formatDate
  }
};
</script>

<style >
@import "@/assets/css/public.less";


.logo {
  //width: calc(100% - 20px);
  //height: calc(100% - 20px);
  //max-width: 100px;
  //max-height: 50px;
  //margin: 20px auto auto auto;
  //object-fit: contain;

  font-size: 30px;
  color:#fefefe;
  text-shadow:0 1px 0 #c0c0c0,
  0 2px 0 #b0b0b0,
  0 3px 0 #a0a0a0,
  0 4px 0 #909090,
  0 5px 10px rgba(0, 0, 0, .9);
}

.main-container {
  height: calc(100vh - 10px);
  //height: 100vh;
  overflow: auto;

  background-color: #F3F5FA;
}

.header {
  height: 60px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.header-col {
  margin-top: 5px;
}

.header-center {
  margin-top: 12px;
}
.sidebar-left {
  width: 15%;
}
.main-content {

  /*overflow:hidden;*/

  width: 70%;
  //margin-left: 300px;

}

.search-input {
  width: 70%;
  margin-right: 10px;
}

.search-select {
  width: 20%;
}

.user-container {
  margin-top: 12px;

  display: flex;
  justify-content: space-between;
}
.dropdown-item {
//width: 400px;
  /*height: 40px;*/
  /*margin-left: 10px;*/
  margin-right: 20px;
  /*flex-shrink: 0*/
  /*width: calc(100% / 3);*/
  /*text-align: center;*/
}
.user-avatar {
  width: 40px;
  height: 40px;
  margin-right: 10px;
}

.body {
  margin-top: 10px;

}

.sidebar-right {
  width: 16%;
  height: 500px;
  /*margin-left: 2%;*/
  margin-top: 1%;
  margin-right: 3%;
  background-color: #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  position: fixed;
  right: 0;
  padding: 10px;

}

.red-dot {
  display: inline-block;
  width: 8px;
  height: 8px;
  background-color: red;
  border-radius: 50%;
  margin-right: 5px;
}

.dropdown-item-class {
  height: 30px;
  width: 90px
}

.el-dropdown-item-class {
  margin-bottom: 10px
}

.menu-class {

}
</style>
