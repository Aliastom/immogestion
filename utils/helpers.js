function formatCurrency(amount) {
  try {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount);
  } catch (error) {
    reportError(error);
    return `${amount} €`;
  }
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch (error) {
    reportError(error);
    return dateString;
  }
}

function formatPeriod(period) {
  try {
    const now = new Date();
    switch(period) {
      case 'month':
        return `${now.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`;
      case 'quarter':
        return `${Math.ceil((now.getMonth() + 1) / 3)}e trimestre ${now.getFullYear()}`;
      case 'year':
        return now.getFullYear().toString();
      default:
        return period;
    }
  } catch (error) {
    reportError(error);
    return period;
  }
}

function calculateDateDifference(startDate, endDate) {
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  } catch (error) {
    reportError(error);
    return 0;
  }
}

function getStatusColor(status) {
  const colors = {
    success: 'green',
    warning: 'yellow',
    error: 'red',
    info: 'blue'
  };
  return colors[status] || 'gray';
}
