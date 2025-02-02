function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = React.useState('dashboard');
  const { error, clearError } = useError();
  const { isLoading } = useLoading();

  // Redirect to login if not authenticated
  if (!user) {
    return <LoginPage />;
  }

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    if (isLoading) {
      return <Loading />;
    }

    switch(currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'properties':
        return <Properties />;
      case 'tenants':
        return <Tenants />;
      case 'finances':
        return <Finances />;
      case 'documents':
        return <DocumentManager />;
      case 'taxes':
        return <TaxSimulation />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div data-name="app" className="min-h-screen bg-gray-900 text-white">
      <Sidebar currentPage={currentPage} onPageChange={handlePageChange} />
      <div className="ml-64">
        <Header />
        <main className="p-6">
          {error && (
            <Alert 
              type="error" 
              message={error} 
              onClose={clearError}
            />
          )}
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>
    <App />
  </div>
);
