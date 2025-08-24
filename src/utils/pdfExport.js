import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// 动态导入jspdf-autotable
let autoTableLoaded = false;
const loadAutoTable = async () => {
  if (!autoTableLoaded) {
    try {
      await import('jspdf-autotable');
      autoTableLoaded = true;
      console.log('jspdf-autotable 加载成功');
    } catch (error) {
      console.error('jspdf-autotable 加载失败:', error);
      throw new Error('PDF表格功能不可用');
    }
  }
};

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
  initDocument(title = 'Joint Health Report') {
    this.doc = new jsPDF('p', 'mm', 'a4');
    this.currentY = 20;
    
    // 设置字体为更兼容的字体
    this.doc.setFont('helvetica');
    
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
    
    // 确保文本是可打印ASCII字符（空格到~），避免乱码
    const cleanText = String(text).replace(/[^\u0020-\u007E]/g, '');
    
    this.doc.text(cleanText, this.margin, this.currentY);
    this.currentY += fontSize + 2;
  }

  // 添加分割线
  addLine() {
    this.doc.setDrawColor(200, 200, 200);
    this.doc.line(this.margin, this.currentY, this.pageWidth - this.margin, this.currentY);
    this.currentY += 5;
  }

  // 添加表格
  async addTable(headers, data, title = '') {
    if (title) {
      this.addSubtitle(title);
    }
    
    // 确保autoTable已加载
    await loadAutoTable();
    
    // 检查是否需要换页
    if (this.currentY > this.pageHeight - 50) {
      this.doc.addPage();
      this.currentY = 20;
    }
    
    const tableData = data.map(row => 
      headers.map(header => row[header.key] || '')
    );
    
    // 检查autoTable方法是否存在
    if (typeof this.doc.autoTable !== 'function') {
      console.error('autoTable方法不可用');
      // 回退到简单文本显示
      this.addText('表格数据:', 12);
      data.forEach((row, index) => {
        const rowText = headers.map(h => `${h.label}: ${row[h.key] || ''}`).join(' | ');
        this.addText(`${index + 1}. ${rowText}`, 10);
      });
      return;
    }
    
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
  async exportSymptomReport(symptomData, language = 'en') { // 强制使用英文避免乱码
    try {
      // 强制使用英文，避免中文字符乱码
      this.initDocument('Joint Health Report');
      
      // 添加基本信息
      this.addText('Symptom Tracking & Analysis', 14);
      this.addText(`Generated: ${new Date().toLocaleString('en-US')}`);
      this.addLine();
      
      // 添加症状统计
      if (symptomData.stats) {
        this.addSubtitle('Symptom Summary');
        this.addText(`Total Records: ${symptomData.stats.totalRecords}`);
        this.addText(`Average Pain: ${symptomData.stats.avgPain}/10`);
        this.addText(`Average Stiffness: ${symptomData.stats.avgStiffness} minutes`);
        this.addText(`Average Fatigue: ${symptomData.stats.avgFatigue}/10`);
        this.addText(`Flare Count: ${symptomData.stats.flareCount}`);
        this.addLine();
      }
      
      // 添加症状记录表格
      if (symptomData.records && symptomData.records.length > 0) {
        const headers = [
          { key: 'date', label: 'Date' },
          { key: 'painLevel', label: 'Pain Level' },
          {text: 'Morning Stiffness' },
          { key: 'fatigue', label: 'Fatigue Level' },
          { key: 'flare', label: 'Flare Status' }
        ];
        
        const tableData = symptomData.records.map(record => ({
          date: new Date(record.timestamp).toLocaleDateString('en-US'),
          painLevel: record.painLevel || '-',
          stiffness: record.stiffnessTime ? `${record.stiffnessTime} min` : '-',
          fatigue: record.fatigue || '-',
          flare: record.isFlare ? 'Yes' : 'No'
        }));
        
        await this.addTable(headers, tableData, 'Symptom Records');
      }
      
      // 添加建议
      this.addSubtitle('Health Recommendations');
      const recommendations = [
        'Regular symptom tracking helps doctors understand disease progression',
        'Maintain regular sleep schedule, avoid overexertion',
        'Take medications as prescribed, do not stop arbitrarily',
        'Regular rehabilitation exercises to maintain joint flexibility',
        'Seek medical attention if symptoms persist or worsen'
      ];
      
      recommendations.forEach(rec => this.addText(`• ${rec}`));
      
      return this.doc;
    } catch (error) {
      console.error('Export symptom report failed:', error);
      throw error;
    }
  }

  // 导出用药报告
  exportMedicationReport(medicationData, language = 'en') { // 强制使用英文避免乱码
    // 强制使用英文，避免中文字符乱码
    this.initDocument('AS Medication Management Report');
    
    this.addText('Medication Info & Adherence', 14);
    this.addText(`Generated: ${new Date().toLocaleString('en-US')}`);
    this.addLine();
    
    if (medicationData && medicationData.length > 0) {
      const headers = [
        { key: 'name', label: 'Medication Name' },
        { key: 'type', label: 'Type' },
        { key: 'dosage', label: 'Dosage' },
        { key: 'frequency', label: 'Frequency' },
        { key: 'nextDose', label: 'Next Dose' },
        { key: 'adherence', label: 'Adherence' }
      ];
      
      const tableData = medicationData.map(med => ({
        name: typeof med.name === 'object' ? med.name.en || med.name.zh || med.name : med.name,
        type: med.type,
        dosage: med.dosage,
        frequency: typeof med.frequency === 'object' ? med.frequency.en || med.frequency.zh || med.frequency : med.frequency,
        nextDose: med.nextDose,
        adherence: `${med.adherence}%`
      }));
      
      this.addTable(headers, tableData, 'Medication Information');
    }
    
    return this.doc;
  }

  // 导出完整健康报告
  async exportFullHealthReport(data, language = 'en') { // 强制使用英文避免乱码
    // 强制使用英文，避免中文字符乱码
    this.initDocument('AS Complete Health Report');
    
    this.addText('Comprehensive Health Management Report', 14);
    this.addText(`Generated: ${new Date().toLocaleString('en-US')}`);
    this.addLine();
    
    // 用户信息
    if (data.userProfile) {
      this.addSubtitle('User Information');
      this.addText(`Name: ${data.userProfile.name || 'Not Set'}`);
      this.addText(`Age: ${data.userProfile.age || 'Not Set'}`);
      this.addText(`Diagnosis Date: ${data.userProfile.diagnosisDate || 'Not Set'}`);
      this.addLine();
    }
    
    // 症状分析
    if (data.symptoms) {
      this.addSubtitle('Symptom Analysis');
      const stats = this.calculateSymptomStats(data.symptoms.dailyRecords);
      this.addText(`Total Records: ${stats.totalRecords}`);
      this.addText(`Average Pain: ${stats.avgPain}/10`);
      this.addText(`Average Stiffness: ${stats.avgStiffness} minutes`);
      this.addText(`Average Fatigue: ${stats.avgFatigue}/10`);
      this.addText(`Flare Count: ${stats.flareCount}`);
      this.addLine();
    }
    
    // 用药管理
    if (data.medications && data.medications.length > 0) {
      this.addSubtitle('Medication Management');
      this.addText(`Current Medications: ${data.medications.length} types`);
      this.addText(`Average Adherence: ${this.calculateAverageAdherence(data.medications)}%`);
      this.addLine();
    }
    
    // 教育进度
    if (data.education) {
      this.addSubtitle('Education Progress');
      this.addText(`Completed Courses: ${data.education.completedCourses.length} courses`);
      this.addText(`Bookmarked Content: ${data.education.bookmarks.length} items`);
      this.addText(`Learning Notes: ${data.education.notes.length} notes`);
      this.addLine();
    }
    
    // 健康建议
    this.addSubtitle('Health Recommendations');
    this.addText('• Maintain regular symptom tracking to help doctors understand disease progression');
    this.addText('• Take medications as prescribed to improve treatment adherence');
    this.addText('• Continue rehabilitation exercises to maintain joint flexibility');
    this.addText('• Learn about AS to improve self-management skills');
    this.addText('• Regular follow-up visits to adjust treatment plans');
    this.addText('• Maintain positive attitude and establish good lifestyle habits');
    
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
