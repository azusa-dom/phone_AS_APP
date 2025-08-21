export const weeklyData = [
  { day: '周一', pain: 4, stiffness: 45, fatigue: 3, date: '2025-08-18' },
  { day: '周二', pain: 3, stiffness: 30, fatigue: 2, date: '2025-08-19' },
  { day: '周三', pain: 5, stiffness: 60, fatigue: 4, date: '2025-08-20' },
  { day: '周四', pain: 2, stiffness: 15, fatigue: 2, date: '2025-08-21' },
  { day: '周五', pain: 3, stiffness: 30, fatigue: 3, date: '2025-08-22' },
  { day: '周六', pain: 1, stiffness: 10, fatigue: 1, date: '2025-08-23' },
  { day: '周日', pain: 2, stiffness: 20, fatigue: 2, date: '2025-08-24' }
];

export const flareData = [
  { trigger: '睡眠不足', count: 8, color: '#EF4444', percentage: 40 },
  { trigger: '天气变化', count: 5, color: '#F59E0B', percentage: 25 },
  { trigger: '工作压力', count: 4, color: '#8B5CF6', percentage: 20 },
  { trigger: '过度劳累', count: 3, color: '#06B6D4', percentage: 15 }
];

export const medicationsData = [
  {
    id: 1,
    name: 'Adalimumab (修美乐)',
    type: 'TNFi',
    dosage: '40mg',
    frequency: '每2周',
    nextDose: '2025-08-25',
    adherence: 95,
    sideEffects: [],
    route: 'sc',
    lastTaken: '2025-08-11'
  },
  {
    id: 2,
    name: 'Celecoxib (塞来昔布)',
    type: 'NSAID',
    dosage: '200mg',
    frequency: '每日2次',
    nextDose: '2025-08-22',
    adherence: 88,
    sideEffects: ['轻微胃痛'],
    route: 'po',
    lastTaken: '2025-08-21'
  }
];

export const educationContent = [
  {
    id: 1,
    title: { zh: 'AS 基础科普', en: 'AS Basics' },
    duration: { zh: '2 分钟', en: '2 min' },
    icon: '📖',
    category: { zh: '基础知识', en: 'Basics' },
    completed: true,
    content: {
      zh: '强直性脊柱炎是一种慢性炎症性疾病...',
      en: 'Ankylosing Spondylitis is a chronic inflammatory disease...'
    }
  },
  {
    id: 2,
    title: { zh: '颈部拉伸指南', en: 'Neck Stretching Guide' },
    duration: { zh: '5 分钟', en: '5 min' },
    icon: '🏃‍♂️',
    category: { zh: '运动康复', en: 'Exercise' },
    completed: false,
    videoUrl: 'https://example.com/neck-stretching.mp4'
  }
  // ... 更多教育内容
];

export const painEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];
export const fatigueEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];

export const triggers = [
  { id: 'sleep', label: { zh: '睡眠', en: 'Sleep' }, icon: '🛏️' },
  { id: 'posture', label: { zh: '姿势', en: 'Posture' }, icon: '🪑' },
  { id: 'overuse', label: { zh: '过劳', en: 'Overuse' }, icon: '💪' },
  { id: 'infection', label: { zh: '感染', en: 'Infection' }, icon: '🦠' },
  { id: 'emotion', label: { zh: '情绪', en: 'Emotion' }, icon: '😰' },
  { id: 'weather', label: { zh: '天气', en: 'Weather' }, icon: '🌧️' }
];


