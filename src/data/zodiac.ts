import type {
  CompatibilityResult,
  HoroscopeCategory,
  HoroscopeData,
  HoroscopePeriod,
  ZodiacSign,
} from '@/types';

// icon 末尾的 \uFE0E 是变体选择符：强制星座符号按文本呈现，否则 macOS/iOS 会渲染成彩色 emoji。
export const zodiacSigns: ZodiacSign[] = [
  { id: 'aries', name: '白羊座', dateRange: '3.21 - 4.19', element: 'fire', icon: '♈\uFE0E' },
  { id: 'taurus', name: '金牛座', dateRange: '4.20 - 5.20', element: 'earth', icon: '♉\uFE0E' },
  { id: 'gemini', name: '双子座', dateRange: '5.21 - 6.21', element: 'air', icon: '♊\uFE0E' },
  { id: 'cancer', name: '巨蟹座', dateRange: '6.22 - 7.22', element: 'water', icon: '♋\uFE0E' },
  { id: 'leo', name: '狮子座', dateRange: '7.23 - 8.22', element: 'fire', icon: '♌\uFE0E' },
  { id: 'virgo', name: '处女座', dateRange: '8.23 - 9.22', element: 'earth', icon: '♍\uFE0E' },
  { id: 'libra', name: '天秤座', dateRange: '9.23 - 10.23', element: 'air', icon: '♎\uFE0E' },
  { id: 'scorpio', name: '天蝎座', dateRange: '10.24 - 11.22', element: 'water', icon: '♏\uFE0E' },
  { id: 'sagittarius', name: '射手座', dateRange: '11.23 - 12.21', element: 'fire', icon: '♐\uFE0E' },
  { id: 'capricorn', name: '摩羯座', dateRange: '12.22 - 1.19', element: 'earth', icon: '♑\uFE0E' },
  { id: 'aquarius', name: '水瓶座', dateRange: '1.20 - 2.18', element: 'air', icon: '♒\uFE0E' },
  { id: 'pisces', name: '双鱼座', dateRange: '2.19 - 3.20', element: 'water', icon: '♓\uFE0E' },
];

export const elementColors = {
  fire: 'from-[#f46f91] to-[#d9a441]',
  earth: 'from-[#718a78] to-[#9baa8c]',
  air: 'from-[#4fa8b7] to-[#7d70ee]',
  water: 'from-[#527fc6] to-[#5b4ae8]',
};

export const elementNames = { fire: '火象', earth: '土象', air: '风象', water: '水象' };
export const HOROSCOPE_DISCLAIMER = '内容基于星座主题生成，仅供娱乐与日常生活参考，请结合实际情况做决定。';

type Element = ZodiacSign['element'];

/* 词条按四象分库：同一天不同星座读起来才真的不一样。
 * 调性沿用原有的克制口吻——具体、不喊口号、不打包票。 */

