import type { ZodiacSign, HoroscopeData, CompatibilityResult } from '@/types';

export const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', dateRange: '3.21 - 4.19', element: 'fire', icon: '♈' },
  { id: 'taurus', name: '金牛座', dateRange: '4.20 - 5.20', element: 'earth', icon: '♉' },
  { id: 'gemini', name: '双子座', dateRange: '5.21 - 6.21', element: 'air', icon: '♊' },
  { id: 'cancer', name: '巨蟹座', dateRange: '6.22 - 7.22', element: 'water', icon: '♋' },
  { id: 'leo', name: '狮子座', dateRange: '7.23 - 8.22', element: 'fire', icon: '♌' },
  { id: 'virgo', name: '处女座', dateRange: '8.23 - 9.22', element: 'earth', icon: '♍' },
  { id: 'libra', name: '天秤座', dateRange: '9.23 - 10.23', element: 'air', icon: '♎' },
  { id: 'scorpio', name: '天蝎座', dateRange: '10.24 - 11.22', element: 'water', icon: '♏' },
  { id: 'sagittarius', name: '射手座', dateRange: '11.23 - 12.21', element: 'fire', icon: '♐' },
  { id: 'capricorn', name: '摩羯座', dateRange: '12.22 - 1.19', element: 'earth', icon: '♑' },
  { id: 'aquarius', name: '水瓶座', dateRange: '1.20 - 2.18', element: 'air', icon: '♒' },
  { id: 'pisces', name: '双鱼座', dateRange: '2.19 - 3.20', element: 'water', icon: '♓' },
];

export const elementColors = {
  fire: 'from-orange-400 to-red-500',
  earth: 'from-emerald-400 to-green-600',
  air: 'from-sky-400 to-blue-500',
  water: 'from-cyan-400 to-blue-600',
};

export const elementNames = {
  fire: '火象',
  earth: '土象',
  air: '风象',
  water: '水象',
};

// Generate deterministic horoscope based on sign and date
export function generateHoroscope(signId: string, date: Date = new Date()): HoroscopeData {
  const seed = date.getDate() + date.getMonth() * 31 + signId.charCodeAt(0);
  const pseudoRandom = (n: number) => {
    const x = Math.sin(seed * n) * 10000;
    return x - Math.floor(x);
  };

  const descriptions: Record<string, string[]> = {
    aries: [
      '今天的你充满活力，适合开启新的计划。保持积极的心态，好运自然会来。',
      '冲动是魔鬼，今天需要多一些耐心。深呼吸，冷静思考后再做决定。',
      '你的领导力今天会得到展现，团队需要你的指引。相信自己！',
    ],
    taurus: [
      '稳定是你的关键词，今天适合处理财务和长期规划。脚踏实地会带来回报。',
      '享受生活中的小确幸，一杯咖啡、一首好歌都能让你心情愉悦。',
      '固执可能会让你错过机会，试着听听他人的建议。',
    ],
    gemini: [
      '沟通是你的超能力，今天适合社交和表达想法。你的话语会感染他人。',
      '信息过载让你感到疲惫，给自己一些独处的时间。',
      '好奇心会带你发现新的机会，保持开放的心态。',
    ],
    cancer: [
      '情感丰富的一天，适合与家人朋友相处。你的温柔会温暖身边的人。',
      '情绪波动较大，需要找到释放压力的方式。泡个热水澡吧。',
      '直觉很准，相信你的第六感。它会指引你做出正确的选择。',
    ],
    leo: [
      '自信满满的你今天光芒四射，成为众人瞩目的焦点。享受这份荣耀吧！',
      '自尊心过强可能会带来冲突，学会谦逊会让你更受欢迎。',
      '创造力爆棚，适合艺术创作或解决难题。展现你的才华！',
    ],
    virgo: [
      '细节决定成败，你的细心会帮助你发现问题。完美主义是你的优势。',
      '过度挑剔可能让身边的人感到压力，学会包容不完美。',
      '健康需要关注，调整作息和饮食会让你更有活力。',
    ],
    libra: [
      '追求平衡与和谐，今天适合处理人际关系。你的公正会得到认可。',
      '犹豫不决可能错过良机，相信自己的判断。',
      '美感在线，适合购物或装饰空间。你会找到心仪之物。',
    ],
    scorpio: [
      '神秘而深沉，你的魅力让人无法抗拒。深入探索会让你有所发现。',
      '嫉妒心可能作祟，学会信任和放手。',
      '转型的好时机，放下过去，迎接新的开始。',
    ],
    sagittarius: [
      '自由与冒险在召唤，今天适合尝试新事物。旅行会带来好运！',
      '过于乐观可能忽视细节，保持务实的态度。',
      '哲学思考让你对生活有新的理解，记录你的想法。',
    ],
    capricorn: [
      '事业心强的你今天效率极高，努力工作会得到回报。坚持就是胜利！',
      '工作狂模式可能让你忽略生活，记得给自己放松的时间。',
      '责任感让你成为可靠的人，但也不要承担过多。',
    ],
    aquarius: [
      '独特的思维让你与众不同，分享你的创意会获得赞赏。',
      '疏离感可能让你感到孤独，主动连接他人。',
      '人道主义精神高涨，帮助他人会让你感到满足。',
    ],
    pisces: [
      '想象力丰富，艺术和创作会带来满足感。相信你的直觉。',
      '逃避现实不能解决问题，勇敢面对挑战。',
      '同情心让你成为很好的倾听者，但也要注意保护自己。',
    ],
  };

  const advices = [
    '保持微笑，好运会来敲门。',
    '今天适合穿暖色系的衣服。',
    '给老朋友发个消息，重温旧时光。',
    '尝试一项新的爱好，你会发现乐趣。',
    '冥想十分钟，让心灵得到平静。',
    '写下三件感恩的事，幸福感会提升。',
    '远离负能量，保护自己的能量场。',
    '今天适合整理房间，清理旧物。',
  ];

  const descList = descriptions[signId] || descriptions.aries;
  const descIndex = Math.floor(pseudoRandom(1) * descList.length);
  const adviceIndex = Math.floor(pseudoRandom(2) * advices.length);

  return {
    overall: Math.floor(pseudoRandom(3) * 30) + 70,
    love: Math.floor(pseudoRandom(4) * 40) + 60,
    career: Math.floor(pseudoRandom(5) * 40) + 60,
    health: Math.floor(pseudoRandom(6) * 40) + 60,
    wealth: Math.floor(pseudoRandom(7) * 40) + 60,
    luckyColor: ['金色', '蓝色', '绿色', '粉色', '紫色', '橙色'][Math.floor(pseudoRandom(8) * 6)],
    luckyNumber: Math.floor(pseudoRandom(9) * 9) + 1,
    luckyTime: ['上午9-11点', '下午2-4点', '晚上7-9点', '凌晨'][Math.floor(pseudoRandom(10) * 4)],
    description: descList[descIndex],
    advice: advices[adviceIndex],
  };
}

