<template>
  <view class="container">
    <uni-section title="查看耗材预约" type="line">
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms ref="form" :modelValue="baseFormData">
          <uni-forms-item label="申请人" required>
            <uni-easyinput
              disabled
              v-model="baseFormData.applyMan"
              placeholder="请输入申请人"
            />
          </uni-forms-item>
          <!--          <uni-forms-item label="归还人">
            <uni-easyinput disabled v-model="baseFormData.returnMan" placeholder="请输入归还人" />
          </uni-forms-item> -->
          <uni-forms-item label="术间" required>
            <uni-easyinput
              disabled
              v-model="baseFormData.surgery"
              placeholder="请输入术间"
            />
          </uni-forms-item>
          <uni-forms-item label="院区" required>
            <uni-easyinput
              disabled
              v-model="baseFormData.location"
              placeholder="请输入院区"
            />
          </uni-forms-item>
          <uni-forms-item label="备注">
            <uni-easyinput
              disabled
              v-model="baseFormData.remark"
              placeholder="请输入备注"
            />
          </uni-forms-item>
        </uni-forms>

        <!-- <view class="list-item" v-for="(item, index) in listData" :key="index">
          <view class="left-content">
            <text class='title'>{{ item.VARIETIE_NAME }}</text>
            <text class='description'>{{ item.SPECIFICATION_OR_TYPE }}</text>
          </view>
          <view class="right-content">
            <uni-easyinput v-model="item.APPLY_QTY" disabled placeholder="请输入数量"></uni-easyinput>
          </view>
        </view> -->

        <view class="list-item" v-for="(item, index) in listData" :key="index">
          <!-- Upper section - stays the same -->
          <view class="upper-section">
            <view class="left-content">
              <text class="title">{{ item.VARIETIE_CODE_NEW }}</text>
              <text class="title">{{ item.VARIETIE_NAME }}</text>
              <text class="description">{{ item.SPECIFICATION_OR_TYPE }}</text>
            </view>
            <view class="right-content">
              <uni-easyinput
                v-model="item.APPLY_QTY"
                :disabled="true"
                placeholder="请输入数量"
              ></uni-easyinput>
            </view>
          </view>
          <!-- New lower section with remarks input -->
          <view class="lower-section">
            <uni-easyinput :disabled="true" v-model="item.REMARK" placeholder="请输入备注" />
          </view>
        </view>

        <view class="button-group">
          <button
            type="warn"
            :disabled="!isDeleteEnable"
            size="mini"
            @click="handleDelete"
          >
            删除
          </button>
          <button
            type="primary"
            :disabled="!isDeleteEnable"
            size="mini"
            @click="handleSubmit"
          >
            提交
          </button>
        </view>
      </view>
    </uni-section>
  </view>
</template>

<script setup>
import { onLoad, onShow } from "@dcloudio/uni-app";

import { reactive, ref, computed } from "vue";

import {
  listRoomBookTemplate,
  listRoomBookTemplateDetail,
  listNaxtItemDetail,
  listRoombookList,
  deleteNaxtDayOrder,
  submitNaxtDayOrder,
} from "@/api/roombook/index";

const baseFormData = reactive({
  applyMan: "",
  returnMan: "",
  surgery: "",
  location: "",
  remark: "",
  template: "",
});

const isDeleteEnable = computed(() => {
  return state.value == 0;
});

const handleSubmit = () => {
  uni.showLoading({
    title: "正在处理中",
  });
  submitNaxtDayOrder({
    Token: sessionStorage.getItem("Token"),
    ID: mainId.value + ",",
    STATE: "1",
  })
    .then((res) => {
      uni.showToast({
        title: res?.msg,
      });
    })
    .finally(() => {
      uni.hideLoading();
      uni.navigateBack({
        delta: 1,
      });
    });
};

//删除
const handleDelete = () => {
  uni.showLoading({
    title: "正在处理中",
  });
  deleteNaxtDayOrder({
    Token: sessionStorage.getItem("Token"),
    id: mainId.value,
  })
    .then((res) => {
      uni.showToast({
        title: res?.msg,
      });
    })
    .finally(() => {
      uni.hideLoading();
      uni.navigateBack({
        delta: 1,
      });
    });
};

const listData = reactive([]);

const initApplication = () => {
  uni.showLoading({
    title: "正在加载中",
  });
  listRoombookList({
    Token: sessionStorage.getItem("Token"),
    NAXT_DAT_PLAN_NUM: planNum.value,
    CREATE_MAN: "",
    page: 1,
    size: 9999,
  })
    .then((res) => {
      baseFormData.applyMan = res.result[0].CREATE_MAN;
      baseFormData.surgery = res.result[0].SURGICAL_ROOM;
      baseFormData.location = res.result[0].SURGICAL_PLACE;
      baseFormData.remark = res.result[0].REMARK;
    })
    .finally(() => {
      uni.hideLoading();
    });
};

const initTemplate = (data) => {
  uni.showLoading({
    title: "正在加载中",
  });
  listNaxtItemDetail({
    VARIETIE_NAME: "",
    MAIN_ID: mainId.value,
    page: 1,
    size: 99999,
    Token: sessionStorage.getItem("Token"),
  })
    .then((res) => {
      listData.splice(0, listData.length, ...res.result);
    })
    .finally(() => {
      uni.hideLoading();
    });
};

const mainId = ref(0);
const planNum = ref("");
const state = ref(0);
onLoad((data) => {
  mainId.value = data.id;
  state.value = data.state;
  planNum.value = data.planNum;
  initTemplate();
  initApplication();
});
</script>

<style scoped>
.button-group {
  margin-top: 15px;
  display: flex;
  justify-content: space-around;
}

.container {
  padding: 20rpx;
  /* 容器内边距，根据需要调整 */
}

.list-item {
  display: flex;
  flex-direction: column;
  margin-bottom: 10px;
  border: 1px solid #eee;
  border-radius: 5px;
  padding: 10px;
}

.upper-section {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.left-content {
  display: flex;
  flex-direction: column;
}

.right-content {
  width: 100px; /* Adjust as needed */
}

.lower-section {
  width: 100%;
}

.title {
  font-weight: bold;
  margin-bottom: 2px;
}

.description {
  font-size: 14px;
  color: #666;
}

.delete-btn {
  margin-top: 5px;
  background-color: #ff4d4f;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 5px 0;
  font-size: 14px;
  cursor: pointer;
}
</style>
