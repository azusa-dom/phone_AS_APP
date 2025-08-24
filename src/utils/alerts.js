// 预警规则与待办生成（简化版，基于前端模拟数据）

/**
 * 计算预警
 * @param {Array} patients - 患者数组
 * @returns {{alerts: Array, stats: Object}}
 */
export function computeAlerts(patients = []) {
  const alerts = [];
  let activeCount = 0;
  let warningCount = 0;

  const now = new Date();

  patients.forEach((p) => {
    if (p.status === 'active') activeCount += 1;
    if (p.status === 'warning') warningCount += 1;

    // 规则1：连续3天疼痛≥8
    if (Array.isArray(p.recentSymptoms)) {
      const last3 = p.recentSymptoms.slice(-3);
      if (last3.length === 3 && last3.every((d) => (d.pain || d.painLevel || 0) >= 8)) {
        alerts.push({
          patientId: p.id,
          name: p.name,
          rule: 'PAIN_HIGH_3D',
          label: '连续3天疼痛≥8',
          severity: 'high',
          hint: '建议尽快复诊评估并调整方案'
        });
      }

      // 规则2：7天未记录
      const lastDateStr = p.recentSymptoms[p.recentSymptoms.length - 1]?.date;
      if (lastDateStr) {
        const lastDate = new Date(lastDateStr);
        const diffDays = Math.floor((now - lastDate) / (1000 * 60 * 60 * 24));
        if (diffDays >= 7) {
          alerts.push({
            patientId: p.id,
            name: p.name,
            rule: 'NO_LOG_7D',
            label: '7天未记录症状',
            severity: 'medium',
            hint: '建议电话随访或应用内提醒'
          });
        }
      }
    }

    // 规则3：依从性<60%
    if (typeof p.adherence === 'number' && p.adherence < 60) {
      alerts.push({
        patientId: p.id,
        name: p.name,
        rule: 'ADHERENCE_LOW',
        label: '用药依从性<60%',
        severity: 'medium',
        hint: '评估原因（不良反应/费用/遗忘），制定改善方案'
      });
    }

    // 规则4：生物制剂到期<7天（若提供）
    if (p.biologicExpiry) {
      const exp = new Date(p.biologicExpiry);
      const diffDays = Math.ceil((exp - now) / (1000 * 60 * 60 * 24));
      if (diffDays >= 0 && diffDays <= 7) {
        alerts.push({
          patientId: p.id,
          name: p.name,
          rule: 'BIOLOGIC_EXPIRY',
          label: '生物制剂即将到期',
          severity: 'low',
          hint: `剩余${diffDays}天，提前安排补给/报销流程`
        });
      }
    }
  });

  return {
    alerts,
    stats: {
      totalPatients: patients.length,
      activeCount,
      warningCount
    }
  };
}

/**
 * 生成今日待办统计
 * @param {Array} alerts - 预警数组
 * @returns {{appointments: number, reportReviews: number, medAdjustments: number, phoneFollowUps: number}}
 */
export function generateTodos(alerts = []) {
  const appointments = alerts.filter(a => a.rule === 'PAIN_HIGH_3D').length;
  const phoneFollowUps = alerts.filter(a => a.rule === 'NO_LOG_7D').length;
  const medAdjustments = alerts.filter(a => a.rule === 'ADHERENCE_LOW').length;
  const reportReviews = alerts.filter(a => a.rule === 'BIOLOGIC_EXPIRY' || a.rule === 'ADHERENCE_LOW').length;

  return { appointments, reportReviews, medAdjustments, phoneFollowUps };
}


