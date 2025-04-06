<template>
  <view class="container">
    <uni-section title="手术排期创建" type="line">
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms ref="form" :modelValue="baseFormData">
          <uni-forms-item label="病患号">
            <uni-easyinput
              disabled
              v-model="baseFormData.hospitalNum"
              placeholder="请输入病患号"
            />
          </uni-forms-item>
          <uni-forms-item label="术间" required>
            <uni-easyinput
              disabled
              v-model="baseFormData.surgery"
              placeholder="请输入术间"
            />
          </uni-forms-item>
          <uni-forms-item label="院区" required>
            <uni-data-select
              placeholder="请选择院区"
              v-model="baseFormData.location"
              :localdata="storages"
            ></uni-data-select>
          </uni-forms-item>
          <uni-forms-item label="备注">
            <uni-easyinput
              v-model="baseFormData.remark"
              placeholder="请输入备注"
            />
          </uni-forms-item>
          <uni-forms-item label="高值耗材模板">
            <uni-easyinput
              v-model="searchQuery"
              placeholder="请输入搜索内容"
              @input="onSearch"
              style="margin-bottom: 10px"
            />
            <!-- 使用过滤后的数据 -->
            <uni-data-select
              v-model="baseFormData.template"
              :localdata="filteredCandidates"
              placeholder="请选择模板"
              @change="handleTemplateChange"
            />
          </uni-forms-item>

          <uni-forms-item label="自定义新增条目">
            <uni-easyinput
              v-model="customSearchQuery"
              placeholder="请输入物料名/物料编码/通用名"
              @input="onCustomSearch"
              style="margin-bottom: 10px"
            />
            <!-- 使用过滤后的数据 -->
            <uni-data-select
              v-model="baseFormData.customItem"
              :localdata="customFilteredCandidates"
              placeholder="请选择条目"
              @change="handleCustomSeachChange"
            />
          </uni-forms-item>
        </uni-forms>

        <!-- <view class="list-item" v-for="(item, index) in listData" :key="index">
          <view class="left-content">
            <text class='title'>{{ item.VARIETIE_CODE_NEW }}</text>
            <text class='title'>{{ item.VARIETIE_NAME }}</text>
            <text class='description'>{{ item.SPECIFICATION_OR_TYPE }}</text>
          </view>
          <view class="right-content">
            <uni-easyinput v-model="item.APPLY_QTY" placeholder="请输入数量"></uni-easyinput>
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
                placeholder="请输入数量"
              ></uni-easyinput>
              <button class="delete-btn" @click="handleDeleteItem(index)">
                删除
              </button>
            </view>
          </view>
          <!-- New lower section with remarks input -->
          <view class="lower-section">
            <uni-easyinput v-model="item.REMARKS" placeholder="请输入备注" />
          </view>
        </view>

        <view class="button-group">
          <button type="primary" size="mini" @click="handleSubmit(0)">
            保存
          </button>
          <button type="primary" size="mini" @click="handleSubmit(1)">
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
  generateNaxtDayOrder,
  generateNaxtDayOrderNormal,
  listStorage,
  SerachAuthVar,
} from "@/api/roombook/index";

const baseFormData = reactive({
  applyMan: "",
  returnMan: "",
  surgery: "",
  location: "",
  remark: "",
  template: "",
  hospitalNum: "",
  customItem: "",
});

const handleDeleteItem = (data) => {
  uni.showModal({
    title: "提示",
    content: "是否删除该条目？",
    success: (res) => {
      if (res.confirm) {
        listData.splice(data, 1);
      }
    },
  });
};

// 新增单条条目
const handleCustomSeachChange = (data) => {
  uni.showLoading({
    title: "正在加载中",
  });
  const varIDToAdd = listData.map((item) => {
    return item.VarID;
  });
  const alreadyExists = varIDToAdd.includes(data.VarID);
  if (!alreadyExists && baseFormData.customItem) {
    listData.push({ ...baseFormData.customItem, id: Date.now() });
  }
  uni.hideLoading();
};

// 自定义添加
// 搜索关键词
const customSearchQuery = ref("");
// 计算属性：根据 searchQuery 对候选项进行过滤
const customFilteredCandidates = computed(() => {
  // 当搜索框为空时返回所有候选项
  if (!customSearchQuery.value.trim()) {
    return cusomCandidates;
  }
  // 模糊匹配：包含搜索关键词的项保留
  return cusomCandidates.filter((item) =>
    item.text.includes(customSearchQuery.value)
  );
});

