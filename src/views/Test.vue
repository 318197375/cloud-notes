<template>
  <div class="infinite-list-wrapper" style="overflow:auto;">
    {{this.loading}}
    -----------------
    {{this.noMore}}
    ---------------
    <ul
      class="list"
      v-infinite-scroll="load"
      infinite-scroll-disabled="disabled"
    >
<!--      <li v-for="i in count" className="list-item">{{ i }}</li>-->
      <li v-for="(i,index) in list" class="list-item" :key="index">
        {{index}}+ {{ i.title }}
      </li>
    </ul>
    <p v-if="loading">加载中...</p>
    <p v-if="noMore">没有更多了</p>
  </div>
</template>

<!--<script>-->
<!--import InfiniteScroll from 'element-ui/lib/infinite-scroll'-->
<!--export default {-->
<!--  directives: { InfiniteScroll },-->

<!--  data () {-->
<!--    return {-->
<!--      count: 10,-->
<!--      loading: false-->
<!--    }-->
<!--  },-->
<!--  computed: {-->
<!--    noMore () {-->
<!--      // return false-->
<!--      return this.count >= 200-->
<!--    },-->
<!--    disabled () {-->
<!--      return this.loading || this.noMore-->
<!--    }-->
<!--  },-->
<!--  methods: {-->
<!--    load () {-->
<!--      this.loading = true-->
<!--      setTimeout(() => {-->
<!--        this.count += 2-->
<!--        this.loading = false-->
<!--      }, 200)-->
<!--    }-->
<!--  }-->
<!--}-->
<!--</script>-->

<!--<style lang="less" scoped>-->
<!--.infinite-list-wrapper{-->
<!--  height: 100vh;-->
<!--  .list-item{-->
<!--    height: 300px;-->
<!--  }-->
<!--}-->
<!--</style>-->


<!--<template>-->
<!--  <div class="infinite-list-wrapper" style="overflow:auto;">-->
<!--    <ul-->
<!--      class="list"-->
<!--      v-infinite-scroll="load"-->
<!--      infinite-scroll-disabled="disabled">-->
<!--      <li v-for="(i,index) in list" class="list-item" :key="index">-->
<!--        {{index}}+ {{ i.title }}-->
<!--      </li>-->
<!--    </ul>-->
<!--    <p v-if="loading">加载中...</p>-->
<!--    <p v-if="noMore">没有更多了</p>-->
<!--  </div>-->
<!--</template>-->

<script>
export default {
  data () {
    return {
      count: 1, //起始页数值为0
      loading: false,
      totalPages: 10, //取后端返回内容的总页数
      list: [] //后端返回的数组
    }
  },
  computed: {
    noMore () {
      return this.count >= this.totalPages - 1;
    },
    disabled () {
      return this.loading || this.noMore
    }
  },
  created() {
    this.getMessage();
  },
  methods: {
    load() {
      //滑到底部时进行加载
      this.loading = true;
      setTimeout(() => {
        this.count += 1; //页数+1
        this.getMessage(); //调用接口，此时页数+1，查询下一页数据
      }, 200);
    },
    //没有后端的情况
    getMessage(){
      let templist = [
        {
          title:"我爱您 你却爱着她"
        },
        {
          title:"我爱您 你却爱着她"
        },
        {
          title:"我爱您 你却爱着她"
        },
        {
          title:"我爱您 你却爱着她"
        }
      ];
      this.list = this.list.concat(templist);
      this.loading = false;
    }
    //有后端的情况
    // getMessage() {
    //   let params = {
    //     pageNumber: this.count,
    //     pageSize: 10 //每页查询条数
    //   };
    //   console.log(params);
    //   request({
    //     url:"/getfollowlist",
    //     method:'post',
    //     data:{
    //         params
    //     }
    // }).then(res =>{
    //   console.log(res);
    //   this.list = this.list.concat(res.data.list);
    //   //因为每次后端返回的都是数组，所以这边把数组拼接到一起 concat() 方法用于连接两个或多个数组。 该方法不会改变现有的数组,而仅仅会返回被连接数组的一个副本
    //   this.loading = false;
    //  }).catch(err =>{ console.log(err);});
    // }
  }
}

</script>
<style lang="less" scoped>
.infinite-list-wrapper{
  height: 100vh;
  .list-item{
    height: 300px;
  }
}
</style>
