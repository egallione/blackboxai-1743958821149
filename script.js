// Shared variables
let currentEquation = '';
let equationResult = '';

// DOM Elements
const equationInput = document.getElementById('equation');
const solveBtn = document.getElementById('solveBtn');
const resultDiv = document.getElementById('result');
const solutionPre = document.getElementById('solution');
const chartBtn = document.getElementById('chartBtn');
const errorDiv = document.getElementById('error');
const errorMessage = document.getElementById('errorMessage');
const backBtn = document.getElementById('backBtn');
const chartCanvas = document.getElementById('equationChart');

// Initialize the app based on current page
if (solveBtn) {
    // Index page initialization
    solveBtn.addEventListener('click', solveEquation);
    chartBtn.addEventListener('click', goToChartPage);
} else if (backBtn) {
    // Chart page initialization
    backBtn.addEventListener('click', goBackToSolver);
    generateChart();
}

// Equation solving function
function solveEquation() {
    try {
        const equation = equationInput.value.trim();
        if (!equation) {
            throw new Error('Please enter an equation');
        }

        // Solve the equation
        const result = math.evaluate(equation);
        currentEquation = equation;
        equationResult = result;

        // Display results
        solutionPre.textContent = `${equation} = ${result}`;
        resultDiv.classList.remove('hidden');
        errorDiv.classList.add('hidden');

        // Store in localStorage
        localStorage.setItem('currentEquation', equation);
        localStorage.setItem('equationResult', result);

    } catch (err) {
        showError(err.message);
    }
}

// Chart generation function
function generateChart() {
    try {
        const equation = localStorage.getItem('currentEquation');
        if (!equation) {
            throw new Error('No equation found');
        }

        // Prepare data points
        const data = [];
        for (let x = -10; x <= 10; x += 0.2) {
            try {
                const y = math.evaluate(equation, {x});
                data.push({x, y});
            } catch (err) {
                // Skip points that can't be evaluated
            }
        }

        // Create chart
        new Chart(chartCanvas, {
            type: 'line',
            data: {
                datasets: [{
                    label: `y = ${equation}`,
                    data: data,
                    borderColor: 'rgb(99, 102, 241)',
                    backgroundColor: 'rgba(99, 102, 241, 0.1)',
                    borderWidth: 2,
                    tension: 0.1
                }]
            },
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: 'linear',
                        position: 'center'
                    },
                    y: {
                        type: 'linear',
                        position: 'center'
                    }
                }
            }
        });

    } catch (err) {
        alert(err.message);
    }
}

// Navigation functions
function goToChartPage() {
    window.location.href = 'chart.html';
}

function goBackToSolver() {
    window.location.href = 'index.html';
}

// Error handling
function showError(message) {
    errorMessage.textContent = message;
    errorDiv.classList.remove('hidden');
    resultDiv.classList.add('hidden');
}