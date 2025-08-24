import React, { useState, useEffect } from 'react';
import { Home, Calendar, Pill, TrendingUp, Book, Settings, Plus, ChevronRight, Bell, Download, Share2, AlertCircle, Clock, Heart, Zap, CheckCircle, Trash2, Save, Send, Bot, Palette, Shield, User, Activity, Target, LineChart } from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart as RechartsBarChart, Bar } from 'recharts';
import { dataStorage, symptomTracker, medicationManager } from '../utils/storage';
import { pdfExporter } from '../utils/pdfExport';

const ASRedesign = () => {
  const [currentPage, setCurrentPage] = useState('home');
  const [language, setLanguage] = useState('zh');
  const [theme, setTheme] = useState('light');
  const [themeColor, setThemeColor] = useState('blue');
  const [painLevel, setPainLevel] = useState(3);
  const [stiffnessTime, setStiffnessTime] = useState(30);
  const [fatigue, setFatigue] = useState(3);
  const [isFlare, setIsFlare] = useState(false);
  const [selectedTriggers, setSelectedTriggers] = useState([]);
  const [showAddMed, setShowAddMed] = useState(false);
  const [newMedication, setNewMedication] = useState({
    name: '',
    type: 'NSAID',
    dosage: '',
    frequency: ''
  });
  const [chatMessages, setChatMessages] = useState([]);
  const [chatInput, setChatInput] = useState('');
  const [medications, setMedications] = useState([]);
  const [symptomRecords, setSymptomRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // 主题色配置
  const themeColors = {
    blue: {
      primary: 'from-blue-500 to-blue-600',
      secondary: 'from-blue-400 to-purple-500',
      accent: 'blue-500',
      light: 'blue-50'
    },
    green: {
      primary: 'from-green-500 to-green-600',
      secondary: 'from-green-400 to-teal-500',
      accent: 'green-500',
      light: 'green-50'
    },
    purple: {
      primary: 'from-purple-500 to-purple-600',
      secondary: 'from-purple-400 to-pink-500',
      accent: 'purple-500',
      light: 'purple-50'
    },
    orange: {
      primary: 'from-orange-500 to-orange-600',
      secondary: 'from-orange-400 to-red-500',
      accent: 'orange-500',
      light: 'orange-50'
    }
  };

  // 模拟数据 - 完全国际化
  const weeklyData = [
    { day: language === 'zh' ? '周一' : 'Mon', pain: 4, stiffness: 45, fatigue: 3 },
    { day: language === 'zh' ? '周二' : 'Tue', pain: 3, stiffness: 30, fatigue: 2 },
    { day: language === 'zh' ? '周三' : 'Wed', pain: 5, stiffness: 60, fatigue: 4 },
    { day: language === 'zh' ? '周四' : 'Thu', pain: 2, stiffness: 15, fatigue: 2 },
    { day: language === 'zh' ? '周五' : 'Fri', pain: 3, stiffness: 30, fatigue: 3 },
    { day: language === 'zh' ? '周六' : 'Sat', pain: 1, stiffness: 10, fatigue: 1 },
    { day: language === 'zh' ? '周日' : 'Sun', pain: 2, stiffness: 20, fatigue: 2 }
  ];

  const flareData = [
    { 
      trigger: language === 'zh' ? '睡眠不足' : 'Sleep deprivation', 
      count: 8, 
      color: '#EF4444', 
      percentage: 40 
    },
    { 
      trigger: language === 'zh' ? '天气变化' : 'Weather changes', 
      count: 5, 
      color: '#F59E0B', 
      percentage: 25 
    },
    { 
      trigger: language === 'zh' ? '工作压力' : 'Work stress', 
      count: 4, 
      color: '#8B5CF6', 
      percentage: 20 
    },
    { 
      trigger: language === 'zh' ? '过度劳累' : 'Overexertion', 
      count: 3, 
      color: '#06B6D4', 
      percentage: 15 
    }
  ];

  // 完整的翻译对象
  const t = {
    zh: {
      home: '今日概览',
      track: '症状记录',
      meds: '用药管理',
      reports: '趋势报告',
      library: '教育资源',
      settings: '设置',
      todayOverview: '今日状态',
      quickRecord: '快速记录',
      painLevel: '疼痛程度',
      morningStiffness: '晨僵时长',
      fatigue: '疲劳程度',
      flare: '发作状态',
      triggers: '可能诱因',
      saveRecord: '保存记录',
      weekSummary: '本周记录',
      avgPain: '疼痛均值',
      checkInDays: '打卡天数',
      flareCount: '发作次数',
      microLearning: '健康微课',
      minutes: '分钟',
      addMedication: '添加药物',
      medicationName: '药物名称',
      dosageFrequency: '剂量/频率',
      nextDose: '下次用药',
      adherence: '依从性',
      sideEffects: '副作用',
      noSideEffects: '无副作用',
      takeMed: '已用药',
      skipMed: '跳过',
      weeklyTrends: '本周趋势',
      monthlyReport: '月度报告',
      exportPDF: '导出PDF',
      shareReport: '分享报告',
      painTrend: '疼痛趋势',
      flareAnalysis: '发作分析',
      triggerAnalysis: '诱因分析',
      appearance: '外观设置',
      privacy: '隐私设置',
      notifications: '通知设置',
      language: '语言',
      darkMode: '深色模式',
      fontSize: '字体大小',
      dataExport: '数据导出',
      dataImport: '数据导入',
      about: '关于应用',
      themeColor: '主题颜色',
      blue: '蓝色',
      green: '绿色',
      purple: '紫色',
      orange: '橙色',
      cancel: '取消',
      confirm: '确认',
      edit: '编辑',
      delete: '删除',
      save: '保存',
      dosage: '剂量',
      frequency: '频率',
      medicationType: '药物类型',
      painLabel: '疼痛',
      fatigueLabel: '疲劳',
      stiffnessLabel: '晨僵',
      aiChat: 'AI助手',
      aiDisclaimer: '⚠️ AI回答仅供参考，请遵循医生建议',
      askAI: '向AI提问',
      chatPlaceholder: '请输入您的问题...'
    },
    en: {
      home: 'Today',
      track: 'Tracking',
      meds: 'Medication',
      reports: 'Reports',
      library: 'Education',
      settings: 'Settings',
      todayOverview: 'Today\'s Status',
      quickRecord: 'Quick Record',
      painLevel: 'Pain Level',
      morningStiffness: 'Morning Stiffness',
      fatigue: 'Fatigue Level',
      flare: 'Flare Status',
      triggers: 'Possible Triggers',
      saveRecord: 'Save Record',
      weekSummary: 'Weekly Summary',
      avgPain: 'Avg Pain',
      checkInDays: 'Check-in Days',
      flareCount: 'Flare Count',
      microLearning: 'Health Tips',
      minutes: 'minutes',
      addMedication: 'Add Medication',
      medicationName: 'Medication Name',
      dosageFrequency: 'Dosage/Frequency',
      nextDose: 'Next Dose',
      adherence: 'Adherence',
      sideEffects: 'Side Effects',
      noSideEffects: 'No Side Effects',
      takeMed: 'Take Med',
      skipMed: 'Skip',
      weeklyTrends: 'Weekly Trends',
      monthlyReport: 'Monthly Report',
      exportPDF: 'Export PDF',
      shareReport: 'Share Report',
      painTrend: 'Pain Trend',
      flareAnalysis: 'Flare Analysis',
      triggerAnalysis: 'Trigger Analysis',
      appearance: 'Appearance',
      privacy: 'Privacy',
      notifications: 'Notifications',
      language: 'Language',
      darkMode: 'Dark Mode',
      fontSize: 'Font Size',
      dataExport: 'Data Export',
      dataImport: 'Data Import',
      about: 'About',
      themeColor: 'Theme Color',
      blue: 'Blue',
      green: 'Green',
      purple: 'Purple',
      orange: 'Orange',
      cancel: 'Cancel',
      confirm: 'Confirm',
      edit: 'Edit',
      delete: 'Delete',
      save: 'Save',
      dosage: 'Dosage',
      frequency: 'Frequency',
      medicationType: 'Medication Type',
      painLabel: 'Pain',
      fatigueLabel: 'Fatigue',
      stiffnessLabel: 'Stiffness',
      aiChat: 'AI Assistant',
      aiDisclaimer: '⚠️ AI responses are for reference only. Please follow medical advice.',
      askAI: 'Ask AI',
      chatPlaceholder: 'Enter your question...'
    }
  };

  const painEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];
  const fatigueEmojis = ['😊', '🙂', '😐', '😟', '😰', '😵‍💫', '😵', '😭', '🤯', '💀', '☠️'];

  const triggers = [
    { id: 'sleep', label: { zh: '睡眠', en: 'Sleep' }, icon: '🛏️' },
    { id: 'posture', label: { zh: '姿势', en: 'Posture' }, icon: '🪑' },
    { id: 'overuse', label: { zh: '过劳', en: 'Overuse' }, icon: '💪' },
    { id: 'infection', label: { zh: '感染', en: 'Infection' }, icon: '🦠' },
    { id: 'emotion', label: { zh: '情绪', en: 'Emotion' }, icon: '😰' },
    { id: 'weather', label: { zh: '天气', en: 'Weather' }, icon: '🌧️' }
  ];

  const educationContent = [
    {
      id: 1,
      title: { zh: 'AS 基础科普', en: 'AS Basics' },
      duration: { zh: '2 分钟', en: '2 min' },
      icon: '📖',
      category: { zh: '基础知识', en: 'Basics' },
      completed: true,
      url: 'https://www.mayoclinic.org/zh-hans/diseases-conditions/ankylosing-spondylitis/symptoms-causes/syc-20354808'
    },
    {
      id: 2,
      title: { zh: '颈部拉伸指南', en: 'Neck Stretching Guide' },
      duration: { zh: '5 分钟', en: '5 min' },
      icon: '🏃‍♂️',
      category: { zh: '运动康复', en: 'Exercise' },
      completed: false,
      url: 'https://m.qlyyqd.com/jktj/2018/9av2wLaG.html'
    },
    {
      id: 3,
      title: { zh: '生物制剂科普', en: 'Biologics Guide' },
      duration: { zh: '3 分钟', en: '3 min' },
      icon: '💊',
      category: { zh: '用药指南', en: 'Medication' },
      completed: false,
      url: 'https://zhuanlan.zhihu.com/p/577156969'
    },
    {
      id: 4,
      title: { zh: '抗炎饮食建议', en: 'Anti-inflammatory Diet' },
      duration: { zh: '4 分钟', en: '4 min' },
      icon: '🥗',
      category: { zh: '营养饮食', en: 'Nutrition' },
      completed: true,
      url: 'https://www.thepaper.cn/newsDetail_forward_26801561'
    }
  ];

  const isDark = theme === 'dark';
  const bgClass = isDark ? 'bg-gray-900' : 'bg-gray-50';
  const cardClass = isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const subtextClass = isDark ? 'text-gray-300' : 'text-gray-500';
  const currentTheme = themeColors[themeColor];

  // 数据加载和保存
  useEffect(() => {
    loadAppData();
  }, []);

  // 加载应用数据
  const loadAppData = () => {
    try {
      const data = dataStorage.loadData();
      setLanguage(data.settings?.language || 'zh');
      setTheme(data.settings?.theme || 'light');
      setThemeColor(data.settings?.themeColor || 'blue');
      setMedications(data.medications || []);
      setSymptomRecords(data.symptoms?.dailyRecords || []);
    } catch (error) {
      console.error('加载数据失败:', error);
    }
  };

  // 保存应用数据
  const saveAppData = () => {
    try {
      const data = dataStorage.loadData();
      data.settings = {
        ...data.settings,
        language,
        theme,
        themeColor
      };
      data.medications = medications;
      data.symptoms = {
        ...data.symptoms,
        dailyRecords: symptomRecords
      };
      dataStorage.saveData(data);
    } catch (error) {
      console.error('保存数据失败:', error);
    }
  };

  // 当关键数据变化时自动保存
  useEffect(() => {
    saveAppData();
  }, [language, theme, themeColor, medications, symptomRecords]);

  // 添加触发器选择逻辑
  const toggleTrigger = (triggerId) => {
    setSelectedTriggers(prev => 
      prev.includes(triggerId) 
        ? prev.filter(id => id !== triggerId)
        : [...prev, triggerId]
    );
  };

  // 添加药物功能
  const handleAddMedication = () => {
    if (newMedication.name.trim()) {
      const newMed = {
        id: Date.now(),
        name: { zh: newMedication.name, en: newMedication.name },
        type: newMedication.type,
        dosage: newMedication.dosage,
        frequency: { zh: newMedication.frequency, en: newMedication.frequency },
        nextDose: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        adherence: 100,
        sideEffects: { zh: [], en: [] }
      };
      
      // 使用真实的数据管理器
      const addedMed = medicationManager.addMedication(newMed);
      setMedications([...medications, addedMed]);
      setNewMedication({ name: '', type: 'NSAID', dosage: '', frequency: '' });
      setShowAddMed(false);
    }
  };

  // 删除药物功能
  const handleDeleteMedication = (id) => {
    medicationManager.deleteMedication(id);
    setMedications(medications.filter(med => med.id !== id));
  };

  // 保存症状记录
  const saveSymptomRecord = () => {
    const record = {
      painLevel,
      stiffnessTime,
      fatigue,
      isFlare,
      selectedTriggers,
      timestamp: new Date().toISOString()
    };
    
    // 使用真实的症状追踪器
    const newRecord = symptomTracker.addSymptomRecord(record);
    setSymptomRecords([...symptomRecords, newRecord]);
    
    // 重置表单
    setPainLevel(3);
    setStiffnessTime(30);
    setFatigue(3);
    setIsFlare(false);
    setSelectedTriggers([]);
    
    alert(language === 'zh' ? '症状记录已保存！' : 'Symptom record saved!');
  };

  // 自定义Tooltip组件，确保完全国际化
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className={`${cardClass} p-3 rounded-lg shadow-lg border`}>
          <p className={`${textClass} font-medium mb-2`}>{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey === 'pain' && `${t[language].painLabel}: ${entry.value}`}
              {entry.dataKey === 'fatigue' && `${t[language].fatigueLabel}: ${entry.value}`}
              {entry.dataKey === 'stiffness' && `${t[language].stiffnessLabel}: ${entry.value} ${t[language].minutes}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // 模拟AI回复
  const aiResponses = {
    zh: {
      '疼痛': '对于强直性脊柱炎的疼痛管理，建议：1）按医嘱服用抗炎药物 2）进行适度的拉伸运动 3）保持正确的姿势。⚠️ 仅供参考，请遵循医生建议。',
      '运动': 'AS患者适合的运动包括：游泳、太极、瑜伽和脊柱拉伸操。避免高冲击性运动。建议咨询理疗师制定个人化运动计划。',
      '饮食': '抗炎饮食建议：多食用富含Omega-3的鱼类、新鲜蔬果、全谷物。减少糖分、加工食品和饱和脂肪摄入。',
      '疲倦': 'AS患者疲倦的常见原因：1）炎症活动 2）睡眠质量差 3）药物副作用。建议：保持规律作息、适度运动、营养均衡。如持续疲倦请咨询医生。',
      '疲劳': 'AS疲劳管理：1）保证7-8小时优质睡眠 2）避免过度劳累 3）进行温和的有氧运动 4）注意营养补充。严重疲劳需就医检查。',
      '睡眠': '改善AS患者睡眠：1）保持规律作息 2）睡前避免刺激性活动 3）创造安静舒适的睡眠环境 4）必要时咨询医生调整用药时间。',
      'default': '我理解您的困扰。作为AS健康助手，我建议您咨询专业医生获得个性化建议。同时可以尝试：保持规律作息、适度运动、营养均衡。⚠️ 仅供参考，请遵循医生建议。'
    },
    en: {
      'pain': 'For AS pain management: 1) Take anti-inflammatory medications as prescribed 2) Perform gentle stretching exercises 3) Maintain good posture. ⚠️ For reference only, please follow medical advice.',
      'exercise': 'Suitable exercises for AS include: swimming, tai chi, yoga, and spinal stretching. Avoid high-impact activities. Consult a physiotherapist for personalized plans.',
      'diet': 'Anti-inflammatory diet: Include omega-3 rich fish, fresh fruits/vegetables, whole grains. Reduce sugar, processed foods, and saturated fats.',
      'tired': 'Common causes of tiredness in AS: 1) Inflammatory activity 2) Poor sleep quality 3) Medication side effects. Suggestions: maintain regular sleep schedule, moderate exercise, balanced nutrition. Consult doctor if persistent.',
      'fatigue': 'AS fatigue management: 1) Ensure 7-8 hours quality sleep 2) Avoid overexertion 3) Gentle aerobic exercise 4) Nutritional support. Severe fatigue requires medical evaluation.',
      'sleep': 'Improve AS sleep: 1) Regular sleep schedule 2) Avoid stimulating activities before bed 3) Create quiet, comfortable sleep environment 4) Consult doctor about medication timing if needed.',
      'default': 'I understand your concern. As an AS health assistant, I recommend consulting a healthcare professional for personalized advice. You can also try: regular sleep schedule, moderate exercise, balanced nutrition. ⚠️ For reference only, please follow medical advice.'
    }
  };

  const sendMessage = () => {
    if (!chatInput.trim()) return;
    
    const userMessage = { id: Date.now(), type: 'user', content: chatInput };
    setChatMessages(prev => [...prev, userMessage]);
    
    // 模拟AI回复
    setTimeout(() => {
      let response = aiResponses[language].default;
      const input = chatInput.toLowerCase();
      
      if (input.includes('疼痛') || input.includes('pain')) {
        response = aiResponses[language]['疼痛'] || aiResponses[language]['pain'];
      } else if (input.includes('运动') || input.includes('exercise')) {
        response = aiResponses[language]['运动'] || aiResponses[language]['exercise'];
      } else if (input.includes('饮食') || input.includes('diet')) {
        response = aiResponses[language]['饮食'] || aiResponses[language]['diet'];
      } else if (input.includes('疲倦') || input.includes('tired')) {
        response = aiResponses[language]['疲倦'] || aiResponses[language]['tired'];
      } else if (input.includes('疲劳') || input.includes('fatigue')) {
        response = aiResponses[language]['疲劳'] || aiResponses[language]['fatigue'];
      } else if (input.includes('睡眠') || input.includes('sleep')) {
        response = aiResponses[language]['睡眠'] || aiResponses[language]['sleep'];
      }
      
      const aiMessage = { id: Date.now() + 1, type: 'ai', content: response };
      setChatMessages(prev => [...prev, aiMessage]);
    }, 1000);
    
    setChatInput('');
  };

  const NavBar = () => (
    <div className={`fixed bottom-0 left-0 right-0 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-t px-2 py-2 backdrop-blur-lg bg-opacity-95`}>
      <div className="flex justify-around">
        {[
          { id: 'home', icon: Home, label: t[language].home },
          { id: 'track', icon: Calendar, label: t[language].track },
          { id: 'meds', icon: Pill, label: t[language].meds },
          { id: 'reports', icon: TrendingUp, label: t[language].reports },
          { id: 'library', icon: Book, label: t[language].library },
          { id: 'ai', icon: Bot, label: t[language].aiChat }
        ].map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setCurrentPage(id)}
            className={`flex flex-col items-center py-2 px-3 rounded-xl transition-all duration-200 ${
              currentPage === id 
                ? `bg-gradient-to-b ${currentTheme.primary} text-white shadow-lg transform scale-105` 
                : `${subtextClass} hover:${textClass} hover:bg-gray-100 ${isDark ? 'hover:bg-gray-700' : ''}`
            }`}
          >
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
          <p className={`${subtextClass} mt-1`}>
            {language === 'zh' ? '今天感觉如何？' : 'How are you feeling today?'}
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
            className={`px-4 py-2 ${cardClass} rounded-xl text-sm font-medium shadow-sm border transition-all hover:shadow-md`}
          >
            {language === 'zh' ? 'EN' : '中文'}
          </button>
          <button onClick={() => setCurrentPage('settings')}>
            <Settings className={`${subtextClass} hover:${textClass} transition-colors`} size={22} />
          </button>
        </div>
      </div>

      <div className={`bg-gradient-to-br ${currentTheme.secondary} rounded-2xl p-6 text-white shadow-xl relative overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -translate-y-8 translate-x-8"></div>
        <div className="relative z-10">
          <h2 className="text-xl font-bold mb-2">{t[language].quickRecord}</h2>
          <p className="text-blue-100 mb-4 text-sm">
            {language === 'zh' ? '30秒完成今日记录' : 'Complete today\'s log in 30 seconds'}
          </p>
          <button
            onClick={() => setCurrentPage('track')}
            className="bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {language === 'zh' ? '开始记录 →' : 'Start Recording →'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className={`${cardClass} rounded-2xl p-4 shadow-sm border`}>
          <div className="flex items-center justify-between mb-2">
            <Activity className="text-blue-500" size={20} />
            <span className="text-xs font-medium text-blue-500 bg-blue-50 px-2 py-1 rounded-full">
              {language === 'zh' ? '今日' : 'Today'}
            </span>
          </div>
          <div className={`text-2xl font-bold ${textClass}`}>3.2</div>
          <div className={`text-sm ${subtextClass}`}>{t[language].avgPain}</div>
        </div>
        
        <div className={`${cardClass} rounded-2xl p-4 shadow-sm border`}>
          <div className="flex items-center justify-between mb-2">
            <Target className="text-green-500" size={20} />
            <span className="text-xs font-medium text-green-500 bg-green-50 px-2 py-1 rounded-full">
              {language === 'zh' ? '本周' : 'This Week'}
            </span>
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
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <Area 
                type="monotone" 
                dataKey="pain" 
                stroke="#3B82F6" 
                fillOpacity={1} 
                fill="url(#painGradient)"
                strokeWidth={3}
              />
              <Tooltip content={<CustomTooltip />} />
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
            <div 
              key={item.id} 
              className={`flex items-center p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-50'} rounded-xl hover:${isDark ? 'bg-gray-600' : 'bg-gray-100'} transition-all duration-200 cursor-pointer group`}
              onClick={() => {
                if (item.url && item.url !== '#') {
                  window.open(item.url, '_blank');
                }
              }}
            >
              <div className={`flex items-center justify-center w-12 h-12 bg-gradient-to-br ${currentTheme.secondary} rounded-xl mr-4 text-white text-xl`}>
                {item.icon}
              </div>
              <div className="flex-1">
                <div className={`font-semibold ${textClass} group-hover:text-blue-600 transition-colors`}>
                  {item.title[language]}
                </div>
                <div className={`text-sm ${subtextClass} flex items-center mt-1`}>
                  <Clock size={12} className="mr-1" />
                  {item.duration[language]}
                  {item.completed && (
                    <CheckCircle size={12} className="ml-2 text-green-500" />
                  )}
                </div>
              </div>
              <ChevronRight className={`${subtextClass} group-hover:text-blue-600 transition-colors`} size={20} />
            </div>
          ))}
        </div>
        
        <button 
          onClick={() => setCurrentPage('library')}
          className={`w-full mt-4 py-3 ${isDark ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-100 hover:bg-gray-200'} rounded-xl font-medium ${textClass} transition-all duration-200`}
        >
          {language === 'zh' ? '查看更多课程' : 'View More Courses'}
        </button>
      </div>
    </div>
  );



  const TrackPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textClass}`}>{t[language].track}</h1>
        <div className="flex items-center space-x-2">
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
        <div className="relative mb-4">
          <input type="range" min="0" max="10" value={fatigue} onChange={(e) => setFatigue(Number(e.target.value))} className="w-full h-4 bg-gray-200 rounded-lg appearance-none cursor-pointer slider" style={{ background: `linear-gradient(to right, #10B981 0%, #F59E0B ${fatigue * 10}%, #EF4444 100%)` }} />
        </div>
        <div className={`flex justify-between text-sm ${subtextClass}`}>
          <span>😊 {language === 'zh' ? '精力充沛' : 'Energetic'}</span>
          <span>😵 {language === 'zh' ? '极度疲劳' : 'Exhausted'}</span>
        </div>
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
                  <span className="text-xs text-center font-medium">{trigger.label[language]}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
      <button 
        onClick={saveSymptomRecord}
        className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 rounded-2xl font-bold text-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
      >
        {t[language].saveRecord}
      </button>
    </div>
  );

  const MedsPage = () => (
    <div className={`p-4 pb-20 space-y-6 ${bgClass} min-h-screen`}>
      <div className="flex items-center justify-between">
        <h1 className={`text-2xl font-bold ${textClass}`}>{t[language].meds}</h1>
        <button onClick={() => setShowAddMed(true)} className={`bg-gradient-to-r ${currentTheme.primary} text-white p-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105`}><Plus size={20} /></button>
      </div>
      <div className="space-y-4">
        {medications.map((med) => (
          <div key={med.id} className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center mb-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                  <h3 className={`text-lg font-bold ${textClass}`}>{med.name[language]}</h3>
                  <span className={`ml-2 px-2 py-1 text-xs font-medium rounded-full ${med.type === 'TNFi' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>{med.type}</span>
                </div>
                <p className={`${subtextClass} text-sm`}>{med.dosage} • {med.frequency[language]}</p>
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
              {med.sideEffects[language].length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {med.sideEffects[language].map((effect, index) => (
                    <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">{effect}</span>
                  ))}
                </div>
              ) : (
                <span className={`text-xs ${subtextClass}`}>{t[language].noSideEffects}</span>
              )}
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => {
                  if (medicationManager.recordMedicationTaken(med.id)) {
                    alert(language === 'zh' ? '已记录用药！' : 'Medication taken recorded!');
                  } else {
                    alert(language === 'zh' ? '记录失败，请重试' : 'Record failed, please try again');
                  }
                }}
                className="flex-1 bg-green-500 text-white py-2 rounded-xl font-medium hover:bg-green-600 transition-colors"
              >
                {t[language].takeMed}
              </button>
              <button 
                onClick={() => {
                  alert(language === 'zh' ? '已记录跳过用药！' : 'Medication skip recorded!');
                }}
                className={`flex-1 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors`}
              >
                {t[language].skipMed}
              </button>
              <button 
                onClick={() => handleDeleteMedication(med.id)}
                className="px-3 py-2 bg-red-500 text-white rounded-xl font-medium hover:bg-red-600 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
      
      {/* 添加药物表单 */}
      {showAddMed && (
        <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
          <h3 className={`text-lg font-bold ${textClass} mb-4`}>{t[language].addMedication}</h3>
          <div className="space-y-4">
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>{t[language].medicationName}</label>
              <input
                type="text"
                value={newMedication.name}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('药物名称输入:', value);
                  setNewMedication(prev => ({...prev, name: value}));
                }}
                className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                placeholder={language === 'zh' ? '输入药物名称' : 'Enter medication name'}
              />
            </div>
            <div>
              <label className={`block text-sm font-medium ${textClass} mb-2`}>{t[language].medicationType}</label>
              <select
                value={newMedication.type}
                onChange={(e) => {
                  const value = e.target.value;
                  console.log('药物类型选择:', value);
                  setNewMedication(prev => ({...prev, type: value}));
                }}
                className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
              >
                <option value="NSAID">NSAID</option>
                <option value="TNFi">TNFi</option>
                <option value="DMARD">DMARD</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>{t[language].dosage}</label>
                <input
                  type="text"
                  value={newMedication.dosage}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('剂量输入:', value);
                    setNewMedication(prev => ({...prev, dosage: value}));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === 'zh' ? '如：200mg' : 'e.g., 200mg'}
                />
              </div>
              <div>
                <label className={`block text-sm font-medium ${textClass} mb-2`}>{t[language].frequency}</label>
                <input
                  type="text"
                  value={newMedication.frequency}
                  onChange={(e) => {
                    const value = e.target.value;
                    console.log('频率输入:', value);
                    setNewMedication(prev => ({...prev, frequency: value}));
                  }}
                  className={`w-full px-3 py-2 border rounded-lg ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-white border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  placeholder={language === 'zh' ? '如：每日2次' : 'e.g., Twice daily'}
                />
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleAddMedication}
                disabled={!newMedication.name.trim()}
                className={`flex-1 bg-gradient-to-r ${currentTheme.primary} text-white py-2 rounded-xl font-medium hover:opacity-90 transition-opacity disabled:opacity-50`}
              >
                {t[language].save}
              </button>
              <button
                onClick={() => setShowAddMed(false)}
                className={`flex-1 ${isDark ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'} py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors`}
              >
                {t[language].cancel}
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div 
        className={`${cardClass} rounded-2xl p-6 shadow-sm border-2 border-dashed ${isDark ? 'border-gray-600' : 'border-gray-300'} text-center hover:border-blue-400 transition-colors cursor-pointer`}
        onClick={() => setShowAddMed(true)}
      >
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
          <button 
            onClick={async () => {
              setIsLoading(true);
              try {
                const data = dataStorage.loadData();
                
                // 确保数据结构完整
                if (!data.symptoms) {
                  data.symptoms = { dailyRecords: [] };
                }
                if (!data.symptoms.dailyRecords) {
                  data.symptoms.dailyRecords = [];
                }
                
                const symptomData = {
                  stats: symptomTracker.getSymptomStats(),
                  records: symptomRecords.slice(-30) // 最近30条记录
                };
                
                await pdfExporter.exportSymptomReport(symptomData, language);
                pdfExporter.savePDF(`as_symptom_report_${new Date().toISOString().split('T')[0]}.pdf`);
                
                alert(language === 'zh' ? 'PDF报告导出成功！' : 'PDF report exported successfully!');
              } catch (error) {
                console.error('导出失败:', error);
                alert(language === 'zh' ? '导出失败，请重试' : 'Export failed, please try again');
              } finally {
                setIsLoading(false);
              }
            }}
            disabled={isLoading}
            className={`p-2 ${cardClass} rounded-xl shadow-sm border hover:shadow-md transition-all ${isLoading ? 'opacity-50' : ''}`}
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <Download size={20} className={`${subtextClass}`} />
            )}
          </button>
          <button 
            onClick={async () => {
              try {
                const data = dataStorage.loadData();
                
                // 确保数据结构完整
                if (!data.symptoms) {
                  data.symptoms = { dailyRecords: [] };
                }
                if (!data.symptoms.dailyRecords) {
                  data.symptoms.dailyRecords = [];
                }
                
                const symptomData = {
                  stats: symptomTracker.getSymptomStats(),
                  records: symptomRecords.slice(-30)
                };
                
                // 生成PDF报告
                await pdfExporter.exportSymptomReport(symptomData, language);
                
                // 尝试使用原生分享API
                if (navigator.share) {
                  const pdfBlob = pdfExporter.doc.output('blob');
                  const pdfFile = new File([pdfBlob], `as_health_report_${new Date().toISOString().split('T')[0]}.pdf`, {
                    type: 'application/pdf'
                  });
                  
                  await navigator.share({
                    title: language === 'zh' ? 'AS健康报告' : 'AS Health Report',
                    text: language === 'zh' ? '我的健康报告' : 'My health report',
                    files: [pdfFile]
                  });
                } else {
                  // 回退到下载
                  pdfExporter.savePDF(`as_health_report_${new Date().toISOString().split('T')[0]}.pdf`);
                  alert(language === 'zh' ? '报告已下载，请手动分享' : 'Report downloaded, please share manually');
                }
              } catch (error) {
                console.error('分享失败:', error);
                alert(language === 'zh' ? '分享失败，请重试' : 'Share failed, please try again');
              }
            }}
            className={`p-2 ${cardClass} rounded-xl shadow-sm border hover:shadow-md transition-all`}
          >
            <Share2 size={20} className={`${subtextClass}`} />
          </button>
        </div>
      </div>

      {/* Weekly Trends */}
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}>
          <TrendingUp className="mr-2 text-blue-500" size={20} />
          {t[language].weeklyTrends}
        </h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsLineChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="day" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="pain" stroke="#EF4444" strokeWidth={3} dot={{ fill: '#EF4444', strokeWidth: 2, r: 4 }} />
              <Line type="monotone" dataKey="fatigue" stroke="#F59E0B" strokeWidth={3} dot={{ fill: '#F59E0B', strokeWidth: 2, r: 4 }} />
            </RechartsLineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Flare Analysis */}
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}>
          <AlertCircle className="mr-2 text-orange-500" size={20} />
          {t[language].flareAnalysis}
        </h3>
        <div className="h-48">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsBarChart data={flareData}>
              <CartesianGrid strokeDasharray="3 3" stroke={isDark ? '#374151' : '#E5E7EB'} />
              <XAxis dataKey="trigger" stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <YAxis stroke={isDark ? '#9CA3AF' : '#6B7280'} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="count" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </RechartsBarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* AI Insights */}
      <div className={`${cardClass} rounded-2xl p-6 shadow-sm border bg-gradient-to-r ${isDark ? 'from-gray-800 to-gray-700' : 'from-blue-50 to-purple-50'}`}>
        <h3 className={`text-lg font-bold ${textClass} mb-4 flex items-center`}>
          <Activity className="mr-2 text-purple-500" size={20} />
          AI {language === 'zh' ? '洞察' : 'Insights'}
        </h3>
        <div className="space-y-3">
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl border`}>
            <p className={`text-sm ${textClass}`}>
              {language === 'zh' 
                ? '📈 本周疼痛水平较上周下降了 15%，继续保持！' 
                : '📈 Pain levels decreased by 15% this week compared to last week. Keep it up!'}
            </p>
          </div>
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl border`}>
            <p className={`text-sm ${textClass}`}>
              {language === 'zh' 
                ? '⚠️ 睡眠不足与发作高度相关，建议保持 7-8 小时睡眠' 
                : '⚠️ Sleep deprivation is highly correlated with flares. Aim for 7-8 hours of sleep.'}
            </p>
          </div>
          <div className={`p-3 ${isDark ? 'bg-gray-700' : 'bg-white'} rounded-xl border`}>
            <p className={`text-sm ${textClass}`}>
              {language === 'zh' 
                ? '💊 用药依从性很好，当前治疗方案效果显著' 
                : '💊 Excellent medication adherence. Current treatment plan shows significant improvement.'}
            </p>
          </div>
        </div>
      </div>

      {/* Export Options */}
      <div className="grid grid-cols-2 gap-4">
        <button 
          onClick={async () => {
            setIsLoading(true);
            try {
              const data = dataStorage.loadData();
              
              // 确保数据结构完整
              if (!data.symptoms) {
                data.symptoms = { dailyRecords: [] };
              }
              if (!data.symptoms.dailyRecords) {
                data.symptoms.dailyRecords = [];
              }
              if (!data.medications) {
                data.medications = [];
              }
              if (!data.education) {
                data.education = { completedCourses: [], bookmarks: [], notes: [] };
              }
              if (!data.userProfile) {
                data.userProfile = { name: '', age: '', diagnosisDate: '', currentMedications: [] };
              }
              
              await pdfExporter.exportFullHealthReport(data, language);
              pdfExporter.savePDF(`as_complete_health_report_${new Date().toISOString().split('T')[0]}.pdf`);
              alert(language === 'zh' ? '完整健康报告导出成功！' : 'Complete health report exported successfully!');
            } catch (error) {
              console.error('导出失败:', error);
              alert(language === 'zh' ? '导出失败，请重试' : 'Export failed, please try again');
            } finally {
              setIsLoading(false);
            }
          }}
          disabled={isLoading}
          className={`bg-gradient-to-r ${currentTheme.primary} text-white py-4 rounded-2xl font-bold hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${isLoading ? 'opacity-50' : ''}`}
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              {language === 'zh' ? '导出中...' : 'Exporting...'}
            </div>
          ) : (
            t[language].exportPDF
          )}
        </button>
        <button 
          onClick={async () => {
            try {
              const data = dataStorage.loadData();
              
              // 确保数据结构完整
              if (!data.symptoms) {
                data.symptoms = { dailyRecords: [] };
              }
              if (!data.symptoms.dailyRecords) {
                data.symptoms.dailyRecords = [];
              }
              
              const symptomData = {
                stats: symptomTracker.getSymptomStats(),
                records: symptomRecords.slice(-30)
              };
              
              await pdfExporter.exportSymptomReport(symptomData, language);
              
              if (navigator.share) {
                const pdfBlob = pdfExporter.doc.output('blob');
                const pdfFile = new File([pdfBlob], `as_health_report_${new Date().toISOString().split('T')[0]}.pdf`, {
                  type: 'application/pdf'
                });
                
                await navigator.share({
                  title: language === 'zh' ? 'AS健康报告' : 'AS Health Report',
                  text: language === 'zh' ? '我的健康报告' : 'My health report',
                  files: [pdfFile]
                });
              } else {
                pdfExporter.savePDF(`as_health_report_${new Date().toISOString().split('T')[0]}.pdf`);
                alert(language === 'zh' ? '报告已下载，请手动分享' : 'Report downloaded, please share manually');
              }
            } catch (error) {
              console.error('分享失败:', error);
              alert(language === 'zh' ? '分享失败，请重试' : 'Share failed, please try again');
            }
          }}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white py-4 rounded-2xl font-bold hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          {t[language].shareReport}
        </button>
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

    const filteredContent = selectedCategory === 'all' 
      ? educationContent 
      : educationContent.filter(item => {
          const categoryMatch = item.category[language].toLowerCase();
          return categoryMatch.includes(selectedCategory) || 
                 (selectedCategory === 'basics' && categoryMatch.includes('基础')) ||
                 (selectedCategory === 'exercise' && categoryMatch.includes('运动')) ||
                 (selectedCategory === 'medication' && categoryMatch.includes('用药')) ||
                 (selectedCategory === 'nutrition' && categoryMatch.includes('营养'));
        });

    return (
      <div className={`p-4 pb-20 ${bgClass} min-h-screen`}>
        <h1 className={`text-2xl font-bold ${textClass} mb-6`}>{t[language].library}</h1>
        
        {/* Category Filter */}
        <div className="flex space-x-2 mb-6 overflow-x-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-200 ${
                selectedCategory === category.id
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white shadow-lg`
                  : `${isDark ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        {/* Progress Overview */}
        <div className={`${cardClass} rounded-2xl p-6 shadow-sm border mb-6`}>
          <div className="flex items-center justify-between mb-4">
            <h3 className={`text-lg font-bold ${textClass}`}>
              {language === 'zh' ? '学习进度' : 'Learning Progress'}
            </h3>
            <span className={`text-sm ${subtextClass}`}>
              {educationContent.filter(item => item.completed).length}/{educationContent.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div 
              className={`h-3 bg-gradient-to-r ${currentTheme.primary} rounded-full transition-all duration-500`}
              style={{ 
                width: `${(educationContent.filter(item => item.completed).length / educationContent.length) * 100}%` 
              }}
            ></div>
          </div>
        </div>
        
        {/* Content List */}
        <div className="space-y-4">
          {filteredContent.map((item) => (
            <div 
              key={item.id} 
              className={`${cardClass} rounded-2xl p-4 shadow-sm border hover:shadow-lg transition-all duration-200 cursor-pointer group`}
              onClick={() => {
                if (item.url && item.url !== '#') {
                  window.open(item.url, '_blank');
                }
              }}
            >
              <div className="flex items-center">
                <div className={`flex items-center justify-center w-14 h-14 bg-gradient-to-br ${currentTheme.secondary} rounded-xl mr-4 text-white text-2xl relative`}>
                  {item.icon}
                  {item.completed && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <CheckCircle size={12} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className={`font-bold ${textClass} group-hover:text-blue-600 transition-colors mb-1`}>
                    {item.title[language]}
                  </h3>
                  <div className={`text-sm ${subtextClass} flex items-center mb-2`}>
                    <span className={`bg-gradient-to-r ${
                      item.category[language].includes('基础') || item.category[language].includes('Basics') ? 'from-blue-100 to-blue-200 text-blue-700' :
                      item.category[language].includes('运动') || item.category[language].includes('Exercise') ? 'from-green-100 to-green-200 text-green-700' :
                      item.category[language].includes('用药') || item.category[language].includes('Medication') ? 'from-purple-100 to-purple-200 text-purple-700' :
                      'from-orange-100 to-orange-200 text-orange-700'
                    } px-2 py-1 rounded-full text-xs mr-2`}>
                      {item.category[language]}
                    </span>
                    <Clock size={12} className="mr-1" />
                    {item.duration[language]}
                  </div>
                  <div className="flex items-center">
                    {item.completed ? (
                      <span className="text-xs text-green-600 font-medium">
                        {language === 'zh' ? '已完成' : 'Completed'}
                      </span>
                    ) : (
                      <span className="text-xs text-blue-600 font-medium">
                        {language === 'zh' ? '开始学习' : 'Start Learning'}
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight className={`${subtextClass} group-hover:text-blue-600 transition-colors`} size={20} />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const AIChatPage = () => (
    <div className={`p-4 pb-20 ${bgClass} min-h-screen`}>
      <h1 className={`text-2xl font-bold ${textClass} mb-6`}>{t[language].aiChat}</h1>
      
      {/* AI免责声明 */}
      <div className={`p-4 mb-6 bg-yellow-50 ${isDark ? 'bg-yellow-900/20' : ''} border border-yellow-200 rounded-xl`}>
        <p className={`text-sm ${isDark ? 'text-yellow-200' : 'text-yellow-800'}`}>
          {t[language].aiDisclaimer}
        </p>
      </div>

      {/* 聊天消息 */}
      <div className={`flex-1 space-y-4 mb-6 max-h-96 overflow-y-auto`}>
        {chatMessages.length === 0 ? (
          <div className={`text-center ${subtextClass} py-8`}>
            <Bot size={48} className="mx-auto mb-4 opacity-50" />
            <p>{language === 'zh' ? '您好！我是您的健康助手，有什么可以帮助您的吗？' : 'Hello! I\'m your health assistant. How can I help you?'}</p>
          </div>
        ) : (
          chatMessages.map((message) => (
            <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                message.type === 'user' 
                  ? `bg-gradient-to-r ${currentTheme.primary} text-white` 
                  : `${cardClass} border`
              }`}>
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* 输入框 */}
      <div className={`${cardClass} rounded-2xl p-4 border`}>
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => {
              console.log('Input change:', e.target.value);
              setChatInput(e.target.value);
            }}
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            placeholder={t[language].chatPlaceholder}
            className={`flex-1 px-3 py-2 rounded-lg border ${isDark ? 'bg-gray-700 border-gray-600' : 'bg-gray-50 border-gray-300'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            maxLength={500}
          />
          <button
            onClick={sendMessage}
            disabled={!chatInput.trim()}
            className={`px-4 py-2 bg-gradient-to-r ${currentTheme.primary} text-white rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );

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
          <div className="flex items-center justify-between">
            <span className={`${textClass} font-medium`}>{t[language].themeColor}</span>
            <div className="flex gap-2">
              <button 
                onClick={() => setThemeColor('blue')} 
                className={`w-8 h-8 rounded-full transition-all duration-200 ${themeColor === 'blue' ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'scale-100'}`}
                style={{ background: 'linear-gradient(135deg, #3B82F6, #1D4ED8)' }}
              />
              <button 
                onClick={() => setThemeColor('green')} 
                className={`w-8 h-8 rounded-full transition-all duration-200 ${themeColor === 'green' ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'scale-100'}`}
                style={{ background: 'linear-gradient(135deg, #10B981, #059669)' }}
              />
              <button 
                onClick={() => setThemeColor('purple')} 
                className={`w-8 h-8 rounded-full transition-all duration-200 ${themeColor === 'purple' ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'scale-100'}`}
                style={{ background: 'linear-gradient(135deg, #8B5CF6, #7C3AED)' }}
              />
              <button 
                onClick={() => setThemeColor('orange')} 
                className={`w-8 h-8 rounded-full transition-all duration-200 ${themeColor === 'orange' ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' : 'scale-100'}`}
                style={{ background: 'linear-gradient(135deg, #F59E0B, #D97706)' }}
              />
            </div>
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
            <div className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600"><span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-6" /></div>
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
      case 'ai': return <AIChatPage />;
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


