<template>
  <el-container>
    <div class="component">
<!--    <span> 个人主页 </span>-->
    </div>
    <el-header style="text-align: right; font-size: 12px; height: 200px">

      <div class="user-info">
        <div class="info_1">
          <el-image :src="user.userAvatar" class="el-image-class" :fit="`cover`"></el-image>

          <el-descriptions column="3" class="info_2" >
            {{user.userAvatar}}
            <el-descriptions-item label="昵称 ">{{ user.userName }}</el-descriptions-item>
            <el-descriptions-item label="ID">{{ user.userId }}</el-descriptions-item>
            <el-descriptions-item label="IP">{{ user.userIp }}</el-descriptions-item>

            <el-descriptions-item label="访问数">{{ user.userVisitNum }}</el-descriptions-item>

            <el-descriptions-item label="文章数">{{ user.userNoteNum }}</el-descriptions-item>
<!--            <el-descriptions-item label="点赞数">{{ user.userNoteLikeNum }}</el-descriptions-item>-->
            <el-descriptions-item label="阅读数">{{ user.userNoteReadNum }}</el-descriptions-item>
<!--            <el-descriptions-item label="订阅数">{{ user.userReadersNum }}</el-descriptions-item>-->
            <!--            <el-descriptions-item label=""></el-descriptions-item>-->


            <el-descriptions-item label="个人简介" span="3">
              <descriptions-tooltip :value="user.userIntroduce"></descriptions-tooltip>

            </el-descriptions-item>
          </el-descriptions>
        </div>

        <div class="edit-btn" v-if="isUserSelf">
          <el-button type="primary" icon="el-icon-edit" @click="openDrawer()">编辑信息</el-button>
          <el-drawer
            :visible.sync="drawerVisible"
            :with-header="false"
            :before-close="beforeDrawerClose"
            :custom-class="['my-drawer-class']"
          >
            <div class="drawer-content">
              <div class="edit-user-info">
                <el-card class="edit-form" :body-style="{ padding: '40px' }">
                  <h2 class="form-title">编辑个人信息</h2>

                  <el-form :model="userForm" label-width="100px" readonly style="margin: auto" enctype="multipart/form-data">
                    <el-form-item>

                      <el-upload
                        class="avatar-uploader"
                        action="#"
                        :http-request="handleAvatarChange"
                        :show-file-list="false"
                      >
                        <div class="avatar-container">
                          <label for="avatar-input" class="user-avatar-label">
                            <el-image :src="userForm.userAvatar" class="avatar-image-special"></el-image>
                            <i class="el-icon-camera"></i>
                          </label>
                        </div>
                      </el-upload>


                    </el-form-item>

                    <el-form-item label="姓名">
                      <el-input v-model="userForm.userName"></el-input>
                    </el-form-item>
                    <el-form-item label="个人介绍">
                      <el-input v-model="userForm.userIntroduce"></el-input>
                    </el-form-item>

                    <el-form-item label="手机">
                      <el-input v-model="userForm.userPhone"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱">
                      <el-input v-model="userForm.userEmail"></el-input>
                    </el-form-item>
                    <el-form-item label="性别">
                      <el-radio-group v-model="userForm.userGender">
                        <el-radio :label="8000">男</el-radio>
                        <el-radio :label="8001">女</el-radio>
                        <el-radio :label="8002">未知</el-radio>
                      </el-radio-group>
                    </el-form-item>
                    <el-form-item style="text-align: center; margin-right: 100px;">
                      <el-button type="primary" @click="handleEdit" >修改</el-button>
                    </el-form-item>
                  </el-form>


                </el-card>
              </div>
            </div>
          </el-drawer>
          <div class="drawer-mask" v-show="drawerVisible" @click="beforeDrawerClose"></div>
        </div>
      </div>

    </el-header>

    <el-main>
      <NoteCard v-for="(item, index) in notes" :key="item.noteId" :note="item"/>

      <div class="load-more-btn">
        <button @click="getNote" v-if="this.notes.length != 0">加载更多</button>
      </div>


    </el-main>


    <div class="add-btn">
      <el-popover
        placement="top-start"
        popper-class="my-popover-class"
        trigger="hover"
        v-if="popoverVisible"
        @show="setPopoverPosition"
      >

        <el-button slot="reference" icon="el-icon-plus" class="in-btn"></el-button>
        <div class="btn-group">
          <el-tooltip  v-for="(btn, index) in popoverButtons" :key="index" :content="btn.name" placement="top" >
            <el-button
              :icon="btn.icon"
              @click="btn.click"
              class="in-btn-btn"
            >
            </el-button>
          </el-tooltip>
        </div>
      </el-popover>
    </div>

    <el-dialog :visible.sync="articleVisible"
               ref="dialogRef"
               title="创建笔记"
               @close="handleClose"
               :before-close="beforeDrawerClose"
    >
      <article-create />
    </el-dialog>

  </el-container>
