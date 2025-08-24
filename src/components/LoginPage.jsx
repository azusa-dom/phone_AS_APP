import React, { useState } from 'react';
import { User, Stethoscope, Heart, Shield, Eye } from 'lucide-react';

const LoginPage = ({ onRoleSelect }) => {
  const [selectedRole, setSelectedRole] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const modes = [
    {
      id: 'local',
      title: '本地模式',
      subtitle: '完全隐私，数据仅本地存储',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
      features: [
        '症状记录与追踪',
        '用药管理提醒',
        '健康报告生成',
        'AI健康助手',
        '数据完全本地存储'
      ]
    },
    {
      id: 'sync',
      title: '同步模式',
      subtitle: '与医生系统同步数据',
      icon: Heart,
      color: 'from-blue-500 to-blue-600',
      features: [
        '症状记录与追踪',
        '用药管理提醒',
        '健康报告生成',
        'AI健康助手',
        '数据同步到医生系统'
      ]
    },
    {
      id: 'doctor',
      title: '医生模式',
      subtitle: '患者数据查看与管理',
      icon: Stethoscope,
      color: 'from-green-500 to-green-600',
      features: [
        '患者数据总览',
        '症状趋势分析',
        '用药依从性监测',
        '健康建议生成'
      ]
    }
  ];

  const handleRoleSelect = (role) => {
    setSelectedRole(role);
  };

  const handleLogin = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        {/* 标题 */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-full shadow-lg mb-6">
            <Heart className="w-10 h-10 text-blue-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">关节通</h1>
          <p className="text-xl text-gray-600">强直性脊柱炎智能健康管理平台</p>
        </div>

        {/* 角色选择 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                  {modes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => handleRoleSelect(mode.id)}
            className={`relative cursor-pointer transition-all duration-300 transform hover:scale-105 ${
              selectedRole === mode.id ? 'scale-105' : ''
            }`}
          >
            <div className={`bg-gradient-to-br ${mode.color} rounded-2xl p-8 text-white shadow-xl ${
              selectedRole === mode.id ? 'ring-4 ring-white ring-opacity-50' : ''
            }`}>
              <div className="flex items-center justify-between mb-6">
                <mode.icon className="w-12 h-12" />
                {selectedRole === mode.id && (
                  <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                )}
              </div>
              <h3 className="text-2xl font-bold mb-2">{mode.title}</h3>
              <p className="text-blue-100 mb-6">{mode.subtitle}</p>
              <ul className="space-y-2">
                {mode.features.map((feature, index) => (
                  <li key={index} className="flex items-center text-blue-100">
                    <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
        </div>

        {/* 登录表单 */}
        {selectedRole && (
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {selectedRole === 'local' ? '本地模式' : 
                 selectedRole === 'sync' ? '同步模式' : '医生登录'}
              </h2>
              <p className="text-gray-600 mt-2">
                {selectedRole === 'local' ? '开始您的隐私健康管理之旅' :
                 selectedRole === 'sync' ? '与医生系统同步数据' :
                 '查看患者健康数据'
                }
              </p>
            </div>

            {selectedRole === 'local' ? (
              // 本地模式：直接进入，无需输入
              <div className="space-y-6">
                <div className="bg-purple-50 p-4 rounded-lg text-center">
                  <Shield className="w-12 h-12 text-purple-600 mx-auto mb-3" />
                  <p className="text-purple-800 font-medium">完全隐私保护</p>
                  <p className="text-purple-600 text-sm">您的所有数据仅存储在本地设备中</p>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-purple-500 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-purple-600 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  开始使用
                </button>
              </div>
            ) : selectedRole === 'sync' ? (
              // 同步模式：需要输入患者ID
              <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    患者ID
                  </label>
                  <input
                    type="text"
                    placeholder="请输入患者ID（可选）"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    不输入ID将使用本地模式
                  </p>
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  进入系统
                </button>
              </form>
            ) : (
              // 医生模式：无需输入，直接进入
              <div className="space-y-6">
                <div className="bg-green-50 p-4 rounded-lg text-center">
                  <Stethoscope className="w-12 h-12 text-green-600 mx-auto mb-3" />
                  <p className="text-green-800 font-medium">医生模式</p>
                  <p className="text-green-600 text-sm">查看患者数据和管理界面</p>
                </div>
                
                <button
                  onClick={handleLogin}
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-green-600 hover:to-green-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  进入医生界面
                </button>
              </div>
            )}

            <div className="mt-6 text-center">
              <button
                onClick={() => setSelectedRole(null)}
                className="text-gray-500 hover:text-gray-700 text-sm"
              >
                重新选择模式
              </button>
            </div>
          </div>
        )}

        {/* 底部信息 */}
        <div className="text-center mt-12">
          <div className="flex items-center justify-center space-x-6 text-gray-500 text-sm">
            <div className="flex items-center">
              <Shield className="w-4 h-4 mr-2" />
              数据安全加密
            </div>
            <div className="flex items-center">
              <User className="w-4 h-4 mr-2" />
              隐私保护
            </div>
          </div>
          <p className="text-gray-400 mt-4 text-xs">
            ⚠️ 本应用仅用于健康教育与自我管理，不构成医疗建议
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
