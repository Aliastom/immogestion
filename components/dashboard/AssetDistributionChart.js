function AssetDistributionChart({ assets }) {
  const chartRef = React.useRef(null);
  const [chartInstance, setChartInstance] = React.useState(null);

  React.useEffect(() => {
    try {
      if (chartInstance) {
        chartInstance.destroy();
      }

      const ctx = document.getElementById('assetDistributionChart').getContext('2d');
      
      const labels = {
        immobilier: 'Immobilier',
        livrets: 'Livrets',
        comptesBancaires: 'Comptes bancaires',
        actionsFonds: 'Actions & fonds',
        emprunts: 'Emprunts'
      };

      const colors = {
        immobilier: '#6c2bd9',
        livrets: '#48bb78',
        comptesBancaires: '#4299e1',
        actionsFonds: '#ed8936',
        emprunts: '#e53e3e'
      };

      const data = Object.entries(assets).map(([key, value]) => ({
        label: labels[key],
        value: Math.abs(value),
        color: colors[key],
        isLiability: value < 0
      }));

      const newChartInstance = new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: data.map(d => d.label),
          datasets: [{
            data: data.map(d => d.value),
            backgroundColor: data.map(d => d.color),
            borderColor: 'rgba(0, 0, 0, 0.1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'bottom',
              labels: {
                color: '#a0aec0'
              }
            },
            tooltip: {
              callbacks: {
                label: function(context) {
                  const dataItem = data[context.dataIndex];
                  const value = formatCurrency(dataItem.value);
                  return `${dataItem.label}: ${dataItem.isLiability ? '-' : ''}${value}`;
                }
              }
            }
          }
        }
      });

      setChartInstance(newChartInstance);
    } catch (error) {
      reportError(error);
    }

    return () => {
      if (chartInstance) {
        chartInstance.destroy();
      }
    };
  }, [assets]);

  return (
    <div data-name="asset-distribution-chart" className="h-64">
      <canvas id="assetDistributionChart"></canvas>
    </div>
  );
}
