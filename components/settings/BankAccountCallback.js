function BankAccountCallback() {
  const [status, setStatus] = React.useState('loading');
  const [error, setError] = React.useState(null);

  React.useEffect(() => {
    const handleCallback = async () => {
      try {
        const params = new URLSearchParams(window.location.search);
        const ref = params.get('ref');

        if (!ref) {
          throw new Error('Référence manquante');
        }

        // Récupération du token d'accès
        const response = await fetch('https://ob.nordigen.com/api/v2/requisitions/' + ref, {
          headers: {
            'Authorization': `Bearer ${process.env.NORDIGEN_SECRET_ID}`
          }
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}. description: ${await response.text()}`);
        }

        const data = await response.json();
        
        // Sauvegarde du token
        localStorage.setItem('nordigen_token', data.accounts[0]);
        
        setStatus('success');
        // Redirection vers les paramètres après 3 secondes
        setTimeout(() => {
          window.location.href = '/settings';
        }, 3000);
      } catch (error) {
        reportError(error);
        setStatus('error');
        setError(error.message);
      }
    };

    handleCallback();
  }, []);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-gray-800 p-8 rounded-lg max-w-md w-full">
        {status === 'loading' && (
          <div className="text-center">
            <Loading />
            <p className="mt-4 text-gray-400">Connexion en cours...</p>
          </div>
        )}

        {status === 'success' && (
          <div className="text-center">
            <div className="text-green-500 text-5xl mb-4">
              <i className="fas fa-check-circle"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">Compte connecté avec succès!</h2>
            <p className="text-gray-400">Redirection automatique...</p>
          </div>
        )}

        {status === 'error' && (
          <div className="text-center">
            <div className="text-red-500 text-5xl mb-4">
              <i className="fas fa-exclamation-circle"></i>
            </div>
            <h2 className="text-xl font-semibold mb-2">Erreur de connexion</h2>
            <p className="text-red-400 mb-4">{error}</p>
            <Button variant="primary" onClick={() => window.location.href = '/settings'}>
              Retour aux paramètres
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
