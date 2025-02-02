function Sidebar({ currentPage, onPageChange }) {
  const menuItems = [
    { id: 'dashboard', label: 'Tableau de bord', icon: 'chart-line' },
    { id: 'properties', label: 'Biens immobiliers', icon: 'building' },
    { id: 'tenants', label: 'Locataires', icon: 'users' },
    { id: 'finances', label: 'Finances', icon: 'wallet' },
    { id: 'documents', label: 'Documents', icon: 'folder' },
    { id: 'taxes', label: 'Impôts', icon: 'file-invoice-dollar' },
    { id: 'integrations', label: 'Intégrations', icon: 'plug' },
    { id: 'settings', label: 'Paramètres', icon: 'cog' }
  ];

  return (
    <div data-name="sidebar" className="fixed left-0 top-0 h-full w-64 bg-gray-800 p-4">
      <div data-name="logo" className="mb-8">
        <h1 className="text-2xl font-bold text-white">ImmoGestion</h1>
      </div>
      
      <nav data-name="navigation">
        <ul className="space-y-2">
          {menuItems.map(item => (
            <li key={item.id}>
              <button
                onClick={() => onPageChange(item.id)}
                className={`w-full flex items-center px-4 py-2 rounded transition-colors ${
                  currentPage === item.id
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-300 hover:bg-gray-700'
                }`}
              >
                <i className={`fas fa-${item.icon} mr-3`}></i>
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
