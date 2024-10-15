/* eslint-disable no-debugger */
import { defineStore } from 'pinia';
/**
 * isSelf 是否是自己
 * content 内容
 * isLast 是否是最后一条
 * isZan 是否点赞
 * isCai 是否点踩
 * index 当前数目
 * num 一问一答当前条数
 * type 普通对话： **chat**， 教案：**lesson**，  翻译：**translate**
 * detailId 对话详情id
 * recordId 对话记录id
 * */
/* eslint-disable no-shadow */
interface aiQuestionAnswerState {
  questionAnswerList: object[],
  sendMessage: String,
  chatType: Number, // 默认值0 标识添加， 1 标识替换自己的问答， 2 标识替换chat的问答  3 替换追加
  isLoading: boolean, // 是否显示loading 正在打字
  isRegenerate: boolean, // 是否重新生成
  isAnswerComplete: boolean, // 是否问答回答完成
}
const aiQuestionAnswerStore = defineStore({
  id: 'ai-question-answer',
  state: (): aiQuestionAnswerState => ({
    questionAnswerList:[],
    sendMessage:'',
    chatType:0,
    isLoading:false,
    isRegenerate:false,
    isAnswerComplete:true
  }),
  getters: {
    getQuestionAnswerList(): object[] {
      return this.questionAnswerList;
    },
    getSendMessage(): String {
      return this.sendMessage;
    },
    getChatType(): Number {
      return this.chatType;
    },
    getIsRegenerate(): boolean {
      return this.isRegenerate;
    },
  },
  actions: {  // 添加问答消息
    addAnswerQuestionMsg( obj) {
      this.questionAnswerList.push(obj)
    },
    // 往数组首位追加问答
    UnshiftAnswerQuestionMsg(objAry) {
      this.questionAnswerList.unshift(...objAry);
    },
    // 替换问答消息
    replaceAnswerQuestionMsg({ obj, index, chatType }) {
       // 先判断是否数组越界
    if (index < 0 || index >= this.questionAnswerList.length) {
      return;
    }
    if (chatType === 1) { // 编辑自己的问答， 后面的问答全部删除
      this.questionAnswerList[index] = obj;
      this.questionAnswerList.splice(index + 1);
    } else if (chatType === 2) { // 对chat的问答不满意 重新生成
      this.questionAnswerList.splice(index, 1);
    } else if (chatType === 3) { // 替换追加
      // console.log('查看追加-----', obj);
      this.questionAnswerList.splice(index, 1, obj);
      // console.log('查看数据-----', state.questionAnswerList);
    }
    this.chatType = chatType;
    },
    // 要发送消息
    addSendMessage(value) {
      this.sendMessage = value;
      // console.log('this.sendMessage-----------',this.sendMessage)
    },
    // 设置chattype 的状态
    setChatType(value) {
      // console.log('setChatTypesetChatTypesetChatType----'+value)
      this.chatType = value;
    },
    // 设置是否loading
    setLoading( value) {
      this.isLoading = value;
    },

    // 为一问一答设置detailId recordId
    setQuestionAnswerDetailId({ detailId, recordId, index }) {
      const obj = this.questionAnswerList[index];
      obj.detailId = detailId;
      obj.recordId = recordId;
    },

    // 为chat设置点踩或者点赞
    // operateType 1点赞，2点踩
    // operateFlag false取消，true是
    setChatAnswerFeedback({ operateType, operateFlag, index }) {
      const obj = this.questionAnswerList[index];
      obj[operateType === 1 ? 'isZan' : 'isCai'] = operateFlag;
    },

    // 清空questionAnswerList 列表
    clearQuestionAnswerList() {
      this.questionAnswerList = [];
    },
    // 设置是否重新生成
    setIsRegenerate(value) {
      this.isRegenerate = value;
    },
    // 设置是否isAnswerComplete 问答是否完成 默认完成true
    setIsAnswerComplete(value) {
      this.isAnswerComplete = value;
    },},
});

export default aiQuestionAnswerStore;
