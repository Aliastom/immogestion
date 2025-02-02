function TransactionList({ transactions }) {
  return (
    <div data-name="transaction-list" className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-800">
            <th className="p-4">Date</th>
            <th className="p-4">Type</th>
            <th className="p-4">Catégorie</th>
            <th className="p-4">Montant</th>
            <th className="p-4">Bien</th>
            <th className="p-4">Description</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.map(transaction => (
            <tr key={transaction.id} className="border-t border-gray-700">
              <td className="p-4">{formatDate(transaction.date)}</td>
              <td className="p-4">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  transaction.type === 'revenu' ? 'bg-green-500' : 'bg-red-500'
                }`}>
                  {transaction.type}
                </span>
              </td>
              <td className="p-4">{transaction.category}</td>
              <td className="p-4">
                <span className={transaction.type === 'revenu' ? 'text-green-500' : 'text-red-500'}>
                  {formatCurrency(transaction.amount)}
                </span>
              </td>
              <td className="p-4">{transaction.property}</td>
              <td className="p-4">{transaction.description}</td>
              <td className="p-4">
                <Button icon="edit" variant="secondary" size="sm" className="mr-2">
                  Modifier
                </Button>
                <Button icon="trash" variant="danger" size="sm">
                  Supprimer
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