const themesByElement: Record<Element, string[]> = {
  fire: [
    '先起个头，别等万事俱备', '把热度用在一件事上', '快一点没关系，方向别错',
    '想说的话，今天适合说清楚', '先完成，再慢慢打磨', '别人的节奏不必成为你的',
    '收住一半力气，留给明天', '站到前面去，也记得回头看',
    '今天适合把话讲在前面',
    '有劲的时候，先做最难的那件',
    '别把着急当成动力',
    '一次拒绝，换回一整天',
    '你带的头，别人会跟',
    '想赢之前，先想清楚赢什么',
    '允许一件事今天只做一半',
    '火力集中，别四处点火',
    '该争的争，不该争的放过',
    '把冲动留在纸上过一夜',
    '今天的果断会省下明天的解释',
    '先动身体，再动脑子',
  ],
  earth: [
    '把手边的秩序理一理', '积累的部分今天会显形', '稳住节奏，不必赶',
    '一次只推进一件事', '该收尾的收尾，别再开新的', '具体的安排比宏大的计划管用',
    '给自己留一点缓冲', '把长期的事切成今天能做的一步',
    '把明天的自己照顾好',
    '值钱的事往往不急',
    '今天适合把账算清楚',
    '一步一步，也是最快的路',
    '别因为习惯就继续',
    '该修的修，该扔的扔',
    '慢工出的是活，不是拖',
    '把承诺缩小到你能兑现的范围',
    '先把地基看一眼',
    '今天适合做减法',
    '重复三次的事，值得做成流程',
    '稳住的人，最后拿得住',
  ],
  air: [
    '信息很多，筛比收更重要', '一次直接的对话胜过反复揣测', '想法落到纸上才算数',
    '换个角度，问题会小一半', '说清楚比说得多重要', '别急着下结论',
    '把人和事接上，路就通了', '给自己留一段安静的时间',
    '想清楚再开口，也别想太久',
    '今天适合问一个真问题',
    '把信息变成判断，才算读过',
    '联系那个你一直想联系的人',
    '少数几件事，做透',
    '别让选择太多变成不选',
    '今天适合整理，而不是收集',
    '你的解释，对方未必需要',
    '把复杂讲简单是一种能力',
    '观点先放一放，事实先摆一摆',
    '今天适合多听一点',
    '一句准话，胜过十条消息',
  ],
  water: [
    '先照顾好自己的感受', '边界不是拒绝，是让关系走得更长', '直觉给线索，事实做决定',
    '熟悉的人和地方会让你稳下来', '不必替所有人兜住情绪', '慢一点，也是一种推进',
    '把想说的说出口', '修复关系，从一句具体的话开始',
    '今天允许自己情绪低一点',
    '该说的委屈，别憋成习惯',
    '把关心用在能接住的人身上',
    '先安顿自己，再安顿事',
    '旧事翻上来，就让它过去一次',
    '今天适合修补，不适合摊牌',
    '相信自己感到的不对劲',
    '温柔不等于没有立场',
    '给自己一个不被打扰的下午',
    '记得吃饭，记得睡觉',
    '今天适合独处一会儿',
    '有些答案，等一等会自己出现',
  ],
};

const actionsByElement: Record<Element, string[]> = {
  fire: [
    '把最想做的那件事先起个头', '主动约一次拖了很久的沟通', '给今天最重要的事留出整段时间',
    '说出一个你一直没提的想法', '完成一件三十分钟内能做完的事', '运动二十分钟，把多余的劲用掉',
    '把一个大目标写成今天的第一步', '主动认领一件大家都在躲的事',
    '把今天最难的事排在最前面',
    '当面说一次谢谢',
    '报名或预约一件想做很久的事',
    '结束一个已经没意义的安排',
    '给一个人明确的答复',
    '出门走一趟，换个环境',
    '把一份草稿直接发出去',
    '挑一件小事今天就做完',
  ],
  earth: [
    '整理桌面或待办清单', '把拖了很久的那件事收个尾', '核对一次这个月的支出',
    '给下周排一个具体的时间表', '把重复的事做成一个固定流程', '检查一个容易出错的细节',
    '提前准备好明天要用的东西', '复盘最近一次有效的方法',
    '备份一次重要的文件',
    '把这个月的固定支出列一遍',
    '收拾出一块干净的桌面',
    '给一件长期的事定个截止日',
    '检查一遍明天的日程',
    '把一份清单删掉三项',
    '修好一个用着别扭很久的东西',
    '给自己订一个能守住的作息',
  ],
  air: [
    '主动确认一个容易产生误解的细节', '给重要的人发一条真诚消息', '把脑子里的想法写下来',
    '找个人聊聊你正在纠结的事', '关掉通知，专注四十五分钟', '整理今天收到的信息，只留三条',
    '把一个复杂问题讲给别人听一遍', '读完一篇一直想读的东西',
    '问清楚一个你以为知道的前提',
    '把一条拖着没回的消息回掉',
    '记下今天想到的三个点子',
    '和同事同步一次真实进度',
    '退出一个已经没用的群',
    '把一个决定的理由写成三行',
    '请教一个比你懂的人',
    '今天只看一次社交媒体',
  ],
  water: [
    '预留二十分钟散步或放空', '安排一件不为效率的事', '和一个让你安心的人说说话',
    '早点睡，把状态还回来', '写下今天真实的感受，先不评判', '拒绝一件本就不该你承担的事',
    '收拾一个让你烦躁很久的角落', '给关心的人打一通电话，别只发消息',
    '泡一杯热的东西，慢慢喝完',
    '和家人报一次平安',
    '把手机放远一点，待十分钟',
    '整理一张旧照片或旧笔记',
    '对一件小事说声抱歉',
    '听完一整张专辑',
    '洗个澡，把今天冲掉',
    '给明天的自己写一句话',
  ],
};

