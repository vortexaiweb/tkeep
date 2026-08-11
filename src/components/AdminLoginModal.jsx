import React, { useState } from 'react';
import { X, Lock, User, Key, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

export const AdminLoginModal = ({ isOpen, onClose, onSuccess }) => {
  const [username, setUsername] = useState('d2c');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const { login } = useAuth();
  const { showToast } = useToast();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    try {
      await login(username.trim(), password);
      showToast('Успешный вход в панель управления!', 'success');
      onSuccess();
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Ошибка авторизации. Проверьте данные.');
      showToast('Ошибка авторизации', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div 
        className="relative w-full max-w-md glass-panel rounded-3xl overflow-hidden border border-gray-700/80 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white bg-gray-800/80 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3 shadow-lg shadow-emerald-500/10">
            <Lock className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-100">Вход в админ-панель</h2>
          <p className="text-xs text-gray-400 mt-1">Доступ только для авторизованных администраторов</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Логин
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                required
                placeholder="d2c"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-gray-900/90 text-gray-100 placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Пароль
            </label>
            <div className="relative">
              <Key className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="password"
                required
                placeholder="787352"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-gray-900/90 text-gray-100 placeholder-gray-500 text-sm rounded-xl pl-10 pr-4 py-3 border border-gray-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/30 disabled:opacity-50"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4" />
                  <span>Войти в систему</span>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="mt-4 pt-4 border-t border-gray-800 text-center">
          <p className="text-[11px] text-gray-500">
            Логин по умолчанию: <code className="text-emerald-400">d2c</code> / Пароль: <code className="text-emerald-400">787352</code>
          </p>
        </div>

      </div>
    </div>
  );
};
