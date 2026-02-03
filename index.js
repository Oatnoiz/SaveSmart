function goToPage(pageId) {
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

function getNum(id) {
    return parseFloat(document.getElementById(id).value) || 0;
}

function drawChart(finalMin, finalMax) {
    const canvas = document.getElementById('polarChart');
    if (window.polarChart instanceof Chart) {
        window.polarChart.destroy();
    }

    window.polarChart = new Chart(canvas, {
        type: 'pie',
        data: {
            labels: [
                'เงินออมต่ำสุด (รายจ่ายสูง)',
                'เงินออมสูงสุด (รายจ่ายต่ำ)'
            ],
            datasets: [{
                data: [finalMin, finalMax],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(54, 162, 235, 0.6)'
                ]
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
function drawExpenseChart(food, transport, water, electric,over) {
    const canvas = document.getElementById('expenseChart');

    if (window.expenseChart instanceof Chart) {
        window.expenseChart.destroy();
    }

    window.expenseChart = new Chart(canvas, {
        type: 'doughnut',
        data: {
            labels: [
                'ค่าอาหาร',
                'ค่ารถ',
                'ค่าน้ำ',
                'ค่าไฟ',
                'เบ็ดเตล็ด'
            ],
            datasets: [{
                data: [food, transport, water, electric, over],
                backgroundColor: [
                    'rgba(255, 159, 64, 0.7)',
                    'rgba(75, 192, 192, 0.7)',
                    'rgba(153, 102, 255, 0.7)',
                    'rgba(255, 205, 86, 0.7)',
                    'rgba(255, 100, 90, 0.9)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom'
                },
                tooltip: {
                    callbacks: {
                        label: function(ctx) {
                            return ctx.label + ': ' + ctx.raw + ' บาท/เดือน';
                        }
                    }
                }
            }
        }
    });
}

function calculate() {
    const income = getNum('income');

    const foodMin = getNum('foodMin'), foodMax = getNum('foodMax');
    const transportMin = getNum('transportMin'), transportMax = getNum('transportMax');
    const waterMin = getNum('waterMin'), waterMax = getNum('waterMax');
    const electricMin = getNum('electricMin'), electricMax = getNum('electricMax');
    const overMin = getNum('overMin'), overMax = getNum('overMax');

    const minExpense = foodMin + transportMin + waterMin + electricMin+overMin;
    const maxExpense = foodMax + transportMax + waterMax + electricMax+overMax;

    const savingMin = income - maxExpense;
    const savingMax = income - minExpense;

    const bank = document.querySelector('select[name="bank"]').value;
    let rate = 0.005;
    if (bank === 'kbank') rate = 0.0055;
    if (bank === 'scb') rate = 0.005;

    const years = 1;
    const totalMin = savingMin * 12 * years;
    const totalMax = savingMax * 12 * years;

    const finalMin = totalMin * Math.pow(1 + rate, years);
    const finalMax = totalMax * Math.pow(1 + rate, years);

    document.getElementById('output').innerHTML = `
        <div style="display: flex;gap: 24px;align-items: center;justify-content: center;text-align: center;">
            <div>
                <h3>📉 กรณีรายจ่ายสูงสุด</h3>
                เงินเก็บคงเหลือหลังหักค่าใช้จ่าย/เดือน:<b>${savingMin.toFixed(2)} บาท/เดือน</b><br>
                รวมดอกเบี้ย: <b>${finalMin.toFixed(2)} บาท/ปี</b>
            </div>

            <div>
                <h3>📈 กรณีรายจ่ายต่ำสุด</h3>
                เงินเก็บคงเหลือหลังหักค่าใช้จ่าย/เดือน:<b>${savingMax.toFixed(2)} บาท/เดือน</b><br>
                รวมดอกเบี้ย: <b>${finalMax.toFixed(2)} บาท/ปี</b>
            </div>
        </div>

    `;

    goToPage('resultPage');

    setTimeout(() => {
        drawChart(
            Math.max(finalMin, 0),
            Math.max(finalMax, 0)
        );
    }, 300);
    const avgFood = (foodMin + foodMax) / 2;
    const avgTransport = (transportMin + transportMax) / 2;
    const avgWater = (waterMin + waterMax) / 2;
    const avgElectric = (electricMin + electricMax) / 2;
    const avgOver = (overMin + overMax) / 2;
    setTimeout(() => {
        drawExpenseChart(
            avgFood,
            avgTransport,
            avgWater,
            avgElectric,
            avgOver
        );
    }, 300);

}
