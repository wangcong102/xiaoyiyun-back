<template>
    <div id="app">
        <div class="login">
            <div class="title">校园海滨后台管理系统登录</div>
            <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="账号">
                <el-input v-model="form.username" style="width:250px"></el-input>
            </el-form-item>
            <el-form-item label="密码">
                <el-input v-model="form.password" style="width:250px"></el-input>
            </el-form-item>
            <el-form-item style="margin-top:30px">
                <el-button type="primary" @click="onSubmit">登录</el-button>
            </el-form-item>
            </el-form>
        </div>
    </div>
</template>

<script>
const util = require('../util.js');
    export default {
        data () {
            return {
                form: {
                    username:'',
                    password:''
                }
            }
        },
        created () {
        },
        methods: {
            async onSubmit() {
                console.log('submit!');
                console.log('username:',this.form.username);
                console.log('password',this.form.password);

                var result = await this.$http.post('http://localhost:8888/login',{
                    username:this.form.username,
                    password:this.form.password
                })
                this.form.username = '';
                this.form.password = '';
                console.log(result);
                if(result.data) {
                    this.$message({
                        message:'登录成功',
                        type:'success'
                    })
                    localStorage.setItem('loginTimeNow',util.formatTime(new Date()))
                    this.$router.push('/Home');
                }else {
                    this.$message({
                        message:'账号或密码错误',
                        type:'error'
                    })
                }
            }
        }
    }
</script>

<style scoped>
 html,body,#app {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
    background-color: #000;
    display: flex;
    justify-content: center;
    align-items: center;
}
.login {
    width: 500px;
    height: 400px;
    background-color: #fff;
    text-align: center;
    display: flex;
    flex-direction: column;
    align-items: center;
}
.title {
    padding-top: 45px;
    margin-bottom: 50px;
    font-weight: bold;
    font-size: 22px;
}
.el-form {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-right: 30px;
}

</style>