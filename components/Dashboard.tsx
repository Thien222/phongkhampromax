import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Users, Glasses, Stethoscope, FileText } from 'lucide-react';

export const Dashboard: React.FC = () => {
  const [stats, setStats] = useState({
    refractionToday: 0,
    examinationToday: 0,
    invoicesToday: 0,
    waitingRefraction: 0
  });

  const loadStats = () => {
    const today = new Date().toDateString();
    const patients = db.getPatients();
    const invoices = db.getInvoices();

    const todayPatients = patients.filter(p =>
      new Date(p.timestamp).toDateString() === today
    );

    setStats({
      refractionToday: todayPatients.filter(p => p.refraction).length,
      examinationToday: todayPatients.filter(p => p.medical).length,
      invoicesToday: invoices.filter(inv => new Date(inv.date).toDateString() === today).length,
      waitingRefraction: patients.filter(p => p.status === 'waiting_refraction').length
    });
  };

  useEffect(() => {
    loadStats();
    window.addEventListener('clinic-db-updated', loadStats);
    return () => window.removeEventListener('clinic-db-updated', loadStats);
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Tổng Quan Phòng Khám</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {/* Refraction Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-brand-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Khúc xạ hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.refractionToday}</p>
            </div>
            <Glasses className="text-brand-500 w-10 h-10" />
          </div>
        </div>

        {/* Examination Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-green-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Khám bệnh hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.examinationToday}</p>
            </div>
            <Stethoscope className="text-green-500 w-10 h-10" />
          </div>
        </div>

        {/* Invoices Today */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-purple-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Hóa đơn kính hôm nay</p>
              <p className="text-3xl font-bold text-gray-800">{stats.invoicesToday}</p>
            </div>
            <FileText className="text-purple-500 w-10 h-10" />
          </div>
        </div>

        {/* Waiting Refraction */}
        <div className="bg-white p-6 rounded-xl shadow-sm border-l-4 border-yellow-500">
          <div className="flex justify-between items-center">
            <div>
              <p className="text-gray-500 text-sm">Chờ đo khúc xạ</p>
              <p className="text-3xl font-bold text-gray-800">{stats.waitingRefraction}</p>
            </div>
            <Users className="text-yellow-500 w-10 h-10" />
          </div>
        </div>
      </div>

      {/* Quick Info */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Thông tin nhanh</h3>
        <div className="text-gray-600 text-sm space-y-2">
          <p>📅 Ngày: {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
          <p>⏰ Giờ hoạt động: 8h - 19h (Thứ Hai đến Chủ Nhật)</p>
          <p>📍 PK Mắt Ngoài Giờ</p>
        </div>
      </div>
    </div>
  );
};