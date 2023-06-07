<template >
  <div class="login-class" >
    <div class="login_box">
      <p class="login_title">
        <span :class="isActiveIndex === 0 ? 'isActiveTitle' : ''" @click="accountLogin">账号登录</span><!-- 利用三元运算符判定点击了哪个登录,从而绑定样式 -->
<!--        <span :class="isActiveIndex === 1 ? 'isActiveTitle' : ''" @click="smsLogin">短信登录</span>-->
      </p>
      <el-form v-if="isActive" ref="loginForm"
               :model="loginForm"
               :rules="rules"
               label-width="80px">

        <el-form-item label="账号：" prop="userName" style="margin-right: 30px">
          <el-input v-model="loginForm.userName"
                    type="input"
                    placeholder="请输入账号"></el-input>
        </el-form-item>

        <el-form-item label="密码：" prop="userPassword" style="margin-right: 30px">
          <el-input v-model="loginForm.userPassword" placeholder="请输入密码"  type="password" show-password></el-input>
        </el-form-item>

        <p class="login_agree"><el-checkbox v-model="loginForm.agree">我已阅读并同意<a>《用户服务协议》</a>、<a>《隐私权政策》</a></el-checkbox></p>
        <el-button  :loading="isLogining" class="login_btn" @click="submitForm('loginForm')">立 即 登 录</el-button>
        <p style="text-align:right;margin-top:10px;margin-right: 30px">
          <router-link to="/RePwd">忘记密码?</router-link></p>
        <p style="text-align:center; margin-top:40px">第三方登录或
          <router-link to="/Register">立即注册</router-link>
        </p>
      </el-form>



<!--      <el-form v-else ref="loginForm2" :model="loginForm2" label-width="80px">-->
<!--        <el-form-item label="手机号：">-->
<!--          <el-input v-model="loginForm2.phone" placeholder="请输入手机号"></el-input>-->
<!--        </el-form-item>-->
<!--        <el-form-item label="验证码：">-->
<!--          <el-input v-model="loginForm2.verifyCode" style="width:60%; margin-right:55px" placeholder="请输入验证码"></el-input>-->
<!--          <el-button>获取验证码</el-button>-->
<!--        </el-form-item>-->

<!--        <p class="login_agree"><el-checkbox v-model="loginForm.agree">>我已阅读并同意<a>《用户服务协议》</a>、<a>《隐私权政策》</a></el-checkbox></p>-->
<!--        <el-button class="login_btn" >立 即 登 录</el-button>-->
<!--        <p style="text-align:right; margin-top:10px"><a>忘记密码？</a></p>-->
<!--        <p style="text-align:center; margin-top:40px">第三方登录或-->
<!--          <router-link to="/Register">立即注册</router-link>-->
<!--        </p>-->
<!--      </el-form>-->
    </div>
  </div>

</template>
<script>
import api from '@/api/public'
export default {
  data () {
    const phoneReg = /0?(13|14|15|18|17)[0-9]{9}/
    const acReg = /[A-Za-z0-9_\-\u4e00-\u9fa5]+/

    const checkAc = (rule, value, callback) => {

      if (!value) {
        return callback(new Error('请输入账号'))
      }
      if (acReg.test(value)) {
        return callback()
      }
      return callback(new Error('账号格式不正确!'))
    }

    const checkPhone = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入手机号'))
      }
      if (phoneReg.test(value)) {
        return callback()
      }
      return callback(new Error('手机号格式不正确!'))
    }

    const checkPwd = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入密码'))
      } else {
        callback()
      }
    }
    return {
      isActive: true, // 用于实现切换登录，作为判断
      isActiveIndex: 0,
      loginForm: {
        userName: '',
        userPassword: '',
        agree: ''
      },
      loginForm2: {
        phone: '',
        verifyCode: '',
        agree: ''
      },
      rules: {
        userName: [{ validator: checkAc, trigger: 'blur' }],
        phone: [{ validator: checkPhone, trigger: 'change' }],
        userPassword: [{ validator: checkPwd, trigger: 'blur' }]
      },
      isLogining: false
    }
  },
  methods: {
    checkAgree() {
      if (!this.loginForm.agree) {
        this.$message({
          message: '请勾选用户服务协议和隐私权政策',
          type: 'warning'
        })
        return false;
      }
      return true;
    },

    accountLogin() { // 账号登录
      this.isActive = true
      this.isActiveIndex = 0
    },
    smsLogin() { // 短信登录

      this.isActive = false
      this.isActiveIndex = 1
    },

    submitForm (formName) {
      if(this.checkAgree()) {

        this.$refs[formName].validate(async (valid) => {

          if (valid) {
            this.isLogining = true

            await api.login(this.loginForm)
              .then((res) => {
                // this.$store.dispatch('setUserInfo', res.result)
                // sessionStorage.setItem('setUserInfo', res.result.token)
                // sessionStorage.setItem('first', 0)
                this.$message.success(res.message)

                this.$router.push({
                  path: '/',
                  query: {
                    isAdmin: res.data.isAdmin
                  }
                })
              })
              .catch((error) => {
                this.$message.error(error.message)
              })

            this.isLogining = false;
            return true;
          } else {
            this.$message({
              message: '格式错误!',
              type: 'warning'
            })
          }
          return false
        })
      }
    }
  }
}
</script>


<style scoped>
.login_box{
  width: 450px;
  height: 400px;
  background-color: #dcdcdc;
  border-radius: 18px;
  padding: 30px 30px 30px 30px;
  margin: auto;
}
.login_title{
  text-align: center;
  margin: 30px 30px 40px 50px;
  font-size: 24px;
  color: #666;
}
.login_title span{
  margin: 0 20px 0 20px;
  cursor: pointer;
}
.login_title span:hover{
  color: #333;
  font-weight: bolder;
}
.isActiveTitle{
  color: #333;
  font-weight: bolder;
}
.login_agree{
  margin-left: 30px;
}
.login_btn{
  width: 40%;
  height: 40px;
  margin: 0 0 0 10px;
  background-color: #409eff;
  color: #fff;
}

.login-class {
  display: flex;
  justify-content: center;
  align-items: center;
  background-image: url("../../src/assets/images/bg.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  border: none;
  padding: 0;
  height: 100vh;
}
</style>
