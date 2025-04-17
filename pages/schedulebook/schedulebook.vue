<template>
  <view>
    <view class="u-page">
      <view class="u-demo-block">
        <view class="u-demo-block__content">
          <!-- 搜索 -->
          <view class="u-page__tag-item">
            <up-row customStyle="margin-bottom: 20px">
              <up-col span="12">
                <up-search v-model="keyword" :show-action="false" @search='handleSearch'></up-search>
              </up-col>
            </up-row>
          </view>
          <!-- 内容 -->
          <!-- :rightText="item.STATE" -->
          <view class="u-page__item">
            <uni-list>
              <uni-list-item v-for="(item,index) in indexList" :key='index'
                :title="'住院号：' + item.HOSPITALIZATION_NUMBER"
                :note="'手术名称：' + item.SURGICAL_NAME+ '\n' + '术间：' + item.SURGICAL_ROOM + '\n' + '手术时间：' + item.SURGICAL_DATE_STR + '&nbsp' + item.SURGICAL_TIME_STR"
                showArrow link="redirectTo"
                :to="'/pages/addSchedulebook/addSchedulebook?id='+item.ID+'&sg='+item.SURGICAL_ROOM + '&bhh=' + item.HOSPITALIZATION_NUMBER" @click="onClick" />
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
    onLoad,
    onShow
  } from '@dcloudio/uni-app';

  import {
    listSchedulebook
  } from '@/api/schedulebook/index'

  const keyword = ref('');

  const handleSearch = () => {}

  const indexList = reactive([]);
  onShow(() => {
    uni.showLoading({
      title: "正在加载中"
    })
    indexList.length = 0;
    listSchedulebook({
      VARIETIE_NAME: "",
      MAIN_ID: "",
      page: 1,
      size: 10,
      Token: uni.getStorageSync("Token")
    }).then(res => {
      if (res.code != 200) {
        return uni.showToast({
          title: res.msg,
        })
      }

      if (res.result && Array.isArray(res.result)) { // 确保 res.result 是数组

        // 1. 排序 res.result 数组 (倒序)
        res.result.sort((a, b) => {
          // 组合日期和时间字符串，方便比较
          const dateTimeA = `${a.SURGICAL_DATE_STR} ${a.SURGICAL_TIME_STR}`;
          const dateTimeB = `${b.SURGICAL_DATE_STR} ${b.SURGICAL_TIME_STR}`;

          // 使用 Date 对象进行比较，更可靠
          const dateA = new Date(dateTimeA);
          const dateB = new Date(dateTimeB);

          return dateB - dateA; //  注意这里是 dateB - dateA，实现倒序排列
        });

        // 2. 将排序后的结果 push 到 indexList
        indexList.push(...res.result);
      } else {
        console.warn("listSchedulebook 返回的 result 不是数组或为空:", res); // 打印警告信息，方便调试
      }

    }).finally(() => {
      uni.hideLoading()
    })
  })
</script>

<style>

</style>
