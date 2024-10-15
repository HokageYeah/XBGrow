export const buildParam = (
  appkey,
  connectSig,
  startSig,
  timestamp,
  userId,
  refText,
  coreType,
  paragraph_need_word_score
) => {
  const paramList = [];
  // 创建连接
  const paramsConnect = {
    cmd: 'connect',
    param: {
      sdk: {
        version: 16777472,
        source: 4,
        protocol: 1
      },
      app: {
        applicationId: appkey,
        sig: connectSig, // 初始化校验码
        timestamp // 初始化时间戳
      }
    }
  };
  paramList.push(JSON.stringify(paramsConnect));
  // 声通开始评分参数
  const paramsStart = {
    cmd: 'start',
    param: {
      app: {
        applicationId: appkey,
        sig: startSig,
        userId,
        timestamp
      },
      audio: {
        audioType: 'mp3',
        sampleRate: 16000,
        channel: 1,
        sampleBytes: 2
      },
      request: {
        getParam: 0,
        coreType,
        refText,
        phoneme_output: 0,
        paragraph_need_word_score
      }
    }
  };

  paramList.push(JSON.stringify(paramsStart));
  const paramsStop = { cmd: 'stop' };
  paramList.push(JSON.stringify(paramsStop));
  return paramList;
};
