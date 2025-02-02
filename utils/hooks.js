function useStore() {
  const [state, setState] = React.useState(store.state);

  React.useEffect(() => {
    return store.subscribe(newState => {
      setState(newState);
    });
  }, []);

  return state;
}

function useProperties() {
  const state = useStore();
  return {
    properties: state.properties,
    addProperty: store.addProperty.bind(store),
    updateProperty: store.updateProperty.bind(store),
    deleteProperty: store.deleteProperty.bind(store)
  };
}

function useTenants() {
  const state = useStore();
  return {
    tenants: state.tenants,
    addTenant: store.addTenant.bind(store),
    updateTenant: store.updateTenant.bind(store),
    deleteTenant: store.deleteTenant.bind(store)
  };
}

function useTransactions() {
  const state = useStore();
  return {
    transactions: state.transactions,
    addTransaction: store.addTransaction.bind(store),
    updateTransaction: store.updateTransaction.bind(store),
    deleteTransaction: store.deleteTransaction.bind(store)
  };
}

function useDocuments() {
  const state = useStore();
  return {
    documents: state.documents,
    addDocument: store.addDocument.bind(store),
    updateDocument: store.updateDocument.bind(store),
    deleteDocument: store.deleteDocument.bind(store)
  };
}

function useError() {
  const state = useStore();
  return {
    error: state.error,
    setError: store.setError.bind(store),
    clearError: store.clearError.bind(store)
  };
}

function useLoading() {
  const state = useStore();
  return {
    isLoading: state.isLoading,
    setLoading: store.setLoading.bind(store)
  };
}
