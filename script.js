// ข้อมูลตั้งต้นจากตาราง [cite: 2]
let livestockData = [
    { name: "สุกร", farmers: 2800, product: 285757, unit: "ตัว", price: 8800, value: 2514.66 },
    { name: "โคเนื้อ", farmers: 5452, product: 61278, unit: "ตัว", price: 25000, value: 1531.95 },
    { name: "กระบือ", farmers: 3143, product: 30800, unit: "ตัว", price: 42000, value: 1293.60 },
    { name: "เป็ด", farmers: 276, product: 707495, unit: "ตัว", price: 300, value: 212.25 },
    { name: "ไก่เนื้อ", farmers: 186, product: 2256772, unit: "ตัว", price: 80, value: 180.54 },
    { name: "ไก่พื้นเมือง", farmers: 32487, product: 1934733, unit: "ตัว", price: 70, value: 135.43 },
    { name: "แพะ", farmers: 456, product: 16878, unit: "ตัว", price: 3500, value: 59.07 },
    { name: "ไข่เป็ด", farmers: 1134, product: 183148194, unit: "ฟอง", price: 5.35, value: 979.84 }
];

// รหัสผ่านสำหรับการแก้ไข (กำหนดไว้เป็น 1234)
const SECRET_CODE = "1234";

let myChart = null;
let isEditing = false;

// ฟังก์ชันเริ่มต้นทำงานเมื่อโหลดหน้าเว็บ
document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    renderChart();
});

// ฟังก์ชันสร้างตาราง
function renderTable(editMode = false) {
    const tbody = document.querySelector('#dataTable tbody');
    tbody.innerHTML = '';

    livestockData.forEach((item, index) => {
        const tr = document.createElement('tr');
        
        // ฟอร์แมตตัวเลขให้สวยงาม (มีลูกน้ำ) ถ้าไม่ใช่โหมดแก้ไข
        const fmt = (num) => num.toLocaleString('th-TH');
        const fmtVal = (num) => num.toLocaleString('th-TH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

        if (editMode) {
            // โหมดแก้ไข: แสดงเป็น Input box
            tr.innerHTML = `
                <td><input type="text" value="${item.name}" id="name-${index}"></td>
                <td><input type="number" value="${item.farmers}" id="farmers-${index}"></td>
                <td><input type="number" value="${item.product}" id="product-${index}"></td>
                <td><input type="text" value="${item.unit}" id="unit-${index}"></td>
                <td><input type="number" value="${item.price}" id="price-${index}"></td>
                <td><input type="number" value="${item.value}" step="0.01" id="value-${index}"></td>
            `;
        } else {
            // โหมดปกติ: แสดงข้อความ
            tr.innerHTML = `
                <td>${item.name}</td>
                <td>${fmt(item.farmers)}</td>
                <td>${fmt(item.product)}</td>
                <td>${item.unit}</td>
                <td>${fmt(item.price)}</td>
                <td style="font-weight:bold; color:#27ae60;">${fmtVal(item.value)}</td>
            `;
        }
        tbody.appendChild(tr);
    });
}

// ฟังก์ชันสร้างกราฟด้วย Chart.js (ปรับปรุงสีแยกตามแท่ง)
function renderChart() {
    const ctx = document.getElementById('myChart').getContext('2d');
    
    // เตรียมข้อมูลสำหรับกราฟ
    const labels = livestockData.map(d => d.name);
    const dataValues = livestockData.map(d => d.value);

    // กำหนดชุดสีสำหรับแต่ละแท่ง (8 สี สำหรับ 8 รายการ)
    const backgroundColors = [
        'rgba(255, 99, 132, 0.7)',   // สุกร (ชมพู)
        'rgba(54, 162, 235, 0.7)',   // โคเนื้อ (ฟ้า)
        'rgba(46, 204, 113, 0.7)',   // กระบือ (เขียว)
        'rgba(255, 206, 86, 0.7)',   // เป็ด (เหลือง)
        'rgba(153, 102, 255, 0.7)',  // ไก่เนื้อ (ม่วง)
        'rgba(255, 159, 64, 0.7)',   // ไก่พื้นเมือง (ส้ม)
        'rgba(230, 126, 34, 0.7)',   // แพะ (ส้มอิฐ)
        'rgba(22, 160, 133, 0.7)'    // ไข่เป็ด (เขียวเข้ม)
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(46, 204, 113, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
        'rgba(230, 126, 34, 1)',
        'rgba(22, 160, 133, 1)'
    ];

    // ถ้ามีกราฟเดิมอยู่ให้ทำลายก่อนสร้างใหม่
    if (myChart) {
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: [{
                label: 'มูลค่า (ล้านบาท)',
                data: dataValues,
                backgroundColor: backgroundColors, // ใช้ Array สีที่กำหนด
                borderColor: borderColors,         // ใช้ Array สีขอบที่กำหนด
                borderWidth: 1,
                borderRadius: 5,
                barPercentage: 0.6, // ปรับความกว้างแท่งให้ดูพอดี
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'มูลค่า (ล้านบาท)',
                        font: {
                            family: 'Kanit',
                            size: 14
                        }
                    },
                    ticks: {
                        font: {
                            family: 'Kanit'
                        }
                    }
                },
                x: {
                    ticks: {
                        font: {
                            family: 'Kanit',
                            size: 12
                        }
                    }
                }
            },
            plugins: {
                legend: {
                    display: false // ซ่อน Legend ด้านบนเพราะสีต่างกันแล้ว ดูชื่อที่แกน X แทน
                },
                tooltip: {
                    titleFont: { family: 'Kanit' },
                    bodyFont: { family: 'Kanit' },
                    callbacks: {
                        label: function(context) {
                            let label = context.dataset.label || '';
                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += context.parsed.y.toLocaleString('th-TH') + ' ล้านบาท';
                            }
                            return label;
                        }
                    }
                }
            }
        }
    });
}