// 输入框输入事件，更新搜索关键词
const onCustomSearch = (e) => {
  // 这里 e.detail.value 为 uni-easyinput 返回的输入内容
  searchQuery.value = e.detail.value;
};
//

const candidates = reactive([]);
const cusomCandidates = reactive([]);
const listData = reactive([]);

const initTemplate = () => {
  //单条目初始化
  SerachAuthVar({
    Token: sessionStorage.getItem("Token"),
    page: 1,
    size: 99999,
    // DeptCode: '2140',
    DeptCode: sessionStorage.getItem("DEPT_TWO_CODE"), //记得放开
    SerachName: "",
  }).then((res) => {
    const formattedData = res.result.map((item) => {
      return {
        value: item,
        text: `物料号：${item.VARIETIE_CODE_NEW}-物料名：${item.VARIETIE_NAME}-通用名：${item.MEDICAL_NAME}`,
      };
    });
    cusomCandidates.splice(0, cusomCandidates.length, ...formattedData);
  });

  listRoomBookTemplate({
    Token: sessionStorage.getItem("Token"),
    TEMPLATE_NAME: "",
    CREATOR: "",
    page: 1,
    size: 999,
  }).then((res) => {
    const formattedData = res.result.map((item) => {
      return {
        value: item.ID,
        text: item.TEMPLATE_NAME,
      };
    });
    candidates.splice(0, candidates.length, ...formattedData);
  });
};

const storages = reactive([]);
const initStorage = () => {
  listStorage({
    Token: sessionStorage.getItem("Token"),
  }).then((res) => {
    const formattedData = res.result.map((item) => {
      return {
        value: item.Name,
        text: item.Name,
      };
    });
    storages.splice(0, storages.length, ...formattedData);
  });
};

const handleSubmit = (data) => {
  if (!baseFormData?.surgery) {
    return uni.showToast({
      title: "请输入术间",
      icon: "error",
    });
  }
  if (!baseFormData?.location) {
    return uni.showToast({
      title: "请输入院区",
      icon: "error",
    });
  }

  if (listData.length == 0) {
    return uni.showToast({
      title: "请先添加条目",
      icon: "error",
    });
  }

  const listDataFilter = JSON.stringify(
    listData.map((item) => {
      return {
        ID: item.ID,
        QTY: item.APPLY_QTY,
        VARID: item.VarID,
        REMARK: item.REMARKS,
      };
    })
  );
  generateNaxtDayOrder({
    ID: mainId.value,
    Token: sessionStorage.getItem("Token"),
    SURGICAL_ROOM: baseFormData.surgery,
    SURGICAL_PLACE: baseFormData.location,
    REMARK: baseFormData.remark,
    data: listDataFilter,
    bhh: baseFormData.hospitalNum,
    state: data,
  })
    .then((res) => {
      uni.showToast({
        title: res?.msg,
      });
    })
    .finally(() => {
      uni.redirectTo({
        url: "/pages/roombook/roombook",
      });
    });
};

//
// 搜索关键词
const searchQuery = ref("");
// 计算属性：根据 searchQuery 对候选项进行过滤
const filteredCandidates = computed(() => {
  // 当搜索框为空时返回所有候选项
  if (!searchQuery.value.trim()) {
    return candidates;
  }
  // 模糊匹配：包含搜索关键词的项保留
  return candidates.filter((item) => item.text.includes(searchQuery.value));
});

// 输入框输入事件，更新搜索关键词
const onSearch = (e) => {
  // 这里 e.detail.value 为 uni-easyinput 返回的输入内容
  searchQuery.value = e.detail.value;
};
//

const mainId = ref(0);
const handleTemplateChange = (data) => {
  mainId.value = data;
  uni.showLoading({
    title: "正在加载中",
  });
  listRoomBookTemplateDetail({
    VARIETIE_NAME: "",
    MAIN_ID: data,
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

onLoad((data) => {
  initTemplate();
  initStorage();
  baseFormData.surgery = data.sg;
  baseFormData.hospitalNum = data.bhh;
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
