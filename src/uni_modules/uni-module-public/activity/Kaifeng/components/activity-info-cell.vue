<template>
  <tui-row
    v-for="act in resultList"
    :key="act.newsId"
    class="act-row"
    margin-bottom="10px"
    :gutter="10"
    @tap="go2Detail(act.newsUrl)"
  >
    <tui-col :span="8" class="book-img">
      <tui-lazyload-img
        width="200rpx"
        height="146rpx"
        radius="16rpx"
        model="aspectFit"
        :src="act.newsImage || ''"
        background-color="#ffffff"
      ></tui-lazyload-img>
    </tui-col>
    <tui-col :span="16">
      <view>
        <tui-text
          class="act-row-title"
          color="#222222"
          :text="`${act.newsTitle}打开了多久啊可是大家来撒娇的了`"
        ></tui-text>
        <tui-text
          size="24"
          color="#666666"
          :text="utils.parseTime(act.createDate, '{y}-{m}-{d}')"
        ></tui-text>
      </view>
    </tui-col>
  </tui-row>
</template>

<script setup lang="ts">
import utils from '@/uni-module-common/utils';
withDefaults(defineProps<{ resultList: any[] }>(), {
  resultList: () => []
});

const go2Detail = (url: string) => {
  console.log('url', url);
};
</script>

<style scoped lang="scss">
.book-img {
  text-align: center;
}
.act-row {
  margin-top: 16px;
  display: flex;
  &-title {
    margin-bottom: 8px;
    color: #222222;
    line-height: 20px;
    /* //隐藏多余行数 */
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    /* //规定显示几行，其余行数用小数点代替 */
    -webkit-line-clamp: 2;
    /* //规定为垂直方向排列 */
    -webkit-box-orient: vertical;
    /* //文字正常换行 */
    white-space: normal;
  }
}
.act-row:first-child {
  margin-top: 0;
}
</style>
