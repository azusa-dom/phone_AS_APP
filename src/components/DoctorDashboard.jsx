import React, { useState, useEffect } from 'react';
import { 
  User, 
  Calendar, 
  TrendingUp, 
  Pill, 
  AlertCircle, 
  Eye, 
  Search,
  Filter,
  Download,
  Share2,
  BarChart3,
  PieChart,
  LineChart
} from 'lucide-react';
import { LineChart as RechartsLineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart as RechartsPieChart, Pie, Cell, BarChart as RechartsBarChart, Bar } from 'recharts';
import { computeAlerts, generateTodos } from '../utils/alerts';

const DoctorDashboard = () => {
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [patients, setPatients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentView, setCurrentView] = useState('overview');
  const [activeTodoFilter, setActiveTodoFilter] = useState(null); // 'appointments'|'reportReviews'|'medAdjustments'|'phoneFollowUps'|null

  // 模拟患者数据
  useEffect(() => {
    const mockPatients = [
      {
        id: 1,
        name: '张先生',
        age: 35,
        diagnosisDate: '2020-03-15',
        lastVisit: '2024-08-20',
        status: 'active',
        painLevel: 4,
        stiffnessTime: 25,
        fatigue: 3,
        flareCount: 2,
        adherence: 92,
        medications: ['阿达木单抗', '塞来昔布'],
        recentSymptoms: [
          { date: '2024-08-20', pain: 4, stiffness: 25, fatigue: 3, isFlare: false },
          { date: '2024-08-19', pain: 5, stiffness: 35, fatigue: 4, isFlare: true },
          { date: '2024-08-18', pain: 3, stiffness: 20, fatigue: 2, isFlare: false }
        ]
      },
      {
        id: 2,
        name: '李女士',
        age: 28,
        diagnosisDate: '2021-07-22',
        lastVisit: '2024-08-18',
        status: 'stable',
        painLevel: 2,
        stiffnessTime: 15,
        fatigue: 2,
        flareCount: 0,
        adherence: 98,
        medications: ['阿达木单抗'],
        recentSymptoms: [
          { date: '2024-08-18', pain: 2, stiffness: 15, fatigue: 2, isFlare: false },
          { date: '2024-08-17', pain: 2, stiffness: 10, fatigue: 1, isFlare: false },
          { date: '2024-08-16', pain: 3, stiffness: 20, fatigue: 2, isFlare: false }
        ]
      },
      {
        id: 3,
        name: '王先生',
        age: 42,
        diagnosisDate: '2019-11-08',
        lastVisit: '2024-08-15',
        status: 'warning',
        painLevel: 6,
        stiffnessTime: 45,
        fatigue: 5,
        flareCount: 3,
        adherence: 78,
        medications: ['阿达木单抗', '塞来昔布', '甲氨蝶呤'],
        recentSymptoms: [
          { date: '2024-08-15', pain: 6, stiffness: 45, fatigue: 5, isFlare: true },
          { date: '2024-08-14', pain: 7, stiffness: 60, fatigue: 6, isFlare: true },
          { date: '2024-08-13', pain: 5, stiffness: 30, fatigue: 4, isFlare: false }
        ]
      }
    ];
    setPatients(mockPatients);
  }, []);

  const filteredPatients = patients.filter(patient => {
    const matchesSearch = patient.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || patient.status === filterStatus;

    // 根据今日待办筛选（示例：高疼痛->appointments，低依从性->medAdjustments，未记录->phoneFollowUps）
    let matchesTodo = true;
    if (activeTodoFilter === 'appointments') {
      const last3 = (patient.recentSymptoms || []).slice(-3);
      matchesTodo = last3.length === 3 && last3.every(d => (d.pain || d.painLevel || 0) >= 8);
    } else if (activeTodoFilter === 'medAdjustments') {
      matchesTodo = typeof patient.adherence === 'number' && patient.adherence < 60;
    } else if (activeTodoFilter === 'phoneFollowUps') {
      const lastDateStr = (patient.recentSymptoms || [])[patient.recentSymptoms.length - 1]?.date;
      if (lastDateStr) {
        const diffDays = Math.floor((new Date() - new Date(lastDateStr)) / (1000*60*60*24));
        matchesTodo = diffDays >= 7;
      }
    } else if (activeTodoFilter === 'reportReviews') {
      // 简化：将warning状态视为需要报告审核
      matchesTodo = patient.status === 'warning';
    }

    return matchesSearch && matchesFilter && matchesTodo;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'stable': return 'bg-green-100 text-green-800';
      case 'warning': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'active': return '活跃期';
      case 'stable': return '稳定期';
      case 'warning': return '需关注';
      default: return '未知';
    }
  };

  const overviewData = computeAlerts(patients);
  const todos = generateTodos(overviewData.alerts);
  const pieData = [
    { name: '活跃期', value: patients.filter(p => p.status === 'active').length, color: '#3B82F6' },
    { name: '稳定期', value: patients.filter(p => p.status === 'stable').length, color: '#10B981' },
    { name: '需关注', value: patients.filter(p => p.status === 'warning').length, color: '#F59E0B' }
  ];

  const PatientOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">总患者数</p>
            <p className="text-2xl font-bold text-gray-900">{overviewData.stats.totalPatients}</p>
          </div>
          <User className="text-blue-500" size={24} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">活跃患者</p>
            <p className="text-2xl font-bold text-green-600">
              {overviewData.stats.activeCount}
            </p>
          </div>
          <AlertCircle className="text-green-500" size={24} />
        </div>
      </div>
      
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">需关注</p>
            <p className="text-2xl font-bold text-yellow-600">
              {overviewData.stats.warningCount}
            </p>
          </div>
          <AlertCircle className="text-yellow-500" size={24} />
        </div>
      </div>
    </div>
  );

  const AlertsPanel = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">智能预警</h3>
      {overviewData.alerts.length === 0 ? (
        <p className="text-gray-500 text-sm">暂无预警</p>
      ) : (
        <div className="space-y-3">
          {overviewData.alerts.slice(0, 6).map((a, idx) => (
            <div key={idx} className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">{a.name} · {a.label}</p>
                <p className="text-xs text-gray-500 mt-1">{a.hint}</p>
              </div>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                a.severity === 'high' ? 'bg-red-100 text-red-700' : a.severity === 'medium' ? 'bg-yellow-100 text-yellow-700' : 'bg-blue-100 text-blue-700'
              }`}>
                {a.severity === 'high' ? '高' : a.severity === 'medium' ? '中' : '低'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  const TodayTodos = () => (
    <div className="bg-white rounded-xl p-6 shadow-sm border">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">今日待办</h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <button onClick={() => { setActiveTodoFilter('appointments'); setCurrentView('patients'); }} className={`p-3 rounded-lg text-left transition ${activeTodoFilter==='appointments'?'ring-2 ring-blue-300':''} bg-blue-50 hover:bg-blue-100`}>
          预约复诊：<span className="font-semibold">{todos.appointments}</span>
        </button>
        <button onClick={() => { setActiveTodoFilter('reportReviews'); setCurrentView('patients'); }} className={`p-3 rounded-lg text-left transition ${activeTodoFilter==='reportReviews'?'ring-2 ring-purple-300':''} bg-purple-50 hover:bg-purple-100`}>
          报告审核：<span className="font-semibold">{todos.reportReviews}</span>
        </button>
        <button onClick={() => { setActiveTodoFilter('medAdjustments'); setCurrentView('patients'); }} className={`p-3 rounded-lg text-left transition ${activeTodoFilter==='medAdjustments'?'ring-2 ring-yellow-300':''} bg-yellow-50 hover:bg-yellow-100`}>
          用药调整：<span className="font-semibold">{todos.medAdjustments}</span>
        </button>
        <button onClick={() => { setActiveTodoFilter('phoneFollowUps'); setCurrentView('patients'); }} className={`p-3 rounded-lg text-left transition ${activeTodoFilter==='phoneFollowUps'?'ring-2 ring-green-300':''} bg-green-50 hover:bg-green-100`}>
          电话随访：<span className="font-semibold">{todos.phoneFollowUps}</span>
        </button>
      </div>
    </div>
  );

  const PatientList = () => (
    <div className="bg-white rounded-xl shadow-sm border">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">患者列表</h3>
          <div className="flex gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <input
                type="text"
                placeholder="搜索患者..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">全部状态</option>
              <option value="active">活跃期</option>
              <option value="stable">稳定期</option>
              <option value="warning">需关注</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-200">
        {filteredPatients.map(patient => (
          <div
            key={patient.id}
            className="p-6 hover:bg-gray-50 cursor-pointer transition-colors"
            onClick={() => setSelectedPatient(patient)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-900">{patient.name}</h4>
                  <p className="text-sm text-gray-600">{patient.age}岁 • 诊断日期: {patient.diagnosisDate}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(patient.status)}`}>
                  {getStatusText(patient.status)}
                </span>
                <div className="text-right">
                  <p className="text-sm text-gray-600">最近就诊</p>
                  <p className="text-sm font-medium text-gray-900">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
            
            <div className="mt-4 grid grid-cols-4 gap-4 text-sm">
              <div>
                <p className="text-gray-600">疼痛程度</p>
                <p className="font-medium">{patient.painLevel}/10</p>
              </div>
              <div>
                <p className="text-gray-600">晨僵时长</p>
                <p className="font-medium">{patient.stiffnessTime}分钟</p>
              </div>
              <div>
                <p className="text-gray-600">疲劳程度</p>
                <p className="font-medium">{patient.fatigue}/10</p>
              </div>
              <div>
                <p className="text-gray-600">用药依从性</p>
                <p className="font-medium">{patient.adherence}%</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const PatientDetail = () => {
    if (!selectedPatient) return null;

    const weeklyData = selectedPatient.recentSymptoms.map(symptom => ({
      date: symptom.date,
      pain: symptom.pain,
      stiffness: symptom.stiffness,
      fatigue: symptom.fatigue
    }));

    return (
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">{selectedPatient.name} - 详细报告</h3>
          <button
            onClick={() => setSelectedPatient(null)}
            className="text-gray-400 hover:text-gray-600"
          >
            ✕
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="font-semibold text-gray-900 mb-3">基本信息</h4>
            <div className="space-y-2 text-sm">
              <p><span className="text-gray-600">年龄:</span> {selectedPatient.age}岁</p>
              <p><span className="text-gray-600">诊断日期:</span> {selectedPatient.diagnosisDate}</p>
              <p><span className="text-gray-600">最近就诊:</span> {selectedPatient.lastVisit}</p>
              <p><span className="text-gray-600">状态:</span> 
                <span className={`ml-2 px-2 py-1 rounded-full text-xs ${getStatusColor(selectedPatient.status)}`}>
                  {getStatusText(selectedPatient.status)}
                </span>
              </p>
            </div>

            <h4 className="font-semibold text-gray-900 mb-3 mt-6">当前用药</h4>
            <div className="space-y-2">
              {selectedPatient.medications.map((med, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Pill className="text-blue-500" size={16} />
                  <span className="text-sm">{med}</span>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-3">症状趋势</h4>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsLineChart data={weeklyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="date" stroke="#6B7280" />
                  <YAxis stroke="#6B7280" />
                  <Tooltip />
                  <Line type="monotone" dataKey="pain" stroke="#EF4444" strokeWidth={2} name="疼痛" />
                  <Line type="monotone" dataKey="fatigue" stroke="#F59E0B" strokeWidth={2} name="疲劳" />
                </RechartsLineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t">
          <h4 className="font-semibold text-gray-900 mb-3">用药依从性分析</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-blue-50 p-4 rounded-lg">
              <h5 className="font-medium text-blue-900 mb-2">依从性评分</h5>
              <div className="flex items-center space-x-2">
                <div className="text-2xl font-bold text-blue-900">{selectedPatient.adherence}%</div>
                <div className="flex-1 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      selectedPatient.adherence >= 90 ? 'bg-green-500' :
                      selectedPatient.adherence >= 80 ? 'bg-yellow-500' :
                      'bg-red-500'
                    }`}
                    style={{ width: `${selectedPatient.adherence}%` }}
                  ></div>
                </div>
              </div>
              <p className="text-sm text-blue-800 mt-2">
                {selectedPatient.adherence >= 90 ? '优秀' :
                 selectedPatient.adherence >= 80 ? '良好' :
                 selectedPatient.adherence >= 70 ? '一般' : '需改善'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">用药统计</h5>
              <div className="space-y-1 text-sm">
                <p><span className="text-green-800">当前用药:</span> {selectedPatient.medications.length}种</p>
                <p><span className="text-green-800">发作次数:</span> {selectedPatient.flareCount}次</p>
                <p><span className="text-green-800">症状控制:</span> 
                  {selectedPatient.painLevel <= 3 ? '良好' : '需关注'}
                </p>
              </div>
            </div>
          </div>

          <h4 className="font-semibold text-gray-900 mb-3">健康建议</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-yellow-50 p-4 rounded-lg">
              <h5 className="font-medium text-yellow-900 mb-2">用药管理</h5>
              <p className="text-sm text-yellow-800">
                {selectedPatient.adherence >= 90 ? '依从性优秀，继续保持' :
                 selectedPatient.adherence >= 80 ? '依从性良好，建议加强提醒' :
                 selectedPatient.adherence >= 70 ? '依从性一般，需要加强管理' :
                 '依从性较差，建议电话随访和家属监督'}
              </p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <h5 className="font-medium text-green-900 mb-2">症状控制</h5>
              <p className="text-sm text-green-800">
                {selectedPatient.painLevel <= 3 ? '疼痛控制良好，建议继续保持当前治疗方案' :
                 selectedPatient.painLevel <= 5 ? '疼痛控制一般，建议调整用药方案' :
                 '疼痛控制不佳，建议及时就医调整治疗'}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 pb-28">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">医生仪表板</h1>
          <p className="text-gray-600 mt-2">患者健康数据管理与分析</p>
        </div>

        <div className="mb-6">
          <div className="flex space-x-4">
            <button
              onClick={() => setCurrentView('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'overview' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              总览
            </button>
            <button
              onClick={() => setCurrentView('patients')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                currentView === 'patients' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              患者管理
            </button>
          </div>
        </div>

        {currentView === 'overview' && (
          <>
            <PatientOverview />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">患者状态分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100}>
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
              
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">平均症状评分</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={[
                      { symptom: '疼痛', value: patients.length ? (patients.reduce((sum, p) => sum + p.painLevel, 0) / patients.length) : 0 },
                      { symptom: '晨僵', value: patients.length ? (patients.reduce((sum, p) => sum + p.stiffnessTime, 0) / patients.length) : 0 },
                      { symptom: '疲劳', value: patients.length ? (patients.reduce((sum, p) => sum + p.fatigue, 0) / patients.length) : 0 }
                    ]}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="symptom" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3B82F6" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">用药分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={(() => {
                      const groups = ['TNFi','NSAID','DMARD','其他'];
                      const countByGroup = { TNFi:0, NSAID:0, DMARD:0, 其他:0 };
                      patients.forEach(p => (p.medications||[]).forEach(m => {
                        if (typeof m === 'string') {
                          if (m.includes('阿达木')||m.includes('依那西普')||m.includes('戈利木')||m.includes('英夫利')||m.includes('修美乐')) countByGroup.TNFi++;
                          else if (m.includes('塞来昔布')||m.includes('布洛芬')||m.includes('双氯芬酸')) countByGroup.NSAID++;
                          else if (m.includes('甲氨蝶呤')||m.includes('柳氮')||m.includes('硫唑')||m.includes('来氟')) countByGroup.DMARD++;
                          else countByGroup.其他++;
                        }
                      }));
                      return groups.map(g => ({ group:g, value: countByGroup[g] }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="group" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#10B981" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-white rounded-xl p-6 shadow-sm border">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">依从性分布</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={(() => {
                      const buckets = [
                        { name:'<60%', min:0, max:59 },
                        { name:'60-79%', min:60, max:79 },
                        { name:'80-89%', min:80, max:89 },
                        { name:'≥90%', min:90, max:100 }
                      ];
                      const counts = buckets.map(() => 0);
                      patients.forEach(p => {
                        const a = Number(p.adherence || 0);
                        const idx = a>=90?3: a>=80?2: a>=60?1:0;
                        counts[idx] += 1;
                      });
                      return buckets.map((b,i) => ({ range: b.name, value: counts[i] }));
                    })()}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                      <XAxis dataKey="range" stroke="#6B7280" />
                      <YAxis stroke="#6B7280" />
                      <Tooltip />
                      <Bar dataKey="value" fill="#F59E0B" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <AlertsPanel />
              <TodayTodos />
            </div>
          </>
        )}

        {currentView === 'patients' && (
          <>
            <PatientList />
            {selectedPatient && <PatientDetail />}
          </>
        )}
      </div>
    </div>
  );
};

export default DoctorDashboard;
