import { API_URL } from '../constants/config';

export const authAPI = {
  register: async (username, password, nickname) => {
    const response = await fetch(`${API_URL}/api/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, nickname })
    });
    return response.json();
  },

  login: async (username, password) => {
    const response = await fetch(`${API_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
      body: JSON.stringify({ username, password })
    });
    return response.json();
  },

  checkAuth: async () => {
    const response = await fetch(`${API_URL}/api/auth/check`, {
      credentials: 'include'
    });
    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/api/auth/logout`, {
      method: 'POST',
      credentials: 'include'
    });
    return response.json();
  },

  updateNickname: async (nickname) => {
    const response = await fetch(`${API_URL}/api/auth/update-nickname`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ nickname })
    });
    return response.json();
  },

  updatePassword: async (currentPassword, nextPassword) => {
    const response = await fetch(`${API_URL}/api/auth/update-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, nextPassword })
    });
    return response.json();
  }
};

export const quizAPI = {
  fetchQuizzes: async () => {
    const response = await fetch(`${API_URL}/api/quizzes`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include'
    });
    return response.json();
  }
};