# 🔧 AS App 故障排除指南

## 🚨 常见问题及解决方案

### 1. **数据无法保存**

#### 问题描述：
- 症状记录点击保存后没有反应
- 药物信息添加后不显示
- 设置更改后重启应用就恢复默认值

#### 可能原因：
1. **浏览器存储权限被禁用**
2. **localStorage不可用**
3. **数据存储代码未正确执行**

#### 解决方案：

**步骤1：检查浏览器控制台**
```bash
# 在浏览器中按F12打开开发者工具
# 查看Console标签页是否有错误信息
```

**步骤2：检查localStorage是否可用**
```javascript
// 在浏览器控制台中输入：
console.log('localStorage available:', typeof localStorage !== 'undefined');
console.log('localStorage test:', localStorage.setItem('test', 'value'));
console.log('localStorage read:', localStorage.getItem('test'));
```

**步骤3：手动测试数据存储**
```javascript
// 在浏览器控制台中测试：
const testData = { test: true, timestamp: new Date().toISOString() };
localStorage.setItem('as_app_data', JSON.stringify(testData));
const loaded = JSON.parse(localStorage.getItem('as_app_data'));
console.log('Test result:', loaded);
```

### 2. **PDF导出失败**

#### 问题描述：
- 点击导出按钮没有反应
- 导出过程中出现错误
- 生成的PDF文件损坏或空白

#### 可能原因：
1. **PDF库未正确加载**
2. **浏览器不支持相关API**
3. **数据格式错误**

#### 解决方案：

**步骤1：检查PDF库依赖**
```bash
# 确保安装了必要的包
npm install jspdf jspdf-autotable html2canvas
```

**步骤2：检查浏览器兼容性**
- 使用Chrome、Firefox、Safari等现代浏览器
- 确保浏览器版本较新（Chrome 80+, Firefox 75+）

**步骤3：手动测试PDF生成**
```javascript
// 在浏览器控制台中测试：
import('jspdf').then(jsPDF => {
  const doc = new jsPDF.default();
  doc.text('Test PDF', 20, 20);
  doc.save('test.pdf');
});
```

### 3. **输入框只能输入一个字符**

#### 问题描述：
- 药物名称输入框只能输入一个字母
- 需要复制粘贴才能输入完整内容
- 输入框失去焦点后内容消失

#### 可能原因：
1. **React状态更新问题**
2. **输入框事件处理错误**
3. **组件重新渲染问题**

#### 解决方案：

**检查输入框代码：**
```jsx
// 正确的写法：
<input
  type="text"
  value={newMedication.name}
  onChange={(e) => {
    const value = e.target.value;
    setNewMedication(prev => ({...prev, name: value}));
  }}
/>

// 错误的写法：
<input
  type="text"
  value={newMedication.name}
  onChange={(e) => {
    setNewMedication({...newMedication, name: e.target.value});
  }}
/>
```

### 4. **应用无法启动**

#### 问题描述：
- `npm start` 命令失败
- 浏览器显示空白页面
- 控制台有大量错误

#### 解决方案：

**步骤1：清理并重新安装依赖**
```bash
rm -rf node_modules package-lock.json
npm install
```

**步骤2：清除浏览器缓存**
- 按Ctrl+Shift+Delete（Windows）或Cmd+Shift+Delete（Mac）
- 选择"清除所有数据"
- 重启浏览器

**步骤3：检查端口占用**
```bash
# 检查3000端口是否被占用
lsof -i :3000
# 如果被占用，杀死进程
kill -9 <PID>
```

## 🧪 功能测试步骤

### 测试数据存储：
1. 打开应用
2. 进入"症状记录"页面
3. 调整疼痛程度、晨僵时长、疲劳程度
4. 点击"保存记录"
5. 检查是否显示成功消息
6. 刷新页面，检查数据是否保存

### 测试PDF导出：
1. 进入"趋势报告"页面
2. 点击"导出PDF"按钮
3. 等待PDF生成完成
4. 检查是否自动下载PDF文件
5. 打开PDF文件验证内容

### 测试药物管理：
1. 进入"用药管理"页面
2. 点击"+"按钮添加药物
3. 填写药物信息（名称、类型、剂量、频率）
4. 点击"保存"
5. 检查药物是否显示在列表中

## 📱 浏览器兼容性

### 支持的浏览器：
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+

### 不支持的浏览器：
- ❌ Internet Explorer
- ❌ 旧版移动浏览器

## 🔍 调试技巧

### 1. **使用浏览器开发者工具**
```bash
# 快捷键：
# Chrome/Edge: F12 或 Ctrl+Shift+I
# Firefox: F12 或 Ctrl+Shift+I
# Safari: Cmd+Option+I
```

### 2. **检查网络请求**
- 在Network标签页查看API调用
- 检查是否有404或500错误

### 3. **检查存储状态**
```javascript
// 在控制台中查看localStorage内容：
Object.keys(localStorage).forEach(key => {
  console.log(key, localStorage.getItem(key));
});
```

### 4. **性能分析**
- 使用Performance标签页分析应用性能
- 检查内存泄漏和渲染问题

## 📞 获取帮助

如果以上方法都无法解决问题：

1. **检查GitHub Issues**：查看是否有类似问题
2. **提交新Issue**：描述具体问题和错误信息
3. **提供环境信息**：
   - 操作系统版本
   - 浏览器版本
   - Node.js版本
   - 错误截图或日志

## 🎯 预防措施

### 1. **定期备份数据**
- 使用"导出数据"功能备份重要信息
- 定期清理浏览器缓存

### 2. **保持应用更新**
- 定期拉取最新代码
- 更新依赖包版本

### 3. **测试环境一致性**
- 开发和生产环境使用相同配置
- 在不同浏览器中测试功能

---

💡 **提示**：大多数问题都可以通过检查浏览器控制台和遵循上述步骤解决。如果问题持续存在，请提供详细的错误信息和环境描述。