const cautionsByElement: Record<Element, string[]> = {
  fire: [
    '别在情绪最高的时候拍板', '冲得太快容易把别人落在后面', '一次开三件事，等于一件都没开',
    '话说重了就直接道歉，不必绕', '不要用忙碌代替真正的推进', '累了就停，硬撑换不来更多',
    '争一口气的代价，通常比想的大',
    '别替别人做他自己的决定',
    '今天的承诺，明天要还',
    '大声不等于有理',
    '先冲出去的人，也最容易忘带地图',
    '情绪上头时，先别发消息',
  ],
  earth: [
    '别让完美标准拖慢交付', '太求稳会错过该动的时机', '减少冲动消费，重要支出先核对预算',
    '不必所有事都自己扛', '计划要留出变化的空间', '反复检查同一处，是拖延的另一种样子',
    '舍不得沉没成本，会拖得更久',
    '别用加班掩盖方向不清',
    '攒着的问题不会自己消失',
    '稳妥不是不做决定的理由',
    '今天不适合做大额承诺',
    '把标准降一档，事情才动得起来',
  ],
  air: [
    '避免在信息不足时做重大决定', '别替别人揣测结论，直接问更快', '想法太多会互相抵消，先挑一个',
    '说得漂亮不等于事情推进了', '消息回得快，不代表沟通清楚了', '别把讨论当成了执行',
    '别在群里讨论该单独说的事',
    '收藏不等于学会',
    '话说得太满，回旋余地就没了',
    '别用玩笑处理认真的分歧',
    '同时对接太多人，容易漏掉关键的那个',
    '今天不适合临时改口径',
  ],
  water: [
    '不要替所有人承担情绪', '感受可以真实，决定要靠事实', '注意休息，身体不适应及时寻求专业帮助',
    '别用沉默表达不满，对方接不到', '回避不会让问题变小', '关系里的委屈，早说比晚说好',
    '别把善意用在会消耗你的地方',
    '情绪需要出口，但不必找人当出口',
    '今天不适合翻旧账',
    '靠感受判断人，也要看行为',
    '心软之前，先想想边界',
    '累到一定程度，别再答应任何事',
  ],
};

