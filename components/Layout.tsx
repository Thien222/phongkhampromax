import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Users, Eye, Stethoscope, ShoppingBag, Package, History, Settings, TrendingUp } from 'lucide-react';

export const Layout: React.FC = () => {
  const navClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center p-3 mb-2 rounded-lg transition-colors ${isActive ? 'bg-brand-600 text-white' : 'text-gray-600 hover:bg-brand-50'}`;

  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden no-print">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-brand-700">EyeClinic Pro</h1>
          <p className="text-xs text-gray-500"></p>
        </div>
        <nav className="flex-1 p-4 overflow-y-auto">
          <NavLink to="/" className={navClass}>
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/reception" className={navClass}>
            <Users className="w-5 h-5 mr-3" />
            Tiếp Tân
          </NavLink>
          <NavLink to="/refraction" className={navClass}>
            <Eye className="w-5 h-5 mr-3" />
            Đo Khúc Xạ
          </NavLink>
          <NavLink to="/doctor" className={navClass}>
            <Stethoscope className="w-5 h-5 mr-3" />
            Khám Mắt
          </NavLink>
          <NavLink to="/billing" className={navClass}>
            <ShoppingBag className="w-5 h-5 mr-3" />
            Thu Ngân & Kê Toa
          </NavLink>
          <NavLink to="/inventory" className={navClass}>
            <Package className="w-5 h-5 mr-3" />
            Kho Hàng
          </NavLink>
          <NavLink to="/statistics" className={navClass}>
            <TrendingUp className="w-5 h-5 mr-3" />
            Thống Kê
          </NavLink>
          <NavLink to="/history" className={navClass}>
            <History className="w-5 h-5 mr-3" />
            Lịch sử
          </NavLink>
          <NavLink to="/settings" className={navClass}>
            <Settings className="w-5 h-5 mr-3" />
            Cài đặt
          </NavLink>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto p-8 relative">
        <Outlet />
      </main>
    </div>
  );
};