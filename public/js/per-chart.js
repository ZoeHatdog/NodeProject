// Function to fetch data and create a chart
async function fetchChartData(chartID) {
    try {
        const response = await fetch(`/per-chart-data?chartID=${chartID}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let labels = [];
        let datasets = [];

        if (chartID === 'chart1') {
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.Department]) {
                    acc[item.Department] = [];
                }
                acc[item.Department].push(item.count);
                return acc;
            }, {});

            labels = [...new Set(data.map(item => item.educational_attainment))];
            datasets = Object.keys(groupedData).map(department => ({
                label: department,
                data: groupedData[department],
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            }));
        } else if (chartID === 'chart2') {
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.Department]) {
                    acc[item.Department] = [];
                }
                acc[item.Department].push(item.count);
                return acc;
            }, {});

            labels = [...new Set(data.map(item => item.job_grade))];
            datasets = Object.keys(groupedData).map(department => ({
                label: department,
                data: groupedData[department],
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            }));
        } else if (chartID === 'chart3') {
            const groupedData = data.reduce((acc, item) => {
                if (!acc[item.Department]) {
                    acc[item.Department] = [];
                }
                acc[item.Department].push(item.count);
                return acc;
            }, {});

            labels = [...new Set(data.map(item => item.job_lvl))];
            datasets = Object.keys(groupedData).map(department => ({
                label: department,
                data: groupedData[department],
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            }));
        }

        createChart(chartID, labels, datasets);
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Function to create a chart using Chart.js
function createChart(chartID, labels, datasets) {
    const ctx = document.getElementById(chartID).getContext('2d');
    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labels,
            datasets: datasets
        },
        options: {
            scales: {
                x: {
                    beginAtZero: true
                },
                y: {
                    beginAtZero: true
                }
            },
            maintainAspectRatio: chartID === 'chart1' ? false : true, // Adjust aspect ratio for chart1
            responsive: true,
            plugins: {
                title: {
                    display: true,
                    text: chartID === 'chart1' ? 'Educational Attainment by Department (Zoomed Out)' : 
                           chartID === 'chart2' ? 'Job Grade by Department' :
                           'Job Level Classification by Department'
                }
            }
        }
    });
}

// Fetch and render charts
fetchChartData('chart1');
fetchChartData('chart2');
fetchChartData('chart3');
