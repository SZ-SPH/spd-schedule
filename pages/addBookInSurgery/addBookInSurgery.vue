<template>
  <view class="container">
    <uni-section title="耗材预约" type="line">
      <view class="example">
        <!-- 基础用法，不包含校验规则 -->
        <uni-forms ref="form" :modelValue="baseFormData">
          <uni-forms-item label="术间" required>
            <uni-data-select v-model="baseFormData.surgery" :localdata="surgeryRange"
              placeholder="请选择术间"></uni-data-select>

            <!-- <uni-easyinput v-model="baseFormData.surgery" placeholder="请输入术间" /> -->
          </uni-forms-item>
          <uni-forms-item label="院区" required>
            <uni-data-select placeholder="请选择院区" v-model="baseFormData.location"
              :localdata="storages"></uni-data-select>
            <!-- <uni-easyinput v-model="baseFormData.location" placeholder="请输入院区" /> -->
          </uni-forms-item>
          <uni-forms-item label="备注">
            <uni-easyinput v-model="baseFormData.remark" placeholder="请输入备注" />
          </uni-forms-item>

          <uni-forms-item label="高值耗材模板">
            <uni-easyinput v-model="searchQuery" placeholder="请输入搜索内容" @input="onSearch" style="margin-bottom: 10px" />
            <!-- 使用过滤后的数据 -->
            <uni-data-select v-model="baseFormData.template" :localdata="filteredCandidates" placeholder="请选择模板"
              @change="handleTemplateChange" />
          </uni-forms-item>

          <uni-forms-item label="自定义新增条目">
            <uni-easyinput v-model="customSearchQuery" placeholder="请输入物料名/物料编码/通用名" @input="onCustomSearch"
              style="margin-bottom: 10px" />
            <!-- 使用过滤后的数据 -->
            <uni-data-select v-model="baseFormData.customItem" :localdata="customFilteredCandidates" placeholder="请选择条目"
              @change="handleCustomSeachChange" />
          </uni-forms-item>

          <uni-section title="提示" type="line">
            <uni-notice-bar text="请在右边输入框添加数量，下面输入框输入备注！" />
          </uni-section>
        </uni-forms>

        <view class="list-item" v-for="(item, index) in listData" :key="index">
          <!-- Upper section - stays the same -->
          <view class="upper-section">
            <view class="left-content">
              <text class="title">{{ item.VARIETIE_CODE_NEW }}</text>
              <text class="title">{{ item.VARIETIE_NAME }}</text>
              <text class="description">{{ item.SPECIFICATION_OR_TYPE }}</text>

              <uni-data-select v-model="item.VARIETIE_SKU" :localdata="(item.SKU_NAMES||'').split(',')
                  .map(s => s.trim())
                  .filter(s => s)
                  .map(txt => ({ text: txt, value: txt }))" placeholder="请选择 SKU"
                style="margin-top: 8px; width: 80%;" />


            </view>
            <view class="right-content">
              <uni-easyinput v-model="item.APPLY_QTY" placeholder="请输入数量"></uni-easyinput>
              <button class="delete-btn" @click="handleDeleteItem(index)">删除</button>
            </view>
          </view>

          <!-- New lower section with remarks input -->
          <view class="lower-section">
            <uni-easyinput v-model="item.REMARKS" placeholder="请输入备注" />
          </view>
        </view>

        <view class="button-group">

          <button :disabled="isSubmitEnable" type="primary" size="mini" @click="handleSubmit(1)">
            提交
          </button>

        </view>
      </view>
    </uni-section>
  </view>
</template>

<script setup>
  import {
    reactive,
    ref,
    computed
  } from "vue";

  import {
    listRoomBookTemplate,
    listRoomBookTemplateDetail,
    generateNaxtDayOrder,
    listStorage,
    SerachAuthVar,
  } from "@/api/roombook/index";

  import {
    onLoad,
    onShow
  } from "@dcloudio/uni-app";

  onLoad(() => {});

  const isSubmitEnable = ref(false);

  // 术间list
  const surgeryRange = reactive([{
      value: "术间1",
      text: "术间1",
    },
    {
      value: "术间2",
      text: "术间2",
    },
    {
      value: "术间3",
      text: "术间3",
    },
    {
      value: "术间4",
      text: "术间4",
    },
    {
      value: "术间5",
      text: "术间5",
    },
    {
      value: "术间6",
      text: "术间6",
    },
    {
      value: "术间7",
      text: "术间7",
    },
    {
      value: "术间8",
      text: "术间8",
    },
    {
      value: "术间9",
      text: "术间9",
    },
    {
      value: "术间10",
      text: "术间10",
    },
    {
      value: "术间11",
      text: "术间11",
    },
    {
      value: "术间12",
      text: "术间12",
    },
    {
      value: "术间13",
      text: "术间13",
    },
    {
      value: "术间14",
      text: "术间14",
    },
    {
      value: "术间15",
      text: "术间15",
    },
    {
      value: "术间16",
      text: "术间16",
    },
    {
      value: "术间17",
      text: "术间17",
    },
    {
      value: "术间18",
      text: "术间18",
    },
    {
      value: "术间19",
      text: "术间19",
    },
    {
      value: "术间20",
      text: "术间20",
    },
  ]);

  // 模板搜索
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
    customSearchQuery.value = e.detail.value;
  };
  //

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
  }

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

    isSubmitEnable.value = true

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
        Token: uni.getStorageSync("Token"),
        SURGICAL_ROOM: baseFormData.surgery,
        SURGICAL_PLACE: baseFormData.location,
        REMARK: baseFormData.remark,
        data: listDataFilter,
        STATE: data,
        type: "1"
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

  const submit = () => {};

  const baseFormData = reactive({
    applyMan: "",
    returnMan: "",
    surgery: "",
    location: "",
    remark: "",
    template: "",
    customItem: "",
  });

  const storages = reactive([]);
  const initStorage = () => {
    listStorage({
      Token: uni.getStorageSync("Token"),
    }).then((res) => {
      const formattedData = res.result.map((item) => {
        return {
          value: item.Name,
          text: item.Name,
        };
      });
      storages.splice(0, storages.length, ...formattedData);
    }).catch(err => {
      console.log(err)
    })
  };

  const candidates = reactive([]);

  const cusomCandidates = reactive([]);

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
      listData.push({
        ...baseFormData.customItem,
        id: Date.now()
      });
    }
    uni.hideLoading();
  };

  const initTemplate = () => {
    //单条目初始化
    SerachAuthVar({
      Token: uni.getStorageSync("Token"),
      page: 1,
      size: 99999,
      DeptCode: uni.getStorageSync("DEPT_TWO_CODE"), //记得放开
      // DeptCode: "2140",
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

    // 模板初始化
    listRoomBookTemplate({
      Token: uni.getStorageSync("Token"),
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

  const listData = reactive([]);

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
        Token: uni.getStorageSync("Token"),
      })
      .then((res) => {
        listData.splice(0, listData.length, ...res.result);
      })
      .finally(() => {
        uni.hideLoading();
      });
  };

  onShow(() => {
    initTemplate();
    initStorage();
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
    width: 70%;
    display: flex;
    flex-direction: column;
  }

  .right-content {
    width: 100px;
    /* Adjust as needed */
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
