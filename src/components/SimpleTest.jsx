import React, { useState } from 'react';

const SimpleTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { message, type, timestamp: new Date().toLocaleTimeString() }]);
  };

  const clearResults = () => {
    setResults([]);
  };

  // 测试1: 基本localStorage
  const testLocalStorage = () => {
    try {
      addResult('🧪 Starting localStorage test...', 'info');
      
      // 测试写入
      localStorage.setItem('test_key', 'test_value');
      addResult('✅ localStorage write test successful', 'success');
      
      // 测试读取
      const readValue = localStorage.getItem('test_key');
      addResult(`✅ localStorage read test successful: ${readValue}`, 'success');
      
      // 测试删除
      localStorage.removeItem('test_key');
      addResult('✅ localStorage delete test successful', 'success');
      
    } catch (error) {
      addResult(`❌ localStorage test failed: ${error.message}`, 'error');
    }
  };

  // 测试2: 数据存储类
  const testStorageClass = () => {
    try {
      addResult('🧪 Starting data storage class test...', 'info');
      
      // 动态导入
      import('../utils/storage.js').then(({ dataStorage }) => {
        addResult('✅ Data storage class imported successfully', 'success');
        
        // 测试默认数据
        const defaultData = dataStorage.getDefaultData();
        addResult(`✅ Default data generated successfully with ${Object.keys(defaultData).length} fields`, 'success');
        
        // 测试保存
        const saveResult = dataStorage.saveData(defaultData);
        if (saveResult) {
          addResult('✅ Data saved successfully', 'success');
        } else {
          addResult('❌ Data save failed', 'error');
        }
        
        // 测试加载
        const loadedData = dataStorage.loadData();
        addResult(`✅ Data loaded successfully, version: ${loadedData.version}`, 'success');
        
      }).catch(error => {
        addResult(`❌ Data storage class import failed: ${error.message}`, 'error');
      });
      
    } catch (error) {
      addResult(`❌ Data storage class test failed: ${error.message}`, 'error');
    }
  };

  // 测试3: PDF导出类
  const testPDFClass = () => {
    try {
      addResult('🧪 Starting PDF export class test...', 'info');
      
      // 动态导入
      Promise.all([
        import('../utils/pdfExport.js'),
        import('jspdf'),
        import('jspdf-autotable'),
        import('html2canvas')
      ]).then(([pdfModule, jsPDF, autoTable, html2canvas]) => {
        addResult('✅ All PDF dependencies imported successfully', 'success');
        
        const { pdfExporter } = pdfModule;
        addResult('✅ PDF exporter created successfully', 'success');
        
        // 测试基本PDF创建
        try {
          const doc = new jsPDF.default();
          doc.text('Test PDF', 20, 20);
          addResult('✅ Basic PDF creation successful', 'success');
          
          // 测试保存
          doc.save('simple_test.pdf');
          addResult('✅ Basic PDF save successful', 'success');
          
        } catch (error) {
          addResult(`❌ Basic PDF test failed: ${error.message}`, 'error');
        }
        
      }).catch(error => {
        addResult(`❌ PDF dependencies import failed: ${error.message}`, 'error');
      });
      
    } catch (error) {
      addResult(`❌ PDF export class test failed: ${error.message}`, 'error');
    }
  };

  // 测试4: 完整流程测试
  const testFullFlow = async () => {
    try {
      setLoading(true);
      addResult('🧪 Starting full flow test...', 'info');
      
      // 导入所有模块
      const [{ dataStorage, symptomTracker }, { pdfExporter }] = await Promise.all([
        import('../utils/storage.js'),
        import('../utils/pdfExport.js')
      ]);
      
      addResult('✅ All modules imported successfully', 'success');
      
      // 创建测试数据
      const testRecord = {
        painLevel: 5,
        stiffnessTime: 45,
        fatigue: 4,
        isFlare: true,
        selectedTriggers: ['sleep', 'stress'],
        timestamp: new Date().toISOString()
      };
      
      addResult('✅ Test data created successfully', 'success');
      
      // 添加症状记录
      const newRecord = symptomTracker.addSymptomRecord(testRecord);
      addResult(`✅ Symptom record added successfully, ID: ${newRecord.id}`, 'success');
      
      // 获取统计
      const stats = symptomTracker.getSymptomStats();
      addResult(`✅ Symptom stats retrieved successfully: ${JSON.stringify(stats)}`, 'success');
      
      // 准备PDF数据
      const symptomData = {
        stats: stats,
        records: [newRecord]
      };
      
      addResult('✅ PDF data prepared successfully', 'success');
      
      // 生成PDF
      await pdfExporter.exportSymptomReport(symptomData, 'en'); // 使用英文
      addResult('✅ PDF report generated successfully', 'success');
      
      // 保存PDF
      pdfExporter.savePDF('full_test_report.pdf');
      addResult('✅ PDF file saved successfully', 'success');
      
      addResult('🎉 Full flow test successful!', 'success');
      
    } catch (error) {
      addResult(`❌ Full flow test failed: ${error.message}`, 'error');
      console.error('Full flow test error:', error);
      console.error('Error stack:', error.stack);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center">🔬 Super Simple Test</h1>
      
      <div className="grid grid-cols-2 gap-4 mb-6">
        <button
          onClick={testLocalStorage}
          className="bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors"
        >
          Test localStorage
        </button>
        
        <button
          onClick={testStorageClass}
          className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors"
        >
          Test Data Storage
        </button>
        
        <button
          onClick={testPDFClass}
          className="bg-purple-500 text-white p-3 rounded-lg hover:bg-purple-600 transition-colors"
        >
          Test PDF Export
        </button>
        
        <button
          onClick={testFullFlow}
          disabled={loading}
          className={`bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600 transition-colors ${loading ? 'opacity-50' : ''}`}
        >
          {loading ? 'Testing...' : 'Test Full Flow'}
        </button>
        
        <button
          onClick={clearResults}
          className="bg-gray-500 text-white p-3 rounded-lg hover:bg-gray-600 transition-colors col-span-2"
        >
          Clear Results
        </button>
      </div>
      
      <div className="mb-4">
        <h2 className="text-lg font-semibold mb-2">Test Results:</h2>
        <div className="max-h-96 overflow-y-auto bg-gray-100 rounded-lg p-3">
          {results.length === 0 ? (
            <p className="text-gray-500">Click buttons to start testing...</p>
          ) : (
            results.map((result, index) => (
              <div key={index} className={`mb-2 p-2 rounded ${
                result.type === 'success' ? 'bg-green-100 text-green-800' :
                result.type === 'error' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                <span className="text-xs text-gray-500">[{result.timestamp}]</span> {result.message}
              </div>
            ))
          )}
        </div>
      </div>
      
      <div className="text-sm text-gray-600">
        <p>💡 Test Instructions:</p>
        <ul className="list-disc list-inside ml-4 space-y-1">
          <li><strong>Test localStorage</strong> - Verify browser basic storage functionality</li>
          <li><strong>Test Data Storage</strong> - Verify custom storage logic</li>
          <li><strong>Test PDF Export</strong> - Verify PDF generation dependencies</li>
          <li><strong>Test Full Flow</strong> - Verify complete data to PDF workflow</li>
        </ul>
      </div>
    </div>
  );
};

export default SimpleTest;
