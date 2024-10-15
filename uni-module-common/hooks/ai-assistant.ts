import { globalData } from '@/uni-module-common/utils/global';
import  aiQuestionAnswerStore  from '@/uni-module-common/store/aiQuestionAnswer';
import { ref,onBeforeMount,getCurrentInstance, onMounted,onUnmounted, watch,computed } from "vue";
const aiStore = aiQuestionAnswerStore();
const wss = globalData.wss;

export const aiAssistant=()=> {
  const instance = getCurrentInstance();
  const refreshIsLoading = ref(false);
  const isDisabled = ref(true);
  const chatTypeId = ref(false);
  const recordId = ref(null);// 对话记录id。新建会话时不传
  const detailId = ref(null);// 用户详情id。新建时不传，重新生成回答时传
  const questionContent = ref('');// 用户提问内容
  const answerContent = ref('');// 助手回复内容
  const modelName = ref('');// 模型名称
  const token = ref('');// token
  const stopBtnShow = ref(false);
  const isSocketStop = ref(false);
  const type = ref('chat');
  const userId = ref(0); //用户的webId
  const wsUrl = ref('');
  const aiParams = ref({}); // 随着业务的增加，参数是不定的，故增加该参数

  const startIndex =ref(0);
  const contentall = ref('');

  const questionAnswerList = computed(() => aiStore.getQuestionAnswerList);
  // const sendMessage = computed(() => aiStore.getSendMessage);
  const chatType = computed(() => aiStore.getChatType);
  const isRegenerate = computed(() => aiStore.getIsRegenerate);
  const canSendMessage = ref(false);
  // 连接
  let socketTask:any = null
  // 是否主动关闭连接
  let meClose = false
  // 地址 写你的后端连接地址
  let url = 'wss://aichat.xxt.cn'
  // 重连定时器
  let Time:any = null
  // WebSocket 连接次数
  let connectCount = 0;
  // 最大重连次数
  const maxConnectCount = 5;
  // 心跳定时器
  let XTime:any = null
  // watch([aiParams,sendMessage],([newAiParams,newMessagevalue])=>{
  //   const arr = Object.keys(newAiParams);
  //   if (newMessagevalue.length !== 0 || (arr.length>0)) {
  //     sendMsg()
  //   };
  // })
  function setAIParams (value:object) {
    aiParams.value = value || {};
    canSendMessage.value = false;
  }

  // 开启连接
const sokcet = (sendMsgFlag=false) => {
	//判断是否有websocet对象，有的话清空
	if (socketTask) {
		socketTask.close()
		socketTask = null;
	}
	// 进行连接
	socketTask = uni.connectSocket({
		url: url,
		success(data) {
			clearInterval(XTime) //关闭心跳定时器=
		}
	});
	socketTask.onOpen((res) => {
    if(sendMsgFlag){
      sendMsg()
    }
	});
	// 监听连接失败
	socketTask.onError((err) => {
		if (!meClose && Time == null) { //判断是否主动关闭进行重新连接
			reconnect()
		}
	})
	// 监听连接关闭close
	socketTask.onClose((e) => {
    console.log('连接关闭close===============')
	})
	// 监听收到信息
	socketTask.onMessage(function(res:any) {
		// 接收数据后回调
		let data = JSON.parse(res.data).data
		// store.commit("getMessage", data)
    dealSocketMessage(res);
	});
}
// 重新连接
const reconnect = () => {
	setTimeout(() => {
		// 确保已经关闭后再重新打开
		socketTask.close()
		socketTask = '';
		console.log("重新连接中...");
		sokcet()
	}, 5000);

}
//向后端发送信息
const sendMsg = () => {
  const { userInfo } = useStore('user');
  const wid = userInfo.value.wid;
  const msg = { user_id: wid,...aiParams.value};
  socketTask.send({
    data:JSON.stringify(msg),
    success:function(){
      stopBtnShow.value = true;
      getSocketData();
    },
    fail:function(error) {
      stopBtnShow.value = false;
      aiStore.setLoading(false);
      aiStore.setIsAnswerComplete(true);
    }
  });
}
// 手动关闭连接
const stop = () => {
	// 主动关闭连接
	meClose = true
	socketTask.close({
		success() {
			clearInterval(Time) //关闭定时器
			clearInterval(XTime) //关闭心跳定时器
			Time = null
			// 确保已经关闭
			socketTask = null;
		}
	})
}

  function getSocketData() {
    startIndex.value = 0;
    contentall.value = '';
  }
  function dealSocketMessage(res:any) {
  // uni.onSocketMessage(function (res) {
        const isobj = typeof res.data === 'object';
        const e = isobj ? res.data : JSON.parse((res.data));
        if (isSocketStop.value) return;
        // e.content = e.content.replace(/\\n/g, '\n');
        contentall.value += e.content;
        if (startIndex.value === 0) {
          stopBtnShow.value = true;
          aiStore.setLoading(false);
          // 第一次推流过来创建chat回答
          createVuexDara(contentall.value, false, type.value, false);
        } else {
          // 后续推流过来向创建的chat中追加答案
          createVuexDara(contentall.value, false, type.value, true);
        }
        startIndex.value += 1;
        if (e.is_end === 'true') {
          stop();
          aiStore.setIsAnswerComplete(true);
          stopBtnShow.value = false;
          answerContent.value = contentall.value;
          modelName.value = e.bot_type || '1';
          token.value = e.total_tokens || '1';
          // this.$ws.closeWebSocket();
          // this.createVuexDara(contentall, false, this.type);
          // 每次获取完chat内容后重置chatType状态为初始状态0
          aiStore.setChatType(0);
          // 调用接口保存问答记录
          // saveChatContent(); 20240424 暂不保存，明天来了问下
        }
  };
  function createVuexDara(content, isSelf, type, isappend, detailId = 0, recordId = 0) {
    const msgdata = {
      isSelf,
      content,
      isZan: false,
      isCai: false,
      index: questionAnswerList.value.length,
      type,
      detailId,
      recordId,
    };
    if (!isappend) {
      aiStore.addAnswerQuestionMsg(msgdata);
    } else {
      aiStore.replaceAnswerQuestionMsg(
        { obj: msgdata, index: questionAnswerList.value.length - 1, chatType: 3 },
      );
    }
  }
  function saveChatContent() {
    const params = {
      modelName: modelName.value,
      token: token.value,
      chatTypeId: chatTypeId.value,
      questionContent: questionContent.value,
      answerContent: answerContent.value,
    };
    if (recordId.value) {
      params.recordId = recordId.value;
    }
    if (detailId.value && isRegenerate.value) {
      params.detailId = detailId.value;
    }
    instance?.proxy
      ?.$uniAjax({
        url: '/csc/aigc/save-chat-content',
        method: 'POST',
      }).then((res) => {
      detailId.value= res.detailId;
      recordId.value = res.recordId;
      const one = questionAnswerList.value.length - 1;
      const two = questionAnswerList.value.length - 2;
      aiStore.setQuestionAnswerDetailId(
        { detailId: detailId.value, recordId: recordId.value, index: one },
      );
      aiStore.setQuestionAnswerDetailId(
        { detailId: detailId.value, recordId:recordId.value, index: two },
      );
      aiStore.setIsRegenerate(false);
    }).catch((err) => {
      uni.showToast({
        title: err.message.answerContent || '网络异常，请稍后重试',
        duration: 3000,
        icon: 'none'
      });
    });
  }
  function stopClick() {
    uni.closeSocket();
    stopBtnShow.value = false;
    isSocketStop.value = true;
    aiStore.setLoading(false);
    aiStore.setIsAnswerComplete(true);
    aiStore.setChatType(0);
  }
  function btnclick() {
    stopBtnShow.value = !stopBtnShow.value;
  }
  function onRefresh() {
    refreshIsLoading.value = false;
  }
  uni.onSocketClose(function (res) {
    console.log('WebSocket 已关闭！-----------');
  });
  return {
    stopBtnShow,
    questionAnswerList,
    chatType,
    isRegenerate,
    setAIParams,
    sokcet,
    stop,
    sendMsg,
    getSocketData,
    stopClick,
    btnclick,
    onRefresh,
    addAnswerQuestionMsg: aiStore.addAnswerQuestionMsg,
    replaceAnswerQuestionMsg: aiStore.replaceAnswerQuestionMsg,
    addSendMessage: aiStore.addSendMessage,
    setChatType: aiStore.setChatType,
    setLoading: aiStore.setLoading,
    setIsAnswerComplete: aiStore.setIsAnswerComplete,
    setQuestionAnswerDetailId: aiStore.setQuestionAnswerDetailId,
    clearQuestionAnswerList: aiStore.clearQuestionAnswerList,
    UnshiftAnswerQuestionMsg: aiStore.UnshiftAnswerQuestionMsg,
    setIsRegenerate: aiStore.setIsRegenerate,
  };
}