const summaries: Record<string, string[]> = {
  aries: [
    '行动力正在回升，适合推进一件已经想清楚的事。',
    '今天的关键是控制节奏，让热情服务于目标。',
    '想到就做是你的优势，出发前多花两分钟确认方向。',
    '遇到阻力时先别加力，换个角度往往更省劲。',
    '你的直接会推动事情，也记得给对方反应的时间。',
    '把注意力收到一件事上，今天的完成度会明显不同。',
  ],
  taurus: [
    '稳定感来自清晰安排，先处理最能减轻负担的事项。',
    '熟悉的方法依然有效，也可以给新想法留一点空间。',
    '慢不是问题，反复犹豫才是。',
    '舒服的部分保留住，只换掉真正卡住你的那一环。',
    '和钱有关的决定，今天适合核对而不是拍板。',
    '身体的信号比日程表诚实，累了就调整。',
  ],
  gemini: [
    '信息很多，筛选比收集更重要。',
    '一次真诚交流，可能帮你打开停滞的局面。',
    '同时想三件事会互相打断，先把一件说完。',
    '好奇心能带来线索，落到笔记上才留得住。',
    '今天适合把复杂的事讲简单，讲给别人也讲给自己。',
    '想法已经够多了，缺的是选一个开始。',
  ],
  cancer: [
    '感受值得被看见，但不必替所有人承担情绪。',
    '熟悉的人和空间，会帮助你恢复稳定。',
    '照顾别人之前，先确认自己还有余力。',
    '把想说没说的那句说出来，比反复揣摩省力。',
    '今天适合处理家里或关系里悬着的小事。',
    '你的记性带来温柔，也可能带来旧账，注意区分。',
  ],
  leo: [
    '你的表达容易被看见，重点是让内容比姿态更有分量。',
    '主动承担可以带来认可，也要保留协作空间。',
    '被注意到不是目的，把事做成才是。',
    '今天适合把功劳分出去一点，回报会更长。',
    '情绪起伏时，先离开五分钟再回应。',
    '你有带动别人的力气，先确认方向值得带。',
  ],
  virgo: [
    '细节能力在线，别让完美标准拖慢交付。',
    '整理秩序会带来掌控感，先从最小的一处开始。',
    '挑出问题之后，也给一个能落地的建议。',
    '对自己的严格，今天可以调低一档。',
    '适合做检查和收尾，不适合从零开始。',
    '别人做得不够好，不一定需要你替他重做。',
  ],
  libra: [
    '关系中的平衡需要清楚表达，而非持续迁就。',
    '审美与判断力在线，适合完成需要取舍的工作。',
    '犹豫的成本，今天比选错更高。',
    '让所有人满意不是标准，先确认你自己的那一票。',
    '适合谈条件、定规则，把模糊的地方写清楚。',
    '你的体面很好，但别用它盖住真实的意见。',
  ],
  scorpio: [
    '洞察力较强，适合处理需要专注和保密的事项。',
    '不急于得出结论，更多信息会让选择更稳。',
    '你看得深，也容易看得太重，留一点余地。',
    '今天适合处理一件你一直不愿碰的事。',
    '信任是慢慢给的，不必今天就给完或收回。',
    '要问的直接问出口，猜测最耗人。',
  ],
  sagittarius: [
    '新鲜感会带来动力，也要为执行留出具体时间。',
    '拓展视野有帮助，先把最感兴趣的方向做深一点。',
    '想去远方之前，先把眼前这一段走完。',
    '坦率是你的优点，开口前想想对方的处境。',
    '今天适合学一点新东西，别急着变成计划。',
    '自由不是躲开责任，是选择要承担哪一份。',
  ],
  capricorn: [
    '长期目标正在积累势能，今天适合推进关键节点。',
    '责任感很强，也需要判断哪些事情不必亲自承担。',
    '进度落后一点不影响结果，别为此透支。',
    '适合谈规划、定节点，不适合临时改方案。',
    '你习惯先做后说，今天说一说会有帮助。',
    '把休息也排进日程，它和工作一样是安排。',
  ],
  aquarius: [
    '独特视角会带来新方案，表达时多补充具体步骤。',
    '适合连接不同信息，形成自己的判断框架。',
    '想法超前不是问题，落地路径要说清楚。',
    '今天适合和不同意见的人聊聊，而不是绕开。',
    '你的抽离能保护自己，也可能让人觉得远。',
    '先把一个想法做出来，比同时构思五个有用。',
  ],
  pisces: [
    '直觉能提供线索，最终决定仍需要现实信息支持。',
    '创造力较活跃，给想法一个可以落地的小出口。',
    '今天容易吸收别人的情绪，注意分清哪些是你的。',
    '模糊的承诺不如具体的拒绝。',
    '适合做需要想象力的事，不适合对数字。',
    '把想做的事写下来一件，今天就开始。',
  ],
};



