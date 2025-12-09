// Script tạo dữ liệu mẫu cho ứng dụng
// Chạy script này trong browser console hoặc import vào ứng dụng

const vietnameseNames = [
    'Nguyễn Văn An', 'Trần Thị Bình', 'Lê Hoàng Cường', 'Phạm Minh Đức', 'Hoàng Thị Em',
    'Vũ Quang Phú', 'Đặng Thị Giang', 'Bùi Văn Hùng', 'Đỗ Thị Lan', 'Ngô Đình Khoa',
    'Dương Thị Mai', 'Lý Văn Nam', 'Trịnh Thị Oanh', 'Phan Quốc Phong', 'Hồ Thị Quế',
    'Võ Văn Rồng', 'Mai Thị Sen', 'Cao Đức Tài', 'Lưu Thị Uyên', 'Đinh Văn Việt',
    'Nguyễn Thị Xuân', 'Trần Văn Yên', 'Lê Thị Ánh', 'Phạm Văn Bảo', 'Hoàng Thị Chi'
];

const addresses = [
    'Thị trấn Vĩnh Thuận, huyện Vĩnh Thuận, tỉnh Kiên Giang',
    '123 Trần Hưng Đạo, TP. Rạch Giá, Kiên Giang',
    '45 Nguyễn Trãi, huyện An Biên, Kiên Giang',
    '78 Lý Thường Kiệt, TP. Vĩnh Long',
    '56 Hùng Vương, TX. Tân Châu, An Giang',
    '12 Nguyễn Du, TP. Long Xuyên, An Giang',
    '89 Lê Lợi, huyện Châu Thành, An Giang',
    '34 Pasteur, TP. Cần Thơ',
    '67 Hai Bà Trưng, quận Ninh Kiều, Cần Thơ',
    '23 Võ Văn Tần, TP. Sóc Trăng'
];

const reasons = [
    'Mờ mắt xa', 'Nhức mắt', 'Thay kính mới', 'Khám định kỳ',
    'Đau đầu khi nhìn gần', 'Mỏi mắt khi làm việc', 'Khó đọc sách',
    'Đau mắt đỏ', 'Cộm mắt', 'Chói mắt', 'Mắt khô', 'Nhìn đôi'
];

const lensTypes = ['Đơn tròng - nhìn xa', 'Đơn tròng - nhìn gần', 'Hai tròng', 'Đa tròng lũy tiến'];

function randomBetween(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomSph(): string {
    const val = (randomBetween(-80, 60) / 10).toFixed(2);
    return parseFloat(val) >= 0 ? `+${val}` : val;
}

function randomCyl(): string {
    const val = (randomBetween(-40, 0) / 10).toFixed(2);
    return val === '0.00' ? '' : val;
}

function randomAxis(): string {
    return randomBetween(0, 180).toString();
}

function randomVA(): string {
    const options = ['10/10', '9/10', '8/10', '7/10', '6/10', '5/10', '4/10', '3/10'];
    return options[randomBetween(0, options.length - 1)];
}

function randomPhone(): string {
    const prefixes = ['091', '093', '097', '098', '086', '033', '034', '035'];
    return prefixes[randomBetween(0, prefixes.length - 1)] + randomBetween(1000000, 9999999);
}

function generatePatient(index: number, ticketNumber: number): any {
    const name = vietnameseNames[index % vietnameseNames.length];
    const hasGlasses = Math.random() > 0.4;
    const isRefractionComplete = Math.random() > 0.3;

    const daysAgo = randomBetween(0, 30);
    const timestamp = Date.now() - (daysAgo * 24 * 60 * 60 * 1000);

    const statuses = ['waiting_refraction', 'processing_refraction', 'waiting_doctor', 'waiting_billing', 'completed'];
    const status = isRefractionComplete ? 'completed' : statuses[randomBetween(0, 2)];

    const patient: any = {
        id: crypto.randomUUID(),
        ticketNumber,
        fullName: name,
        dob: randomBetween(1950, 2015),
        phone: randomPhone(),
        address: addresses[index % addresses.length],
        gender: Math.random() > 0.5 ? 'Nam' : 'Nữ',
        reason: reasons[randomBetween(0, reasons.length - 1)],
        hasGlasses,
        initialVA: {
            od: randomVA(),
            os: randomVA()
        },
        notes: '',
        status,
        timestamp
    };

    // Thêm dữ liệu khúc xạ nếu đã hoàn thành
    if (isRefractionComplete) {
        patient.refraction = {
            skiascopy: {
                od: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: '' },
                os: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: '' },
                cycloplegia: Math.random() > 0.7
            },
            subjective: {
                od: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: randomVA() },
                os: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: randomVA() }
            },
            finalRx: {
                od: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: '10/10', add: Math.random() > 0.6 ? '+1.50' : '' },
                os: { sph: randomSph(), cyl: randomCyl(), axis: randomAxis(), va: '10/10', add: Math.random() > 0.6 ? '+1.50' : '' },
                lensType: lensTypes[randomBetween(0, lensTypes.length - 1)],
                distance: true,
                near: Math.random() > 0.5
            },
            note: ''
        };
    }

    return patient;
}