</template>

<script>
import ArticleCreate from '@/views/ArticleCreate'
import DescriptionsTooltip from '@/components/DescriptionsTooltip'
import api from '@/api/public'
import fileSave from '@/api/fileSave'
import { setNoteInfo, beforeDrawerClose, handleClose, formatDate } from '@/util/public'
import NoteCard from "@/components/NoteCard.vue";

export default {

  components: {
    ArticleCreate,
    DescriptionsTooltip,
    NoteCard
  },

  name: 'User',

  async created () {

    this.page.userId = this.$route.query.id;

    await this.getUserData()
    await this.getNote();

    if (this.page.userId != null) {

      await api.判断是否是用户自身访问(this.page.userId)
        .then((res) => {

          this.isUserSelf = res.data;
          this.popoverVisible = res.data;
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    } else {
      this.isUserSelf = true;
      this.popoverVisible = true;
    }

    if (!this.isUserSelf) {
      debugger
      const userFom = {
        userId: this.user.userId,
        userVisitNum: (this.user.userVisitNum + 1)
      }
      await api.修改用户信息(userFom)
        .then((res) => {
          this.user.userVisitNum++;
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    }
  },

  data() {

    return {
      articleVisible: false,
      drawerVisible: false,
      isUserSelf: false,
      popoverVisible: false, // Popover 是否可见
      popoverPosition: { x: 0, y: 0 }, // Popover 的位置
      popoverButtons: [ // Popover 内的按钮列表
        { name: '添加文章', icon: 'el-icon-plus', click: this.handleClickBtn1 },
        { name: '文章设置', icon: 'el-icon-setting', click: this.handleClickBtn2 },
        { name: '未完待续', icon: 'el-icon-check', click: this.handleClickBtn3 },
      ],
      user: {
        userId: 10002,
        userName: "???",
        userStatus: "正常",
        userNoteLikeNum: 0,
        userNoteNum: 0,
        userNoteReadNum: 0,
        userReadersNum: 0,
        userVisitNum: 0,
        userIp: "未知",
        userIntroduce: "无",
        userAvatar: "",
        userPhone: "",
        userEmail: "",
        userGender: "未知",
        is_del: "",
      },

      userForm: {
        avatar: "???",
        userId: 10002,
        userName: "???",
        userStatus: "正常",
        userIp: "未知",
        userIntroduce: "无",
        userAvatar: "",
        userPhone: "",
        userEmail: "",
        userGender: "未知",
        is_del: "",
      },

      notes: [],

      page: {
        pageNum: 1,
        pageSize: 10,
        userId: null
      },

      rules: {
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        age: [
          { required: true, message: '请输入年龄', trigger: 'blur' },
          { type: 'number', message: '年龄必须为数字值' }
        ]
      }
    }
  },
  methods: {
    beforeDrawerClose,
    handleClose,

    async getUserData() {

      await api.获取用户信息(this.page.userId)
        .then((res) => {
          this.user = res.data
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      await api.获取用户数据(this.page.userId)
        .then((res) => {
          this.user.userNoteNum = res.data.userNoteNum
          this.user.userNoteLikeNum = res.data.userNoteLikeNum
          this.user.userNoteReadNum = res.data.userNoteReadNum
          this.user.userReadersNum = res.data.userReadersNum
          this.user.userVisitNum = res.data.userVisitNum
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      this.userForm = JSON.parse(JSON.stringify(this.user));
    },

    async getNote() {
      api.获取指定用户的笔记基础信息(this.page)
        .then((res) => {
          if(res.data === null || res.data.length === 0) {
            this.noMore = true;
            this.$message.warning("没有更多了!")

          } else {
            this.notes = this.notes.concat(res.data)
            this.page.pageNum += 1;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },

    toEditProfile() {
      this.$router.push('/EditProfile')
    },

    setPopoverPosition() {
      const { top, left } = this.$el.querySelector('.add-btn').getBoundingClientRect();
      this.popoverPosition = {
        x: left - 150 + 30,
        y: top + 40,
      };
    },
    handleClickBtn1() {
      this.articleVisible = true;
    },
    handleClickBtn2() {
      this.$router.push('/ArticleInfo')
    },
    handleClickBtn3() {
      this.$message.success('点击了按钮3');
    },
    openDrawer() {
      this.drawerVisible = true;
      document.body.style.overflow = "hidden";
    },
    closeDrawer() {
      this.drawerVisible = false;
      document.body.style.overflow = "";
    },


    showDialog() {
      this.dialogVisible = true;
    },



    handleSubmit() {
      this.$refs.form.validate(valid => {
        if (valid) {
          // 提交表单数据
        } else {
          return false;
        }
      });
    },

    handleAvatarChange(param) {
      let form = new FormData();
      form.append("image", param.file);

      fileSave.存储图片(form)
        .then((res) => {
          debugger

          this.$message.success(res.data)
          this.userForm.userAvatar = res.data
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },

    handleEdit() {
      debugger
      api.修改用户信息(this.userForm)
        .then((res) => {
          this.$message.success(res.message)
          this.drawerVisible = false;
          this.user.userAvatar = this.userForm.userAvatar
          this.user.userName = this.userForm.userName
          this.user.userIntroduce = this.userForm.userIntroduce
          this.user.userPhone = this.userForm.userPhone
          this.user.userEmail = this.userForm.userEmail
          this.user.userGender = this.userForm.userGender
        })
        .catch((error) => {
          this.$message.error(error.message)
        })
    },

    toShow(item) {
      this.$router.push(
        {
          path: '/ArticleShow',
          query: { note: item }
        })
    }
  },

  filters: {
    formatDate
  },
}
</script>

<style>
@import "@/assets/css/public.less";

.component {
  position: absolute;
  top: 10px;
  left: 10px;
  font-size: 16px;
  font-weight: bold;
}

.el-header {
  /*background-color: #F3F5FA;*/
  color: #333;
  line-height: 200px;
  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}
.el-main {
  /*background-color: #F3F5FA;*/

  margin-top: 20px;
  margin-left: 10%;
  margin-right: 10%;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.el-aside {
  color: #333;
}

.user-info {
  display: flex;
  justify-content: space-between;
  height: 200px;
}

.info_1 {
  display: flex;
  justify-content: space-between;
  order: 1;
  width: 90%;
  margin-top: 20px;
}

.avatar {
  order: 1;
  width: 40%;
}

.info_2 {
  order: 2;
  align-self: center;
  width: 80%;
}





.user-name {
  height: 40px;
  text-align: left;
  font-size: 24px;
}
.user-introduce {
  height: 60px;
  text-align: left;
  font-size: 10px;

  max-height: 3.6em; /* 两行文字的高度 */
  line-height: 1.8em; /* 行高为文字高度的一半 */

  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical

  /*text-overflow: -o -ellipsis -lastline;*/
  /*overflow: hidden;*/
  /*text-overflow: ellipsis;*/
  /*display: -webkit-box;*/
  /*-webkit-line-clamp: 2;*/
  /*line-clamp: 2;*/
  /*-webkit-box-orient: vertical;*/
}

.user-detail {
  height: 40px;

  display: flex;
  flex-direction: row;
  justify-content: space-between;
}

.user-detail > div {
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 20px;
}

.edit-btn {
  order: 4;
  align-self: center;
}


.add-btn {
  right: 20px;
  bottom: 20px;
  position: fixed;
}

.in-btn {
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

.btn-group {
  display: flex;
  /*flex-direction: column;*/
  width: 50px;
}

/*.in-btn-btn {*/

/*  margin: 5px;*/
/*}*/

/*.el-popover__popper {*/
/*  border-radius: 8px;*/
/*  box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);*/
/*}*/

/*.el-popover__title,*/
/*.el-popover__reference {*/
/*  display: none;*/
/*}*/

.add-btn .el-popover.my-popover-class {
  width: 400px;
  height: 400px

}

.my-drawer-class {
  width: 80%;
  height: 80%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.drawer-content {
  padding: 20px;
}
.drawer-mask {
  position: fixed;
  z-index: 999;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
}

.edit-user-info {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
}
.edit-form {
  width: 400px;
}
.form-title {
  font-size: 24px;
  text-align: center;
  line-height: 50px
}

.avatar-container {
  margin-right: 100px;
  text-align: center;
}

.user-avatar-label{
  margin: auto;
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
}

.avatar-label{
  margin: auto;
}



.avatar-label i {
  position: absolute;
  bottom: 0;
  right: 0;
  display: none;
  font-size: 20px;
  background-color: rgba(255, 255, 255, 0.8);
  border-radius: 50%;
  padding: 5px;
  cursor: pointer;
}

.avatar-label:hover i {
  display: block;
}

.avatar-input {
  display: none;
}

.avatar-image-special {
  width: 100%;
  height: 100%;
}

.el-image-class {
  margin: auto;
  position: relative;
  display: inline-block;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  overflow: hidden;
}

</style>
