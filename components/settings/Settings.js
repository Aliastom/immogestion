function Settings() {
  const [personalInfo, setPersonalInfo] = React.useState({
    maritalStatus: 'single',
    children: 0,
    salary: 0,
    perContribution: 0,
    withholding: 0
  });
  const [showPersonalForm, setShowPersonalForm] = React.useState(false);
  const [accounts, setAccounts] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [showAddAccount, setShowAddAccount] = React.useState(false);

  React.useEffect(() => {
    // Charger les informations personnelles sauvegardées
    const savedInfo = localStorage.getItem('personalInfo');
    if (savedInfo) {
      setPersonalInfo(JSON.parse(savedInfo));
    }

    // Charger les comptes bancaires
    if (localStorage.getItem('nordigen_token')) {
      fetchAccounts();
    }
  }, []);

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://ob.nordigen.com/api/v2/accounts', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('nordigen_token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
      }
      
      const data = await response.json();
      setAccounts(data.accounts);
    } catch (error) {
      reportError(error);
      setError("Erreur lors de la récupération des comptes");
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePersonalInfo = (formData) => {
    try {
      setPersonalInfo(formData);
      localStorage.setItem('personalInfo', JSON.stringify(formData));
      setShowPersonalForm(false);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <div data-name="settings" className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Paramètres</h2>
      </div>

      {error && (
        <Alert type="error" message={error} onClose={() => setError(null)} />
      )}

      {/* Informations personnelles */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Informations personnelles</h3>
          <Button
            variant="primary"
            icon="edit"
            onClick={() => setShowPersonalForm(true)}
          >
            Modifier
          </Button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-gray-400 mb-1">Situation matrimoniale</p>
            <p className="font-medium">
              {personalInfo.maritalStatus === 'single' ? 'Célibataire' : 'Marié(e)/Pacsé(e)'}
            </p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Nombre d'enfants</p>
            <p className="font-medium">{personalInfo.children}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Salaire annuel</p>
            <p className="font-medium">{formatCurrency(personalInfo.salary)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Cotisation PER</p>
            <p className="font-medium">{formatCurrency(personalInfo.perContribution)}</p>
          </div>
          <div>
            <p className="text-gray-400 mb-1">Prélèvement à la source mensuel</p>
            <p className="font-medium">{formatCurrency(personalInfo.withholding)}</p>
          </div>
        </div>
      </div>

      {/* Comptes bancaires */}
      <div className="bg-gray-800 rounded-lg p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold">Comptes bancaires connectés</h3>
          <Button
            variant="primary"
            icon="plus"
            onClick={() => setShowAddAccount(true)}
          >
            Connecter un compte
          </Button>
        </div>
        
        {loading ? (
          <Loading />
        ) : accounts.length > 0 ? (
          <div className="space-y-4">
            {accounts.map(account => (
              <div key={account.id} className="bg-gray-700 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <div>
                    <h4 className="font-medium">{account.institution_name}</h4>
                    <p className="text-sm text-gray-400">IBAN: {account.iban}</p>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon="sync"
                      onClick={() => fetchAccounts()}
                    >
                      Actualiser
                    </Button>
                    <Button
                      variant="danger"
                      size="sm"
                      icon="trash"
                    >
                      Déconnecter
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-sm text-gray-400">
                    Dernier rafraîchissement: {formatDate(account.last_accessed)}
                  </p>
                  <p className="text-lg font-semibold mt-2">{formatCurrency(account.balance)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <i className="fas fa-university text-4xl text-gray-600 mb-4"></i>
            <p className="text-gray-400">Aucun compte bancaire connecté</p>
          </div>
        )}
      </div>

      {/* Modal formulaire informations personnelles */}
      {showPersonalForm && (
        <Modal onClose={() => setShowPersonalForm(false)}>
          <PersonalInfoForm
            initialData={personalInfo}
            onSubmit={handleUpdatePersonalInfo}
            onClose={() => setShowPersonalForm(false)}
          />
        </Modal>
      )}

      {/* Modal connexion compte bancaire */}
      {showAddAccount && (
        <Modal onClose={() => setShowAddAccount(false)}>
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">Connecter un compte Boursorama</h3>
            <p className="text-gray-400">
              La connexion se fait via l'API Nordigen, un service sécurisé et gratuit qui respecte la directive DSP2.
              Vos identifiants bancaires ne sont jamais stockés.
            </p>
            <div className="flex justify-end space-x-4">
              <Button variant="secondary" onClick={() => setShowAddAccount(false)}>
                Annuler
              </Button>
              <Button variant="primary" onClick={() => handleConnect()} loading={loading}>
                Connecter
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