// Calculate compatibility between two signs
export function calculateCompatibility(sign1: string, sign2: string): CompatibilityResult {
  const seed = sign1.charCodeAt(0) + sign2.charCodeAt(0);
  const pseudoRandom = () => {
    const x = Math.sin(seed * 999) * 10000;
    return x - Math.floor(x);
  };

  const score = Math.floor(pseudoRandom() * 40) + 60;

  const descriptions = [
    '你们是天作之合，彼此互补，能创造美好的未来。',
    '需要一些磨合，但只要有爱，一切都不是问题。',
    '性格差异较大，但差异也能带来新鲜感。',
    '默契十足，一个眼神就能明白对方的心意。',
    '需要更多沟通和理解，避免误会。',
  ];

  const tags = [
    '灵魂伴侣',
    '欢喜冤家',
    '最佳拍档',
    '互相成长',
    '需要磨合',
    '默契十足',
    '激情四射',
    '细水长流',
  ];

  const descIndex = Math.floor(pseudoRandom() * descriptions.length);
  const tagCount = Math.floor(pseudoRandom() * 2) + 2;
  const selectedTags: string[] = [];
  
  for (let i = 0; i < tagCount; i++) {
    const tagIndex = Math.floor(pseudoRandom() * (i + 1)) % tags.length;
    if (!selectedTags.includes(tags[tagIndex])) {
      selectedTags.push(tags[tagIndex]);
    }
  }

  return {
    score,
    description: descriptions[descIndex],
    tags: selectedTags.length > 0 ? selectedTags : ['缘分天定'],
  };
}

export const dailyQuotes = [
  { text: '星辰指引方向，但航行的船由你掌舵。', author: '星座屋' },
  { text: '每一个结束都是新的开始。', author: '星座屋' },
  { text: '相信宇宙的节奏，一切都会在正确的时间发生。', author: '星座屋' },
  { text: '你的能量吸引着你所经历的一切。', author: '星座屋' },
  { text: '在黑暗中，星星才会更加闪耀。', author: '星座屋' },
  { text: '跟随你的直觉，它知道答案。', author: '星座屋' },
  { text: '今天的努力是明天的收获。', author: '星座屋' },
  { text: '爱自己是一生浪漫的开始。', author: '星座屋' },
];
