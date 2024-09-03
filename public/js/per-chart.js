// Function to fetch data and create a chart
async function fetchChartData(chartID) {
    try {
        const response = await fetch(`/per-chart-data?chartID=${chartID}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();

        let seriesData = [];
        let categories = [];

        if (chartID === 'chart1') {
            const groupedData = data.reduce((acc, item) => {
                acc[item.Department] = acc[item.Department] || [];
                acc[item.Department].push({ x: item.educational_attainment, y: item.count });
                return acc;
            }, {});

            seriesData = Object.keys(groupedData).map(department => ({
                name: department,
                data: groupedData[department]
            }));
            categories = [...new Set(data.map(item => item.educational_attainment))];
        } else if (chartID === 'chart2') {
            const groupedData = data.reduce((acc, item) => {
                acc[item.Department] = acc[item.Department] || [];
                acc[item.Department].push({ x: item.job_grade, y: item.count });
                return acc;
            }, {});

            seriesData = Object.keys(groupedData).map(department => ({
                name: department,
                data: groupedData[department]
            }));
            categories = [...new Set(data.map(item => item.job_grade))];
        }

        createChart(chartID, seriesData, categories);
    } catch (error) {
        console.error('Error fetching chart data:', error);
    }
}

// Function to create a chart using ApexCharts
function createChart(chartID, seriesData, categories) {
    const options = {
        chart: {
            type: 'bar',
            height: chartID === 'chart1' ? 300 : 400, // Adjust height for chart1
            width: chartID === 'chart1' ? '80%' : '100%', // Adjust width for chart1
            zoom: {
                enabled: chartID === 'chart1' // Enable zoom for chart1
            }
        },
        series: seriesData,
        xaxis: {
            categories: categories
        },
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: chartID === 'chart1' ? '60%' : '70%' // Adjust column width for chart1
            }
        },
        title: {
            text: chartID === 'chart1' ? 'Educational Attainment by Department (Zoomed Out)' : 'Job Grade by Department'
        }
    };

    const chart = new ApexCharts(document.querySelector(`#${chartID}`), options);
    chart.render();
}

// Fetch and render charts
fetchChartData('chart1');
fetchChartData('chart2');
