import { useEffect, useRef, useState } from 'react';
import { Heart, Briefcase, Activity, Coins, Star, Sparkles, Clock, Palette, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { ZodiacSign, HoroscopeData, HoroscopeCategory } from '@/types';
import { generateHoroscope } from '@/data/zodiac';
import { Progress } from '@/components/ui/progress';
import { ShareImageModal } from '@/components/ShareImageModal';

interface HoroscopeDisplayProps {
  selectedSign: ZodiacSign | null;
  onChangeSign: () => void;
}

const categoryConfig: Record<HoroscopeCategory, { icon: typeof Heart; label: string; color: string }> = {
  love: { icon: Heart, label: '爱情', color: 'text-rose-500' },
  career: { icon: Briefcase, label: '事业', color: 'text-blue-500' },
  health: { icon: Activity, label: '健康', color: 'text-green-500' },
  wealth: { icon: Coins, label: '财运', color: 'text-amber-500' },
};

// 专业的差异化解读内容
const getCategoryDescription = (category: HoroscopeCategory, score: number, signName: string): string => {
  const descriptions: Record<HoroscopeCategory, Record<string, string[]>> = {
    love: {
      high: [
        `${signName}今天的桃花运爆棚！单身者容易遇到心仪对象，已有伴侣的适合表白或求婚。你的魅力值达到巅峰，大胆展现真实的自己。`,
        `爱情运势极佳！今天适合约会、告白或修复关系。你的温柔体贴会让对方心动不已，把握机会创造浪漫回忆。`,
        `感情甜蜜指数飙升！${signName}今天特别容易获得异性的好感，主动出击会有意想不到的收获。`,
      ],
      medium: [
        `${signName}今天的感情运势平稳，适合与伴侣深入交流，增进彼此了解。单身者可以多参加社交活动，扩大交友圈。`,
        `爱情方面需要耐心经营，不要急于求成。已有伴侣的适合一起规划未来，单身者保持开放心态。`,
        `感情运势中规中矩，${signName}今天适合用心倾听对方，用行动表达关心，细节决定成败。`,
      ],
      low: [
        `${signName}今天感情运势稍弱，容易因小事产生误会。建议保持冷静，避免冲动发言，给彼此一些空间。`,
        `爱情方面需要谨慎，今天不适合做重大感情决定。已有伴侣的注意沟通方式，单身者先专注自我提升。`,
        `感情运势较低迷，${signName}今天容易情绪化，建议独处冷静思考，不要强求感情进展。`,
      ],
    },
    career: {
      high: [
        `${signName}事业运势大好！今天适合提出新方案、争取晋升或开启新项目。你的创意和执行力会得到上司认可。`,
        `职场贵人运旺！今天容易获得重要机会，主动承担任务会展现你的能力。谈判、签约成功率极高。`,
        `事业蒸蒸日上！${signName}今天工作效率极高，适合处理复杂事务，你的专业素养会赢得同事尊重。`,
      ],
      medium: [
        `${signName}今天事业运势平稳，适合按部就班完成日常工作。可以整理文档、复盘项目，为下一步做准备。`,
        `职场方面保持低调务实，今天适合团队协作而非单打独斗。多听取他人意见，会有意外收获。`,
        `事业运势一般，${signName}今天适合学习新技能、积累知识。不要急于求成，稳扎稳打更重要。`,
      ],
      low: [
        `${signName}今天事业运势欠佳，容易遇到阻碍或突发状况。建议谨慎行事，重要决策延后处理。`,
        `职场方面需要格外小心，今天容易与同事产生分歧。保持低调，避免卷入办公室政治。`,
        `事业运势低迷，${signName}今天不适合冒险或改变计划。专注于完成手头工作，等待更好的时机。`,
      ],
    },
    health: {
      high: [
        `${signName}身体状态极佳！今天适合运动健身、户外活动。精力充沛，可以尝试新的运动项目。`,
        `健康运势很好！身心状态平衡，适合调整作息、养成健康习惯。今天开始健身计划会事半功倍。`,
        `元气满满的一天！${signName}今天免疫力强，适合挑战体能极限。注意饮食均衡，保持好心情。`,
      ],
      medium: [
        `${signName}今天健康状况平稳，注意劳逸结合。适当运动可以舒缓压力，但不要过度消耗体力。`,
        `健康方面需要关注细节，今天容易感到轻微疲劳。保证充足睡眠，多喝水，避免熬夜。`,
        `身体状态一般，${signName}今天适合做一些舒缓的运动如瑜伽、散步。注意饮食清淡，避免油腻。`,
      ],
      low: [
        `${signName}今天健康运势较弱，容易感到疲惫或不适。建议减少外出，多休息，注意保暖。`,
        `健康方面需要格外注意，今天身体可能发出警告信号。不要忽视小毛病，及时就医检查。`,
        `健康运势低迷，${signName}今天容易失眠或消化不良。建议放松心情，避免剧烈运动和暴饮暴食。`,
      ],
    },
    wealth: {
      high: [
        `${signName}财运亨通！今天适合投资理财、洽谈合作。偏财运旺，可能有意外之财或中奖机会。`,
        `财富运势极佳！今天容易获得赚钱机会，大胆尝试新项目。你的理财眼光独到，收益可观。`,
        `财源滚滚来！${signName}今天适合制定财务规划，开源节流双管齐下。投资方面会有好消息。`,
      ],
      medium: [
        `${signName}今天财运平稳，适合稳健理财。可以整理账目、规划预算，避免不必要的开支。`,
        `财富方面保持谨慎，今天不适合高风险投资。做好本职工作，正财收入稳定即可。`,
        `财运一般，${signName}今天容易有意外支出。建议控制消费欲望，为未来储蓄做准备。`,
      ],
      low: [
        `${signName}今天财运欠佳，容易破财或投资失利。建议保守理财，避免大额支出和借贷。`,
        `财富运势低迷，今天不适合做任何财务决策。谨防诈骗，保护好自己的钱包。`,
        `财运不佳，${signName}今天容易冲动消费。建议制定预算计划，量入为出，等待运势好转。`,
      ],
    },
  };

  const level = score >= 80 ? 'high' : score >= 60 ? 'medium' : 'low';
  const options = descriptions[category][level];
  // 根据星座和日期选择一个固定的描述
  const index = (signName.charCodeAt(0) + new Date().getDate()) % options.length;
  return options[index];
};

export function HoroscopeDisplay({ selectedSign, onChangeSign }: HoroscopeDisplayProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [horoscope, setHoroscope] = useState<HoroscopeData | null>(null);
  const [expandedCards, setExpandedCards] = useState<Set<HoroscopeCategory>>(new Set(['love']));
  const [isVisible, setIsVisible] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (selectedSign) {
      const data = generateHoroscope(selectedSign.id);
      setHoroscope(data);
    }
  }, [selectedSign]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const renderStars = (score: number) => {
    const starCount = Math.round(score / 20);
    return (
      <div className="flex gap-1">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`w-4 h-4 ${
              i < starCount
                ? 'fill-[#d4a373] text-[#d4a373]'
                : 'fill-gray-200 text-gray-200'
            }`}
          />
        ))}
      </div>
    );
  };

  const toggleCard = (category: HoroscopeCategory) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(category)) {
        newSet.delete(category);
      } else {
        newSet.add(category);
      }
      return newSet;
    });
  };

  if (!selectedSign) {
    return (
      <section
        id="horoscope"
        ref={sectionRef}
        className="py-16 sm:py-24 px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white/60 backdrop-blur-sm rounded-3xl p-12 shadow-lg">
            <Sparkles className="w-16 h-16 text-[#d4a373] mx-auto mb-6 opacity-50" />
            <h3 className="text-2xl font-semibold text-gray-700 mb-3">
              请先选择你的星座
            </h3>
            <p className="text-gray-500">
              向上滚动选择星座，解锁今日运势
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      id="horoscope"
      ref={sectionRef}
      className="py-16 sm:py-24 px-6"
    >
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-10">
          <div 
            className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm rounded-full px-6 py-3 shadow-lg mb-4 cursor-pointer hover:shadow-xl transition-shadow"
            onClick={onChangeSign}
          >
            <span className="text-3xl">{selectedSign.icon}</span>
            <div className="text-left">
              <h2 className="text-xl font-bold text-gray-900">
                {selectedSign.name}今日运势
              </h2>
              <p className="text-sm text-gray-500">
                {new Date().toLocaleDateString('zh-CN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <span className="text-xs text-[#d4a373] ml-2">点击切换</span>
          </div>

          {/* Share Button - 单独一行 */}
          <div className="mt-4">
            <Button
              onClick={() => setIsShareModalOpen(true)}
              variant="outline"
              className="rounded-full border-[#d4a373] text-[#d4a373] hover:bg-[#d4a373] hover:text-white"
            >
              <Share2 className="w-4 h-4 mr-2" />
              生成分享图
            </Button>
          </div>
        </div>

        {/* Overall Score */}
        {horoscope && (
          <div className={`bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-lg mb-6 transition-all duration-700 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="flex items-center justify-between mb-4">
              <span className="text-lg font-semibold text-gray-700">综合运势</span>
              <span className="text-3xl font-bold text-[#d4a373]">{horoscope.overall}%</span>
            </div>
            <Progress value={horoscope.overall} className="h-3 mb-4" />
            <p className="text-gray-600 leading-relaxed">{horoscope.description}</p>
          </div>
        )}

        {/* Category Cards */}
        <div className="space-y-3">
          {horoscope &&
            (Object.keys(categoryConfig) as HoroscopeCategory[]).map((category, index) => {
              const config = categoryConfig[category];
              const Icon = config.icon;
              const score = horoscope[category];
              const isExpanded = expandedCards.has(category);

              return (
                <div
                  key={category}
                  className={`horoscope-card transition-all duration-500 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                  style={{ transitionDelay: `${(index + 1) * 100}ms` }}
                  onClick={() => toggleCard(category)}
                >
                  <div
                    className={`relative overflow-hidden rounded-2xl bg-white/80 backdrop-blur-sm shadow-lg transition-all duration-300 cursor-pointer ${
                      isExpanded ? 'shadow-xl' : 'hover:shadow-xl'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-center justify-between p-5">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
                          <Icon className={`w-6 h-6 ${config.color}`} />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{config.label}</h3>
                          {renderStars(score)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-2xl font-bold text-[#d4a373]">{score}%</span>
                        <div
                          className={`w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center transition-transform duration-300 ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        >
                          <svg
                            className="w-4 h-4 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 9l-7 7-7-7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Content - 使用差异化专业解读 */}
                    <div
                      className={`overflow-hidden transition-all duration-300 ${
                        isExpanded ? 'max-h-48' : 'max-h-0'
                      }`}
                    >
                      <div className="px-5 pb-5 pt-2 border-t border-gray-100">
                        <div className="flex items-start gap-3">
                          <Sparkles className="w-5 h-5 text-[#d4a373] mt-0.5 flex-shrink-0" />
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {getCategoryDescription(category, score, selectedSign.name)}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="px-5 pb-5">
                      <Progress value={score} className="h-2" />
                    </div>
                  </div>
                </div>
              );
            })}
        </div>

        {/* Lucky Info */}
        {horoscope && (
          <div className={`mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 transition-all duration-700 delay-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            {[
              { icon: Palette, label: '幸运色', value: horoscope.luckyColor },
              { icon: Star, label: '幸运数字', value: horoscope.luckyNumber.toString() },
              { icon: Clock, label: '幸运时段', value: horoscope.luckyTime },
              { icon: Sparkles, label: '今日建议', value: horoscope.advice },
            ].map((item, index) => {
              const Icon = item.icon;
              return (
                <div
                  key={index}
                  className="bg-white/60 backdrop-blur-sm rounded-xl p-3 text-center hover:bg-white/80 transition-colors"
                >
                  <Icon className="w-5 h-5 text-[#d4a373] mx-auto mb-1" />
                  <p className="text-xs text-gray-500 mb-0.5">{item.label}</p>
                  <p className="text-sm font-medium text-gray-900 line-clamp-2">{item.value}</p>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Share Image Modal */}
      <ShareImageModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        selectedSign={selectedSign}
        horoscope={horoscope}
        type="horoscope"
      />
    </section>
  );
}
