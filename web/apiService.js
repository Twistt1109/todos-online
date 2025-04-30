const API_BASE = 'http://localhost:8888/todos';

export const apiService = {
  async getAll() {
    try {
      const response = await fetch(API_BASE);
      return await response.json();
    } catch (error) {
      console.error('获取数据失败:', error);
      throw error;
    }
  },

  async create(todoText) {
    try {
      const response = await fetch(API_BASE, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ text: todoText })
      });
      return await response.json();
    } catch (error) {
      console.error('创建失败:', error);
      throw error;
    }
  },

  async delete(id) {
    try {
      await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE'
      });
      return true;
    } catch (error) {
      console.error('删除失败:', error);
      throw error;
    }
  }
};