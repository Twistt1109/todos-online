import { apiService } from './apiService.js';

// 初始化加载待办事项
document.addEventListener('DOMContentLoaded', function() {
  loadTodos();
  document.getElementById('add-btn').addEventListener('click', addTodo);
});

/**
 * 添加新的待办事项
 * 功能：获取输入框内容，将新事项保存到chrome.storage
 * 参数：无
 * 流程：
 * 1. 校验输入内容是否为空
 * 2. 从存储中获取现有待办事项
 * 3. 生成新事项对象（包含文本和唯一ID）
 * 4. 更新存储并重新渲染列表
 */
async function addTodo() {
  const input = document.getElementById('todo-input');
  if (input.value.trim() === '') return;

  try {
    // 显示加载状态
    document.getElementById('add-btn').disabled = true;
    
    await apiService.create(input.value);
    input.value = '';
    const todos = await apiService.getAll();
    renderTodos(todos);
  } catch (error) {
    console.error('添加失败:', error);
    alert('添加失败，请检查网络连接');
  } finally {
    document.getElementById('add-btn').disabled = false;
  }
}

/**
 * 删除指定ID的待办事项
 * @param {number} id - 要删除的事项ID
 * 流程：
 * 1. 从存储中过滤掉指定ID的事项
 * 2. 更新存储数据
 * 3. 重新渲染列表
 */
async function deleteTodo(id) {
  try {
    await apiService.delete(id);
    const todos = await apiService.getAll();
    renderTodos(todos);
  } catch (error) {
    console.error('删除失败:', error);
    alert('删除失败，请稍后重试');
  }
}

/**
 * 渲染待办事项列表
 * @param {Array} todos - 待办事项数组
 * 功能：
 * 1. 将数组转换为HTML列表项
 * 2. 为每个删除按钮绑定点击事件
 * 3. 更新DOM显示
 */
function renderTodos(todos) {
  const list = document.getElementById('todo-list');
  // 生成列表项HTML
  list.innerHTML = todos.map(todo => `
    <li>
      <span>${todo.text}</span>
      <button class="delete-btn" data-id="${todo.id}">×</button>
    </li>
  `).join('');

  // 为所有删除按钮添加点击监听
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteTodo(parseInt(btn.dataset.id)));
  });
}

/**
 * 加载存储中的待办事项
 * 功能：初始化时从chrome.storage加载数据并渲染
 */
async function loadTodos() {
  try {
    document.getElementById('todo-list').innerHTML = '加载中...';
    const todos = await apiService.getAll();
    renderTodos(todos);
  } catch (error) {
    console.error('加载失败:', error);
    document.getElementById('todo-list').innerHTML = '数据加载失败'; 
  }
}