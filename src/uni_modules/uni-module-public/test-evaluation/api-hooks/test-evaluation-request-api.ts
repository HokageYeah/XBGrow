import ajax from '@/uni-module-common/http';

/**
 *   根据图书及目录获取试题列表
 */
export function getQuestionByBookCatalog(data: any) {
  return ajax({
    url: '/xinzx-resource/book-etest/get-question-by-book-catalog',
    method: 'POST',
    data,
    custom: {
      showLoading: false
    }
  });
}

// 根据ISBN获取图书基本信息
export const getBookBaseByIsbnApplet = (data: any) => {
  const url = '/book-reading/book-base/get-book-base-by-isbn-applet';
  return ajax({
    url,
    method: 'POST',
    data
  });
};

// 提交作答结果
export const submitPaperQuestAnswer = (data: any) => {
  const url = '/xinzx-resource/book-etest/submit-paper-quest-answer';
  return ajax({
    url,
    method: 'POST',
    data
  });
};

// 提交作答结果
export const getConsumeReward = (data: any) => {
  const url = '/xinzx-resource/book-etest/consume-reward';
  return ajax({
    url,
    method: 'POST',
    data
  });
};
