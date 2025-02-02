function LoginPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });
  const [showSignUp, setShowSignUp] = React.useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      
      const { data: { user }, error } = await window.supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (error) throw error;

      // Redirection automatique gérée par le AuthProvider
    } catch (error) {
      console.error('Erreur de connexion:', error.message);
      setError(error.message === 'Invalid login credentials'
        ? 'Email ou mot de passe incorrect'
        : 'Erreur lors de la connexion. Veuillez réessayer.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      const { data: { user }, error } = await window.supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: '',
            last_name: '',
            account_type: 'individual'
          }
        }
      });

      if (error) throw error;

      setError('Vérifiez votre email pour confirmer votre inscription.');
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message);
      setError('Erreur lors de l\'inscription. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div data-name="login-page" className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="bg-gray-800 p-8 rounded-lg shadow-xl max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">ImmoGestion</h1>
          <p className="text-gray-400">
            {showSignUp ? 'Créez votre compte' : 'Connectez-vous à votre compte'}
          </p>
        </div>

        {error && (
          <Alert
            type="error"
            message={error}
            onClose={() => setError(null)}
            className="mb-6"
          />
        )}

        <form onSubmit={showSignUp ? handleSignUp : handleSignIn} className="space-y-4">
          <Input
            label="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="Entrez votre email"
          />

          <Input
            label="Mot de passe"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            placeholder="Entrez votre mot de passe"
          />

          {!showSignUp && (
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  className="form-checkbox h-4 w-4 text-purple-600 bg-gray-700 border-gray-600"
                />
                <span className="ml-2 text-gray-400">Se souvenir de moi</span>
              </label>
              <a href="#" className="text-purple-400 hover:text-purple-300">
                Mot de passe oublié ?
              </a>
            </div>
          )}

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            {showSignUp ? 'S\'inscrire' : 'Se connecter'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          {showSignUp ? (
            <>
              Déjà un compte ?{' '}
              <button
                onClick={() => setShowSignUp(false)}
                className="text-purple-400 hover:text-purple-300"
              >
                Se connecter
              </button>
            </>
          ) : (
            <>
              Pas encore de compte ?{' '}
              <button
                onClick={() => setShowSignUp(true)}
                className="text-purple-400 hover:text-purple-300"
              >
                S'inscrire
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
