<template>
  <view
    :class="['other-message','common-content-left']"
  >
    <aiChatText :text-vale="showContent" @aiContentChange="aiContentChange" :can-edit="canEdit"/>
    <tui-row
      v-if="iconArray && iconArray.length>0"
      style="margin-top: 10px; height: 28px;"
      :isFlex="true"
      justify="end"
    >
      <tui-col
        v-for="(item) in iconArray"
        :key="item.type"
        :span="2"
        :offset="1"
        style="text-align: right;"
      >
        <tui-icon
          class="iconfont"
          class-prefix="icon"
          :name="item.icon"
          color="#666666"
          size="18"
          @click="iconTypeClick(item.type)"
        />
      </tui-col>
      <tui-col
        v-if="showFourBtn"
        key="2"
        :span="2"
        :offset="1"
        style="text-align: right;"
      >
        <tui-icon
          :class="['iconfont', {'disabled': isZanDisable}]"
          class-prefix="icon"
          :name="isdianzan?'x-dianzan_shixin-01': 'x-dianzan'"
          :color="isdianzan? '#FFB700': '#666666' "
          size="18"
          @click="iconTypeClick(2)"
        />
      </tui-col>
      <tui-col
        v-if="showFourBtn"
        key="3"
        :span="2"
        :offset="1"
        style="text-align: right;"
      >
        <tui-icon
          :class="['iconfont', {'disabled': isCaiDisable}]"
          class-prefix="icon"
          :name="isdiancai?'x-diancai_shixin': 'x-diancai_moren'"
          :color="isdiancai? '#FFB700': '#666666' "
          :size="18"
          @click="iconTypeClick(3)"
        />
      </tui-col>
    </tui-row>
    <view style="text-align: end;color:#999;">{{showContent.trim().length}}/2000字</view>
  </view>
</template>

<script lang="ts">
  export default {
    name: 'AIOtherMessageCell',
  };
</script>

