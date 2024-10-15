function get_comment_of_total() {
  return {
    total_0: ['放松心情，再来一遍吧！', '没有听清楚，再来一遍吧！'],
    total_1: [
      '没关系，调整好状态，加油！',
      '还有一定的提升空间，继续努力呀！',
      '还有很大的提升空间，要加油呀！'
    ],
    total_2: [
      '不积跬步无以至千里，再来一遍吧！',
      '还需多多练习哦！',
      '集中精神，注意细节。',
      '璞玉出山，还需切磋琢磨。',
      '再接再厉！'
    ],
    total_3: [
      '你很有潜力哦！',
      '你很认真，如果能用这样的态度多练几遍，相信会更好！',
      '不错！再注意一些小细节就更好了！',
      '你可以做得更棒！',
      '再加把劲儿！'
    ],
    total_4: [
      '你离成功只有一星之遥！',
      '再加把劲就完美啦！',
      '还欠画龙点睛之功。',
      '很不错，继续加油！'
    ],
    total_5: [
      '恭喜你，斩获五颗星！',
      '你真棒！快分享给小伙伴听一听吧！',
      '准确、流利，还很有感情！',
      '你那富有感染力的朗读，把我带进了一个美妙的世界！',
      '完美！',
      '行云流水，字正腔圆，感情丰富，在下佩服！',
      '真厉害！给自己点个赞吧！',
      '余音绕梁，三日不绝！',
      '我对你的景仰有如滔滔江水，连绵不绝！',
      '自然流畅，字正腔圆，声情并茂，继续保持哟！'
    ]
  };
}
function get_comment_of_integrity() {
  return {
    integrity_0: ['没有听清楚！加油，再来一次吧！'],
    integrity_1: ['注意不要丢字漏字哦！'],
    integrity_2: [
      '检查一下，是不是丢字漏字了？',
      '如果能再完整些就更好了！',
      '比较完整，再接再厉！'
    ],
    integrity_3: ['完整度很高，你真棒！', '很完整哦！', '太棒了，跟文段完全契合，继续保持哟！']
  };
}
function get_comment_of_accuracy() {
  return {
    accuracy_0: ['你的声音好像不太清晰，清清嗓子再来读一遍吧！', '抱歉！没有听清楚，再来一遍吧！'],
    accuracy_1: ['哎呀，错字了，要加油呀！'],
    accuracy_2: ['个别发音不是很准确！', '个别文字读准就更棒了！'],
    accuracy_3: [
      '很好，继续加油！',
      '咬字清晰，读音准确，你就是“小播音员”！',
      '发音准确，字正腔圆，可以参加朗读比赛啦！',
      '几乎每一个字音都很准确，保持这种水准呀！',
      '太棒了，发言标准，字正腔圆，继续保持哟！'
    ]
  };
}
function get_comment_of_fluency() {
  return {
    fluency_0: ['没有听清楚！加油！', '我好像没听清楚你的声音！', '没有听清楚，再来一遍吧！'],
    fluency_1: [
      '请多多练习，熟悉文章才能流利哦！',
      '再熟练一点，你一定能更流利！',
      '哎呀，不太流利，要加油呀！'
    ],
    fluency_2: ['读得不错！离行云流水就差一点点啦！', '多多练习，你能更流利！'],
    fluency_3: [
      '行云流水，一气呵成！',
      '自然流畅，行云流水，实在是太棒了！',
      '读得真棒！行云流水说得就是你吧！',
      '太棒了，自然流畅，一气呵成，继续保持哟！'
    ]
  };
}
function getStarNumOfTotalScore(score) {
  let starNum; // 星星数
  if (score === 0) {
    starNum = 0;
  } else if (score < 60) {
    starNum = 1;
  } else if (score < 70) {
    starNum = 2;
  } else if (score < 80) {
    starNum = 3;
  } else if (score < 90) {
    starNum = 4;
  } else {
    starNum = 5;
  }
  return parseInt(starNum);
}
function getCommentsOfTotalScorecomments(score) {
  let comments = [];
  if (score === 0) {
    comments = get_comment_of_total().total_0;
  } else if (score < 60) {
    comments = get_comment_of_total().total_1;
  } else if (score < 70) {
    comments = get_comment_of_total().total_2;
  } else if (score < 80) {
    comments = get_comment_of_total().total_3;
  } else if (score < 90) {
    comments = get_comment_of_total().total_4;
  } else {
    comments = get_comment_of_total().total_5;
  }
  return comments;
}
function getCommentsOfIntegrityScorecomments(score) {
  let comments = [];
  if (score === 0) {
    comments = get_comment_of_integrity().integrity_0;
  } else if (score < 60) {
    comments = get_comment_of_integrity().integrity_1;
  } else if (score < 80) {
    comments = get_comment_of_integrity().integrity_2;
  } else {
    comments = get_comment_of_integrity().integrity_3;
  }
  return comments;
}
function getCommentsOfAccuracyScorecomments(score) {
  let comments = [];
  if (score === 0) {
    comments = get_comment_of_accuracy().accuracy_0;
  } else if (score < 60) {
    comments = get_comment_of_accuracy().accuracy_1;
  } else if (score < 80) {
    comments = get_comment_of_accuracy().accuracy_2;
  } else {
    comments = get_comment_of_accuracy().accuracy_3;
  }
  return comments;
}
function getCommentsOfFluencyScorecomments(score) {
  let comments = [];
  if (score === 0) {
    comments = get_comment_of_fluency().fluency_0;
  } else if (score < 60) {
    comments = get_comment_of_fluency().fluency_1;
  } else if (score < 80) {
    comments = get_comment_of_fluency().fluency_2;
  } else {
    comments = get_comment_of_fluency().fluency_3;
  }
  return comments;
}
function getCommentOfTotal(fileId, score) {
  const comments = getCommentsOfTotalScorecomments(score);
  const index = (fileId + score) % comments.length;
  return comments[index];
}
function getCommentOfIntegrity(fileId, score) {
  const comments = getCommentsOfIntegrityScorecomments(score);
  const index = (fileId + score) % comments.length;
  return comments[index];
}
function getCommentOfAccuracy(fileId, score) {
  const comments = getCommentsOfAccuracyScorecomments(score);
  const index = (fileId + score) % comments.length;
  return comments[index];
}
function getCommentOfFluency(fileId, score) {
  const comments = getCommentsOfFluencyScorecomments(score);
  const index = (fileId + score) % comments.length;
  return comments[index];
}
export {
  getStarNumOfTotalScore,
  getCommentOfTotal,
  getCommentOfIntegrity,
  getCommentOfAccuracy,
  getCommentOfFluency
};
