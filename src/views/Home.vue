<template>
  <div style="height:100%">
    <el-container>
      <el-header style="background-color:#545c64;">
        <div class="headerLeft">
          <img src="../assets/logo.png" class="myLogo">
          <h2 style="color:#fff;margin-right:auto">校园海滨后台管理系统</h2>
        </div>
        <div style="color:#fff">
           {{lastLoginTime}}
        </div>
        <div class="headerRight">
          <img src="../assets/user.png" style="width:40px;height:40px;border-radius:50%">
          <span style="margin-left:15px;color:#fff">超级管理员</span>
        </div>
      </el-header>
      <el-container>
        <el-aside width="220px">
          <el-col :span="24" style="height:100%;">
            <el-menu
              :default-active="elMenuSelect"
              class="el-menu-vertical-demo"
              @open="handleOpen"
              @close="handleClose"
              @select="handleSelect"
              background-color="#545c64"
              text-color="#fff"
              active-text-color="#ffd04b"
              style="height:100%">
              <el-menu-item index="1">
                <i class="el-icon-location"></i>
                <span slot="title">二手交易内容管理</span>
              </el-menu-item>
              <el-menu-item index="2">
                <i class="el-icon-menu"></i>
                <span slot="title">兼职发布内容管理</span>
              </el-menu-item>
              <el-menu-item index="3">
                <i class="el-icon-document"></i>
                <span slot="title">失物招领内容管理</span>
              </el-menu-item>
              <el-menu-item index="4">
                <i class="el-icon-setting"></i>
                <span slot="title">代取快递内容管理</span>
              </el-menu-item>
              <el-menu-item index="5">
                  <i class="el-icon-s-cooperation"></i>
                  <span slot="title">其它任务内容管理</span>
                </el-menu-item>
            </el-menu>
          </el-col>
        </el-aside>
        <el-main>
          <erShouJiaoYi v-if="elMenuSelect == 1"></erShouJiaoYi>
          <jianZhiFaBu v-if="elMenuSelect == 2"></jianZhiFaBu>
          <shiWuZhaoLing v-if="elMenuSelect == 3"></shiWuZhaoLing>
          <daiQuKuaiDi v-if="elMenuSelect == 4"></daiQuKuaiDi>
          <qiTaRenWu v-if="elMenuSelect == 5"></qiTaRenWu>
        </el-main>
      </el-container>
  </el-container>
  </div>
</template>

<script>
import erShouJiaoYi from '../components/erShouJiaoyi.vue';
import jianZhiFaBu from '../components/jianZhiFaBu.vue';
import shiWuZhaoLing from '../components/shiWuZhaoLing.vue';
import daiQuKuaiDi from '../components/daiQuKuaiDi.vue';
import qiTaRenWu from '../components/qiTaRenWu.vue';
  export default {
    data () {
      return {
          fabuAllData:[],
          fabuNowData:[],
          fabuSelect:0,
          dialogVisible:false,
          nowImg:'',
          elMenuSelect:"1",
          lastLoginTime:null
      }
    },
    mounted () {
      var nowTime = localStorage.getItem('loginTimeNow');
      var lastTime = localStorage.getItem('loginTimeLast');
      console.log(nowTime);
      console.log(lastTime);
      localStorage.setItem('loginTimeLast',nowTime);
      if(nowTime == null) {
        this.$message({
          message:'请先登录！',
          type:'error'
        })
        this.$router.push('/');
      }else {
        if(lastTime !== null) {
          this.lastLoginTime = '上次登录时间:' + lastTime;
        }else {
          this.lastLoginTime = '第一次登录'
        }
      }

    },
    methods: {
      handleOpen(key, keyPath) {
        console.log(key, keyPath);
      },
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      handleSelect(e) {
        this.elMenuSelect = String(e);
      }
    },
      components: {
        erShouJiaoYi,
        jianZhiFaBu,
        shiWuZhaoLing,
        daiQuKuaiDi,
        qiTaRenWu
      }
  }
</script>

<style>
  html,body,#app {
    height: 100%;
    width: 100%;
    padding: 0;
    margin: 0;
  }
  html,body,#app,.el-container {
    height: 100%;
    width: 100%;
    text-align: left;
  }
  .el-header {
    background-color:"#545c64";
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  
  .el-aside {
    background-color: #D3DCE6;
    color: #333;
  }
  
  .el-main {
    background-color: #E9EEF3;
    color: #333;
  }
  .headerLeft {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 30px;
  }
  .myLogo {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    margin-right: 20px;
  }
  .headerRight {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-left: auto;
  }
  
</style>