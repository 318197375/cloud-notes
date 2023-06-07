<template>
  <div class="page-register">

    <div class="register_box">
      <el-form
        ref="ruleForm"
        :model="ruleForm"
        :rules="rules"
        label-width="100px"
        class="demo-ruleForm"
        autocomplete="off"
      >
        <p class="register_title">
          <span >注册</span>
        </p>

        <el-form-item label="用户名" prop="name">
          <el-input v-model="ruleForm.name" />
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="ruleForm.email" />
        </el-form-item>

        <el-form-item label="验证码" prop="code">
          <el-input v-model="ruleForm.code" style="width: 40%; margin-right: 20%" />
          <el-button :disabled="disableButton" @click="sendMsg" style="width: 40%; background: #409eff; color: #F3F5FA">{{ buttonText }}</el-button>

        </el-form-item>
        <el-form-item label="密码" prop="pwd">
          <el-input v-model="ruleForm.pwd" type="password" />
        </el-form-item>
        <el-form-item label="确认密码" prop="cpwd">
          <el-input v-model="ruleForm.cpwd" type="password" />
        </el-form-item>
      </el-form>

      <el-button type="primary" size="small" @click="register">注册</el-button>


      <header style="margin-top: 20px">
        <span class="login">
          <em class="bold">已有账号？</em>
          <a href="/Login">
            <el-button type="primary" size="small">登录</el-button>
          </a>
        </span>
      </header>
    </div>
  </div>
</template>

<script>

import api from '@/api/public'
import Router from '@/router'

export default {
  data() {
    return {
      step: 2,
      active: 0,
      buttonText: '发送验证码',
      disableButton: false,
      countdown: 60,

      error: '',
      ruleForm: {
        textarea: '请仔细阅读以下协议',
        agreed: false,
        name: '',
        code: '',
        pwd: '',
        cpwd: '',
        email: ''
      },
      rules: {
        agreed: [{
          validator: (rule, value, callback) => {
            if (value !== true) {
              callback(new Error('请确认同意注册协议'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }],
        name: [{
          required: true,
          type: 'string',
          message: '请输入用户名',
          trigger: 'blur'
        }],
        email: [{
          required: true,
          type: 'email',
          message: '请输入邮箱',
          trigger: 'blur'
        }],
        pwd: [{
          required: true,
          message: '创建密码',
          trigger: 'blur'
        }],
        cpwd: [{
          required: true,
          message: '确认密码',
          trigger: 'blur'
        }, {
          validator: (rule, value, callback) => {
            if (value === '') {
              callback(new Error('请再次输入密码'))
            } else if (value !== this.ruleForm.pwd) {
              callback(new Error('两次输入密码不一致'))
            } else {
              callback()
            }
          },
          trigger: 'blur'
        }]
      }
    }
  },
  layout: 'blank',
  methods: {
    async sendMsg() {

      let namePass = false
      let emailPass = false


      await this.$refs['ruleForm'].validateField('name',  (valid) => {
        if (valid === "" || valid === null) {
          namePass = true;
        } else {
          namePass = false;
        }
      })

      if(namePass) {
        await api.判断用户是否被注册(this.ruleForm.name)
          .then(async (res) => {

            if (res.data === false) {
              this.$message.warning("该用户名已被注册!")
            }
            namePass = res.data;
          })
          .catch((error) => {
            namePass = false;
            this.$message.error(error.message)
          });
      }

      if (!namePass) {
        return false
      }

      this.$refs['ruleForm'].validateField('email', (valid) => {
        if (valid === "" || valid === null) {
          emailPass = true;
        } else {
          emailPass = false;
        }
      })

      debugger

      // 模拟验证码发送
      if (namePass && emailPass) {
        debugger
        const userDTO = {
          userEmail: this.ruleForm.email
        }
        await api.发送注册验证码(userDTO)
          .then((res) => {
            this.$message.success(res.message)
          })
          .catch((error) => {
            this.$message.error(error.message)
          });


        this.disableButton = true; // 禁用按钮
        this.buttonText = `${this.countdown}秒后重新获取`;

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
      }
    },

    next: function() {
      if (this.active === 0) {
        this.$refs['ruleForm'].validateField('agreed', (valid) => {
          if (valid === '') {
            this.active++
          }
        })
      }
    },
    prev: function() {
      if (--this.active < 0) this.active = 0
    },

    // 模拟登录
    register: function() {
      this.$refs['ruleForm'].validate((valid) => {
        if (valid) {

          const userInfo = {
            userName: this.ruleForm.name,
            userPassword: this.ruleForm.pwd,
            userEmail: this.ruleForm.email,
            verificationCode: this.ruleForm.code
          }

          api.用户注册(userInfo)
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

        }
      })
    }
  }
}
</script>

<style  rel="stylesheet/scss" lang="scss">

.register_box{
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, -20%);

  width: 450px;
  height: 400px;
  background-color: #dcdcdc;
  border-radius: 18px;
  padding: 30px 50px 30px 30px;
  margin-top: 120px;

}

.register_title {
  text-align: center;
  margin: 20px 20px 20px 20px;
  font-size: 24px;
  color: #666;
}
.page-register {
  background-image: url("../../src/assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  padding: 0;
  height: 100vh;
}


//.page-register {
//
//
//  .header {
//    //border-bottom: 2px solid rgb(235, 232, 232);
//    min-width: 980px;
//    color: #666;
//
//    header {
//      margin: 10px auto;
//      padding: 10px 0;
//      width: 980px;
//
//      .login {
//        margin-top: 10px;
//        float: right;
//      }
//
//      .bold {
//        font-style: normal;
//      }
//    }
//  }
//
//  .register {
//    color: #1890ff;
//  }
//
//  a {
//    color: #1890ff;
//    text-decoration: none;
//    background-color: transparent;
//    outline: none;
//    cursor: pointer;
//    transition: color 0.3s;
//  }
//
//  > section {
//    margin: 0 auto 30px;
//    padding-top: 30px;
//    width: 980px;
//    min-height: 300px;
//    padding-right: 550px;
//    box-sizing: border-box;
//
//    .status {
//      font-size: 12px;
//      margin-left: 20px;
//      color: #e6a23c;
//    }
//
//    .error {
//      color: red;
//    }
//  }
//
//  .footer{
//    text-align: center;
//  }
//}
</style>