// ฟังก์ชันเปิดโหมดแก้ไข (ตรวจสอบรหัสผ่าน)
function toggleEditMode() {
    const password = prompt("กรุณากรอกรหัสผ่านเพื่อแก้ไขข้อมูล:", "");
    
    if (password === SECRET_CODE) {
        isEditing = true;
        document.getElementById('editBtn').classList.add('hidden');
        document.getElementById('saveBtn').classList.remove('hidden');
        document.getElementById('cancelBtn').classList.remove('hidden');
        renderTable(true); // สร้างตารางใหม่ในโหมด Edit
    } else if (password !== null) {
        alert("รหัสผ่านไม่ถูกต้อง!");
    }
}

// ฟังก์ชันบันทึกข้อมูล
function saveData() {
    // ดึงค่าจาก Input ทั้งหมดมาอัปเดต Array
    const newData = livestockData.map((_, index) => {
        return {
            name: document.getElementById(`name-${index}`).value,
            farmers: parseFloat(document.getElementById(`farmers-${index}`).value),
            product: parseFloat(document.getElementById(`product-${index}`).value),
            unit: document.getElementById(`unit-${index}`).value,
            price: parseFloat(document.getElementById(`price-${index}`).value),
            value: parseFloat(document.getElementById(`value-${index}`).value)
        };
    });

    livestockData = newData; // อัปเดตข้อมูลหลัก
    exitEditMode();
    renderChart(); // อัปเดตกราฟทันที
    alert("บันทึกข้อมูลเรียบร้อยแล้ว!");
}

// ฟังก์ชันยกเลิก
function cancelEdit() {
    exitEditMode();
}

// ออกจากโหมดแก้ไขกลับสู่ปกติ
function exitEditMode() {
    isEditing = false;
    document.getElementById('editBtn').classList.remove('hidden');
    document.getElementById('saveBtn').classList.add('hidden');
    document.getElementById('cancelBtn').classList.add('hidden');
    renderTable(false);
}