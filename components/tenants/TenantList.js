function TenantList({ tenants, onSelect }) {
  return (
    <div data-name="tenant-list" className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left bg-gray-800">
            <th className="p-4">Nom</th>
            <th className="p-4">Bien</th>
            <th className="p-4">Loyer</th>
            <th className="p-4">Contact</th>
            <th className="p-4">Fin du bail</th>
            <th className="p-4">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tenants.map(tenant => (
            <tr key={tenant.id} className="border-t border-gray-700">
              <td className="p-4">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-700 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-user text-gray-400"></i>
                  </div>
                  {tenant.name}
                </div>
              </td>
              <td className="p-4">{tenant.property}</td>
              <td className="p-4">{tenant.rentAmount}</td>
              <td className="p-4">
                <div className="space-y-1">
                  <div>{tenant.email}</div>
                  <div className="text-sm text-gray-400">{tenant.phone}</div>
                </div>
              </td>
              <td className="p-4">{formatDate(tenant.leaseEnd)}</td>
              <td className="p-4">
                <Button icon="eye" variant="secondary" size="sm" onClick={() => onSelect(tenant)} className="mr-2">
                  Voir
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
