import React, { useState } from 'react';
import { Home, Calendar, Pill, TrendingUp, Book, Plus, ChevronRight, Bell, Download, Share2, AlertCircle, Clock, Target, Activity, Heart, User, Shield, Palette, LineChart, Zap } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart as RechartsBarChart, Bar } from 'recharts';

const ASRedesign = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('zh');
  const [theme, setTheme] = useState('light');
  const [painLevel, setPainLevel] = useState(3);
  const [stiffnessTime, setStiffnessTime] = useState(30);
  const [fatigue, setFatigue] = useState(3);
  const [isFlare, setIsFlare] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [medications, setMedications] = useState([
    { id: 1, name: 'Adalimumab', type: 'TNFi', dosage: '40mg', frequency: '每2周', nextDose: '2025-08-23', adherence: 95, sideEffects: [] },
    { id: 2, name: 'Celecoxib', type: 'NSAID', dosage: '200mg', frequency: '每日2次', nextDose: '2025-08-22', adherence: 88, sideEffects: ['胃痛'] }
  ]);

  const weeklyData = [
    { day: '周一', pain: 4, stiffness: 45, fatigue: 3 },
    { day: '周二', pain: 3, stiffness: 30, fatigue: 2 },
    { day: '周三', pain: 5, stiffness: 60, fatigue: 4 },
    { day: '周四', pain: 2, stiffness: 15, fatigue: 2 },
    { day: '周五', pain: 3, stiffness: 30, fatigue: 3 },
    { day: '周六', pain: 1, stiffness: 10, fatigue: 1 },
    { day: '周日', pain: 2, stiffness: 20, fatigue: 2 }
  ];

  const flareData = [
    { trigger: '睡眠不足', count: 8, color: '#EF4444' },
    { trigger: '天气变化', count: 5, color: '#F59E0B' },
    { trigger: '工作压力', count: 4, color: '#8B5CF6' },
    { trigger: '过度劳累', count: 3, color: '#06B6D4' }
  ];

  const t = {
    zh: {
      home: '今日概览', track: '症状记录', meds: '用药管理', reports: '趋势报告', library: '教育资源', settings: '设置',
      todayOverview: '今日状态', quickRecord: '快速记录', painLevel: '疼痛程度', morningStiffness: '晨僵时长', fatigue: '疲劳程度', flare: '发作状态', triggers: '可能诱因', saveRecord: '保存记录',
      weekSummary: '本周记录', avgPain: '疼痛均值', checkInDays: '打卡天数', flareCount: '发作次数', microLearning: '健康微课', minutes: '分钟',
      addMedication: '添加药物', medicationName: '药物名称', dosageFrequency: '剂量/频率', nextDose: '下次用药', adherence: '依从性', sideEffects: '副作用', noSideEffects: '无副作用', takeMed: '已用药', skipMed: '跳过',
      weeklyTrends: '本周趋势', monthlyReport: '月度报告', exportPDF: '导出PDF', shareReport: '分享报告', painTrend: '疼痛趋势', flareAnalysis: '发作分析', triggerAnalysis: '诱因分析',
      appearance: '外观设置', privacy: '隐私设置', notifications: '通知设置', language: '语言', darkMode: '深色模式', fontSize: '字体大小', dataExport: '数据导出', dataImport: '数据导入', about: '关于应用'
    },
    en: {
      home: 'Today', track: 'Tracking', meds: 'Medication', reports: 'Reports', library: 'Education', settings: 'Settings',
      todayOverview: "Today's Status", quickRecord: 'Quick Record', painLevel: 'Pain Level', morningStiffness: 'Morning Stiffness', fatigue: 'Fatigue Level', flare: 'Flare Status', triggers: 'Possible Triggers', saveRecord: 'Save Record',
      weekSummary: 'Weekly Summary', avgPain: 'Avg Pain', checkInDays: 'Check-in Days', flareCount: 'Flare Count', microLearning: 'Health Tips', minutes: 'minutes',
      addMedication: 'Add Medication', medicationName: 'Medication Name', dosageFrequency: 'Dosage/Frequency', nextDose: 'Next Dose', adherence: 'Adherence', sideEffects: 'Side Effects', noSideEffects: 'No Side Effects', takeMed: 'Take Med', skipMed: 'Skip',
      weeklyTrends: 'Weekly Trends', monthlyReport: 'Monthly Report', exportPDF: 'Export PDF', shareReport: 'Share Report', painTrend: 'Pain Trend', flareAnalysis: 'Flare Analysis', triggerAnalysis: 'Trigger Analysis',
      appearance: 'Appearance', privacy: 'Privacy', notifications: 'Notifications', language: 'Language', darkMode: 'Dark Mode', fontSize: 'Font Size', dataExport: 'Data Export', dataImport: 'Data Import', about: 'About'
    }
  };

  const painEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];
  const fatigueEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];

  const triggers = [
    { id: 'sleep', label: language === 'zh' ? '睡眠' : 'Sleep', icon: '🛏️' },
    { id: 'posture', label: language === 'zh' ? '姿势' : 'Posture', icon: '🪑' },
    { id: 'overuse', label: language === 'zh' ? '过劳' : 'Overuse', icon: '💪' },
    { id: 'infection', label: language === 'zh' ? '感染' : 'Infection', icon: '🦠' },
    { id: 'emotion', label: language === 'zh' ? '情绪' : 'Emotion', icon: '😰' },
    { id: 'weather', label: language === 'zh' ? '天气' : 'Weather', icon: '🌧️' }
  ];

  const educationContent = [
    { id: 1, title: language === 'zh' ? 'AS 基础科普' : 'AS Basics', duration: language === 'zh' ? '2 分钟' : '2 min', icon: '📖', category: language === 'zh' ? '基础知识' : 'Basics', completed: true },
    { id: 2, title: language === 'zh' ? '颈部拉伸指南' : 'Neck Stretching Guide', duration: language === 'zh' ? '5 分钟' : '5 min', icon: '🏃‍♂️', category: language === 'zh' ? '运动康复' : 'Exercise', completed: false },
    { id: 3, title: language === 'zh' ? '生物制剂科普' : 'Biologics Guide', duration: language === 'zh' ? '3 分钟' : '3 min', icon: '💊', category: language === 'zh' ? '用药指南' : 'Medication', completed: false },
    { id: 4, title: language === 'zh' ? '抗炎饮食建议' : 'Anti-inflammatory Diet', duration: language === 'zh' ? '4 分钟' : '4 min', icon: '🥗', category: language === 'zh' ? '营养饮食' : 'Nutrition', completed: true },
    { id: 5, title: language === 'zh' ? '睡眠质量改善' : 'Sleep Quality Tips', duration: language === 'zh' ? '3 分钟' : '3 min', icon: '😴', category: language === 'zh' ? '生活方式' : 'Lifestyle', completed: false },
    { id: 6, title: language === 'zh' ? '就医准备清单' : 'Doctor Visit Checklist', duration: language === 'zh' ? '2 分钟' : '2 min', icon: '👨‍⚕️', category: language === 'zh' ? '就医指导' : 'Healthcare', completed: false }
  ];

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const subtextClass = isDark ? 'text-gray-300' : 'text-gray-500';

  const toggleTrigger = (triggerId) => {
    setSelectedTriggers(prev => prev.includes(triggerId) ? prev.filter(id => id !== triggerId) : [...prev, triggerId]);
  };

  const NavBar = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-2 py-2 backdrop-blur-lg bg-opacity-95`}>
      <div className="flex justify-around">
        {[
          { id: 'home', icon: Home, label: t[language].home },
          { id: 'track', icon: Calendar, label: t[language].track },
          { id: 'meds', icon: Pill, label: t[language].meds },
          { id: 'reports', icon: TrendingUp, label: t[language].reports },
          { id: 'library', icon: Book, label: t[language].library }
        ].map(({ id, icon: Icon, label }) => (
          <button key={id} onClick={() => setCurrentPage(id)} className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${currentPage === id ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' : `${subtextClass} hover:${textClass} ${isDark ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}>
            <Icon size={20} />
            <span className="text-xs mt-1 font-medium">{label}</span>
          </button>
        ))}
      </div>
    </div>
  );

  const HomePage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex justify-between items-center">
        <div>
          <h1 className={`text-3xl font-bold ${textClass}`}>{t[language].home}</h1>
          <p className={`${subtextClass} mt-1`}>{language === 'zh' ? '今天感觉如何？' : 'How are you feeling today?'}</p>
        </div>
        <div className="flex items-center space-x-3">
          <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className={`px-4 py-2 ${cardClass} rounded-xl text-sm font-medium shadow-sm border transition-all hover:shadow-md`}>
            {language === 'zh' ? 'EN' : '中文'}
          </button>
          <div className="relative">
            <Bell className={`${subtextClass} hover:${textClass} transition-colors cursor-pointer`} size={22} />
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
          </div>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">{t[language].quickRecord}</h2>
          <p className="text-blue-100 mb-4 text-sm">{language === 'zh' ? '30秒完成今日记录' : "Complete today's log in 30 seconds"}</p>
          <button onClick={() => setCurrentPage('track')} className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            {language === 'zh' ? '开始记录 →' : 'Start Recording →'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardClass} rounded-2xl p-4 shadow-sm border`}>
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-blue-500" size={20} />
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">{language === 'zh' ? '今日' : 'Today'}</span>
          </div>
          <div className={`text-2xl font-bold ${textClass}`}>3.2</div>
          <div className={`text-sm ${subtextClass}`}>{t[language].avgPain}</div>
        </div>
        <div className={`${cardClass} rounded-2xl p-4 shadow-sm border`}>
          <div className="flex items-center justify-between mb-2">
            <Target className="text-green-500" size={20} />
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">{language === 'zh' ? '本周' : 'This Week'}</span>
          </div>
          <div className={`text-2xl font-bold ${textClass}`}>5/7</div>
          <div className={`text-sm ${subtextClass}`}>{t[language].checkInDays}</div>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textClass}`}>{t[language].weekSummary}</h3>
          <LineChart className={`${subtextClass}`} size={20} />
        </div>
        <div className="h-32 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={weeklyData}>
              <defs>
                <linearGradient id="painGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <Area type="monotone" dataKey="pain" stroke="#3B82F6" fillOpacity={1} fill="url(#painGradient)" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-xl font-bold text-blue-600">3.2</div>
            <div className={`text-xs ${subtextClass}`}>{t[language].avgPain}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-green-600">5</div>
            <div className={`text-xs ${subtextClass}`}>{t[language].checkInDays}</div>
          </div>
          <div className="text-center">
            <div className="text-xl font-bold text-orange-600">1</div>
            <div className={`text-xs ${subtextClass}`}>{t[language].flareCount}</div>
          </div>
        </div>
      </div>

      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className={`text-lg font-bold ${textClass}`}>{t[language].microLearning}</h3>
          <Book className={`${subtextClass}`} size={20} />
        </div>
        <div className="space-y-3">
          {educationContent.slice(0, 2).map((item) => (
            <div key={item.id} className={`flex items-center p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl transition-all duration-200 cursor-pointer group`}>
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mr-4 text-white text-xl">{item.icon}</div>
              <div className="flex-1">
                <div className={`font-semibold ${textClass}`}>{item.title}</div>
                <div className={`text-sm ${subtextClass} flex items-center mt-1`}>
                  <Clock size={12} className="mr-1" />
                  {item.duration}
                </div>
              </div>
              <ChevronRight className={`${subtextClass}`} size={20} />
            </div>
          ))}
        </div>
        <button onClick={() => setCurrentPage('library')} className={`w-full mt-4 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-medium ${textClass} transition-all duration-200`}>
          {language === 'zh' ? '查看更多课程' : 'View More Courses'}
        </button>
      </div>
    </div>
  );

  const TrackPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textClass}`}>{t[language].track}</h1>
        <div className="flex items中心 space-x-2">
          <Calendar className={`${subtextClass}`} size={20} />
          <span className={`text-sm ${subtextClass}`}>{new Date().toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US')}</span>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <label className={`block text-lg font-bold mb-4 ${textClass} flex items-center`}>
          <Heart className="mr-2 text-red-500" size={20} />
          {t[language].painLevel} (0-10): {painLevel} {painEmojis[painLevel]}
        </label>
        <div className="relative mb-4">
          <input type="range" min="0" max="10" value={painLevel} onChange={(e) => setPainLevel(Number(e.target.value))} className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, #10B981 0%, #F59E0B ${painLevel * 10}%, #EF4444 100%)` }} />
        </div>
        <div className={`flex justify-between text-sm ${subtextClass}`}>
          <span>😊 {language === 'zh' ? '无痛' : 'No pain'}</span>
          <span>😵 {language === 'zh' ? '剧痛' : 'Severe'}</span>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <label className={`block text-lg font-bold mb-4 ${textClass} flex items-center`}>
          <Clock className="mr-2 text-blue-500" size={20} />
          {t[language].morningStiffness}: {stiffnessTime} {t[language].minutes}
        </label>
        <div className="grid grid-cols-6 gap-2">
          {[0, 15, 30, 60, 90, 120].map((time) => (
            <button key={time} onClick={() => setStiffnessTime(time)} className={`py-3 px-2 rounded-xl text-sm font-medium transition-all duration-200 ${stiffnessTime === time ? 'bg-gradient-to-b from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}`}>
              {time === 0 ? (language === 'zh' ? '无' : 'None') : `${time}${language === 'zh' ? '分' : 'm'}`}
            </button>
          ))}
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <label className={`block text-lg font-bold mb-4 ${textClass} flex items-center`}>
          <Zap className="mr-2 text-yellow-500" size={20} />
          {t[language].fatigue} (0-10): {fatigue} {fatigueEmojis[fatigue]}
        </label>
        <input type="range" min="0" max="10" value={fatigue} onChange={(e) => setFatigue(Number(e.target.value))} className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <div className="flex items-center justify-between mb-4">
          <span className={`text-lg font-bold ${textClass} flex items-center`}>
            <AlertCircle className="mr-2 text-orange-500" size={20} />
            {t[language].flare}
          </span>
          <button onClick={() => setIsFlare(!isFlare)} className={`px-4 py-2 rounded-full font-medium transition-all duration-200 ${isFlare ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-lg' : `${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'}`}`}>
            {isFlare ? (language === 'zh' ? '正在发作 ⚡' : 'Flaring ⚡') : (language === 'zh' ? '无发作' : 'No flare')}
          </button>
        </div>
        {isFlare && (
          <div className="mt-4 p-4 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-100">
            <h4 className={`font-semibold mb-3 ${textClass}`}>{t[language].triggers}</h4>
            <div className="grid grid-cols-3 gap-2">
              {triggers.map((trigger) => (
                <button key={trigger.id} onClick={() => toggleTrigger(trigger.id)} className={`flex flex-col items-center p-3 rounded-xl transition-all duration-200 ${selectedTriggers.includes(trigger.id) ? 'bg-blue-500 text-white shadow-lg transform scale-105' : `${isDark ? 'bg-gray-700' : 'bg-white'} hover:bg-blue-50 hover:shadow-md`}`}>
                  <span className="text-2xl mb-1">{trigger.icon}</span>
                  <span className="text-xs text-center font-medium">{trigger.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">{t[language].saveRecord}</button>
    </div>
  );

  const MedsPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textClass}`}>{t[language].meds}</h1>
        <button className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"><Plus size={20} /></button>
      </div>
      <div className="space-y-4">
        {medications.map((med) => (
          <div key={med.id} className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className={`text-lg font-bold ${textClass}`}>{med.name}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${med.type === 'TNFi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{med.type}</span>
                </div>
                <p className={`${subtextClass} text-sm`}>{med.dosage} • {med.frequency}</p>
              </div>
              <div className="text-right">
                <div className={`text-sm ${subtextClass}`}>{t[language].nextDose}</div>
                <div className={`font-semibold ${textClass}`}>{med.nextDose}</div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className={`text-sm font-medium ${textClass}`}>{t[language].adherence}</span>
                <span className={`text-sm font-bold ${med.adherence >= 90 ? 'text-green-600' : 'text-orange-600'}`}>{med.adherence}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${med.adherence >= 90 ? 'bg-green-500' : 'bg-orange-500'}`} style={{ width: `${med.adherence}%` }}></div>
              </div>
            </div>
            <div className="mb-4">
              <span className={`text-sm font-medium ${textClass} block mb-2`}>{t[language].sideEffects}</span>
              {med.sideEffects.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {med.sideEffects.map((effect, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{effect}</span>
                  ))}
                </div>
              ) : (
                <span className={`text-xs ${subtextClass}`}>{t[language].noSideEffects}</span>
              )}
            </div>
            <div className="flex gap-3">
              <button className="flex-1 bg-green-500 text白 py-2 rounded-xl font-medium hover:bg-green-600 transition-colors">{t[language].takeMed}</button>
              <button className={`flex-1 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors`}>{t[language].skipMed}</button>
            </div>
          </div>
        ))}
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'} text-center hover:border-blue-400 transition-colors cursor-pointer`}>
        <Plus className={`mx-auto mb-2 ${subtextClass}`} size={24} />
        <p className={`${subtextClass} font-medium`}>{t[language].addMedication}</p>
      </div>
    </div>
  );

  const ReportsPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textClass}`}>{t[language].reports}</h1>
        <div className="flex gap-2">
          <button className={`p-2 ${cardClass} rounded-xl shadow-sm border hover:shadow-md transition-all`}><Download size={20} className={`${subtextClass}`} /></button>
          <button className={`p-2 ${cardClass} rounded-xl shadow-sm border hover:shadow-md transition-all`}><Share2 size={20} className={`${subtextClass}`} /></button>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><TrendingUp className="mr-2 text-blue-500" size={20} />{t[language].weeklyTrends}</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="day" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '8px' }} />
              <Line type="monotone" dataKey="pain" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="fatigue" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><AlertCircle className="mr-2 text-orange-500" size={20} />{t[language].flareAnalysis}</h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={flareData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="trigger" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip contentStyle={{ backgroundColor: isDark ? '#1F2937' : '#FFFFFF', border: `1px solid ${isDark ? '#374151' : '#E5E7EB'}`, borderRadius: '8px' }} />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border bg-gradient-to-r ${isDark ? 'from-gray-800 to-gray-700' : 'from-blue-50 to-purple-50'}`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><Activity className="mr-2 text-purple-500" size={20} />AI {language === 'zh' ? '洞察' : 'Insights'}</h3>
        <div className="space-y-3">
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl border`}><p className={`text-sm ${textClass}`}>{language === 'zh' ? '📈 本周疼痛水平较上周下降了 15%，继续保持！' : '📈 Pain levels decreased by 15% this week compared to last week. Keep it up!'}</p></div>
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg白'} rounded-xl border`}><p className={`text-sm ${textClass}`}>{language === 'zh' ? '⚠️ 睡眠不足与发作高度相关，建议保持 7-8 小时睡眠' : '⚠️ Sleep deprivation is highly correlated with flares. Aim for 7-8 hours of sleep.'}</p></div>
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg白'} rounded-xl border`}><p className={`text-sm ${textClass}`}>{language === 'zh' ? '💊 用药依从性很好，当前治疗方案效果显著' : '💊 Excellent medication adherence. Current treatment plan shows significant improvement.'}</p></div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <button className="bg-gradient-to-r from-green-500 to-green-600 text白 py-4 rounded-2xl font-bold hover:from-green-600 hover:to-green-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">{t[language].exportPDF}</button>
        <button className="bg-gradient-to-r from-purple-500 to-purple-600 text白 py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">{t[language].shareReport}</button>
      </div>
    </div>
  );

  const LibraryPage = () => {
    const [selectedCategory, setSelectedCategory] = useState('all');
    const categories = [
      { id: 'all', label: language === 'zh' ? '全部' : 'All' },
      { id: 'basics', label: language === 'zh' ? '基础知识' : 'Basics' },
      { id: 'exercise', label: language === 'zh' ? '运动康复' : 'Exercise' },
      { id: 'medication', label: language === 'zh' ? '用药指南' : 'Medication' },
      { id: 'nutrition', label: language === 'zh' ? '营养饮食' : 'Nutrition' }
    ];
    const filteredContent = selectedCategory === 'all' ? educationContent : educationContent.filter(item => item.category.toLowerCase().includes(selectedCategory));
    return (
      <div className={`p-4 pb-20 ${bgClass} min-h-screen`}>
        <h1 className={`text-2xl font-bold ${textClass} mb-6`}>{t[language].library}</h1>
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button key={category.id} onClick={() => setSelectedCategory(category.id)} className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${selectedCategory === category.id ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}`}>
              {category.label}
            </button>
          ))}
        </div>
        <div className={`${cardClass} rounded-2xl p-6 shadow-sm border mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${textClass}`}>{language === 'zh' ? '学习进度' : 'Learning Progress'}</h3>
            <span className={`text-sm ${subtextClass}`}>{educationContent.filter(item => item.completed).length}/{educationContent.length}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div className="h-3 bg-gradient-to-r from-green-400 to-green-600 rounded-full transition-all duration-500" style={{ width: `${(educationContent.filter(item => item.completed).length / educationContent.length) * 100}%` }}></div>
          </div>
        </div>
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <div key={item.id} className={`${cardClass} rounded-2xl p-4 shadow-sm border transition-all duration-200 cursor-pointer group`}>
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-400 to-purple-500 rounded-xl mr-4 text-white text-2xl relative`}>{item.icon}</div>
                <div className="flex-1">
                  <h3 className={`font-bold ${textClass} mb-1`}>{item.title}</h3>
                  <div className={`text-sm ${subtextClass} flex items-center mb-2`}>
                    <span className={`px-2 py-1 rounded-full text-xs mr-2 ${item.category.includes('基础') || item.category.includes('Basics') ? 'bg-blue-100 text-blue-700' : item.category.includes('运动') || item.category.includes('Exercise') ? 'bg-green-100 text-green-700' : item.category.includes('用药') || item.category.includes('Medication') ? 'bg-purple-100 text-purple-700' : 'bg-orange-100 text-orange-700'}`}>{item.category}</span>
                    <Clock size={12} className="mr-1" />{item.duration}
                  </div>
                  <div className="flex items-center">
                    {item.completed ? (
                      <span className="text-xs text-green-600 font-medium">{language === 'zh' ? '已完成' : 'Completed'}</span>
                    ) : (
                      <span className="text-xs text-blue-600 font-medium">{language === 'zh' ? '开始学习' : 'Start Learning'}</span>
                    )}
                  </div>
                </div>
                <ChevronRight className={`${subtextClass}`} size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const SettingsPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <h1 className={`text-2xl font-bold ${textClass} mb-6`}>{t[language].settings}</h1>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><Palette className="mr-2 text-purple-500" size={20} />{t[language].appearance}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${textClass} font-medium`}>{t[language].darkMode}</span>
            <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isDark ? 'bg-blue-600' : 'bg-gray-300'}`}>
              <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isDark ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${textClass} font-medium`}>{t[language].language}</span>
            <select value={language} onChange={(e) => setLanguage(e.target.value)} className={`${cardClass} border rounded-lg px-3 py-1 text-sm`}>
              <option value="zh">中文</option>
              <option value="en">English</option>
            </select>
          </div>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><Shield className="mr-2 text-green-500" size={20} />{t[language].privacy}</h3>
        <div className="space-y-4">
          <button className={`w-full text-left p-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors flex items-center justify-between`}>
            <span className={`${textClass} font-medium`}>{t[language].dataExport}</span>
            <ChevronRight className={`${subtextClass}`} size={16} />
          </button>
          <button className={`w-full text-left p-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-gray-100'} rounded-xl transition-colors flex items-center justify-between`}>
            <span className={`${textClass} font-medium`}>{t[language].dataImport}</span>
            <ChevronRight className={`${subtextClass}`} size={16} />
          </button>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><Bell className="mr-2 text-blue-500" size={20} />{t[language].notifications}</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className={`${textClass} font-medium`}>{language === 'zh' ? '用药提醒' : 'Medication Reminders'}</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" /></div>
          </div>
          <div className="flex items-center justify-between">
            <span className={`${textClass} font-medium`}>{language === 'zh' ? '症状记录提醒' : 'Symptom Tracking'}</span>
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg白 transition-transform translate-x-6" /></div>
          </div>
        </div>
      </div>
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}><User className="mr-2 text-gray-500" size={20} />{t[language].about}</h3>
        <div className="space-y-2">
          <p className={`text-sm ${subtextClass}`}>{language === 'zh' ? 'AS 助手 v1.0.0' : 'AS Helper v1.0.0'}</p>
          <p className={`text-sm ${subtextClass}`}>{language === 'zh' ? '专为强直性脊柱炎患者设计的健康管理工具' : 'Health management tool designed for AS patients'}</p>
          <p className={`text-xs ${subtextClass} mt-4 p-3 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg`}>{language === 'zh' ? '⚠️ 本应用仅用于健康教育与自我管理，不构成医疗建议。如症状持续或加重，请及时就医。' : '⚠️ This app is for health education and self-management only. It does not constitute medical advice. Please consult healthcare providers if symptoms persist or worsen.'}</p>
        </div>
      </div>
    </div>
  );

  const renderPage = () => {
    switch (currentPage) {
      case 'home': return <HomePage />;
      case 'track': return <TrackPage />;
      case 'meds': return <MedsPage />;
      case 'reports': return <ReportsPage />;
      case 'library': return <LibraryPage />;
      case 'settings': return <SettingsPage />;
      default: return <HomePage />;
    }
  };

  return (
    <div className={`max-w-md mx-auto ${bgClass} min-h-screen transition-colors duration-300`}>
      {renderPage()}
      <NavBar />
    </div>
  );
};

export default ASRedesign;


