<template>
  <view>
    <view class="u-page">
      <view class="u-demo-block">
        <view class="u-demo-block__content">
          <!-- 搜索 -->
          <view class="u-page__tag-item">
            <up-row customStyle="margin-bottom: 20px">
              <up-col span="10">
                <up-search v-model="keyword" :show-action="false" @search='handleSearch'></up-search>
              </up-col>
              <up-col span="2">
                <up-button type="primary" @click='handleAddItem' shape="circle" text="添加"></up-button>
              </up-col>
            </up-row>
          </view>
          <!-- 内容 -->
          <!-- :rightText="item.STATE" -->
          <view class="u-page__item">
            <uni-list>
              <uni-list-item v-for="(item,index) in indexList" :key='index'
                :title="item.NAXT_DAT_PLAN_NUM + '&nbsp' +'术间：' + item.SURGICAL_ROOM"
                :note="'创建人:' + item.CREATE_MAN + '&nbsp&nbsp' + '申请时间：' + item.CREATE_TIME"
                :rightText="'状态：' + (item.STATE == 0 ? '新增' : item.STATE == 1 ? '已提交' : item.STATE == 2 ? '已拣配' : item.STATE == 3 ? '已交接' : item.STATE == 4 ? '已完成' : '默认')" showArrow link="redirectTo"
                :to="'/pages/catbook/catbook?id='+item.ID+'&planNum='+item.NAXT_DAT_PLAN_NUM +'&state='+item.STATE" @click="onClick" />
            </uni-list>
          </view>
        </view>
      </view>
    </view>
  </view>
</template>

<script setup>
  import {
    reactive,
    ref
  } from 'vue';
  import {
    listRoombookList
  } from '@/api/roombook/index';
  import {
    onLoad,
    onShow
  } from '@dcloudio/uni-app';
  // 响应式数据
  const keyword = ref('');

  const handleAddItem = () => {
    uni.navigateTo({
      url: "/pages/addbook/addbook"
    })
  }

  const handleSearch = () => {
    uni.showLoading({
      title: "正在加载中"
    })
    indexList.length = 0;
    listRoombookList({
      Token: sessionStorage.getItem("Token"),
      NAXT_DAT_PLAN_NUM: keyword.value,
      CREATE_MAN: "",
      page: 1,
      size: 20
    }).then(res => {
      if (res.code != 200) {
        return uni.showToast({
          title: res.msg,
        })
      }
      if (res.result && res.result.length > 0) { // 确保 res.result 存在且不为空
        // 1. 对 res.result 数组进行排序 (倒序，CREATE_TIME 晚的排在前面)

        res.result.sort((a, b) => {
          // 将 CREATE_TIME 转换为 Date 对象进行比较，确保正确排序
          const dateA = new Date(a.CREATE_TIME);
          const dateB = new Date(b.CREATE_TIME);
          // 倒序排列，所以 b 在前，a 在后
          return dateB - dateA;
        });

        // 2. 将排序后的数组 push 到 indexList
        indexList.push(...res.result);
      }
    }).finally(() => {
      uni.hideLoading()
    })
  }


  const indexList = reactive([]);

  onShow(() => {
    uni.showLoading({
      title: "正在加载中"
    })
    indexList.length = 0;
    listRoombookList({
      Token: sessionStorage.getItem("Token"),
      NAXT_DAT_PLAN_NUM: keyword.value,
      CREATE_MAN: "",
      page: 1,
      size: 20
    }).then(res => {
      if (res.code != 200) {
        return uni.showToast({
          title: res.msg,
        })
      }

      if (res.result && res.result.length > 0) { // 确保 res.result 存在且不为空
        // 1. 对 res.result 数组进行排序 (倒序，CREATE_TIME 晚的排在前面)
        res.result.sort((a, b) => {
          // 将 CREATE_TIME 转换为 Date 对象进行比较，确保正确排序
          const dateA = new Date(a.CREATE_TIME);
          const dateB = new Date(b.CREATE_TIME);
          // 倒序排列，所以 b 在前，a 在后
          return dateB - dateA;
        });

        // 2. 将排序后的数组 push 到 indexList
        indexList.push(...res.result);
      }
    }).finally(() => {
      uni.hideLoading()
    })
  })
</script>

<style>
  .wrap {
    padding: 12px;
  }

  .demo-layout {
    height: 25px;
    border-radius: 4px;
  }

  .bg-purple {
    background: #CED7E1;
  }

  .bg-purple-light {
    background: #e5e9f2;
  }

  .bg-purple-dark {
    background: #99a9bf;
  }
</style>
