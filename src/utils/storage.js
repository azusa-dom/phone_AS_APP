// 数据存储管理工具
export class DataStorage {
  constructor() {
    this.storageKey = 'as_app_data';
    this.version = '1.0.0';
  }

  // 保存数据到localStorage
  saveData(data) {
    try {
      // 确保数据结构完整
      const completeData = this.ensureDataStructure(data);
      
      const dataToSave = {
        ...completeData,
        version: this.version,
        lastUpdated: new Date().toISOString()
      };
      
      console.log('保存数据:', dataToSave);
      localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
      return true;
    } catch (error) {
      console.error('保存数据失败:', error);
      return false;
    }
  }

  // 从localStorage加载数据
  loadData() {
    try {
      const savedData = localStorage.getItem(this.storageKey);
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        // 检查版本兼容性
        if (parsedData.version === this.version) {
          // 确保数据结构完整
          return this.ensureDataStructure(parsedData);
        } else {
          // 版本不匹配，返回默认数据
          console.warn('数据版本不匹配，使用默认数据');
          return this.getDefaultData();
        }
      }
      return this.getDefaultData();
    } catch (error) {
      console.error('加载数据失败:', error);
      return this.getDefaultData();
    }
  }

  // 获取默认数据结构
  getDefaultData() {
    return {
      version: this.version,
      lastUpdated: new Date().toISOString(),
      userProfile: {
        name: '',
        age: '',
        diagnosisDate: '',
        currentMedications: []
      },
      symptoms: {
        dailyRecords: [],
        weeklyTrends: [],
        monthlyReports: []
      },
      medications: [
        {
          id: 1,
          name: { zh: '阿达木单抗 (修美乐)', en: 'Adalimumab (Humira)' },
          type: 'TNFi',
          dosage: '40mg',
          frequency: { zh: '每2周', en: 'Every 2 weeks' },
          nextDose: '2025-08-25',
          adherence: 95,
          sideEffects: { zh: [], en: [] }
        },
        {
          id: 2,
          name: { zh: '塞来昔布', en: 'Celecoxib' },
          type: 'NSAID',
          dosage: '200mg',
          frequency: { zh: '每日2次', en: 'Twice daily' },
          nextDose: '2025-08-22',
          adherence: 88,
          sideEffects: { zh: ['胃痛'], en: ['Stomach pain'] }
        }
      ],
      medicationRecent: [],
      education: {
        completedCourses: [],
        bookmarks: [],
        notes: []
      },
      settings: {
        language: 'zh',
        theme: 'light',
        themeColor: 'blue',
        notifications: {
          medicationReminders: true,
          symptomTracking: true
        }
      }
    };
  }

  // 确保数据结构完整
  ensureDataStructure(data) {
    const defaultData = this.getDefaultData();
    
    return {
      ...defaultData,
      ...data,
      medicationRecent: Array.isArray(data.medicationRecent) ? data.medicationRecent : defaultData.medicationRecent,
      symptoms: {
        ...defaultData.symptoms,
        ...data.symptoms,
        dailyRecords: data.symptoms?.dailyRecords || defaultData.symptoms.dailyRecords,
        weeklyTrends: data.symptoms?.weeklyTrends || defaultData.symptoms.weeklyTrends,
        monthlyReports: data.symptoms?.monthlyReports || defaultData.symptoms.monthlyReports
      },
      medications: data.medications || defaultData.medications,
      education: {
        ...defaultData.education,
        ...data.education
      },
      userProfile: {
        ...defaultData.userProfile,
        ...data.userProfile
      },
      settings: {
        ...defaultData.settings,
        ...data.settings
      }
    };
  }

  // 清除所有数据
  clearData() {
    try {
      localStorage.removeItem(this.storageKey);
      return true;
    } catch (error) {
      console.error('清除数据失败:', error);
      return false;
    }
  }

  // 导出数据为JSON文件
  exportData() {
    try {
      const data = this.loadData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const link = document.createElement('a');
      link.href = URL.createObjectURL(dataBlob);
      link.download = `as_app_data_${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      URL.revokeObjectURL(link.href);
      return true;
    } catch (error) {
      console.error('导出数据失败:', error);
      return false;
    }
  }

  // 导入数据从JSON文件
  async importData(file) {
    try {
      const text = await file.text();
      const importedData = JSON.parse(text);
      
      // 验证数据格式
      if (this.validateData(importedData)) {
        this.saveData(importedData);
        return { success: true, message: '数据导入成功' };
      } else {
        return { success: false, message: '数据格式无效' };
      }
    } catch (error) {
      console.error('导入数据失败:', error);
      return { success: false, message: '导入失败：' + error.message };
    }
  }

  // 验证数据格式
  validateData(data) {
    return data && 
           typeof data === 'object' && 
           data.version && 
           data.lastUpdated;
  }

  // 备份数据到云端（模拟）
  backupToCloud() {
    // 这里可以集成真实的云存储服务
    // 如 Firebase, AWS S3, 或自己的服务器
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({ success: true, message: '数据备份成功' });
      }, 1000);
    });
  }
}

// 症状记录管理
export class SymptomTracker {
  constructor(storage) {
    this.storage = storage;
  }

  // 添加症状记录
  addSymptomRecord(record) {
    const data = this.storage.loadData();
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      ...record
    };
    
    data.symptoms.dailyRecords.push(newRecord);
    
    // 更新周趋势
    this.updateWeeklyTrends(data);
    
    this.storage.saveData(data);
    return newRecord;
  }

  // 更新周趋势
  updateWeeklyTrends(data) {
    const now = new Date();
    const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    
    const weekRecords = data.symptoms.dailyRecords.filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= weekStart;
    });

    // 计算周平均值
    const weeklyData = {
      weekStart: weekStart.toISOString(),
      avgPain: this.calculateAverage(weekRecords, 'painLevel'),
      avgStiffness: this.calculateAverage(weekRecords, 'stiffnessTime'),
      avgFatigue: this.calculateAverage(weekRecords, 'fatigue'),
      flareCount: weekRecords.filter(r => r.isFlare).length,
      totalRecords: weekRecords.length
    };

    data.symptoms.weeklyTrends.push(weeklyData);
    
    // 只保留最近8周的数据
    if (data.symptoms.weeklyTrends.length > 8) {
      data.symptoms.weeklyTrends = data.symptoms.weeklyTrends.slice(-8);
    }
  }

  // 计算平均值
  calculateAverage(records, field) {
    if (records.length === 0) return 0;
    const sum = records.reduce((acc, record) => acc + (record[field] || 0), 0);
    return Math.round((sum / records.length) * 10) / 10;
  }

  // 获取症状统计
  getSymptomStats() {
    try {
      const data = this.storage.loadData();
      
      // 确保数据结构完整
      if (!data.symptoms) {
        data.symptoms = { dailyRecords: [] };
      }
      if (!data.symptoms.dailyRecords) {
        data.symptoms.dailyRecords = [];
      }
      
      const records = data.symptoms.dailyRecords;
      
      if (!records || records.length === 0) {
        return {
          totalRecords: 0,
          avgPain: 0,
          avgStiffness: 0,
          avgFatigue: 0,
          flareCount: 0
        };
      }

      return {
        totalRecords: records.length,
        avgPain: this.calculateAverage(records, 'painLevel'),
        avgStiffness: this.calculateAverage(records, 'stiffnessTime'),
        avgFatigue: this.calculateAverage(records, 'fatigue'),
        flareCount: records.filter(r => r.isFlare).length
      };
    } catch (error) {
      console.error('获取症状统计失败:', error);
      return {
        totalRecords: 0,
        avgPain: 0,
        avgStiffness: 0,
        avgFatigue: 0,
        flareCount: 0
      };
    }
  }
}

// 药物管理
export class MedicationManager {
  constructor(storage) {
    this.storage = storage;
  }

  // 添加药物
  addMedication(medication) {
    const data = this.storage.loadData();
    const newMed = {
      id: Date.now(),
      ...medication,
      createdAt: new Date().toISOString(),
      adherence: 100
    };
    
    data.medications.push(newMed);
    this.storage.saveData(data);
    return newMed;
  }

  // 更新药物
  updateMedication(id, updates) {
    const data = this.storage.loadData();
    const index = data.medications.findIndex(med => med.id === id);
    
    if (index !== -1) {
      data.medications[index] = {
        ...data.medications[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.storage.saveData(data);
      return data.medications[index];
    }
    return null;
  }

  // 删除药物
  deleteMedication(id) {
    const data = this.storage.loadData();
    data.medications = data.medications.filter(med => med.id !== id);
    this.storage.saveData(data);
    return true;
  }

  // 记录用药
  recordMedicationTaken(id) {
    const data = this.storage.loadData();
    const medication = data.medications.find(med => med.id === id);
    
    if (medication) {
      // 这里可以添加用药记录逻辑
      medication.lastTaken = new Date().toISOString();
      this.storage.saveData(data);
      return true;
    }
    return false;
  }
}

// 创建默认实例
export const dataStorage = new DataStorage();
export const symptomTracker = new SymptomTracker(dataStorage);
export const medicationManager = new MedicationManager(dataStorage);


