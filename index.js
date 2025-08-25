function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function getNum(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function calculate() {
    const income = getNum('income');

    // ค่ารายจ่ายแต่ละรายการ
    const foodMin = getNum('foodMin'), foodMax = getNum('foodMax');
    const transportMin = getNum('transportMin'), transportMax = getNum('transportMax');
    const waterMin = getNum('waterMin'), waterMax = getNum('waterMax');
    const electricMin = getNum('electricMin'), electricMax = getNum('electricMax');

    // รายจ่ายรวมแบบต่ำสุด และ สูงสุด
    const minExpense = foodMin + transportMin + waterMin + electricMin;
    const maxExpense = foodMax + transportMax + waterMax + electricMax;

    // เงินออมต่อเดือน
    const savingMin = income - maxExpense; // กรณีรายจ่ายสูง
    const savingMax = income - minExpense; // กรณีรายจ่ายต่ำ

    // อัตราดอกเบี้ย
    const bank = document.querySelector('input[name="bank"]:checked').value;
    let rate = 0.02;
    if (bank === 'B') rate = 0.03;
    if (bank === 'C') rate = 0.04;

    // คำนวณรวม 3 ปี
    const years = 3;
    const totalMin = savingMin * 12 * years;
    const totalMax = savingMax * 12 * years;

    const finalMin = totalMin * Math.pow(1 + rate, years);
    const finalMax = totalMax * Math.pow(1 + rate, years);

    document.getElementById('output').innerHTML = `
        <h3>📉 กรณีรายจ่ายสูงสุด (เงินออมน้อยที่สุด)</h3>
        <p>เงินออมต่อเดือน: <b>${savingMin.toFixed(2)} บาท</b></p>
        <p>รวมเงินต้น 3 ปี: <b>${totalMin.toFixed(2)} บาท</b></p>
        <p>รวมเมื่อคิดดอกเบี้ย ${rate * 100}% ต่อปี: <b>${finalMin.toFixed(2)} บาท</b></p>

        <hr>

        <h3>📈 กรณีรายจ่ายต่ำสุด (เงินออมมากที่สุด)</h3>
        <p>เงินออมต่อเดือน: <b>${savingMax.toFixed(2)} บาท</b></p>
        <p>รวมเงินต้น 3 ปี: <b>${totalMax.toFixed(2)} บาท</b></p>
        <p>รวมเมื่อคิดดอกเบี้ย ${rate * 100}% ต่อปี: <b>${finalMax.toFixed(2)} บาท</b></p>
    `;

    goToPage('resultPage');
}
