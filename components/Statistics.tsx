import React, { useState, useEffect } from 'react';
import { db } from '../services/db';
import { Invoice, InventoryItem } from '../types';
import { TrendingUp, DollarSign, Package, ShoppingCart, Calendar, ArrowUp, ArrowDown } from 'lucide-react';

export const Statistics: React.FC = () => {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [inventory, setInventory] = useState<InventoryItem[]>([]);
    const [selectedMonth, setSelectedMonth] = useState<string>(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    });

    useEffect(() => {
        setInvoices(db.getInvoices());
        setInventory(db.getInventory());
    }, []);

    // Filter invoices by month
    const filteredInvoices = invoices.filter(inv => {
        const d = new Date(inv.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === selectedMonth;
    });

    // Calculate statistics
    const totalRevenue = filteredInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const totalDiscount = filteredInvoices.reduce((sum, inv) => sum + (inv.discount || 0), 0);
    const totalSurcharge = filteredInvoices.reduce((sum, inv) => sum + (inv.surcharge || 0), 0);

    // Calculate profit (revenue - cost)
    const totalCost = filteredInvoices.reduce((sum, inv) => {
        return sum + inv.items.reduce((itemSum, item) => {
            // Try to find cost price from inventory or stored in invoice
            const invItem = inventory.find(i => i.id === item.itemId);
            const costPrice = item.costPrice || invItem?.costPrice || 0;
            return itemSum + (costPrice * item.quantity);
        }, 0);
    }, 0);
    const totalProfit = totalRevenue - totalCost;

    // Item statistics  
    const totalItemsSold = filteredInvoices.reduce((sum, inv) =>
        sum + inv.items.reduce((itemSum, item) => itemSum + item.quantity, 0), 0
    );

    // Previous month comparison
    const prevMonth = new Date(selectedMonth + '-01');
    prevMonth.setMonth(prevMonth.getMonth() - 1);
    const prevMonthStr = `${prevMonth.getFullYear()}-${String(prevMonth.getMonth() + 1).padStart(2, '0')}`;

    const prevMonthInvoices = invoices.filter(inv => {
        const d = new Date(inv.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}` === prevMonthStr;
    });
    const prevRevenue = prevMonthInvoices.reduce((sum, inv) => sum + inv.total, 0);
    const revenueChange = prevRevenue > 0 ? ((totalRevenue - prevRevenue) / prevRevenue * 100) : 0;

    // Low stock items
    const lowStockItems = inventory.filter(i => i.quantity <= i.minStock);

    // Top selling items
    const itemSales: { [key: string]: { name: string, qty: number, revenue: number } } = {};
    filteredInvoices.forEach(inv => {
        inv.items.forEach(item => {
            if (!itemSales[item.itemId]) {
                itemSales[item.itemId] = { name: item.name, qty: 0, revenue: 0 };
            }
            itemSales[item.itemId].qty += item.quantity;
            itemSales[item.itemId].revenue += item.price * item.quantity;
        });
    });
    const topItems = Object.values(itemSales).sort((a, b) => b.revenue - a.revenue).slice(0, 5);

    // Daily revenue chart data
    const dailyRevenue: { [key: string]: number } = {};
    filteredInvoices.forEach(inv => {
        const day = new Date(inv.date).toLocaleDateString('vi-VN');
        dailyRevenue[day] = (dailyRevenue[day] || 0) + inv.total;
    });

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                    <TrendingUp className="text-brand-600" /> Thống Kê Doanh Thu
                </h2>
                <div className="flex items-center gap-3">
                    <label className="text-sm font-medium">Chọn tháng:</label>
                    <input
                        type="month"
                        className="border rounded-lg px-3 py-2"
                        value={selectedMonth}
                        onChange={e => setSelectedMonth(e.target.value)}
                    />
                </div>
            </div>

            {/* Main Stats Cards */}
            <div className="grid grid-cols-4 gap-6">
                {/* Revenue */}
                <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-green-100 text-sm">Tổng Doanh Thu</p>
                            <p className="text-3xl font-bold mt-1">{totalRevenue.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <DollarSign className="opacity-50" size={40} />
                    </div>
                    <div className="mt-3 flex items-center gap-1 text-sm">
                        {revenueChange >= 0 ? (
                            <><ArrowUp size={14} /> +{revenueChange.toFixed(1)}% so với tháng trước</>
                        ) : (
                            <><ArrowDown size={14} /> {revenueChange.toFixed(1)}% so với tháng trước</>
                        )}
                    </div>
                </div>

                {/* Profit */}
                <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-blue-100 text-sm">Lợi Nhuận</p>
                            <p className="text-3xl font-bold mt-1">{totalProfit.toLocaleString('vi-VN')} đ</p>
                        </div>
                        <TrendingUp className="opacity-50" size={40} />
                    </div>
                    <div className="mt-3 text-sm text-blue-100">
                        Tỷ suất: {totalRevenue > 0 ? ((totalProfit / totalRevenue) * 100).toFixed(1) : 0}%
                    </div>
                </div>

                {/* Invoices Count */}
                <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-purple-100 text-sm">Số Hóa Đơn</p>
                            <p className="text-3xl font-bold mt-1">{filteredInvoices.length}</p>
                        </div>
                        <ShoppingCart className="opacity-50" size={40} />
                    </div>
                    <div className="mt-3 text-sm text-purple-100">
                        TB: {filteredInvoices.length > 0 ? Math.round(totalRevenue / filteredInvoices.length).toLocaleString('vi-VN') : 0} đ/đơn
                    </div>
                </div>

                {/* Items Sold */}
                <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-5 text-white shadow-lg">
                    <div className="flex justify-between items-start">
                        <div>
                            <p className="text-orange-100 text-sm">Sản Phẩm Bán Ra</p>
                            <p className="text-3xl font-bold mt-1">{totalItemsSold}</p>
                        </div>
                        <Package className="opacity-50" size={40} />
                    </div>
                    <div className="mt-3 text-sm text-orange-100">
                        Giảm giá: {totalDiscount.toLocaleString('vi-VN')} đ
                    </div>
                </div>
            </div>

            {/* Secondary Stats */}
            <div className="grid grid-cols-3 gap-6">
                {/* Cost & Profit Breakdown */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-4">📊 Chi Tiết Thu Chi</h3>
                    <div className="space-y-3">
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Doanh thu gộp:</span>
                            <span className="font-bold text-green-600">{totalRevenue.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Giá vốn hàng bán:</span>
                            <span className="font-bold text-red-600">-{totalCost.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Giảm giá đã áp dụng:</span>
                            <span className="text-gray-500">-{totalDiscount.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between py-2 border-b">
                            <span className="text-gray-600">Phụ thu:</span>
                            <span className="text-gray-500">+{totalSurcharge.toLocaleString()} đ</span>
                        </div>
                        <div className="flex justify-between py-2 bg-blue-50 rounded px-2">
                            <span className="font-bold">Lợi nhuận ròng:</span>
                            <span className="font-bold text-blue-600">{totalProfit.toLocaleString()} đ</span>
                        </div>
                    </div>
                </div>

                {/* Top Selling Items */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-4">🏆 Top Sản Phẩm Bán Chạy</h3>
                    {topItems.length === 0 ? (
                        <p className="text-gray-400 text-center py-4">Chưa có dữ liệu</p>
                    ) : (
                        <div className="space-y-2">
                            {topItems.map((item, i) => (
                                <div key={i} className="flex justify-between items-center py-2 border-b last:border-0">
                                    <div className="flex items-center gap-2">
                                        <span className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${i === 0 ? 'bg-yellow-500' : i === 1 ? 'bg-gray-400' : i === 2 ? 'bg-orange-400' : 'bg-gray-300'
                                            }`}>{i + 1}</span>
                                        <span className="text-sm truncate max-w-[150px]">{item.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-bold text-sm">{item.revenue.toLocaleString()} đ</div>
                                        <div className="text-xs text-gray-500">{item.qty} sp</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Low Stock Warning */}
                <div className="bg-white rounded-xl shadow-sm p-5">
                    <h3 className="font-bold text-gray-800 mb-4">⚠️ Cảnh Báo Tồn Kho</h3>
                    {lowStockItems.length === 0 ? (
                        <div className="text-center py-4">
                            <span className="text-green-500 text-4xl">✓</span>
                            <p className="text-gray-500 mt-2">Tồn kho đầy đủ</p>
                        </div>
                    ) : (
                        <div className="space-y-2 max-h-48 overflow-y-auto">
                            {lowStockItems.map(item => (
                                <div key={item.id} className="flex justify-between items-center p-2 bg-red-50 rounded">
                                    <span className="text-sm truncate max-w-[150px]">{item.name}</span>
                                    <span className="text-red-600 font-bold text-sm">
                                        Còn {item.quantity}/{item.minStock}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Daily Revenue Table */}
            <div className="bg-white rounded-xl shadow-sm p-5">
                <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <Calendar size={18} /> Doanh Thu Theo Ngày
                </h3>
                {Object.keys(dailyRevenue).length === 0 ? (
                    <p className="text-gray-400 text-center py-4">Chưa có dữ liệu trong tháng này</p>
                ) : (
                    <div className="grid grid-cols-7 gap-2">
                        {Object.entries(dailyRevenue).sort((a, b) => {
                            const dateA = a[0].split('/').reverse().join('');
                            const dateB = b[0].split('/').reverse().join('');
                            return dateA.localeCompare(dateB);
                        }).map(([day, revenue]) => (
                            <div key={day} className="p-3 bg-gray-50 rounded text-center">
                                <div className="text-xs text-gray-500">{day}</div>
                                <div className="font-bold text-green-600 text-sm mt-1">
                                    {(revenue / 1000).toFixed(0)}k
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
