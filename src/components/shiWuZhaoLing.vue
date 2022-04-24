<template>
    <div>
        <div class="elMainTop">
            <div :class='["elMainTopBlock",lostSelect == index ? "elMainTopBlockSelect" : "" ]' v-for="(item,index) in blockArray" :key="index"  @click="selectBlock(item.name)">
              <img :src="item.imgSrc">
              <div class="elMainTopBlockB">
                <span style="margin-bottom:8px">{{item.name}}</span>
                <span>{{item.num}}</span>
              </div>
            </div>
          </div>
            <!-- openId、array1、faxaindeshijian、lianxifangshi2、see、wupinmiaoshu -->
            <div class="elMainTable" style="margin-top:20px">
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0,0,0,0.8)"
                :data="lostNowData"
                border
                style="width: 100%">
                <el-table-column
                  prop="_openid"
                  label="openId"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="array1"
                  label="发现地点"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="faxiandeshijian"
                  label="发现时间"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="wupinmiaoshu"
                  label="物品描述">
                </el-table-column>
                <el-table-column
                  prop="see"
                  label="物品浏览量">
                </el-table-column>
                <el-table-column
                  prop="lianxifangshi2"
                  label="联系方式">
                </el-table-column>
                <el-table-column
                  label="物品图片">
                  <template slot-scope="scope">
                    <el-button @click="seeImg(scope)" type="primary" size="mini">查看图片</el-button>
                  </template>
                </el-table-column>
                <el-table-column
                  label="管理数据">
                  <template slot-scope="scope">
                    <el-popconfirm
                        title="这是一项数据确定删除吗？"
                        @confirm="deleteTrue(scope)">
                        <el-button slot="reference"  type="danger">删除</el-button>
                    </el-popconfirm>
                    <el-popconfirm
                        title="是否通过审核？"
                        confirm-button-text="通过"
                        confirm-button-type="success"
                        cancel-button-text="不过"
                        cancel-button-type="danger"
                        @cancel="toCheck(scope,'fail')"
                        @confirm="toCheck(scope,'success')">
                        <el-button slot="reference" size="mini" :disabled="scope.row.shenhe !== '审核中' " type="success">审核</el-button>
                    </el-popconfirm>
                  </template>
                </el-table-column>
              </el-table>
              <el-pagination
                background
                layout="prev, pager, next"
                :total="total"
                :current-page="currentPage"
                :page-size="pageSize"
                @current-change="currentChange">
              </el-pagination>
            </div>
          <el-dialog
            title="提示"
            :visible.sync="dialogVisible"
            width="30%"
            :before-close="handleClose">
            <el-image
            style="width: 250px; height: 250px;"
            :src="nowImg"
            fit="fill"></el-image>
            <span slot="footer" class="dialog-footer">
              <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
            </span>
          </el-dialog>
    </div>
</template>

<script>
    export default {
        data () {
            return {
                blockArray:[
                {
                    imgSrc:require('../assets/all.png'),
                    name:'全部数据',
                    num:0
                },
                {
                    imgSrc:require('../assets/shenhe.png'),
                    name:'待审核',
                    num:0
                },
                {
                    imgSrc:require('../assets/success.png'),
                    name:'审核通过',
                    num:0
                },
                {
                    imgSrc:require('../assets/fail.png'),
                    name:'审核失败',
                    num:0
                }
                ],
                lostAllData:[],
                lostNowData:[],
                lostSelect:0,
                nowImg:'',
                dialogVisible:false,
                total:0,
                pageSize:10,
                currentPage:1, 
                loading:true
            }
        },
     mounted () {
      this.getLost();
     },
     methods: {
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      async getLost () {
        var res = await this.$http.get('http://localhost:8888/lostAndFount');
        var array = [];
        // 计算全部数据,待审核,审核通过,审核失败的数量
        var a1 = res.data.length,a2 = 0,a3 = 0,a4 = 0;
        res.data.forEach(item => {
          if(item.shenhe == '审核中') {
            a2++;
          }else if(item.shenhe == '通过') {
            a3++;
          }else if(item.shenhe == '失败') {
            a4++;
          }
        })
        this.blockArray[0].num = a1;
        this.blockArray[1].num = a2;
        this.blockArray[2].num = a3;
        this.blockArray[3].num = a4;
        console.log('lostAndFound',res);
        this.lostAllData = res.data;
        this.total = res.data.length;
        if(res.data.length < 10) {
          for(var i = 0; i < res.data.length; i++) {
            array.push(res.data[i]);
          }   
        }else {
          for(var i = 0; i < 10; i++) {
            array.push(res.data[i]);
          }   
        }
        this.lostNowData = array;
        this.loading = false;
      },
      seeImg(res) {
          console.log(res.row.fileList1);
          this.dialogVisible = true;
          this.nowImg = res.row.fileList1;
      },
      selectBlock(res) {
          var name = '';
          var selectData = [];
          console.log(res);
          if(res == '全部数据') {
            this.lostNowData = this.lostAllData;
            this.lostSelect = 0;
          }else if(res == '待审核') {
            name = '审核中'
            this.lostSelect = 1;
          }else if(res == '审核通过') {
            name = '通过'
            this.lostSelect = 2;
          }else if(res == '审核失败') {
            name = '失败'
            this.lostSelect = 3;
          }
          if(name !== ''){
            selectData = this.lostAllData.filter((item,index,array) => {
              return item.shenhe == name;
            })
            console.log('selectData',selectData);
            this.lostNowData = selectData;
          }
        },
        currentChange(currentPage) {
          console.log(currentPage);
          var array = [];
          this.currentPage = currentPage;
          if(parseInt(this.lostAllData.length/10)+1 == currentPage) {
            console.log('if',this.lostNowData);
            for(var i = (currentPage -1)*this.pageSize; i < this.lostAllData.length; i++) {
              array.push(this.lostAllData[i]);
            }
          }else {
            console.log('else',this.lostNowData);
            for(var i = (currentPage-1)*this.pageSize; i < currentPage*this.pageSize; i++) {
              array.push(this.lostAllData[i]);
            }
          }
          this.lostNowData = array;          
        },
        async deleteTrue(e) {
          var id = e.row._id;
          console.log('要删除这项数据ID是',id);
          var res = await this.$http.post('http://localhost:8888/deleteData',{
            id:id,
            name:'shiwuzhaoling'
          });
          if(res.data == 'ok') {
            this.$message({
              message:'恭喜你,删除成功!',
              type:'success'
            })
            this.getLost();
          }else{
            this.$message({
              message:'删除失败,请联系开发者查明原因!',
              type:'error'
            })
          }
        },
        async toCheck(e1,e2) {
          var id = e1.row._id;
          var status = e2;
          var callBackStatus = await this.$http.post('http://localhost:8888/checkData',{
            id:id,
            status:status,
            name:'shiwuzhaoling'
          })
          if(callBackStatus.data == 'ok') {
            this.$message({
              message:'恭喜你,审核成功!',
              type:'success'
            })
            this.getLost();
          }else {
            this.$message({
              message:'审核操作失败,请联系开发者查明原因!',
              type:'error'
            })
          }
        }
     }   
    }
</script>

<style>
.elMainTop {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .elMainTopBlock {
    background-color: #fff;
    width: 20%;
    margin: 10px;
    height: 80px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .elMainTopBlockSelect {
    border:1px solid blue
  }
  .elMainTopBlockB {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  }
  .elMainTopBlock > img {
    width:35px;
    height:35px;
    margin-right: 10px;
  }
</style>