function generateInventory(): any[] {
    return [
        // Tròng kính
        { id: crypto.randomUUID(), code: 'TR001', category: 'lens', name: 'Essilor Single Vision 1.56', specs: { material: '1.56', type: 'Single' }, price: 500000, quantity: 50, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TR002', category: 'lens', name: 'Essilor Single Vision 1.61', specs: { material: '1.61', type: 'Single' }, price: 800000, quantity: 40, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TR003', category: 'lens', name: 'Essilor Single Vision 1.67', specs: { material: '1.67', type: 'Single' }, price: 1200000, quantity: 30, minStock: 5 },
        { id: crypto.randomUUID(), code: 'TR004', category: 'lens', name: 'Hoya Sync III 1.56', specs: { material: '1.56', type: 'PAL' }, price: 2500000, quantity: 20, minStock: 5 },
        { id: crypto.randomUUID(), code: 'TR005', category: 'lens', name: 'Zeiss SmartLife 1.67', specs: { material: '1.67', type: 'PAL' }, price: 4500000, quantity: 15, minStock: 3 },
        { id: crypto.randomUUID(), code: 'TR006', category: 'lens', name: 'Chemi U6 AS 1.56', specs: { material: '1.56', type: 'Single' }, price: 350000, quantity: 80, minStock: 20 },
        { id: crypto.randomUUID(), code: 'TR007', category: 'lens', name: 'Chemi U6 AS 1.61', specs: { material: '1.61', type: 'Single' }, price: 550000, quantity: 60, minStock: 15 },

        // Gọng kính
        { id: crypto.randomUUID(), code: 'GO001', category: 'frame', name: 'Rayban RB5154', price: 1800000, quantity: 10, minStock: 3 },
        { id: crypto.randomUUID(), code: 'GO002', category: 'frame', name: 'Oakley OX8046', price: 2400000, quantity: 8, minStock: 2 },
        { id: crypto.randomUUID(), code: 'GO003', category: 'frame', name: 'Silhouette 5515', price: 5500000, quantity: 5, minStock: 2 },
        { id: crypto.randomUUID(), code: 'GO004', category: 'frame', name: 'Gọng nhựa GT01', price: 250000, quantity: 30, minStock: 10 },
        { id: crypto.randomUUID(), code: 'GO005', category: 'frame', name: 'Gọng kim loại KL02', price: 350000, quantity: 25, minStock: 8 },
        { id: crypto.randomUUID(), code: 'GO006', category: 'frame', name: 'Gọng titan TT03', price: 850000, quantity: 15, minStock: 5 },

        // Thuốc
        { id: crypto.randomUUID(), code: 'TH001', category: 'medicine', name: 'Tobradex (5ml)', price: 120000, quantity: 50, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TH002', category: 'medicine', name: 'Refresh Tears (15ml)', price: 85000, quantity: 60, minStock: 15 },
        { id: crypto.randomUUID(), code: 'TH003', category: 'medicine', name: 'Systane Ultra (10ml)', price: 180000, quantity: 40, minStock: 10 },
        { id: crypto.randomUUID(), code: 'TH004', category: 'medicine', name: 'Vigamox (5ml)', price: 150000, quantity: 35, minStock: 8 },
        { id: crypto.randomUUID(), code: 'TH005', category: 'medicine', name: 'Nước mắt nhân tạo', price: 45000, quantity: 100, minStock: 25 }
    ];
}

function generateInvoice(patient: any, inventory: any[], index: number): any {
    const items: any[] = [];

    // Thêm tròng kính (2 mắt)
    const lenses = inventory.filter(i => i.category === 'lens');
    const selectedLens = lenses[randomBetween(0, lenses.length - 1)];
    items.push({
        itemId: selectedLens.id,
        name: selectedLens.name,
        quantity: 2,
        price: selectedLens.price,
        isLens: true
    });

    // Thêm gọng kính (50% chance)
    if (Math.random() > 0.5) {
        const frames = inventory.filter(i => i.category === 'frame');
        const selectedFrame = frames[randomBetween(0, frames.length - 1)];
        items.push({
            itemId: selectedFrame.id,
            name: selectedFrame.name,
            quantity: 1,
            price: selectedFrame.price
        });
    }

    // Thêm thuốc (30% chance)
    if (Math.random() > 0.7) {
        const medicines = inventory.filter(i => i.category === 'medicine');
        const selectedMedicine = medicines[randomBetween(0, medicines.length - 1)];
        items.push({
            itemId: selectedMedicine.id,
            name: selectedMedicine.name,
            quantity: randomBetween(1, 2),
            price: selectedMedicine.price
        });
    }

    const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.price), 0);
    const discount = Math.random() > 0.7 ? randomBetween(1, 5) * 50000 : 0;
    const surcharge = Math.random() > 0.8 ? 100000 : 0;
    const total = subtotal - discount + surcharge;

    const daysAgo = randomBetween(0, 30);

    return {
        id: crypto.randomUUID(),
        patientId: patient.id,
        patientName: patient.fullName,
        items,
        subtotal,
        discount,
        surcharge,
        total,
        date: Date.now() - (daysAgo * 24 * 60 * 60 * 1000)
    };
}

export function seedAllData() {
    // Generate patients
    const patients: any[] = [];
    for (let i = 0; i < 20; i++) {
        patients.push(generatePatient(i, i + 1));
    }

    // Generate inventory
    const inventory = generateInventory();

    // Generate invoices for completed patients
    const invoices: any[] = [];
    const completedPatients = patients.filter(p => p.status === 'completed');
    completedPatients.forEach((patient, index) => {
        invoices.push(generateInvoice(patient, inventory, index));
    });

    // Save to localStorage
    localStorage.setItem('eyeclinic_patients', JSON.stringify(patients));
    localStorage.setItem('eyeclinic_inventory', JSON.stringify(inventory));
    localStorage.setItem('eyeclinic_invoices', JSON.stringify(invoices));

    console.log(`✅ Đã tạo ${patients.length} bệnh nhân`);
    console.log(`✅ Đã tạo ${inventory.length} sản phẩm trong kho`);
    console.log(`✅ Đã tạo ${invoices.length} hóa đơn`);

    return { patients, inventory, invoices };
}

// Export để sử dụng trong console
if (typeof window !== 'undefined') {
    (window as any).seedData = seedAllData;
}
