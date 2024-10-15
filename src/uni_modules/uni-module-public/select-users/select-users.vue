<template>
  <view>
    <tui-skeleton v-if="skeletonShow" background-color="white"></tui-skeleton>
    <view v-if="skeletonShow" class="tui-skeleton padding016">
      <view class="tui-skeleton-rect mt16" style="display: inline-block"> 学生联系录 </view>
      <view v-for="item in 4" :key="item" class="tui-skeleton-rect mt16"> 占位 </view>
    </view>
    <view v-show="!skeletonShow">
      <!-- <view v-if="stuGroups && stuGroups.length > 0"> -->
      <view>
        <!-- 搜索 固定 -->
        <view class="search-view">
          <view class="search-view-content">
            <tui-input
              :value="searchValue"
              padding="8px 16px"
              :size="28"
              border-color="#4AD975"
              is-fillet
              input-border
              placeholder="搜索联系人"
              placeholder-style="font-size: 14px; color: #999"
              @input="searchChange"
            >
              <template #left>
                <view class="thorui-align__center paddingright10">
                  <tui-icon name="search" color="#999" :size="16" unit="px"></tui-icon>
                </view>
              </template>
            </tui-input>
          </view>
          <view class="thorui-flex__between padding016" style="margin-bottom: 28rpx">
            <view
              :style="{ opacity: searchValue ? 0.3 : 1 }"
              @click.stop="allStuRadioChange(!!searchValue)"
            >
              <view class="checkbox-wrapper">
                <tui-icon
                  :name="allStuChecked ? 'circle-fill' : 'circle'"
                  :color="allStuChecked ? '#4ad975' : '#999'"
                  :size="18"
                  unit="px"
                ></tui-icon>
              </view>
              <text>全选</text>
            </view>
            <view v-if="userTypeTabShow" style="width: 184rpx">
              <tui-segmented-control
                :values="['学生', '老师']"
                :current="userTypeTab"
                radius="8px"
                active-color="#4ad975"
                :disabled="!!searchValue"
                @click="onUserTypeSwitch"
              ></tui-segmented-control>
            </view>
          </view>
        </view>
        <!-- 列表展示 -->
        <view v-if="stuGroups && stuGroups.length > 0 && !searchValue" class="list-view">
          <view class="list-content">
            <block v-for="(group, index) in stuGroups" :key="index">
              <tui-collapse
                class="collapse-view"
                :index="index"
                :current="group.current"
                :disabled="group.disabled"
                arrow-color="#999"
                @click="onCollapseChange($event, group)"
              >
                <template #title>
                  <tui-row class="thorui-align__center collapse-title">
                    <tui-col :span="15">
                      <view class="thorui-align__center">
                        <view class="checkbox-wrapper" @click.stop="groupRadioChange(group)">
                          <tui-icon
                            :name="group.checked ? 'circle-fill' : 'circle'"
                            :color="group.checked ? '#4ad975' : '#999'"
                            :size="18"
                            unit="px"
                          ></tui-icon>
                        </view>
                        <text class="fontsize16">{{ group.groupName }}</text>
                      </view>
                    </tui-col>
                    <tui-col :span="9">
                      <view class="paddingright20" style="text-align: right">
                        <text class="minor-text">
                          共{{ group.persons.length }}人 已选<text style="color: #4ad975">
                            {{ group.persons.filter((_: any) => _.checked).length }}</text
                          >人
                        </text>
                      </view>
                    </tui-col>
                  </tui-row>
                </template>
                <template v-if="group.current === index" #content>
                  <view
                    v-for="person in group.persons"
                    :key="person.userId"
                    class="collapse-content-item thorui-align__center"
                    @click="personRadiuChange(group, person)"
                  >
                    <view class="checkbox-wrapper" @click.stop="personRadiuChange(group, person)">
                      <tui-icon
                        :name="person.checked ? 'circle-fill' : 'circle'"
                        :color="person.checked ? '#4ad975' : '#999'"
                        :size="18"
                        unit="px"
                      ></tui-icon>
                    </view>
                    <text>{{ person.userName }}</text>
                  </view>
                </template>
              </tui-collapse>
            </block>
          </view>
        </view>
        <!-- 搜索结果展示 -->
        <view v-if="stuGroups && stuGroups.length > 0 && searchValue" class="list-view">
          <!-- 学生联系录 -->
          <view
            v-if="filterStuGroups && filterStuGroups.length > 0 && hasPerson4Search"
            class="thorui-align__center title-view"
          >
            <text class="ml8 fontsize16" style="color: #666">{{ userTypeDesc }}联系录</text>
          </view>
          <block v-for="group in filterStuGroups" :key="group.groupId">
            <block
              v-for="person in group.persons.filter((person: any) =>
                person.userName.includes(searchValue)
              )"
              :key="person.userId"
            >
              <view class="collapse-content-item ml16" @click="personRadiuChange(group, person)">
                <tui-row class="thorui-align__center" :gutter="5">
                  <tui-col :span="8">
                    <view class="thorui-align__center">
                      <view class="checkbox-wrapper" @click.stop="personRadiuChange(group, person)">
                        <tui-icon
                          :name="person.checked ? 'circle-fill' : 'circle'"
                          :color="person.checked ? '#4ad975' : '#999'"
                          :size="18"
                          unit="px"
                        ></tui-icon>
                      </view>
                      <text>{{ person.userName }}</text>
                    </view>
                  </tui-col>
                  <tui-col :span="16">
                    <view class="paddingright16" style="text-align: right">
                      <text class="minor-text">{{ group.groupName }}</text>
                    </view>
                  </tui-col>
                </tui-row>
              </view>
            </block>
          </block>
          <!-- 学生群组 -->
          <view
            v-if="filterStuGroups && filterStuGroups.length > 0"
            class="thorui-align__center title-view"
          >
            <text class="ml8 fontsize16" style="color: #666">{{ userTypeDesc }}群组</text>
          </view>
          <block v-for="group in filterStuGroups" :key="group.groupId">
            <view class="collapse-content-item ml16">
              <tui-row class="thorui-align__center" :gutter="5">
                <tui-col :span="15">
                  <view class="thorui-align__center">
                    <view class="checkbox-wrapper" @click.stop="groupRadioChange(group)">
                      <tui-icon
                        :name="group.checked ? 'circle-fill' : 'circle'"
                        :color="group.checked ? '#4ad975' : '#999'"
                        :size="18"
                        unit="px"
                      ></tui-icon>
                    </view>
                    <text>{{ group.groupName }}</text>
                  </view>
                </tui-col>
                <tui-col :span="9">
                  <view class="paddingright16" style="text-align: right">
                    <text class="minor-text">
                      共{{ group.persons.length }}人 已选<text style="color: #4ad975">
                        {{ group.persons.filter((_: any) => _.checked).length }}</text
                      >人
                    </text>
                  </view>
                </tui-col>
              </tui-row>
              <view class="minor-text paddingright16 ml25">
                包含：{{
                  group.persons
                    .filter((person: any) => person.userName.includes(searchValue))
                    .map((person: any) => person.userName)
                    .join(' ')
                }}
              </view>
            </view>
          </block>
        </view>
        <view v-if="stuGroups && stuGroups.length === 0" class="list-view">
          <xxt-empty
            :tip-message="`${
              userTypeTab === 0
                ? '您暂无班级权限，无法选择发送对象。如需发送，请联系学校管理员添加班级权限，或联系客服添加，教师专属免费客服：12556166'
                : '您暂无发送权限，请联系学校管理员分配权限'
            }`"
          />
        </view>
      </view>
      <!-- 底部占位view -->
      <view :class="{ height70: selectedUserNum === 0, height702516: selectedUserNum > 0 }"></view>
      <!-- 底部 -->
      <view v-if="selectedUserNum > 0" class="bottom-checked-view">
        <scroll-view scroll-x style="white-space: nowrap">
          <block
            v-for="group in stuGroups.filter((group: any) => group.checked)"
            :key="group.groupId"
          >
            <!-- 班级所有学生都被选中 -->
            <block
              v-if="
                group.persons.filter((person: any) => person.checked).length ===
                group.persons.length
              "
            >
              <view class="bottom-checked-btn" @click="groupRadioChange(group)">
                {{ formatSelectName(group.groupName) }}
              </view>
            </block>
            <block v-else>
              <block v-for="person in group.persons" :key="person.userId">
                <view
                  v-if="person.checked"
                  class="bottom-checked-btn"
                  @click="personRadiuChange(group, person)"
                >
                  {{ formatSelectName(person.userName) }}
                </view>
              </block>
            </block>
          </block>
        </scroll-view>
      </view>
      <view v-if="stuGroups && stuGroups.length > 0" class="bottom-view">
        <view class="circle-btn" @click="onNavigationBarButtonTapFunc">
          确定{{ `(${selectedUserNum})` }}
        </view>
      </view>
    </view>
  </view>
</template>

<script setup lang="ts">
import { useDebounceFn } from '@vueuse/core';
import { getSmsGroupUserList } from '@/uni-module-common/utils/bizCommon';
import { commonSelectUsersResult } from '@/uni-module-common/utils/uniEmitsProtocol';

const { isLogin, userInfo } = useStore('user');

// 学生/老师 切换 0学生 1老师
const userTypeTab = ref(0);
// 是否展示学生/老师切换
const userTypeTabShow = ref(true);
const userTypeDesc = computed(() => {
  return userTypeTab.value === 0 ? '学生' : '老师';
});

// 组织 人员列表
const groupList: any = ref([]);
// 班级 学生
const stuGroups: any = ref(null);
// 教师
// const teaGroups: any = ref([]);

/**
 * 选择联系人后的「确定」函数
 */
const onNavigationBarButtonTapFunc = () => {
  // ***********
  // 只过滤选择的班级 不进一步对未选的学生进行过滤，使用时需注意
  // ***********
  const result = stuGroups.value
    ? JSON.parse(JSON.stringify(stuGroups.value)).filter((group: any) => group.checked)
    : [];
  uni.$emit(commonSelectUsersResult, {
    stuGroups: result,
    groupType: userTypeTab.value === 0 ? 5 : 1 // 5学生 1老师
  });
  uni.navigateBack({
    delta: 1
  });
};

const skeletonShow = ref(true);

// 学生联系录
const allStuChecked = ref(false);

/**
 * 选中学生联系录
 */
const allStuRadioChange = (disabled: boolean) => {
  if (disabled) {
    return;
  }
  allStuChecked.value = !allStuChecked.value;

  stuGroups.value.forEach((group: any) => {
    group.checked = allStuChecked.value;
    group.persons.forEach((person: any) => {
      person.checked = allStuChecked.value;
    });
  });
};

/**
 * 选中学生联系录-班级
 */
const groupRadioChange = (group: any) => {
  if (group.checked) {
    if (group.persons.find((item: any) => !item.checked)) {
      group.persons.forEach((person: any) => {
        if (!person.checked) {
          person.checked = true;
        }
      });
    } else {
      group.persons.forEach((person: any) => {
        person.checked = false;
      });
      group.checked = false;
    }
  } else {
    group.checked = true;
    group.persons.forEach((person: any) => {
      person.checked = true;
    });
  }
};

// 选中的学生数量
const selectedUserNum = computed(() => {
  if (stuGroups.value) {
    let arr = stuGroups.value
      .filter((group: any) => group.checked)
      .map((group: any) => group.persons.filter((person: any) => person.checked).length);
    arr = arr && arr.length > 0 ? arr : [0];
    return arr.reduce((prev: number, curr: number) => {
      return prev + curr;
    });
  } else {
    return 0;
  }
});

/**
 *  选中学生联系录-班级下学生
 */
const personRadiuChange = (group: any, person: any) => {
  person.checked = !person.checked;
  group.checked = !!group.persons.find((item: any) => item.checked);
};

/**
 * 班级折叠
 * @param e
 * @param item
 */
const onCollapseChange = (e: any, item: any) => {
  const index = e.index;
  item.current = item.current === index ? -1 : index;
};

// 搜索输入内容
const searchValue = ref('');
const filterStuGroups: any = ref([]);
const hasPerson4Search = ref(false);

/**
 * 搜索输入
 */
const searchChange = useDebounceFn((e: any) => {
  searchValue.value = e;
  if (searchValue.value) {
    filterStuGroups.value = stuGroups.value.filter(
      (group: any) =>
        group.groupName.includes(searchValue.value) ||
        group.persons.find((person: any) => person.userName.includes(searchValue.value))
    );

    hasPerson4Search.value = filterStuGroups.value.find((group: any) =>
      group.persons.find((person: any) => person.userName.includes(searchValue.value))
    );
  }
}, 50);

const reloadData = async () => {
  // 新平台的组织类型：5学生组织 1教师组织
  // 老平台的组织类型：1学生组织 2教师组织
  const stuGroupType = userInfo.value.useXinzxData ? 5 : 1;
  const teaGroupType = userInfo.value.useXinzxData ? 1 : 2;
  const groupType4Filter = userTypeTab.value === 0 ? stuGroupType : teaGroupType;

  if (groupList.value && groupList.value.length > 0) {
    stuGroups.value = groupList.value.filter(
      (item: any) => item.groupType === groupType4Filter && item.persons.length > 0
    );
    return;
  }
  const result = await getSmsGroupUserList();
  groupList.value = result;
  stuGroups.value = groupList.value.filter(
    (item: any) => item.groupType === groupType4Filter && item.persons.length > 0
  );
};

/**
 * 学生/老师 切换 重新查
 */
const onUserTypeSwitch = (e: any) => {
  userTypeTab.value = e.index;
  // 清空之前的选中状态
  allStuChecked.value = false;
  stuGroups.value.forEach((group: any) => {
    group.checked = allStuChecked.value;
    group.persons.forEach((person: any) => {
      person.checked = allStuChecked.value;
    });
  });
  reloadData();
};

/**
 * 格式化底部展示的班级名称或学生姓名
 */
const formatSelectName = (name: string) => {
  return !name || name.length <= 8 ? name : `${name.slice(0, 4)}...${name.slice(-4)}`;
};

/**
 * 下拉刷新被触发
 */
const onRefresherrefresh = async () => {
  // 已选的userIds
  let userIds: any = [];
  if (stuGroups.value && stuGroups.value.length > 0) {
    userIds = stuGroups.value
      .filter((group: any) => group.checked)
      .map((group: any) => {
        return group.persons
          .filter((person: any) => person.checked)
          .map((person: any) => `${group.groupId}-${person.userId}`);
      })
      .flat();
  }
  // 重置数据
  groupList.value = [];
  stuGroups.value = null;
  // 加载数据
  await reloadData();
  // 回显
  if (userIds && userIds.length > 0) {
    stuGroups.value.forEach((group: any) => {
      group.persons.forEach((person: any) => {
        if (userIds.includes(`${group.groupId}-${person.userId}`)) {
          person.checked = true;
          group.checked = true;
        }
      });
    });
  }
  // 关闭下拉刷新动画
  uni.stopPullDownRefresh();
};

/**
 * 监听下拉刷新
 */
onPullDownRefresh(() => {
  onRefresherrefresh();
});

onShow(() => {
  uni.hideLoading();
});

/**
 * 传参解释
 * uni.getStorageSync('commonSelectUsersParams')
 * userIds 用于选中状态回显。数据结构：组织id+'-'+用户id 组成的字符串列表
 * groupType 用于学生/老师切换默认值，5学生 1老师
 * switchRoleShow 是否展示学生/老师切换 必须是布尔值 默认展示
 */
onLoad(async () => {
  if (!isLogin.value) {
    return;
  }
  // 页面回显参数
  const params = uni.getStorageSync('commonSelectUsersParams'); // 取出缓存数据
  // 用户类型切换默认设置
  if ([5, 1].includes(params.groupType)) {
    userTypeTab.value = params.groupType === 5 ? 0 : 1;
  }
  // 用户类型切换是否展示默认设置
  if (typeof params.switchRoleShow === 'boolean') {
    userTypeTabShow.value = params.switchRoleShow;
  }
  // 加载数据
  await reloadData();
  // 关闭骨架
  skeletonShow.value = false;
  // 组织人员回显
  if (params && params.userIds && params.userIds.length > 0) {
    stuGroups.value.forEach((group: any) => {
      group.persons.forEach((person: any) => {
        if (params.userIds.includes(`${group.groupId}-${person.userId}`)) {
          person.checked = true;
          group.checked = true;
        }
      });
    });
  }
  // 销毁缓存数据
  uni.removeStorageSync('commonSelectUsersParams');
});
</script>

<style scoped lang="scss">
.checkbox-wrapper {
  display: inline-block;
  width: 25px;
  height: 20px;
  line-height: 20px;
}
.search-view {
  position: fixed;
  z-index: 99;
  width: 100%;
  background-color: #fff;
  border-bottom: 1px solid #f2f2f2;
  .search-view-content {
    display: flex;
    align-items: center;
    padding: 0 16px;
    height: 66px;
  }
}
.ml8 {
  margin-left: 8px;
}
.list-view {
  padding-top: calc(66px - 2px + 44px);
  // border: 1px solid red;
  .title-view {
    padding: 14px 16px;
    background-color: #f9f9f9;
    font-weight: bold;
    font-size: 14px;
    color: #666;
  }
  .collapse-view {
    .collapse-title {
      padding: 14px 16px;
      // border-top: 1px solid #f2f2f2;
      border-bottom: 1px solid #f2f2f2;
    }
  }
  .collapse-content-item {
    margin-left: 25px;
    padding: 14px 0;
    border-bottom: 1px solid #f2f2f2;
    text {
      font-size: 14px;
    }
  }
}
.minor-text {
  font-size: 12px !important;
  color: #999;
}
.bottom-view {
  display: flex;
  position: fixed;
  bottom: 0;
  z-index: 9999;
  align-items: center;
  padding: 0 5%;
  width: 90%;
  height: 70px;
  background-color: #fff;
  .circle-btn {
    border-radius: 23px;
    width: 100%;
    height: 46px;
    background-color: #4ad975;
    line-height: 46px;
    text-align: center;
    font-weight: bold;
    font-size: 16px;
    color: #fff;
  }
}
.bottom-checked-view {
  position: fixed;
  bottom: 70px;
  z-index: 9999;
  background-color: #fff;
  padding: 16px 5% 0 5%;
  width: 90%;
  .bottom-checked-btn {
    display: inline-block;
    background-color: #eaeaea;
    font-size: 12px;
    border-radius: 4px;
    height: 25px;
    line-height: 25px;
    padding: 0 8px;
    margin-right: 8px;
  }
}
.height70 {
  height: 70px;
}
.height702516 {
  height: calc(70px + 25px + 16px);
}
.padding016 {
  padding: 0 16px;
}
.mt16 {
  margin-top: 16px;
}
.paddingright10 {
  padding-right: 10px;
}
.paddingright20 {
  padding-right: 20px;
}
.paddingright16 {
  padding-right: 16px;
}
.fontsize16 {
  font-size: 16px;
}
.ml16 {
  margin-left: 16px;
}
.ml25 {
  margin-left: 25px;
}
.bottom-checked-view ::-webkit-scrollbar {
  display: none;
  width: 0 !important;
  height: 0 !important;
  appearance: none;
  background: transparent;
}
</style>