function hashString(value: string): number {
  let hash = 2166136261;
  for (let i = 0; i < value.length; i += 1) {
    hash ^= value.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function seededRandom(seed: number) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let t = state;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const pad = (value: number) => String(value).padStart(2, '0');
export const toDateKey = (date: Date) => `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;

export function getISOWeek(date: Date): { year: number; week: number } {
  const utc = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const day = utc.getUTCDay() || 7;
  utc.setUTCDate(utc.getUTCDate() + 4 - day);
  const yearStart = new Date(Date.UTC(utc.getUTCFullYear(), 0, 1));
  return { year: utc.getUTCFullYear(), week: Math.ceil((((utc.getTime() - yearStart.getTime()) / 86400000) + 1) / 7) };
}

export function getDateFromISOWeek(year: number, week: number): Date {
  const fourthOfJanuary = new Date(year, 0, 4);
  const day = fourthOfJanuary.getDay() || 7;
  const monday = new Date(fourthOfJanuary);
  monday.setDate(fourthOfJanuary.getDate() - day + 1 + (week - 1) * 7);
  return monday;
}

export function getDateRange(date: Date, period: HoroscopePeriod): string {
  if (period === 'daily') return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
  if (period === 'monthly') return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  const start = new Date(date);
  const weekday = start.getDay() || 7;
  start.setDate(start.getDate() - weekday + 1);
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  return `${start.getMonth() + 1}月${start.getDate()}日—${end.getMonth() + 1}月${end.getDate()}日`;
}

function periodKey(date: Date, period: HoroscopePeriod) {
  if (period === 'daily') return toDateKey(date);
  if (period === 'monthly') return `${date.getFullYear()}-${pad(date.getMonth() + 1)}`;
  const { year, week } = getISOWeek(date);
  return `${year}-W${pad(week)}`;
}

function score(random: () => number, min = 58, spread = 38) {
  return Math.round(min + random() * spread);
}

type DimensionLevel = 'high' | 'mid' | 'steady';

/* 四维解读按「元素 × 维度 × 档位」分库，每格三条变体，共 144 条。
 * 这四条每天都会显示在页面上，是重复感最强的位置——比主题词库更值得铺量。
 * 句子不带时间前缀，渲染时按周期拼上「今天 / 这周 / 本月」。 */
const dimensionCopy: Record<Element, Record<HoroscopeCategory, Record<DimensionLevel, string[]>>> = {
  fire: {
    love: {
      high: ['你的主动会被正面接住，想说的可以直接说。', '关系里的热度在你这边，但别急着要一个答复。', '表达心意不必绕弯，具体一点更有力。'],
      mid: ['感情节奏平稳，把冲动压一压再开口更稳妥。', '对方需要一点时间跟上你，别把沉默当拒绝。', '想推进关系，先问对方的节奏，而不是宣布你的。'],
      steady: ['情绪起伏容易带进关系里，先把自己安顿好。', '争一时高低没有意义，重要的话留到平静时说。', '不必用力证明什么，关系不是比赛。'],
    },
    career: {
      high: ['推进力很足，适合啃最硬的那一块。', '你开的局别人会跟，把方向说清楚。', '适合做决定并立刻推下去，别停在讨论里。'],
      mid: ['有劲但容易分散，先锁定一件事做完。', '速度不是问题，返工才是，出发前确认一遍。', '适合推进已经想清楚的部分，新坑先别开。'],
      steady: ['冲不动就别硬冲，改做梳理和收尾。', '适合把手上的摊子收一收，而不是再铺开。', '进度慢一点不影响结果，别用加班找补。'],
    },
    health: {
      high: ['精力充沛，出一身汗会让状态更稳。', '身体给得起，也记得留一半力气给明天。', '适合安排运动量大一点的活动。'],
      mid: ['状态尚可，注意别在兴头上透支。', '活动量够了就停，硬撑换不来更多。', '适度出汗有帮助，睡眠别再往后拖。'],
      steady: ['消耗偏大，把节奏降下来一档。', '容易上火或睡不好，早点结束这一天。', '如有持续不适，请及时咨询专业人士。'],
    },
    wealth: {
      high: ['判断果断是优势，大额决定仍要过一遍数字。', '适合谈价格、争条件，但别为面子加码。', '进项的机会在，别让它变成即刻消费。'],
      mid: ['收支平稳，冲动下单前先把它放一晚上。', '想改善收入结构可以，先做小额验证。', '钱的事适合规划，不适合拍板。'],
      steady: ['情绪消费的风险偏高，先离开付款页。', '以控制风险为主，大额支出多方核实。', '别用花钱解决情绪，那笔账会回来。'],
    },
  },
  earth: {
    love: {
      high: ['稳定的陪伴比惊喜更被珍惜，做你擅长的。', '关系有进展的空间，一个具体的安排胜过一句承诺。', '适合把长久的打算和对方摊开说。'],
      mid: ['关系节奏平稳，别把沉默默认成没问题。', '习惯让人安心，也别让它替代沟通。', '适合花时间相处，不适合谈条件。'],
      steady: ['情绪不高时不必勉强社交，先照顾自己。', '关系里的不满攒着会变硬，早说比晚说好。', '给彼此一点空间，不等于疏远。'],
    },
    career: {
      high: ['积累的部分开始显形，适合推进关键节点。', '交付质量在线，把成果同步出去。', '适合定规划、排节点，把长线的事往前挪。'],
      mid: ['按优先级稳步推进，比同时开几件更快。', '适合处理流程和细节，重大调整先小范围验证。', '进度可控，别让完美标准拖住交付。'],
      steady: ['适合补信息、做复盘，暂时不做大动作。', '卡住的地方先放一放，换一件能完成的做。', '别在低效的时候硬磨同一处。'],
    },
    health: {
      high: ['作息规律见效了，保持就好。', '身体状态扎实，适合安排需要耐力的事。', '精力稳定，不需要额外加码。'],
      mid: ['久坐的代价会累积，给自己安排间歇。', '状态平稳，注意别把休息一再往后排。', '吃饭和睡觉按点来，比事后补救管用。'],
      steady: ['疲惫是攒出来的，先减负。', '降低额外消耗，把要紧的事留到状态好的时候。', '如有持续不适，请及时咨询专业人士。'],
    },
    wealth: {
      high: ['适合梳理预算和长期安排，你的耐心在这里有回报。', '账目清楚会带来安全感，趁状态好把它理完。', '适合做长期配置的决定，仍以真实信息为准。'],
      mid: ['收支节奏平稳，减少无计划消费会更安心。', '适合核对而不是新增，先把已有的看明白。', '小额的优化累积起来，比一次大动作稳。'],
      steady: ['以控制风险为主，大额支出或投资建议多方核实。', '不确定就先不动，等信息齐了再说。', '别为省一点而占用太多精力，要算总账。'],
    },
  },
  air: {
    love: {
      high: ['沟通顺畅，把一直没说清的那件说清楚。', '你的表达容易被接住，适合谈重要的事。', '一次坦诚的对话，胜过一周的揣测。'],
      mid: ['关系里信息差比感情问题多，先问再判断。', '少替对方补台词，直接确认更省力。', '适合聊天，不适合下结论。'],
      steady: ['想太多容易把小事放大，先离开一会儿。', '消息回得慢不等于冷淡，别急着解读。', '感受说不清就先不说，攒清楚再开口。'],
    },
    career: {
      high: ['思路清晰，适合处理需要判断力的事。', '把复杂的问题讲简单，你在这上面有优势。', '适合协调和串联，把人和事对上。'],
      mid: ['信息很多，筛选比收集更重要。', '把讨论落成具体的下一步，否则等于没推进。', '适合同步进展，不适合临时改口径。'],
      steady: ['注意力容易被打断，关掉通知做一段。', '想法多但落不了地，先挑一个写下来。', '适合整理和归档，不适合开新话题。'],
    },
    health: {
      high: ['脑子转得快，别让它一直转到深夜。', '状态不错，安排一点户外活动会更好。', '精神头足，记得给眼睛和颈椎放个假。'],
      mid: ['久坐和久看屏幕是主要消耗，起来动动。', '状态平稳，注意信息过载带来的疲惫。', '睡前少刷一会儿，入睡会快一些。'],
      steady: ['思绪杂会拖垮休息，先把脑子清空。', '降低信息摄入，给自己一点安静。', '如有持续不适，请及时咨询专业人士。'],
    },
    wealth: {
      high: ['信息判断力在线，适合比价和做功课。', '适合梳理账目和订阅，砍掉不用的那些。', '机会看得清，仍要基于真实数字决定。'],
      mid: ['收支平稳，注意那些悄悄续费的小额支出。', '多方比较有帮助，但别比到错过。', '适合规划，不适合被一时的说法推着走。'],
      steady: ['信息越乱越容易踩坑，不确定就先不动。', '以控制风险为主，大额决定多方核实。', '别被限时和倒计时推着做决定。'],
    },
  },
  water: {
    love: {
      high: ['你的体贴会被看见，也记得说出自己的需要。', '关系里的默契在线，适合做一次深一点的交流。', '主动靠近一步，对方接得住。'],
      mid: ['耐心倾听比急着给答案更有效。', '别把对方的沉默翻译成最坏的那一种。', '适合陪伴，不适合谈判。'],
      steady: ['容易吸收别人的情绪，先分清哪些是你的。', '委屈别攒着，攒久了会变成账。', '先照顾好自己的感受，重要沟通多留一点时间。'],
    },
    career: {
      high: ['直觉给的线索准，落到具体方案再推进。', '适合做需要想象力和细腻度的事。', '你能察觉到别人没说出口的，用它来协调。'],
      mid: ['状态时好时坏，趁清醒的那一段做要紧的。', '别把别人的情绪扛成自己的任务。', '适合推进已在轨道上的事，不适合硬碰硬。'],
      steady: ['容易分心，把任务拆到足够小再开始。', '适合做整理和收尾，重大决定往后放。', '状态不好不必自责，先恢复再说。'],
    },
    health: {
      high: ['身心都还稳，适合安排一次好好休息。', '状态不错，睡够会让它延续下去。', '精力够用，别一次性用完。'],
      mid: ['情绪会影响身体，注意别憋着。', '状态平稳，多喝水和早点睡就够了。', '给自己安排一点不带目的的时间。'],
      steady: ['消耗偏大，把要紧的事减到一件。', '情绪低落时先别做决定，先休息。', '如有持续不适，请及时咨询专业人士。'],
    },
    wealth: {
      high: ['适合处理和家人有关的财务安排。', '判断稳，趁状态好把该定的定下来。', '适合梳理长期保障类的安排。'],
      mid: ['收支平稳，注意为情绪买单的那一部分。', '适合存钱和规划，不适合冲动加码。', '借钱和担保的事，想清楚再答应。'],
      steady: ['心情不好时最容易乱花，先离开付款页。', '以控制风险为主，大额支出多方核实。', '别因为不好意思拒绝，而承担不该你出的开销。'],
    },
  },
};

function dimensionSummary(element: Element, category: HoroscopeCategory, value: number, period: HoroscopePeriod, variantSeed: string) {
  const prefix = period === 'daily' ? '今天' : period === 'weekly' ? '这周' : '本月';
  const level: DimensionLevel = value >= 82 ? 'high' : value >= 70 ? 'mid' : 'steady';
  const variants = dimensionCopy[element][category][level];
  // 变体用独立的哈希挑，不动主随机序列——换文案不至于把分数也一起改了
  return prefix + variants[hashString(`${variantSeed}|${category}|${level}`) % variants.length];
}

export function generateHoroscope(signId: string, date: Date = new Date(), period: HoroscopePeriod = 'daily'): HoroscopeData {
  const sign = zodiacSigns.find((item) => item.id === signId) ?? zodiacSigns[0];
  const random = seededRandom(hashString(`${sign.id}|${period}|${periodKey(date, period)}|v3`));
  const overall = score(random, 66, 29);
  const love = score(random);
  const career = score(random);
  const health = score(random);
  const wealth = score(random);
  const themePool = themesByElement[sign.element];
  const theme = themePool[Math.floor(random() * themePool.length)];
  const signSummaries = summaries[sign.id] ?? summaries.aries;
  const summary = signSummaries[Math.floor(random() * signSummaries.length)];
  const actionPool = actionsByElement[sign.element];
  const selectedActions = [actionPool[Math.floor(random() * actionPool.length)], actionPool[Math.floor(random() * actionPool.length)]].filter((v, i, a) => a.indexOf(v) === i);
  const cautionPool = cautionsByElement[sign.element];
  const selectedCautions = [cautionPool[Math.floor(random() * cautionPool.length)]];
  const keyDates = period === 'daily' ? [] : Array.from({ length: period === 'weekly' ? 2 : 3 }, (_, index) => {
    const keyDate = new Date(date);
    keyDate.setDate(keyDate.getDate() + Math.floor(random() * (period === 'weekly' ? 7 : 28)) + index);
    return `${keyDate.getMonth() + 1}月${keyDate.getDate()}日`;
  });
  const variantSeed = `${sign.id}|${period}|${periodKey(date, period)}`;
  const dimensions = {
    love: { score: love, summary: dimensionSummary(sign.element, 'love', love, period, variantSeed) },
    career: { score: career, summary: dimensionSummary(sign.element, 'career', career, period, variantSeed) },
    health: { score: health, summary: dimensionSummary(sign.element, 'health', health, period, variantSeed) },
    wealth: { score: wealth, summary: dimensionSummary(sign.element, 'wealth', wealth, period, variantSeed) },
  };
  return {
    period,
    dateRange: getDateRange(date, period),
    theme,
    summary,
    overall,
    love,
    career,
    health,
    wealth,
    dimensions,
    luckyColor: ['暮紫', '雾蓝', '月白', '柔金', '珊瑚粉', '松石绿'][Math.floor(random() * 6)],
    luckyNumber: Math.floor(random() * 9) + 1,
    luckyTime: ['上午 9—11 点', '午后 2—4 点', '傍晚 6—8 点', '晚上 8—10 点'][Math.floor(random() * 4)],
    actions: selectedActions,
    cautions: selectedCautions,
    keyDates,
    disclaimer: HOROSCOPE_DISCLAIMER,
    description: summary,
    advice: selectedActions[0],
  };
}

export function getCanonicalCompatibilityPair(sign1: string, sign2: string): [string, string] {
  return [sign1, sign2].sort() as [string, string];
}

export function calculateCompatibility(sign1: string, sign2: string): CompatibilityResult {
  const [first, second] = getCanonicalCompatibilityPair(sign1, sign2);
  const random = seededRandom(hashString(`${first}|${second}|compatibility-v2`));
  const makeDimension = (label: string) => {
    const value = score(random, 55, 41);
    return { score: value, summary: value >= 80 ? `${label}自然流畅，彼此容易形成正向回应。` : value >= 68 ? `${label}基础稳定，清楚表达会让关系更顺畅。` : `${label}需要多一点耐心，避免用自己的习惯替对方下结论。` };
  };
  const dimensions = {
    chemistry: makeDimension('默契'),
    communication: makeDimension('沟通'),
    emotion: makeDimension('情感连接'),
    longTerm: makeDimension('长期相处'),
  };
  const dimensionValues = Object.values(dimensions);
  const total = Math.round(dimensionValues.reduce((sum, item) => sum + item.score, 0) / dimensionValues.length);
  const strengths = ['愿意看见彼此的不同', '能在共同目标上形成配合', '相处中容易保留新鲜感'];
  const frictions = ['节奏不一致时容易各自猜测', '压力下的表达方式可能不同'];
  return {
    score: total,
    description: total >= 80 ? '你们容易建立默契，也愿意给彼此积极回应。' : total >= 68 ? '关系有稳定基础，清晰沟通会让相处更轻松。' : '差异会带来新鲜感，也需要更多理解与边界感。',
    tags: total >= 80 ? ['默契在线', '互相支持'] : total >= 68 ? ['稳定成长', '保持沟通'] : ['尊重差异', '慢慢磨合'],
    dimensions,
    strengths: strengths.slice(0, total >= 80 ? 3 : 2),
    frictions,
    advice: '把配对结果当作沟通提示，而不是替关系做决定。具体感受和真实交流更重要。',
  };
}



export const personalityProfiles: Record<string, { core: string; strengths: string[]; blindSpots: string[]; love: string; career: string; communication: string }> = Object.fromEntries(
  zodiacSigns.map((sign) => [sign.id, {
    core: summaries[sign.id][0],
    strengths: sign.element === 'fire' ? ['行动直接', '感染力强', '敢于开始'] : sign.element === 'earth' ? ['稳定可靠', '重视细节', '有长期耐心'] : sign.element === 'air' ? ['善于沟通', '思路灵活', '乐于连接'] : ['感受细腻', '同理心强', '直觉敏锐'],
    blindSpots: sign.element === 'fire' ? ['容易过快行动', '需要照顾他人节奏'] : sign.element === 'earth' ? ['有时过于求稳', '改变前需要更多时间'] : sign.element === 'air' ? ['想法较多易分散', '需要把表达落实为行动'] : ['容易吸收他人情绪', '需要建立清晰边界'],
    love: '重视被理解和真实回应。关系稳定后，更愿意用持续行动表达在意。',
    career: '适合把自身优势放进清晰目标中，通过稳定积累形成专业影响力。',
    communication: '先说明感受和需要，再讨论解决办法，通常能减少误解。',
  }]),
);
