import React from 'react';
import { AlertOctagon, RefreshCw, Trash2 } from 'lucide-react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Uncaught error in React tree:", error, errorInfo);
    this.setState({ errorInfo });
  }

  handleReload = () => {
    window.location.reload();
  };

  handleResetData = () => {
    try {
      localStorage.clear();
      sessionStorage.clear();
    } catch (e) {
      console.error("Could not clear storage:", e);
    }
    window.location.href = window.location.origin + window.location.pathname;
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0b0f19] text-gray-100 flex items-center justify-center p-4 font-sans">
          <div className="max-w-lg w-full bg-gray-900/90 border border-rose-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl text-center space-y-6">
            
            <div className="w-16 h-16 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mx-auto">
              <AlertOctagon className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h2 className="text-2xl font-extrabold text-white">Произошла ошибка при загрузке</h2>
              <p className="text-xs text-gray-400">
                Приложение столкнулось с непредвиденным сбоем. Мы уже подготовили инструменты для быстрого восстановления.
              </p>
            </div>

            {this.state.error && (
              <div className="p-3 bg-black/50 border border-gray-800 rounded-xl text-left font-mono text-[11px] text-rose-300 overflow-x-auto max-h-32">
                {this.state.error.toString()}
              </div>
            )}

            <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
              <button
                onClick={this.handleReload}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm transition-all shadow-lg shadow-emerald-600/25"
              >
                <RefreshCw className="w-4 h-4" />
                <span>Перезагрузить страницу</span>
              </button>

              <button
                onClick={this.handleResetData}
                className="w-full flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gray-800 hover:bg-rose-900/40 text-gray-300 hover:text-rose-200 border border-gray-700 font-bold text-sm transition-all"
              >
                <Trash2 className="w-4 h-4 text-rose-400" />
                <span>Сбросить кэш и данные</span>
              </button>
            </div>

          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
