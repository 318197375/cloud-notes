<template>
  <div style="margin-top: 200px">
    <div style="width: 900px; margin: auto;">
    <el-steps :active="activeStep" align-center >
      <el-step title="确认用户" description="第一步"></el-step>
      <el-step title="获取验证码" description="第二步"></el-step>
      <el-step title="修改密码" description="第三步"></el-step>
    </el-steps>
    </div>

    <div class="step-content">
      <div v-if="activeStep === 0">
        <el-input
          v-model="userName"
          placeholder="输入用户名称"
          @blur="checkUserName"
          :suffix-icon="userNameIcon"
          style="width: 300px; border: #409eff solid 1px"
        ></el-input>
        <i class="el-icon-check" style="margin-left: 10px; font-size: 25px; color: #67C23A" v-if="existUser"></i>
        <i class="el-icon-close" style="margin-left: 10px; font-size: 25px; color: #c0504d" v-if="!existUser"></i>
      </div>
      <div v-else-if="activeStep === 1">
        <el-input v-model="verificationCode" placeholder="输入验证码" style="width: 100px; margin-right: 20px; border: #409eff solid 1px"></el-input>
        <el-button :disabled="disableButton" @click="getVerificationCode">{{ buttonText }}</el-button>
        <i class="el-icon-check" style="margin-left: 10px; font-size: 25px; color: #67C23A" v-if="existSendCode"></i>

      </div>

      <div v-else-if="activeStep === 2" style="display: flex;flex-direction: column;">
        <el-input v-model="newPassword" show-password placeholder="输入新密码" class="repwd-pwd-class" ></el-input>
        <el-input v-model="confirmPassword" show-password placeholder="输入确认密码" class="repwd-pwd-class"></el-input>
        <el-button class="modify-button" @click="modifyPassword" v-if="activeStep === 2">修改</el-button>
      </div>
    </div>



    <div >
      <el-button style="margin-top: 12px;" @click="back" v-if="activeStep > 0">上一步</el-button>

      <el-button style="margin-top: 12px;" @click="next" v-if="activeStep < 2">下一步</el-button>
    </div>


  </div>
</template>


<script>
import api from '@/api/public'

export default {
  data() {
    return {
      activeStep: 0,
      userName: '',
      verificationCode: '',
      countdown: 60,
      newPassword: '',
      confirmPassword: '',
      buttonText: '获取验证码',
      existUser: false,
      existSendCode: false,
      disableButton: false,
      userDTO: {

      }
    };
  },
  computed: {
  },
  methods: {
    back() {
        this.activeStep--;
    },
    next() {
      if(this.activeStep === 0) {
        if(this.existUser) {
          this.activeStep++;
        } else {
          this.$message.warning("您需要输入正确的用户名")
        }
      } else if(this.activeStep === 1){
        if(this.existSendCode) {
          this.activeStep++;
        } else {
          this.$message.warning("您需要发送一个验证码, 以确定是用户本人")
        }
      } else {
        this.activeStep++;
      }
    },

    async checkUserName () {
      const userInfo = {
        userName: this.userName
      }
      await api.验证用户是否存在(userInfo)
        .then((res) => {
          debugger
          if (res.data == null) {
            this.$message.error("您输入的用户不存在!")
          } else {
            this.userDTO = res.data;
            this.existUser = true;
          }
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
    },
    async getVerificationCode () {
      this.disableButton = true; // 禁用按钮
      this.buttonText = `${this.countdown}秒后重新获取`;

      const userDTO = {
        userEmail: this.userDTO.userEmail
      }
      await api.发送找回密码验证码(userDTO)
        .then((res) => {
          this.$message.success(res.message)
          this.existSendCode = true;
        })
        .catch((error) => {
          this.$message.error(error.message)
        });
      this.existSendCode = true;


      // 启动定时器，每秒减少倒计时时间
      const timer = setInterval(() => {
        this.countdown--;

        if (this.countdown === 0) {
          clearInterval(timer);
          this.disableButton = false; // 启用按钮
          this.buttonText = '获取验证码';
          this.countdown = 60;
        } else {
          this.buttonText = `${this.countdown}秒后重新获取`;
        }
      }, 1000);



    },
    modifyPassword() {
      // Call API to modify password
      // Handle success response

      if(this.newPassword === this.confirmPassword) {
        const userInfo = {
          userId: this.userDTO.userId,
          userPassword: this.newPassword,
          verificationCode: this.verificationCode
        }
        api.修改用户密码(userInfo)
          .then((res) => {
            this.$message.success(res.message)
            this.$nextTick(() => {
              // 在下一个 DOM 更新周期执行刷新操作
              this.$router.push({
                path: '/Login',
              });
            });
          })
          .catch((error) => {
            this.$message.error(error.message)
          });
      } else {
        this.$message.error("两次密码输入的不一致!");
      }
    },
  },
};
</script>



<style scoped>
.step-content {
  margin-top: 100px;
  height: 200px;
}

.modify-button {
  margin: 20px auto 0 auto;
}

.repwd-pwd-class {

  margin: 20px auto 0 auto;
  width: 200px;
  border: #409eff solid 1px
}
</style>
