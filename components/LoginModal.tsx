import React, { useState } from 'react';
import { Lock, X } from 'lucide-react';
import { db } from '../services/db';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLoginSuccess: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const settings = db.getSettings();
        const adminPass = settings?.adminPassword || 'admin123';

        if (password === adminPass) {
            onLoginSuccess();
            setPassword('');
            setError('');
            onClose();
        } else {
            setError('Mật khẩu không đúng!');
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100] backdrop-blur-sm">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden animate-fade-in-up">
                <div className="bg-brand-600 p-6 flex flex-col items-center justify-center text-white relative">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-white/70 hover:text-white"
                    >
                        <X size={24} />
                    </button>
                    <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-4 backdrop-blur-md">
                        <Lock size={32} className="text-white" />
                    </div>
                    <h2 className="text-2xl font-bold">Quản Trị Viên</h2>
                    <p className="text-brand-100 text-sm mt-1">Đăng nhập để truy cập tính năng này</p>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Mật khẩu Admin</label>
                        <input
                            type="password"
                            placeholder="Nhập mật khẩu..."
                            className="w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-brand-500 focus:border-transparent outline-none transition-all"
                            value={password}
                            onChange={(e) => {
                                setPassword(e.target.value);
                                setError('');
                            }}
                            autoFocus
                        />
                        {error && <p className="text-red-500 text-sm mt-2 flex items-center gap-1">⚠️ {error}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-brand-600 text-white font-bold py-3 rounded-lg hover:bg-brand-700 transition-colors shadow-lg shadow-brand-200"
                    >
                        Đăng Nhập
                    </button>
                </form>
            </div>
        </div>
    );
};
