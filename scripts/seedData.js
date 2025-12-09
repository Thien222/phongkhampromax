// ====== COPY TẤT CẢ CODE NÀY VÀO BROWSER CONSOLE (F12) ======

(function () {
    const vietnameseNames = ['Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em', 'Vũ Quang Phú', 'Đặng Thị Giang', 'Bùi Văn Hùng', 'Đỗ Thị Lan', 'Ngô Đình Khoa', 'Dương Thị Mai', 'Lý Văn Nam', 'Trịnh Thị Oanh', 'Phan Quốc Phong', 'Hồ Thị Quế', 'Võ Văn Rồng', 'Mai Thị Sen', 'Cao Đức Tài', 'Lưu Thị Uyên', 'Đinh Văn Việt'];
    const addresses = ['Thị trấn Vĩnh Thuận, Kiên Giang', '123 Trần Hưng Đạo, Rạch Giá', '45 Nguyễn Trãi, An Biên', '78 Lý Thường Kiệt, Vĩnh Long', '56 Hùng Vương, Tân Châu, An Giang', '12 Nguyễn Du, Long Xuyên', '89 Lê Lợi, Châu Thành, An Giang', '34 Pasteur, Cần Thơ', '67 Hai Bà Trưng, Ninh Kiều', '23 Võ Văn Tần, Sóc Trăng'];
    const reasons = ['Mờ mắt xa', 'Nhức mắt', 'Thay kính mới', 'Khám định kỳ', 'Đau đầu khi nhìn gần', 'Mỏi mắt khi làm việc'];
    const lensTypes = ['Đơn tròng - nhìn xa', 'Đơn tròng - nhìn gần', 'Hai tròng', 'Đa tròng lũy tiến'];
    const randomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
    const randomPhone = () => ['091', '093', '097', '098'][randomBetween(0, 3)] + randomBetween(1000000, 9999999);
    const randomVA = () => ['10/10', '9/10', '8/10', '7/10', '6/10'][randomBetween(0, 4)];
    const randomSph = () => { const v = (randomBetween(-60, 40) / 10).toFixed(2); return parseFloat(v) >= 0 ? '+' + v : v; };
    const randomCyl = () => { const v = (randomBetween(-30, 0) / 10).toFixed(2); return v === '0.00' ? '' : v; };

    const patients = vietnameseNames.map((name, i) => {
        const isComplete = Math.random() > 0.3;
        const p = {
            id: crypto.randomUUID(),
            ticketNumber: i + 1,
            fullName: name,
            dob: randomBetween(1955, 2010),
            phone: randomPhone(),
            address: addresses[i % 10],
            gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
            reason: reasons[randomBetween(0, 5)],
            hasGlasses: Math.random() > 0.4,
            initialVA: { od: randomVA(), os: randomVA() },
            notes: '',
            status: isComplete ? 'completed' : ['waiting_refraction', 'waiting_doctor'][randomBetween(0, 1)],
            timestamp: Date.now() - randomBetween(0, 30) * 86400000
        };

        if (isComplete) {
            p.refraction = {
                skiascopy: {
                    od: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: '' },
                    os: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: '' },
                    cycloplegia: Math.random() > 0.7
                },
                subjective: {
                    od: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: randomVA() },
                    os: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: randomVA() }
                },
                finalRx: {
                    od: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: '10/10', add: Math.random() > 0.6 ? '+1.50' : '' },
                    os: { sph: randomSph(), cyl: randomCyl(), axis: randomBetween(0, 180).toString(), va: '10/10', add: Math.random() > 0.6 ? '+1.50' : '' },
                    lensType: lensTypes[randomBetween(0, 3)],
                    distance: true,
                    near: Math.random() > 0.5
                },
                note: ''
            };
        }
        return p;
    });

    const inventory = [
        { id: crypto.randomUUID(), code: 'TR001', category: 'lens', name: 'Essilor Single Vision 1.56', price: 500000, quantity: 50, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TR002', category: 'lens', name: 'Essilor Single Vision 1.61', price: 800000, quantity: 40, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TR003', category: 'lens', name: 'Essilor Single Vision 1.67', price: 1200000, quantity: 30, minStock: 5 },
        { id: crypto.randomUUID(), code: 'TR004', category: 'lens', name: 'Hoya Sync III 1.56', price: 2500000, quantity: 20, minStock: 5 },
        { id: crypto.randomUUID(), code: 'TR005', category: 'lens', name: 'Chemi U6 AS 1.56', price: 350000, quantity: 80, minStock: 20 },
        { id: crypto.randomUUID(), code: 'TR006', category: 'lens', name: 'Chemi U6 AS 1.61', price: 550000, quantity: 60, minStock: 15 },
        { id: crypto.randomUUID(), code: 'GO001', category: 'frame', name: 'Rayban RB5154', price: 1800000, quantity: 10, minStock: 3 },
        { id: crypto.randomUUID(), code: 'GO002', category: 'frame', name: 'Oakley OX8046', price: 2400000, quantity: 8, minStock: 2 },
        { id: crypto.randomUUID(), code: 'GO003', category: 'frame', name: 'Gọng nhựa GT01', price: 250000, quantity: 30, minStock: 10 },
        { id: crypto.randomUUID(), code: 'GO004', category: 'frame', name: 'Gọng kim loại KL02', price: 350000, quantity: 25, minStock: 8 },
        { id: crypto.randomUUID(), code: 'GO005', category: 'frame', name: 'Gọng titan TT03', price: 850000, quantity: 15, minStock: 5 },
        { id: crypto.randomUUID(), code: 'TH001', category: 'medicine', name: 'Tobradex (5ml)', price: 120000, quantity: 50, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TH002', category: 'medicine', name: 'Refresh Tears (15ml)', price: 85000, quantity: 60, minStock: 15 },
        { id: crypto.randomUUID(), code: 'TH003', category: 'medicine', name: 'Systane Ultra (10ml)', price: 180000, quantity: 40, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TH004', category: 'medicine', name: 'Nước mắt nhân tạo', price: 45000, quantity: 100, minStock: 25 }
    ];

    const invoices = patients.filter(p => p.status === 'completed').map(p => {
        const lens = inventory.filter(i => i.category === 'lens')[randomBetween(0, 5)];
        const frame = inventory.filter(i => i.category === 'frame')[randomBetween(0, 4)];
        const items = [{ itemId: lens.id, name: lens.name, quantity: 2, price: lens.price, isLens: true }];
        if (Math.random() > 0.4) items.push({ itemId: frame.id, name: frame.name, quantity: 1, price: frame.price });
        const subtotal = items.reduce((s, i) => s + i.quantity * i.price, 0);
        return {
            id: crypto.randomUUID(),
            patientId: p.id,
            patientName: p.fullName,
            items,
            subtotal,
            discount: Math.random() > 0.8 ? 100000 : 0,
            surcharge: 0,
            total: subtotal - (Math.random() > 0.8 ? 100000 : 0),
            date: p.timestamp
        };
    });

    localStorage.setItem('eyeclinic_patients', JSON.stringify(patients));
    localStorage.setItem('eyeclinic_inventory', JSON.stringify(inventory));
    localStorage.setItem('eyeclinic_invoices', JSON.stringify(invoices));

    console.log('✅ Đã tạo ' + patients.length + ' bệnh nhân');
    console.log('✅ Đã tạo ' + inventory.length + ' sản phẩm trong kho');
    console.log('✅ Đã tạo ' + invoices.length + ' hóa đơn');
    console.log('🔄 Hãy refresh trang (F5) để thấy dữ liệu mới!');

    alert('Đã tạo dữ liệu mẫu thành công!\n\n' + patients.length + ' bệnh nhân\n' + inventory.length + ' sản phẩm\n' + invoices.length + ' hóa đơn\n\nNhấn OK và F5 để refresh trang.');
})();
