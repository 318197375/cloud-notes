<template>
  <div id="background">
    <div class="message-page">
      <div class="left-layout">
        <div class="message-center">管理中心</div>
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

          <el-button type="primary" icon="el-icon-circle-plus-outline" v-if="show === 'role'"  @click="showRoleDialog" style="margin-right: 11px">添加角色</el-button>
        </div>

        <!--        <el-divider></el-divider>-->

        <div class="message-list" v-if="show === 'power'">
          <el-collapse v-model="powerActiveName" v-for="(power, index) in powers" :key="index" accordion>
            <el-collapse-item  :name="index" class="deploy-setting">
              <template slot="title">
                <span style="width: 100%; text-align: center"> {{power.key}}</span>
              </template>
              <div class="card-container-desc" >
                <div class="card-content-desc">
                  接口描述
                </div>
                <div class="card-content-desc">
                  接口请求方式
                </div>
                <div class="card-content-desc">
                  接口URL
                </div>
                <div class="card-content-desc">
                  是否已经存入权限表
                </div>
              </div>


              <div class="card-container" v-for="(powerInfo, index2) in power.value" :key="index2">
                <div class="card-content">
                  {{powerInfo.powerInfo}}
                </div>
                <div class="card-content">
                  {{powerInfo.uriRequestMethod}}
                </div>
                <div class="card-content">
                  {{powerInfo.powerUri}}
                </div>
                <div class="card-content">
                  <el-switch
                    style="display: block"
                    v-model="powerInfo.isSave"
                    active-color="#13ce66"
                    inactive-color="#ff4949"
                    active-text="已入库"
                    inactive-text="未入库"
                    @change="changePowerInfo(powerInfo, index, index2)"
                  >
                  </el-switch>
                </div>

              </div>
            </el-collapse-item>
          </el-collapse>
        </div>


        <div class="message-list" v-if="show === 'role'">

          <el-collapse v-model="roleActiveName" v-for="(role, index) in roles" :key="index" accordion @change="selectRole(role)">
            <el-collapse-item  :name="index" class="deploy-setting"  >
              <template slot="title">
                <span style="width: 100%; text-align: center"> {{role.roleName}} {{role.roleInfo}}</span>
                <el-button type="danger" icon="el-icon-edit" @click="deleteRole(role)" style="">删除角色</el-button>
                <el-button type="primary" icon="el-icon-edit" @click="setPower(role)" style="">管理权限</el-button>
              </template>


              <div class="card-container" v-for="(powerInfo, index2) in selectPowers" :key="index2">
                <div class="card-content">
                  {{powerInfo.powerInfo}}
                </div>
                <div class="card-content">
                  {{powerInfo.uriRequestMethod}}
                </div>
                <div class="card-content">
                  {{powerInfo.powerUri}}
                </div>
              </div>


            </el-collapse-item>
          </el-collapse>
        </div>


        <el-dialog
          title="权限管理"
          :visible.sync="dialogVisible"
          width="60%"
          :before-close="handleClose"
          append-to-body
        >
          <div class="edit_dev">
          <el-transfer
            filterable
            filter-placeholder="请输入权限关键词"
            v-model="transferSelectPowers"
            :data="transferTablePowers"
            :titles="['库权限', '用户权限']"
            :button-texts="['删除权限', '添加权限']"
            @change="transferSelect"
          >

          </el-transfer>
          </div>


        </el-dialog>


        <el-dialog
          title="添加角色"
          :visible.sync="addRoleVisable"
          width="30%"
          :before-close="handleClose"
          append-to-body
        >
            <el-input v-model="addRole.roleName" placeholder="请输入角色名称" ></el-input>
            <el-input v-model="addRole.roleInfo" placeholder="请输入角色描述" style="margin-top: 20px"></el-input>
            <el-button type="primary" icon="el-icon-edit" @click="addRoleInfo" style="margin-top: 20px; margin-left: 35%">添加角色</el-button>
        </el-dialog>


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
        { id: 1, name: '权限管理' },
        { id: 2, name: '角色管理' },
      ],
      selectedCollectType: "权限管理",
      show: "power",

      doSelectPower: false,
      doSelectRole: false,

      powers: [
        {
          powerName: '',
          powerInfo: []
        }
      ],

      powerActiveName: '1',
      roleActiveName: '1',


      tablePowers: [
        {

        }
      ],

      roles: [

      ],

      selectPowers: [],

      transferTablePowers: [
        {

        }
      ],

      transferSelectPowers: [
      ],

      addRole: {
        roleName: null,
        roleInfo: null
      },

      roleId: null,

      test: true,

      dialogVisible: false,
      addRoleVisable: false,
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
        if(!this.doSelectPower) {
          this.powers = [];

          let resPowers = [];
          await api.获取系统所有的API()
            .then((res) => {
              resPowers = res.data
            })
            .catch((error) => {
              this.$message.error(error.message)
            });


          // 初始化一个空对象用于存储分组后的列表
          const groupedData = {};
          // 遍历数组中的每个对象
          resPowers.forEach(obj => {
            // 提取 uri 中两个斜杠之间的值
            const key = obj.powerUri.match(/\/([^/]+)\//)[1];

            // 如果该值对应的列表不存在，则创建一个空数组
            if (!groupedData[key]) {
              groupedData[key] = [];
            }

            // 将当前对象添加到对应的列表中
            groupedData[key].push(obj);
          });

          // groupedData 现在包含了按照 /message/ 两个斜杠中间的值分组的列表
          this.powers = Object.entries(groupedData).map(([key, value]) => ({key, value}));
          this.doSelectPower = true;
        }

        this.show= "power"
      } else if(index === 2) {
        this.tablePowers = []
        await api.获取权限表中的所有数据()
          .then((res) => {
            this.tablePowers = res.data
          })
          .catch((error) => {
            this.$message.error(error.message)
          });

        if(!this.doSelectRole) {
          this.roles = []

          await api.获取所有的角色信息()
            .then((res) => {
              this.roles = res.data
            })
            .catch((error) => {
              this.$message.error(error.message)
            });
          this.doSelectRole = true;
        }
        this.show= "role"

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

    errorHandler() {
      return true
    },

    changePowerInfo(powerInfo, index, index2) {
      // 先将已改变的isSave变回来

      const powers = [];
      powers.push(powerInfo)

      console.log(powerInfo)
      if(!powerInfo.isSave) {
        this.$confirm("确定要将该权限: [" + powerInfo.powerInfo + "] 从库中删除吗", "警告", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }).then(async () => {

          await api.指定Api从权限表删除(powers)
            .then((res) => {
              this.$message.success(res.message)
            }).catch((error) => {
              this.$message.error(error.message)
              powerInfo.isSave = !powerInfo.isSave
            });
        }).catch(() => {
          powerInfo.isSave = !powerInfo.isSave
        });
      } else {
        this.$confirm("确定要将该权限: " + powerInfo.powerInfo + " 入库吗？", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "success",
        }).then(async () => {
          await api.将指定Api入库权限表(powers)
            .then((res) => {
              this.$message.success(res.message)
              this.powers[index].value[index2].powerId = res.data[0].powerId;
            }).catch((error) => {
              this.$message.error(error.message)
              powerInfo.isSave = !powerInfo.isSave
            });
        }).catch(() => {
          powerInfo.isSave = !powerInfo.isSave
        });
      }

    },

    async selectRole (role) {

      let powerIds = [];
      await api.根据角色ID获取角色的权限信息(role)
        .then((res) => {
          debugger

          powerIds = res.data
        })
        .catch((error) => {
          this.$message.error(error.message)
        });

      debugger

      this.selectPowers = this.tablePowers.filter(tablePower => powerIds.includes(tablePower.powerId));
    },

    async setPower (role) {
      await this.selectRole(role);
      this.roleId = role.roleId;

      debugger
      this.dialogVisible = true;
      // 将表格和用户自身的power进行处理, 以符合穿梭框格式

      // 右侧
      this.transferSelectPowers = this.selectPowers.map(power => power.powerId);

      // 左侧
      this.transferTablePowers = this.tablePowers.map(power => ({
        key: power.powerId,
        label: power.powerInfo,
      }));
    },

    async deleteRole(roleInfo) {
      await api.将指定角色删除(roleInfo)
        .then((res) => {
          debugger
          this.$message.success(res.message)
          this.roles = this.roles.filter(role => role !== roleInfo);
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },

    async transferSelect (value, direction, movedKeys) {
      let res = {
        roleIds: [],
        powerDTOS: [
          {
            powerId: null,
            powerInfo: "",
            powerUri: "",
            uriRequestMethod: ""
          }
        ]
      };

      res.roleIds.push(this.roleId);
      res.powerDTOS = this.tablePowers.filter(power => movedKeys.includes(power.powerId));


      if (direction === 'left') {
        // 向左移动, 删除权限
        await api.将指定角色的指定权限删除(res)
          .then((res) => {
            this.$message.success(res.message)
          })
          .catch((error) => {
            this.$message.error(error.message)
          });

      } else {
        // 向右移动, 添加权限
        // let


        await api.将指定权限分配给角色(res)
          .then((res) => {
            this.$message.success(res.message)
          })
          .catch((error) => {
            this.$message.error(error.message)
          });
      }
    },

    showRoleDialog() {
      this.addRoleVisable = true;
    },

    async addRoleInfo () {
      await api.新建角色(this.addRole)
        .then((res) => {
          debugger
          this.$message.success(res.message)
          this.roles = this.roles.concat(res.data)
          this.addRoleVisable = false;
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },


    handleClose(done) {
      this.$confirm('确认关闭？')
        .then(_ => {
          done();
        })
        .catch(_ => {});
    },
  }
};
</script>

<style scoped>
#background {
  width: 100%;
  background-image: url("../../src/assets/images/权限管理.jpg");
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

  justify-content: space-between;
}

.selected-type {
  font-weight: bold;
  text-align: center;
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
  margin-right: 18px;
}

.to-name {
  color: #409EFF;
  margin-left: 5px;
  margin-right: 5px;
}

.card-container-desc {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 10px 10px;
}

.card-content-desc {
  flex: 1;
  display: flex;
  align-items: center;
  color: #409EFF;
  font-size: 20px;
  margin-left: 10px;

}

.card-container {
  display: flex;
  justify-content: space-between;
  margin: 10px 10px 10px 10px;
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.el-collapse-item {
  margin: 10px 0 10px 0;
}


.edit_dev >>> .el-transfer-panel {
  width:300px;
}
</style>
