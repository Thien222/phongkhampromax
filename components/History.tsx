import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Patient } from '../types';
import { Search, Eye, FileText, Calendar, Glasses, Printer } from 'lucide-react';

export const History: React.FC = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [activeTab, setActiveTab] = useState<'refraction' | 'all'>('refraction');

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = () => {
    const all = db.getPatients();
    setPatients(all.sort((a, b) => b.timestamp - a.timestamp));
  };

  // Lọc bệnh nhân theo tab và tìm kiếm
  const filtered = patients.filter(p => {
    // Filter by search term (name or phone)
    const matchSearch = searchTerm === '' ||
      p.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.phone.includes(searchTerm);

    // Filter by tab
    if (activeTab === 'refraction') {
      return matchSearch && p.refraction; // Chỉ hiện BN có kết quả khúc xạ
    }
    return matchSearch; // Tab "all" hiện tất cả
  });

  const handlePrintRefraction = (p: Patient) => {
    setSelectedPatient(p);
    setTimeout(() => {
      window.print();
    }, 200);
  };

  const today = new Date();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
          <HistoryIcon /> Lịch Sử Khám
        </h2>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('refraction')}
            className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 ${activeTab === 'refraction'
              ? 'bg-brand-50 text-brand-600 border-b-2 border-brand-600'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <Glasses size={16} /> Lịch sử Khúc xạ
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`flex-1 py-3 text-sm font-bold flex justify-center items-center gap-2 ${activeTab === 'all'
              ? 'bg-green-50 text-green-600 border-b-2 border-green-600'
              : 'text-gray-500 hover:bg-gray-50'
              }`}
          >
            <FileText size={16} /> Tất cả bệnh nhân
          </button>
        </div>

        <div className="p-6">
          {/* Search */}
          <div className="mb-4 relative">
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
            <input
              placeholder="Tìm kiếm theo tên hoặc số điện thoại..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-brand-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-600">
                <tr>
                  <th className="p-3">Ngày</th>
                  <th className="p-3">STT</th>
                  <th className="p-3">Họ Tên</th>
                  <th className="p-3">Năm sinh</th>
                  <th className="p-3">SĐT</th>
                  {activeTab === 'refraction' && <th className="p-3">Kính điều chỉnh</th>}
                  <th className="p-3">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {filtered.map(p => (
                  <tr key={p.id} className="hover:bg-gray-50">
                    <td className="p-3 text-sm">{new Date(p.timestamp).toLocaleDateString('vi-VN')}</td>
                    <td className="p-3 font-bold text-brand-600">{p.ticketNumber}</td>
                    <td className="p-3 font-medium">{p.fullName}</td>
                    <td className="p-3">{p.dob}</td>
                    <td className="p-3">{p.phone}</td>
                    {activeTab === 'refraction' && (
                      <td className="p-3 text-xs">
                        {p.refraction && (
                          <div>
                            <span>OD: {p.refraction.finalRx.od.sph}/{p.refraction.finalRx.od.cyl}</span>
                            <span className="ml-2">OS: {p.refraction.finalRx.os.sph}/{p.refraction.finalRx.os.cyl}</span>
                          </div>
                        )}
                      </td>
                    )}
                    <td className="p-3">
                      <div className="flex gap-2">
                        <button
                          onClick={() => setSelectedPatient(p)}
                          className="text-brand-600 hover:bg-brand-50 p-2 rounded flex items-center gap-1 text-sm font-medium"
                        >
                          <Eye size={16} /> Xem
                        </button>
                        {p.refraction && (
                          <button
                            onClick={() => handlePrintRefraction(p)}
                            className="text-gray-600 hover:bg-gray-100 p-2 rounded flex items-center gap-1 text-sm"
                            title="In phiếu khúc xạ"
                          >
                            <Printer size={16} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={activeTab === 'refraction' ? 7 : 6} className="p-8 text-center text-gray-500">
                      {searchTerm ? 'Không tìm thấy bệnh nhân phù hợp' : 'Chưa có dữ liệu lịch sử'}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b flex justify-between items-start bg-brand-50">
              <div>
                <h3 className="text-2xl font-bold text-brand-800">{selectedPatient.fullName}</h3>
                <div className="flex gap-4 text-sm text-gray-600 mt-1">
                  <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(selectedPatient.timestamp).toLocaleDateString('vi-VN')}</span>
                  <span>{selectedPatient.gender} - {selectedPatient.dob}</span>
                  <span>{selectedPatient.phone}</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">Địa chỉ: {selectedPatient.address}</p>
              </div>
              <button onClick={() => setSelectedPatient(null)} className="text-gray-500 hover:text-red-500 text-2xl">&times;</button>
            </div>

            <div className="p-6 space-y-6">
              {/* Thông tin ban đầu */}
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-bold text-yellow-800 mb-2">Thông tin ban đầu</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p><strong>Thị lực (UCVA):</strong> OD {selectedPatient.initialVA?.od || '-'} / OS {selectedPatient.initialVA?.os || '-'}</p>
                    <p><strong>Có kính:</strong> {selectedPatient.hasGlasses ? 'Có' : 'Không'}</p>
                  </div>
                  <div>
                    <p><strong>Lý do khám:</strong> {selectedPatient.reason || '-'}</p>
                    <p><strong>Ghi chú:</strong> {selectedPatient.notes || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Refraction Data */}
              {selectedPatient.refraction && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                    <Glasses size={18} /> Kết quả Khúc Xạ
                  </h4>

                  {/* Skiascopy */}
                  <div className="mb-4">
                    <p className="font-medium text-sm text-gray-600 mb-2">
                      Khúc xạ khách quan (Skiascopy)
                      {selectedPatient.refraction.skiascopy.cycloplegia &&
                        <span className="ml-2 text-red-600 text-xs bg-red-50 px-2 py-0.5 rounded">Có liệt điều tiết</span>
                      }
                    </p>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-gray-50 p-3 rounded">
                      <div>
                        <strong>OD:</strong> SPH {selectedPatient.refraction.skiascopy.od.sph || '-'} |
                        CYL {selectedPatient.refraction.skiascopy.od.cyl || '-'} |
                        AXIS {selectedPatient.refraction.skiascopy.od.axis || '-'}
                      </div>
                      <div>
                        <strong>OS:</strong> SPH {selectedPatient.refraction.skiascopy.os.sph || '-'} |
                        CYL {selectedPatient.refraction.skiascopy.os.cyl || '-'} |
                        AXIS {selectedPatient.refraction.skiascopy.os.axis || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Subjective */}
                  <div className="mb-4">
                    <p className="font-medium text-sm text-gray-600 mb-2">Khúc xạ chủ quan (Subj. Refraction)</p>
                    <div className="grid grid-cols-2 gap-4 text-sm bg-blue-50 p-3 rounded">
                      <div>
                        <strong>OD:</strong> SPH {selectedPatient.refraction.subjective.od.sph || '-'} |
                        CYL {selectedPatient.refraction.subjective.od.cyl || '-'} |
                        AXIS {selectedPatient.refraction.subjective.od.axis || '-'} |
                        VA {selectedPatient.refraction.subjective.od.va || '-'}
                      </div>
                      <div>
                        <strong>OS:</strong> SPH {selectedPatient.refraction.subjective.os.sph || '-'} |
                        CYL {selectedPatient.refraction.subjective.os.cyl || '-'} |
                        AXIS {selectedPatient.refraction.subjective.os.axis || '-'} |
                        VA {selectedPatient.refraction.subjective.os.va || '-'}
                      </div>
                    </div>
                  </div>

                  {/* Final Rx */}
                  <div className="mb-4">
                    <p className="font-medium text-sm text-gray-600 mb-2">Kính điều chỉnh (Prescription)</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="bg-brand-50 p-3 rounded border border-brand-200">
                        <p className="font-bold mb-1">Mắt Phải (OD)</p>
                        <p>SPH: {selectedPatient.refraction.finalRx.od.sph} | CYL: {selectedPatient.refraction.finalRx.od.cyl} | AXIS: {selectedPatient.refraction.finalRx.od.axis}</p>
                        <p>Thị lực: {selectedPatient.refraction.finalRx.od.va} | ADD: {selectedPatient.refraction.finalRx.od.add || '-'}</p>
                      </div>
                      <div className="bg-brand-50 p-3 rounded border border-brand-200">
                        <p className="font-bold mb-1">Mắt Trái (OS)</p>
                        <p>SPH: {selectedPatient.refraction.finalRx.os.sph} | CYL: {selectedPatient.refraction.finalRx.os.cyl} | AXIS: {selectedPatient.refraction.finalRx.os.axis}</p>
                        <p>Thị lực: {selectedPatient.refraction.finalRx.os.va} | ADD: {selectedPatient.refraction.finalRx.os.add || '-'}</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm mt-2 p-2 bg-gray-50 rounded">
                    <p><strong>Loại kính:</strong> {selectedPatient.refraction.finalRx.lensType}</p>
                    <p><strong>PD (KCĐT):</strong> {selectedPatient.refraction.finalRx.od.pd || '-'} mm</p>
                    {selectedPatient.refraction.note && <p><strong>Ghi chú:</strong> {selectedPatient.refraction.note}</p>}
                  </div>
                </div>
              )}

              {/* Medical Record */}
              {selectedPatient.medical && (
                <div className="border rounded-lg p-4">
                  <h4 className="font-bold text-gray-700 border-b pb-2 mb-3 flex items-center gap-2">
                    <FileText size={18} /> Khám Bệnh & Đơn Thuốc
                  </h4>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="font-bold text-sm text-gray-500">Triệu chứng</p>
                      <p>{selectedPatient.medical.symptoms}</p>
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-500">Chẩn đoán</p>
                      <p>{selectedPatient.medical.diagnosis}</p>
                    </div>
                  </div>

                  {selectedPatient.medical.prescriptions.length > 0 && (
                    <table className="w-full text-sm border">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="p-2 text-left">Thuốc</th>
                          <th className="p-2 text-center">SL</th>
                          <th className="p-2 text-left">Cách dùng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedPatient.medical.prescriptions.map((m, i) => (
                          <tr key={i} className="border-t">
                            <td className="p-2 font-medium">{m.medicineName}</td>
                            <td className="p-2 text-center">{m.quantity}</td>
                            <td className="p-2">{m.usage}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              )}
            </div>

            <div className="p-4 bg-gray-50 border-t flex justify-between">
              {selectedPatient.refraction && (
                <button
                  onClick={() => handlePrintRefraction(selectedPatient)}
                  className="px-4 py-2 bg-brand-600 text-white rounded hover:bg-brand-700 flex items-center gap-2"
                >
                  <Printer size={18} /> In Phiếu Khúc Xạ
                </button>
              )}
              <button onClick={() => setSelectedPatient(null)} className="px-4 py-2 bg-gray-200 rounded text-gray-700 hover:bg-gray-300 ml-auto">Đóng</button>
            </div>
          </div>
        </div>
      )}

      {/* Print Area for Refraction Sheet */}
      {selectedPatient?.refraction && (
        <div className="print-area">
          <div className="print-a5">
            {/* Header */}
            <div className="clearfix mb-4">
              <div className="header-left">
                <p className="font-bold">PHÒNG KHÁM MẮT NGOÀI GIỜ</p>
                <p className="font-bold">BSCKII. Hứa Trung Kiên</p>
                <p className="text-xs">SĐT: 0917416421 – 0849274364</p>
              </div>
              <div className="header-right">
                <p className="font-bold">KHÁM KHÚC XẠ</p>
                <p className="text-xs">Từ 8h đến 19h, Thứ hai đến Chủ nhật</p>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-center text-xl font-bold my-4 uppercase">PHIẾU KHÚC XẠ</h1>
            <p className="text-center text-sm mb-4">Ngày thực hiện: {new Date(selectedPatient.timestamp).toLocaleDateString('vi-VN')}</p>

            {/* Patient Info */}
            <div className="mb-4 text-sm">
              <div className="flex justify-between mb-1">
                <span><strong>Họ và tên:</strong> {selectedPatient.fullName}</span>
                <span><strong>Giới tính:</strong> {selectedPatient.gender}</span>
              </div>
              <div className="flex justify-between mb-1">
                <span><strong>Ngày sinh:</strong> {selectedPatient.dob}</span>
                <span><strong>SĐT:</strong> {selectedPatient.phone}</span>
              </div>
              <p><strong>Địa chỉ:</strong> {selectedPatient.address}</p>
            </div>

            {/* UCVA */}
            <table className="mb-4">
              <thead>
                <tr>
                  <th colSpan={2}>Thị lực không kính/kính cũ<br /><span className="text-xs font-normal">(UCVA/with old glasses)</span></th>
                  <th>Mắt phải (OD)</th>
                  <th>Mắt trái (OS)</th>
                  <th>KCĐT<br />(PD)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={2}></td>
                  <td>{selectedPatient.initialVA?.od || ''}</td>
                  <td>{selectedPatient.initialVA?.os || ''}</td>
                  <td>{selectedPatient.refraction.finalRx.od.pd || ''}</td>
                </tr>
              </tbody>
            </table>

            {/* Skiascopy */}
            <table className="mb-2">
              <thead>
                <tr>
                  <th rowSpan={2}>Khúc xạ khách quan<br /><span className="text-xs font-normal">(Skiascopy)</span>{selectedPatient.refraction.skiascopy.cycloplegia && <><br /><span className="text-xs text-red-600">- Có liệt điều tiết -</span></>}</th>
                  <th>MẮT</th>
                  <th>Độ cầu (SPH)</th>
                  <th>Độ loạn (CYL)</th>
                  <th>Trục (AXIS)</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>OD</td>
                  <td>{selectedPatient.refraction.skiascopy.od.sph}</td>
                  <td>{selectedPatient.refraction.skiascopy.od.cyl}</td>
                  <td>{selectedPatient.refraction.skiascopy.od.axis}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>OS</td>
                  <td>{selectedPatient.refraction.skiascopy.os.sph}</td>
                  <td>{selectedPatient.refraction.skiascopy.os.cyl}</td>
                  <td>{selectedPatient.refraction.skiascopy.os.axis}</td>
                </tr>
              </tbody>
            </table>

            {/* Subjective */}
            <table className="mb-4">
              <thead>
                <tr>
                  <th rowSpan={2}>Khúc xạ chủ quan<br /><span className="text-xs font-normal">(Subj. refraction)</span></th>
                  <th>MẮT</th>
                  <th>SPH</th>
                  <th>CYL</th>
                  <th>AXIS</th>
                  <th>Thị lực</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>OD</td>
                  <td>{selectedPatient.refraction.subjective.od.sph}</td>
                  <td>{selectedPatient.refraction.subjective.od.cyl}</td>
                  <td>{selectedPatient.refraction.subjective.od.axis}</td>
                  <td>{selectedPatient.refraction.subjective.od.va}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>OS</td>
                  <td>{selectedPatient.refraction.subjective.os.sph}</td>
                  <td>{selectedPatient.refraction.subjective.os.cyl}</td>
                  <td>{selectedPatient.refraction.subjective.os.axis}</td>
                  <td>{selectedPatient.refraction.subjective.os.va}</td>
                </tr>
              </tbody>
            </table>

            {/* Prescription */}
            <table className="mb-2">
              <thead>
                <tr>
                  <th rowSpan={2}>Kính điều chỉnh<br /><span className="text-xs font-normal">(Prescription)</span></th>
                  <th>MẮT</th>
                  <th>SPH</th>
                  <th>CYL</th>
                  <th>AXIS</th>
                  <th>Thị lực</th>
                  <th>ADD</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td></td>
                  <td>OD</td>
                  <td>{selectedPatient.refraction.finalRx.od.sph}</td>
                  <td>{selectedPatient.refraction.finalRx.od.cyl}</td>
                  <td>{selectedPatient.refraction.finalRx.od.axis}</td>
                  <td>{selectedPatient.refraction.finalRx.od.va}</td>
                  <td>{selectedPatient.refraction.finalRx.od.add}</td>
                </tr>
                <tr>
                  <td></td>
                  <td>OS</td>
                  <td>{selectedPatient.refraction.finalRx.os.sph}</td>
                  <td>{selectedPatient.refraction.finalRx.os.cyl}</td>
                  <td>{selectedPatient.refraction.finalRx.os.axis}</td>
                  <td>{selectedPatient.refraction.finalRx.os.va}</td>
                  <td>{selectedPatient.refraction.finalRx.os.add}</td>
                </tr>
              </tbody>
            </table>

            {/* Lens Type */}
            <table className="mb-4">
              <tbody>
                <tr>
                  <th>Loại kính<br /><span className="text-xs font-normal">(Type)</span></th>
                  <td colSpan={6}>{selectedPatient.refraction.finalRx.lensType}</td>
                </tr>
              </tbody>
            </table>

            {/* Notes */}
            <div className="mb-4">
              <p><strong>Ghi chú:</strong></p>
              <p className="min-h-[30px] border-b border-dotted">{selectedPatient.refraction.note}</p>
            </div>

            {/* Disclaimer */}
            <div className="text-xs mb-4 p-2 border rounded">
              <p><strong>Lưu ý:</strong></p>
              <p>1. Khách hàng đã được đeo thử kính và cảm thấy thoải mái khi đi lại, không có hiện tượng nhức mắt hay đau đầu. Mức độ thích nghỉ của mỗi người có thể khác nhau, vì vậy thời gian làm quen với kính có thể từ 5–7 ngày.</p>
              <p>2. Khách hàng đã được tư vấn về độ kính phù hợp, mọi điều chỉnh theo nhu cầu riêng sẽ được thực hiện theo mong muốn cá nhân sau khi đã được giải thích rõ ràng.</p>
            </div>

            {/* Signatures */}
            <div className="flex justify-between mt-8">
              <div className="text-center">
                <p className="font-bold">Xác nhận của khách hàng</p>
                <p className="mt-16">(Ký và ghi rõ họ tên)</p>
              </div>
              <div className="text-center">
                <p className="font-bold">Người thực hiện</p>
                <p className="mt-16">(Ký và ghi rõ họ tên)</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const HistoryIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 12" /></svg>;
