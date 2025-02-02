function FinanceReports({ type, transactions, period }) {
  const calculateTotal = (type) => {
    try {
      return transactions
        .filter(t => t.type === type)
        .reduce((sum, t) => sum + t.amount, 0);
    } catch (error) {
      reportError(error);
      return 0;
    }
  };

  const renderReport = () => {
    switch(type) {
      case 'income':
        return (
          <div className="text-green-500 text-2xl font-bold">
            {formatCurrency(calculateTotal('revenu'))}
          </div>
        );
      case 'expense':
        return (
          <div className="text-red-500 text-2xl font-bold">
            {formatCurrency(calculateTotal('depense'))}
          </div>
        );
      case 'balance':
        const balance = calculateTotal('revenu') - calculateTotal('depense');
        return (
          <div className={`text-2xl font-bold ${balance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
            {formatCurrency(balance)}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div data-name="finance-reports" className="space-y-4">
      {renderReport()}
      <div className="text-sm text-gray-400">
        Période: {formatPeriod(period)}
      </div>
    </div>
  );
}
