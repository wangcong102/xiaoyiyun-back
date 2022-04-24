<template>
    <div>
        <div class="elMainTop">
            <div :class='["elMainTopBlock",taskSelect == index ? "elMainTopBlockSelect" : "" ]' v-for="(item,index) in blockArray" :key="index"  @click="selectBlock(item.name)">
              <img :src="item.imgSrc">
              <div class="elMainTopBlockB">
                <span style="margin-bottom:8px">{{item.name}}</span>
                <span>{{item.num}}</span>
              </div>
            </div>
          </div>
            <!-- openId、TaskContent、TaskPhone、TaskQQ、leiXing、status、timeNow -->
            <div class="elMainTable" style="margin-top:20px">
              <el-table
                v-loading="loading"
                element-loading-text="拼命加载中"
                element-loading-spinner="el-icon-loading"
                element-loading-background="rgba(0,0,0,0.8)"
                :data="taskNowData"
                border
                style="width: 100%">
                <el-table-column
                  prop="_openid"
                  label="openId"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="leiXing"
                  label="任务类型"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="TaskContent"
                  label="任务内容">
                </el-table-column>
                <el-table-column
                  prop="TaskPhone"
                  label="联系电话">
                </el-table-column>
                <el-table-column
                  prop="TaskQQ"
                  label="联系QQ">
                </el-table-column>
                <el-table-column
                  prop="Money"
                  label="悬赏金额(元)">
                </el-table-column>
                <el-table-column
                  prop="status"
                  label="订单状态">
                </el-table-column>
                <el-table-column
                  prop="timeNow"
                  label="发布时间">
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
                taskAllData:[],
                taskNowData:[],
                taskSelect:0,  
                total:0,
                pageSize:10,
                currentPage:1,
                loading:true
            }
        },
     mounted () {
      this.getTask();  
     },
     methods: {
      handleClose(key, keyPath) {
        console.log(key, keyPath);
      },
      async getTask () {
        var res = await this.$http.get('http://localhost:8888/expressAndTask');
        var array = [];
        var task = res.data.filter((item, index, array) => {
          return item.leiXing == '其它任务';
        })
        // 计算全部数据,待审核,审核通过,审核失败的数量
        var a1 = task.length,a2 = 0,a3 = 0,a4 = 0;
        task.forEach(item => {
          if(item.shenHe == '审核中') {
            a2++;
          }else if(item.shenHe == '已发布') {
            a3++;
          }else if(item.shenHe == '审核失败') {
            a4++;
          }
        })
        this.blockArray[0].num = a1;
        this.blockArray[1].num = a2;
        this.blockArray[2].num = a3;
        this.blockArray[3].num = a4;
        console.log('task',task);
        this.taskAllData = task;
        this.total = task.length;
        if(task.length < 10) {
          for(var i = 0; i < task.length; i++) {
            array.push(task.data[i]);
          }   
        }else {
          for(var i = 0; i < 10; i++) {
            array.push(task.data[i]);
          }   
        }   
        this.taskNowData = array;   
        this.loading = false;  
      },
      selectBlock(res) {
          var name = '';
          var selectData = [];
          console.log(res);
          if(res == '全部数据') {
            this.taskNowData = this.taskAllData;
            this.taskSelect = 0;
          }else if(res == '待审核') {
            name = '审核中'
            this.taskSelect = 1;
          }else if(res == '审核通过') {
            name = '已发布'
            this.taskSelect = 2;
          }else if(res == '审核失败') {
            name = '审核失败'
            this.taskSelect = 3;
          }
          if(name !== ''){
            selectData = this.taskAllData.filter((item,index,array) => {
              return item.shenHe == name;
            })
            console.log('selectData',selectData);
            this.taskNowData = selectData;
          }
        },
        currentChange(currentPage) {
          console.log(currentPage);
          var array = [];
          this.currentPage = currentPage;
          if(parseInt(this.taskAllData.length/10)+1 == currentPage) {
            console.log('if',this.taskNowData);
            for(var i = (currentPage -1)*this.pageSize; i < this.taskAllData.length; i++) {
              array.push(this.taskAllData[i]);
            }
          }else {
            console.log('else',this.taskNowData);
            for(var i = (currentPage-1)*this.pageSize; i < currentPage*this.pageSize; i++) {
              array.push(this.taskAllData[i]);
            }
          }
          this.taskAllData = array;
        },
        async deleteTrue(e) {
          var id = e.row._id;
          console.log('要删除这项数据ID是',id);
          var res = await this.$http.post('http://localhost:8888/deleteData',{
            id:id,
            name:'ExpressAndTask'
          });
          if(res.data == 'ok') {
            this.$message({
              message:'恭喜你,删除成功!',
              type:'success'
            })
            this.getTask();
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
            name:'ExpressAndTask'
          })
          if(callBackStatus.data == 'ok') {
            this.$message({
              message:'恭喜你,审核成功!',
              type:'success'
            })
            this.getTask();
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