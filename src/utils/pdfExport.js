import jsPDF from 'jspdf';
import 'jspdf-autotable';
import html2canvas from 'html2canvas';

// PDF导出工具类
export class PDFExporter {
  constructor() {
    this.doc = null;
    this.currentY = 20;
    this.pageWidth = 210;
    this.pageHeight = 297;
    this.margin = 20;
  }

  // 初始化PDF文档
  initDocument(title = 'AS健康报告') {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
    
    // 添加标题
    this.addTitle(title);
    this.addLine();
    
    return this.doc;
  }

  // 添加标题
  addTitle(text, fontSize = 18) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, this.pageWidth / 2, this.currentY, { align: 'center' });
    this.currentY += fontSize + 5;
  }

  // 添加副标题
  addSubtitle(text, fontSize = 14) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'bold');
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize + 3;
  }

  // 添加文本
  addText(text, fontSize = 12) {
    this.doc.setFontSize(fontSize);
    this.doc.setFont('helvetica', 'normal');
    
    // 检查是否需要换页
    if (this.currentY > this.pageHeight - 30) {
      this.doc.addPage();
      this.currentY = 20;
    }
    
    this.doc.text(text, this.margin, this.currentY);
    this.currentY += fontSize + 2;
  }

  // 添加分割线
  addLine() {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }

  // 添加表格
  addTable(headers, data, title = '') {
    if (title) {
      this.addSubtitle(title);
    }
    
    // 检查是否需要换页
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = 20;
    }
    
    const tableData = data.map(row => 
      headers.map(header => row[header.key] || '')
    );
    
    this.doc.autoTable({
      head: [headers.map(h => h.label)],
      body: tableData,
      startY: this.currentY,
      margin: { left: this.margin },
      styles: {
        fontSize: 10,
        cellPadding: 3
      },
      headStyles: {
        fillColor: [59, 130, 246],
        textColor: 255
      }
    });
    
    this.currentY = this.doc.lastAutoTable.finalY + 10;
  }

  // 添加图表（转换为图片）
  async addChart(chartElement, title = '') {
    if (title) {
      this.addSubtitle(title);
    }
    
    try {
      // 检查是否需要换页
      if (this.currentY > this.pageHeight - 80) {
        this.doc.addPage();
        this.currentY = 20;
      }
      
      const canvas = await html2canvas(chartElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true
      });
      
      const imgData = canvas.toDataURL('image/png');
      const imgWidth = this.pageWidth - 2 * this.margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      this.doc.addImage(imgData, 'PNG', this.margin, this.currentY, imgWidth, imgHeight);
      this.currentY += imgHeight + 10;
      
    } catch (error) {
      console.error('图表转换失败:', error);
      this.addText('图表生成失败', 10);
    }
  }

  // 导出症状报告
  async exportSymptomReport(symptomData, language = 'zh') {
    const t = {
      zh: {
        title: 'AS症状健康报告',
        subtitle: '症状记录与分析',
        painLevel: '疼痛程度',
        stiffness: '晨僵时长',
        fatigue: '疲劳程度',
        flareStatus: '发作状态',
        date: '日期',
        value: '数值',
        status: '状态',
        summary: '症状总结',
        recommendations: '建议'
      },
      en: {
        title: 'AS Symptom Health Report',
        subtitle: 'Symptom Records & Analysis',
        painLevel: 'Pain Level',
        stiffness: 'Morning Stiffness',
        fatigue: 'Fatigue Level',
        flareStatus: 'Flare Status',
        date: 'Date',
        value: 'Value',
        status: 'Status',
        summary: 'Symptom Summary',
        recommendations: 'Recommendations'
      }
    };

    this.initDocument(t[language].title);
    
    // 添加基本信息
    this.addText(`${t[language].subtitle}`, 14);
    this.addText(`生成时间: ${new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}`);
    this.addLine();
    
    // 添加症状统计
    if (symptomData.stats) {
      this.addSubtitle(t[language].summary);
      this.addText(`总记录数: ${symptomData.stats.totalRecords}`);
      this.addText(`平均疼痛: ${symptomData.stats.avgPain}/10`);
      this.addText(`平均晨僵: ${symptomData.stats.avgStiffness}分钟`);
      this.addText(`平均疲劳: ${symptomData.stats.avgFatigue}/10`);
      this.addText(`发作次数: ${symptomData.stats.flareCount}`);
      this.addLine();
    }
    
    // 添加症状记录表格
    if (symptomData.records && symptomData.records.length > 0) {
      const headers = [
        { key: 'date', label: t[language].date },
        { key: 'painLevel', label: t[language].painLevel },
        { key: 'stiffness', label: t[language].stiffness },
        { key: 'fatigue', label: t[language].fatigue },
        { key: 'flare', label: t[language].flareStatus }
      ];
      
      const tableData = symptomData.records.map(record => ({
        date: new Date(record.timestamp).toLocaleDateString(language === 'zh' ? 'zh-CN' : 'en-US'),
        painLevel: record.painLevel || '-',
        stiffness: record.stiffnessTime ? `${record.stiffnessTime}分钟` : '-',
        fatigue: record.fatigue || '-',
        flare: record.isFlare ? '是' : '否'
      }));
      
      this.addTable(headers, tableData, '症状记录详情');
    }
    
    // 添加建议
    this.addSubtitle(t[language].recommendations);
    this.addText('• 定期记录症状变化，帮助医生了解病情发展');
    this.addText('• 保持规律作息，避免过度劳累');
    this.addText('• 按医嘱用药，不要随意停药');
    this.addText('• 定期进行康复运动，保持关节灵活性');
    this.addText('• 如症状持续或加重，请及时就医');
    
    return this.doc;
  }

  // 导出用药报告
  exportMedicationReport(medicationData, language = 'zh') {
    const t = {
      zh: {
        title: 'AS用药管理报告',
        subtitle: '药物信息与依从性',
        medicationName: '药物名称',
        type: '类型',
        dosage: '剂量',
        frequency: '频率',
        nextDose: '下次用药',
        adherence: '依从性',
        sideEffects: '副作用'
      },
      en: {
        title: 'AS Medication Management Report',
        subtitle: 'Medication Info & Adherence',
        medicationName: 'Medication Name',
        type: 'Type',
        dosage: 'Dosage',
        frequency: 'Frequency',
        nextDose: 'Next Dose',
        adherence: 'Adherence',
        sideEffects: 'Side Effects'
      }
    };

    this.initDocument(t[language].title);
    
    this.addText(`${t[language].subtitle}`, 14);
    this.addText(`生成时间: ${new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}`);
    this.addLine();
    
    if (medicationData && medicationData.length > 0) {
      const headers = [
        { key: 'name', label: t[language].medicationName },
        { key: 'type', label: t[language].type },
        { key: 'dosage', label: t[language].dosage },
        { key: 'frequency', label: t[language].frequency },
        { key: 'nextDose', label: t[language].nextDose },
        { key: 'adherence', label: t[language].adherence }
      ];
      
      const tableData = medicationData.map(med => ({
        name: med.name[language] || med.name,
        type: med.type,
        dosage: med.dosage,
        frequency: typeof med.frequency === 'object' ? med.frequency[language] : med.frequency,
        nextDose: med.nextDose,
        adherence: `${med.adherence}%`
      }));
      
      this.addTable(headers, tableData, '药物信息');
    }
    
    return this.doc;
  }

  // 导出完整健康报告
  async exportFullHealthReport(data, language = 'zh') {
    const t = {
      zh: {
        title: 'AS完整健康报告',
        subtitle: '综合健康管理报告',
        userInfo: '用户信息',
        symptomAnalysis: '症状分析',
        medicationManagement: '用药管理',
        educationProgress: '教育进度',
        healthRecommendations: '健康建议'
      },
      en: {
        title: 'AS Complete Health Report',
        subtitle: 'Comprehensive Health Management Report',
        userInfo: 'User Information',
        symptomAnalysis: 'Symptom Analysis',
        medicationManagement: 'Medication Management',
        educationProgress: 'Education Progress',
        healthRecommendations: 'Health Recommendations'
      }
    };

    this.initDocument(t[language].title);
    
    this.addText(`${t[language].subtitle}`, 14);
    this.addText(`生成时间: ${new Date().toLocaleString(language === 'zh' ? 'zh-CN' : 'en-US')}`);
    this.addLine();
    
    // 用户信息
    if (data.userProfile) {
      this.addSubtitle(t[language].userInfo);
      this.addText(`姓名: ${data.userProfile.name || '未设置'}`);
      this.addText(`年龄: ${data.userProfile.age || '未设置'}`);
      this.addText(`诊断日期: ${data.userProfile.diagnosisDate || '未设置'}`);
      this.addLine();
    }
    
    // 症状分析
    if (data.symptoms) {
      this.addSubtitle(t[language].symptomAnalysis);
      const stats = this.calculateSymptomStats(data.symptoms.dailyRecords);
      this.addText(`总记录数: ${stats.totalRecords}`);
      this.addText(`平均疼痛: ${stats.avgPain}/10`);
      this.addText(`平均晨僵: ${stats.avgStiffness}分钟`);
      this.addText(`平均疲劳: ${stats.avgFatigue}/10`);
      this.addText(`发作次数: ${stats.flareCount}`);
      this.addLine();
    }
    
    // 用药管理
    if (data.medications && data.medications.length > 0) {
      this.addSubtitle(t[language].medicationManagement);
      this.addText(`当前用药: ${data.medications.length}种`);
      this.addText(`平均依从性: ${this.calculateAverageAdherence(data.medications)}%`);
      this.addLine();
    }
    
    // 教育进度
    if (data.education) {
      this.addSubtitle(t[language].educationProgress);
      this.addText(`已完成课程: ${data.education.completedCourses.length}个`);
      this.addText(`收藏内容: ${data.education.bookmarks.length}个`);
      this.addText(`学习笔记: ${data.education.notes.length}条`);
      this.addLine();
    }
    
    // 健康建议
    this.addSubtitle(t[language].healthRecommendations);
    this.addText('• 保持规律的症状记录，帮助医生了解病情变化');
    this.addText('• 严格按医嘱用药，提高治疗依从性');
    this.addText('• 坚持康复运动，保持关节灵活性');
    this.addText('• 学习AS相关知识，提高自我管理能力');
    this.addText('• 定期复查，及时调整治疗方案');
    this.addText('• 保持积极心态，建立良好的生活习惯');
    
    return this.doc;
  }

  // 计算症状统计
  calculateSymptomStats(records) {
    if (!records || records.length === 0) {
      return {
        totalRecords: 0,
        avgPain: 0,
        avgStiffness: 0,
        avgFatigue: 0,
        flareCount: 0
      };
    }

    const avgPain = records.reduce((sum, r) => sum + (r.painLevel || 0), 0) / records.length;
    const avgStiffness = records.reduce((sum, r) => sum + (r.stiffnessTime || 0), 0) / records.length;
    const avgFatigue = records.reduce((sum, r) => sum + (r.fatigue || 0), 0) / records.length;
    const flareCount = records.filter(r => r.isFlare).length;

    return {
      totalRecords: records.length,
      avgPain: Math.round(avgPain * 10) / 10,
      avgStiffness: Math.round(avgStiffness),
      avgFatigue: Math.round(avgFatigue * 10) / 10,
      flareCount
    };
  }

  // 计算平均依从性
  calculateAverageAdherence(medications) {
    if (!medications || medications.length === 0) return 0;
    const sum = medications.reduce((acc, med) => acc + (med.adherence || 0), 0);
    return Math.round(sum / medications.length);
  }

  // 保存PDF
  savePDF(filename = 'as_health_report.pdf') {
    if (this.doc) {
      this.doc.save(filename);
    }
  }
}

// 创建默认实例
export const pdfExporter = new PDFExporter();
