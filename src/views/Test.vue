<template>
  <div id="box">
    <div class="box" v-infinite-scroll="load" infinite-scroll-disabled="disabled" >
        <ul class="list" >
          <li v-for="(i,index) in list" class="list-item" :key="index">{{ i.noticeTitle }}</li>
        </ul>
        <p v-if="loading" style="margin-top:10px;" class="loading">
          <span></span>
        </p>
        <p v-if="noMore" style="margin-top:10px;font-size:13px;color:#ccc">没有更多了</p>
    </div>
  </div>
</template>
 
<script>
export default {
  data() {
    return {
      count: 0,//起始页数值为0
      loading: false,
      totalPages: "",//取后端返回内容的总页数
      list: [] //后端返回的数组
    };
  },
  computed: {
    noMore() {
      //当起始页数大于总页数时停止加载
      return this.count >= this.totalPages - 1;
    },
    disabled() {
      return this.loading || this.noMore;
    }
  },
  created() {
    // this.getMessage();
  },
  methods: {
    load() {
      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        this.count += 1; //页数+1
        // this.getMessage(); //调用接口，此时页数+1，查询下一页数据
      }, 2000);
    },
  }
};
</script>
 
<style scoped>
#box{
 width: 100%;
  height: 100%;
  position: absolute;
  overflow-y: auto;
}
.box {
  width: 100%;
   margin:  0 auto;
}
.list {
  padding: 0;
  font-size: 14px;
}
.list-item {
  width: 100%;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  list-style: none;
  padding: 0 1rem;
  box-sizing: border-box;
  height: 70px;
  line-height: 70px;
  border-bottom: 1px solid #e7e7e7;
}
.loading span {
  display: inline-block;
  width: 20px;
  height: 20px;
  border: 2px solid #409eff;
  border-left: transparent;
  animation: zhuan 0.5s linear infinite;
  border-radius: 50%;
}
@keyframes zhuan {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>