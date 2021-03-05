<template>
  <div class="login_container">
    <div class="login_box">
      <!-- 头像区 -->
      <div class="head_logo">
        <img src="../assets/logo.png" alt="" />
      </div>
      <!-- 登录表单区 -->
      <!-- label-width 给 label 进行占位 -->
      <!-- <el-form label-width="80px">
                <el-form-item label="活动名称"> -->
      <!-- 1. 在 Form 标签中绑定一个 rules 属性 -->
      <el-form
        ref="loginFormRef"
        label-width="0px"
        class="login_form"
        :model="loginForm"
        :rules="loginFormRules"
      >
        <!-- 用户名 -->
        <!-- 4. 绑定具体规则 -->
        <el-form-item class="icon_self" prop="username">
          <!-- icon 无法进行样式修改 -->
          <el-input
            prefix-icon="iconfont icon-user"
            v-model="loginForm.username"
          ></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item class="icon_self" prop="password">
          <el-input
            prefix-icon="iconfont icon-3702mima"
            v-model="loginForm.password"
            type="password"
          ></el-input>
        </el-form-item>
        <el-form-item class="btns">
          <el-button type="primary" @click="login">登录</el-button>
          <el-button type="info" @click="resetLoginForm">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: "Login",
  data() {
    return {
      loginForm: {
        username: "",
        password: "",
      },
      // 2. 在data中定义规则信息
      loginFormRules: {
        // 验证用户名是否合法
        username: [
          // 3. 详细规则信息
          { required: true, message: "请输入用户名", trigger: "blur" },
          {
            min: 3,
            max: 10,
            message: "长度在 3 到 10 个字符",
            trigger: "blur",
          },
        ],
        // 验证密码是否合法
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          {
            min: 6,
            max: 15,
            message: "长度在 6 到 15 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    login_message({ type, message }) {
      this.$message({
        message: message,
        type: type,
        center: true,
      });
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return;
        // (await this.$http.post('login',this.loginForm)) 会报错
        await this.$http
          .post("login", this.loginForm)
          .then((res) => {
            // console.log(res);
            if (res.data.meta.status == 200) {
              this.login_message({
                type: "success",
                message: "恭喜你，登录成功",
              });
            } else {
              this.login_message({ type: "error", message: res.data.meta.msg });
            }
          })
          .catch((err) => {
            console.log(err);
          });
      });
    },
  },
};
</script>

//
elementUI默认全局样式覆盖局部样式，当需要修改某一些样式时，可以同时声明全局样式和局部样式，在全局样式中进行修改
// 但是为了避免全局都产生变化，可以使用类名进行深度嵌套
<style lang="scss">
.icon_self .el-input__prefix {
  margin-left: 3px;
}
</style>

<style lang="scss" scoped>
.login_container {
  background-color: #2b4b6b;
  height: 100%;
  position: relative;
  .login_box {
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    .head_logo {
      width: 130px;
      height: 130px;
      border: 1px solid #eee;
      border-radius: 50%;
      padding: 10px;
      box-shadow: 0 0 10px #ddd;
      position: absolute;
      left: 50%;
      transform: translate(-50%, -50%);
      background-color: #fff;
      img {
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: #eee;
      }
    }
    .btns {
      display: flex;
      justify-content: flex-end;
    }
    .login_form {
      position: absolute;
      bottom: 0;
      width: 100%;
      padding: 0 20px;
      box-sizing: border-box;
    }
    .icon-3702mima {
      left: 3px;
    }
  }
}
</style>
