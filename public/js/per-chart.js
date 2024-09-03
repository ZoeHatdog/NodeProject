async function fetchChartData(chartID) {
    try {
        const response = await fetch(`/per-chart-data?chartID=${chartID}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let labels = [];
        let datasets = [];

        // Initialize the data structure for grouping
        let groupedData = {};
        let allLabels = new Set();

        if (chartID === 'chart1') {
            data.forEach(item => {
                if (!groupedData[item.Department]) {
                    groupedData[item.Department] = {};
                }
                groupedData[item.Department][item.educational_attainment] = item.count;
                allLabels.add(item.educational_attainment);
            });
            labels = Array.from(allLabels);
        } else if (chartID === 'chart2') {
            data.forEach(item => {
                if (!groupedData[item.Department]) {
                    groupedData[item.Department] = {};
                }
                groupedData[item.Department][item.job_grade] = item.count;
                allLabels.add(item.job_grade);
            });
            labels = Array.from(allLabels);
        } else if (chartID === 'chart3') {
            data.forEach(item => {
                if (!groupedData[item.Department]) {
                    groupedData[item.Department] = {};
                }
                groupedData[item.Department][item.job_lvl] = item.count;
                allLabels.add(item.job_lvl);
            });
            labels = Array.from(allLabels);
        }

        // Create the datasets for the chart
        datasets = Object.keys(groupedData).map(department => {
            return {
                label: department,
                data: labels.map(label => groupedData[department][label] || 0), // Set to 0 if the label is missing
                backgroundColor: `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, ${Math.floor(Math.random() * 255)}, 0.5)`
            };
        });

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
