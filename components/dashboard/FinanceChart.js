function FinanceChart({ transactions }) {
  const chartRef = React.useRef(null);
  const [chartInstance, setChartInstance] = React.useState(null);

  React.useEffect(() => {
    try {
      // Nettoyer le graphique précédent s'il existe
      if (chartInstance) {
        chartInstance.destroy();
      }

      // Préparer les données
      const months = ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin', 'Juil', 'Août', 'Sep', 'Oct', 'Nov', 'Déc'];
      const currentYear = new Date().getFullYear();
      
      const revenuesByMonth = new Array(12).fill(0);
      const expensesByMonth = new Array(12).fill(0);

      transactions.forEach(transaction => {
        const date = new Date(transaction.date);
        if (date.getFullYear() === currentYear) {
          const month = date.getMonth();
          if (transaction.type === 'revenu') {
            revenuesByMonth[month] += transaction.amount;
          } else {
            expensesByMonth[month] += transaction.amount;
          }
        }
      });

      const ctx = document.getElementById('financeChart').getContext('2d');
      
      // Configuration du thème sombre pour Chart.js
      Chart.defaults.color = '#a0aec0';
      Chart.defaults.scale.grid.color = 'rgba(255, 255, 255, 0.1)';

      const newChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
          labels: months,
          datasets: [
            {
              label: 'Revenus',
              data: revenuesByMonth,
              borderColor: '#48bb78',
              backgroundColor: 'rgba(72, 187, 120, 0.1)',
              fill: true,
              tension: 0.4
            },
            {
              label: 'Dépenses',
              data: expensesByMonth,
              borderColor: '#e53e3e',
              backgroundColor: 'rgba(229, 62, 62, 0.1)',
              fill: true,
              tension: 0.4
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          interaction: {
            intersect: false,
            mode: 'index'
          },
          scales: {
            y: {
              beginAtZero: true,
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              },
              ticks: {
                callback: function(value) {
                  return value + ' €';
                }
              }
            },
            x: {
              grid: {
                color: 'rgba(255, 255, 255, 0.1)'
              }
            }
          },
          plugins: {
            legend: {
              position: 'bottom'
            },
            tooltip: {
              backgroundColor: 'rgba(0, 0, 0, 0.8)',
              titleColor: '#fff',
              bodyColor: '#fff',
              callbacks: {
                label: function(context) {
                  return context.dataset.label + ': ' + context.parsed.y + ' €';
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
  }, [transactions]);

  return (
    <div data-name="finance-chart" className="h-64">
      <canvas id="financeChart"></canvas>
    </div>
  );
}
