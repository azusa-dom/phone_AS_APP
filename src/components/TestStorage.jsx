import React, { useState, useEffect } from 'react';
import { dataStorage, symptomTracker, medicationManager } from '../utils/storage';
import { pdfExporter } from '../utils/pdfExport';

const TestStorage = () => {
  const [testData, setTestData] = useState(null);
  const [message, setMessage] = useState('');

  // 测试数据存储
  const testDataStorage = () => {
    try {
      // 测试保存数据
      const testData = {
        test: true,
        timestamp: new Date().toISOString(),
        message: '这是测试数据'
      };
      
      const success = dataStorage.saveData(testData);
      if (success) {
        setMessage('✅ 数据保存成功！');
        
        // 测试加载数据
        const loadedData = dataStorage.loadData();
        setTestData(loadedData);
        setMessage(prev => prev + ' ✅ 数据加载成功！');
      } else {
        setMessage('❌ 数据保存失败！');
      }
    } catch (error) {
      setMessage(`❌ 错误: ${error.message}`);
    }
  };

  // 测试症状记录
  const testSymptomTracking = () => {
    try {
      const record = {
        painLevel: 5,
        stiffnessTime: 45,
        fatigue: 4,
        isFlare: true,
        selectedTriggers: ['sleep', 'stress'],
        timestamp: new Date().toISOString()
      };
      
      const newRecord = symptomTracker.addSymptomRecord(record);
      setMessage(`✅ 症状记录添加成功！ID: ${newRecord.id}`);
      
      // 获取统计
      const stats = symptomTracker.getSymptomStats();
      setMessage(prev => prev + ` 统计: ${JSON.stringify(stats)}`);
    } catch (error) {
      setMessage(`❌ 症状记录错误: ${error.message}`);
    }
  };

  // 测试药物管理
  const testMedicationManagement = () => {
    try {
      const medication = {
        name: { zh: '测试药物', en: 'Test Medication' },
        type: 'NSAID',
        dosage: '100mg',
        frequency: { zh: '每日2次', en: 'Twice daily' }
      };
      
      const newMed = medicationManager.addMedication(medication);
      setMessage(`✅ 药物添加成功！ID: ${newMed.id}`);
    } catch (error) {
      setMessage(`❌ 药物管理错误: ${error.message}`);
    }
  };

  // 测试PDF导出
  const testPDFExport = async () => {
    try {
      setMessage('🔄 正在生成PDF...');
      
      // 先添加一些测试数据
      const testRecord = {
        painLevel: 5,
        stiffnessTime: 45,
        fatigue: 4,
        isFlare: true,
        selectedTriggers: ['sleep', 'stress'],
        timestamp: new Date().toISOString()
      };
      
      // 添加测试症状记录
      symptomTracker.addSymptomRecord(testRecord);
      
      // 获取症状统计
      const stats = symptomTracker.getSymptomStats();
      console.log('症状统计:', stats);
      
      const symptomData = {
        stats: stats,
        records: [testRecord] // 使用刚添加的记录
      };
      
      console.log('PDF导出数据:', symptomData);
      
      await pdfExporter.exportSymptomReport(symptomData, 'zh');
      pdfExporter.savePDF('test_report.pdf');
      
      setMessage('✅ PDF导出成功！');
    } catch (error) {
      setMessage(`❌ PDF导出错误: ${error.message}`);
      console.error('PDF导出详细错误:', error);
      console.error('错误堆栈:', error.stack);
    }
  };

  // 清除测试数据
  const clearTestData = () => {
    try {
      dataStorage.clearData();
      setTestData(null);
      setMessage('✅ 测试数据已清除！');
    } catch (error) {
      setMessage(`❌ 清除数据错误: ${error.message}`);
    }
  };

  // 显示当前数据
  const showCurrentData = () => {
    try {
      const data = dataStorage.loadData();
      setTestData(data);
      setMessage('📊 当前数据已加载');
    } catch (error) {
      setMessage(`❌ 加载数据错误: ${error.message}`);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">🧪 数据存储和PDF导出测试</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testDataStorage}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          测试数据存储
        </button>
        
        <button
          onClick={testSymptomTracking}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          测试症状记录
        </button>
        
        <button
          onClick={testMedicationManagement}
          className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          测试药物管理
        </button>
        
        <button
          onClick={testPDFExport}
          className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors"
        >
          测试PDF导出
        </button>
        
        <button
          onClick={showCurrentData}
          className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors"
        >
          显示当前数据
        </button>
        
        <button
          onClick={clearTestData}
          className="bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition-colors"
        >
          清除测试数据
        </button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">状态信息:</h2>
        <div className="p-3 bg-gray-100 rounded-lg">
          <p className="text-sm">{message || '点击按钮开始测试...'}</p>
        </div>
      </div>
      
      {testData && (
        <div className="mb-4">
          <h2 className="text-lg font-semibold mb-2">当前数据:</h2>
          <div className="p-3 bg-gray-100 rounded-lg">
            <pre className="text-xs overflow-auto max-h-64">
              {JSON.stringify(testData, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="text-sm text-gray-600">
        <p>💡 使用说明:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li>点击"测试数据存储"验证基本存储功能</li>
          <li>点击"测试症状记录"添加测试症状数据</li>
          <li>点击"测试药物管理"添加测试药物</li>
          <li>点击"测试PDF导出"生成测试报告</li>
          <li>点击"显示当前数据"查看存储的内容</li>
          <li>点击"清除测试数据"清空所有测试数据</li>
        </ul>
      </div>
    </div>
  );
};

export default TestStorage;