<script lang="ts" setup>
import aiQuestionAnswerStore from '@/uni-module-common/store/aiQuestionAnswer';
import aiChatText from './ai-chat-text.vue';
import { ref,watch,computed } from 'vue';
const emit = defineEmits(['aiContent'])
const instance = getCurrentInstance();
const aiStore = aiQuestionAnswerStore();
const questionAnswerList = computed(() => aiStore.getQuestionAnswerList);
const props = defineProps({
  answerObj: {
      type:  Object,
      default: () => {},
    },
    index: {
      type: Number,
      default: 0,
    },
    lastIndex: {
      type: Boolean,
      default: false,
    },
    isAnimation: {
      type: Boolean,
      default: false,
    },
    isHistory: {
      type: Boolean,
      default: false,
    },
    canEdit: {
      type: Boolean,
      default: false,
    },
  });
  const timeIndex = ref(0);
  const timer = ref(null);
  const showContent = ref('');
  const isdiancai = ref('');
  const isdianzan = ref('');

  const iconArray = computed(()=>{
      const ary = props.isHistory ? [{
        name: 'fuzhi',
        icon: 'x-fuzhi',
        type: 1,
      }] : [
        // {
        //   name: 'zhongxinfasong',
        //   icon: 'x-zhongxinfasong',
        //   type: 0,
        // },
        // {
        //   name: 'fuzhi',
        //   icon: 'x-fuzhi',
        //   type: 1,
        // },
        // {
        //   name: 'dianzan',
        //   icon: 'x-dianzan',
        //   iconSelect: 'x-dianzan_shixin-01',
        //   type: 2,
        // },
        // {
        //   name: 'diancai',
        //   icon: 'x-diancai_moren',
        //   iconSelect: 'x-diancai_shixin',
        //   type: 3,
        // },
      ];
      !props.isHistory && !props.lastIndex && ary.shift();
      return showFourBtn ? ary : [];
    });
    const replaceContent= computed(()=>{
      return questionAnswerList[props.index - 1].content;
    });
    const isZanDisable= computed(()=> {
      return props.answerObj.isCai;
    });
    const isCaiDisable= computed(() =>{
      return props.answerObj.isZan;
    });
    const showFourBtn= computed(()=> {
      return props.answerObj.recordId !== 0 && props.answerObj.recordId !== null;
    });
  watch(
    () => props.answerObj,
    (newValue,oldValue )=> {
        showContent.value = props.answerObj.content;
        isdiancai.value = props.answerObj.isCai;
        isdianzan.value = props.answerObj.isZan;
    },
    {
      immediate: true, // 初始化时让handler调用一下
      deep: true, // 深度监视
    }
    );
   function iconTypeClick(value) {
      const detailId = questionAnswerList[props.index].detailId;
      switch (value) {
        case 0:
         aiStore.setIsRegenerate(true);
          // 本地维护数组进行重新生成
          aiStore.replaceAnswerQuestionMsg({ obj: {}, index: props.index, chatType: 2 });
          // 重新生成
          aiStore.addSendMessage(replaceContent);
          break;
        case 1:
          {
            const params = {
              detailId,
              operateType: 3,
              operateFlag: true,
            };
            saveAnswerFeedback(params, () => {});
            // 复制
            // this.$copyText(this.answerObj.content).then(
            //   (e) => {
            //     console.log('copy arguments e:', e);
            //     Toast.success('复制成功!');
            //   },
            //   (e) => {
            //     console.log('copy arguments e:', e);
            //     Toast.error('复制失败!');
            //   },
            // );
          }
          break;
        case 2:
          {
            if (isZanDisable) return;
            // 点赞
            const params = {
              detailId,
              operateType: 1,
              operateFlag: !isdianzan.value,
            };
            saveAnswerFeedback(params, () => {
              const dianzan = !isdianzan.value;
              aiStore.setChatAnswerFeedback(
                { operateType: 1, operateFlag: dianzan, index: props.index },
              );
            });
          }
          break;
        case 3:
          {
            if (isCaiDisable) return;
            // 点踩
            const params = {
              detailId,
              operateType: 2,
              operateFlag: !isdiancai.value,
            };
            saveAnswerFeedback(params, () => {
              const diancai = !isdiancai.value;
              aiStore.setChatAnswerFeedback(
                { operateType: 2, operateFlag: diancai, index: props.index },
              );
            });
            // console.log(this.$refs.diancai);
            // this.isdiancai = !this.isdiancai;
          // this.$eventBus.$emit('diancai', this.isdiancai);
          }
          break;
        default:
          break;
      }
    };
    function saveAnswerFeedback(params, callback) {
      instance?.proxy
      ?.$uniAjax({
        url: '/csc/aigc/save-answer-feedback',
        method: 'POST',
        data: {
          params,
          },
      }).then((res) => {
        // console.log(res);
        callback();
      }).catch((err) => {
        uni.showToast({
        title: err.message || '网络异常，请稍后重试',
        duration: 3000,
        icon: 'none'
      });
      });
    };
    function animationFrame(contentall) {
      if (timer.value) return;
      let showContentstr = '';
      timer.value = setInterval(() => {
        if (timeIndex.value < contentall.length) {
          const str = contentall.charAt(timeIndex.value);
          // console.log(contentall.charAt(timeIndex.value));
          showContentstr += str;
          showContent.value = showContentstr;
          timeIndex.value += 1;
        } else {
          // console.log('结束了');
          timeIndex.value = 0;
          clearInterval(timer.value);
          timer.value = null;
        }
      }, 50);
      return showContentstr;
    };

    function aiContentChange(newContent:string) {
      showContent.value = newContent;
      emit('aiContent',newContent)
    }

    // animationFrame(contentall) {
    //   // eslint-disable-next-line no-debugger
    //   debugger;
    //   let index = 0;
    //   let requestId = 0; // 声明 requestId 变量
    //   let startTime = 0;
    //   const interval = 100; // 设置间隔为 100 毫秒
    //   let showContentstr = '';
    //   const animate = (timestamp) => {
    //     if (!startTime) {
    //       startTime = timestamp;
    //       // console.log('startTime----', startTime);
    //     }
    //     const elapsed = timestamp - startTime;
    //     // console.log('elapsed----', elapsed);
    //     if (elapsed >= interval) {
    //       startTime = timestamp;
    //       if (index < contentall.length) {
    //         // console.log('index---', index);
    //         const str = contentall.charAt(index);
    //         console.log(contentall.charAt(index));
    //         showContentstr += str;
    //         this.showContent = showContentstr;
    //         index += 1;
    //       } else {
    //         console.log('结束了');
    //         contentall = '';
    //         cancelAnimationFrame(requestId); // 停止动画
    //         requestId = null; // 重置 requestId 变量
    //         return;
    //       }
    //     }
    //     requestId = requestAnimationFrame(animate);
    //   };
    //   if (!requestId) {
    //     console.log('--------h是颠三倒四');
    //     requestId = requestAnimationFrame(animate);
    //   }
    // },
    // ...mapActions('aiQuestionAnswer', {
    //   addSendMessage: 'addSendMessage',
    //   replaceAnswerQuestionMsg: 'replaceAnswerQuestionMsg',
    //   setChatAnswerFeedback: 'setChatAnswerFeedback',
    //   setIsRegenerate: 'setIsRegenerate',
    // }),
</script>
<style lang='scss' scoped>
.other-message {
  align-self: flex-start; /* 别人的消息靠左对齐 */
  padding: 4px 10px;
  border: 2px solid transparent;
  border-radius: 4px 16px 16px;
  border-radius: 8px;
  background-color: white;
  background-image: linear-gradient(to right, #fff, #fff), linear-gradient(90deg, #52EF81,#3BEBF6 ,#ED81FF);
  background-origin: padding-box, border-box;
  background-clip: padding-box, border-box;
  text-align: left;
  word-wrap: break-word;
  white-space: pre-wrap;
}
.other-message-ai {
  padding: 8px 0;
  border-bottom: 1px solid #EAEAEA;
  font-size: 10px;
  color: #999;
}
.other-message .common-content-left{
  line-height: 1.5;
  text-align: right;
  text-align: left;
  font-weight: 400;
  font-size: 14px;
  color:#222;
}
.disabled {
  opacity: 0.5; /* 设置透明度为 0.5，使按钮看起来禁用 */
  cursor: not-allowed; /* 设置鼠标样式为不可用 */
  /* 添加其他禁用样式，如颜色、背景色等 */
}
</style>
