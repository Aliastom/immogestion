function TenantDetail({ tenant, onUpdate }) {
  return (
    <div data-name="tenant-detail" className="space-y-6">
      <div className="flex items-center space-x-4">
        <div className="h-16 w-16 bg-gray-700 rounded-full flex items-center justify-center">
          <i className="fas fa-user text-2xl text-gray-400"></i>
        </div>
        <div>
          <h2 className="text-xl font-semibold">{tenant.name}</h2>
          <p className="text-gray-400">{tenant.property}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Email</h3>
          <p>{tenant.email}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Téléphone</h3>
          <p>{tenant.phone}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Début du bail</h3>
          <p>{formatDate(tenant.leaseStart)}</p>
        </div>
        <div className="bg-gray-700 rounded-lg p-4">
          <h3 className="text-sm text-gray-400 mb-1">Fin du bail</h3>
          <p>{formatDate(tenant.leaseEnd)}</p>
        </div>
      </div>

      <div className="bg-gray-700 rounded-lg p-4">
        <h3 className="text-sm text-gray-400 mb-1">Loyer mensuel</h3>
        <p className="text-xl font-semibold">{tenant.rentAmount}</p>
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" icon="envelope">
          Contacter
        </Button>
        <Button variant="primary" icon="edit">
          Modifier
        </Button>
      </div>
    </div>
  );
}
