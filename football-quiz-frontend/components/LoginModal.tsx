'use client';

import { useState } from 'react';
import { api } from '../lib/api';
import { useGameStore } from '../store/useGameStore';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSwitchToRegister: () => void;
}

export function LoginModal({ isOpen, onClose, onSwitchToRegister }: LoginModalProps) {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const { setCurrentUser } = useGameStore();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { data } = await api.post('/api/auth/login', formData);
      if (data.success) {
        setCurrentUser(data.user);
        onClose();
        window.location.href = '/mode-select';
      }
    } catch (err) {
      alert('아이디 또는 비밀번호가 틀렸습니다.');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="w-full max-w-md bg-gray-900 border border-gray-800 p-10 rounded-[2.5rem] shadow-2xl animate-in fade-in zoom-in duration-300">
        <h2 className="text-3xl font-black text-green-500 mb-8 italic">LOGIN</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">ID</label>
            <input 
              type="text" required
              className="w-full bg-black border border-gray-800 p-4 rounded-xl focus:border-green-500 outline-none font-bold"
              placeholder="아이디를 입력하세요" onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase mb-2">Password</label>
            <input 
              type="password" required
              className="w-full mb-6 bg-black border border-gray-800 p-4 rounded-xl focus:border-green-500 outline-none font-bold"
              placeholder="비밀번호를 입력하세요" onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>
          <button type="submit" className="w-full py-2 bg-transparent border-2 border-green-600 rounded-xl font-black text-xl hover:bg-green-600 transition shadow-lg shadow-green-900/20">
            ENTER
          </button>
        </form>
        <div className="mt-10 text-center text-sm text-gray-500 font-bold">
          계정이 없으신가요?{' '}
          <span 
            onClick={onSwitchToRegister} 
            className="text-green-500 cursor-pointer hover:underline decoration-2 underline-offset-4 ml-1"
          >
            간편 회원가입
          </span>
        </div>
        <button 
          onClick={() => {
            onClose();
            window.location.href = '/mode-select';
          }}
          className="mt-4 w-full text-gray-400 text-sm font-bold hover:text-white transition py-2 bg-gray-800/50 rounded-xl"
        >
          비회원으로 이용
        </button>
        <button onClick={onClose} className="mt-6 w-full text-gray-600 text-xs font-bold hover:text-red-500 transition">CLOSE</button>
      </div>
    </div>
  );
}