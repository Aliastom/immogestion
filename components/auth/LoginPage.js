function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await login(formData);
    } catch (error) {
      setError(error.message);
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
            Connectez-vous pour gérer vos biens immobiliers
          </p>
          <p className="text-sm text-gray-400 mt-2">
            (Utilisez demo@example.com / demo123)
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

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <Button
            type="submit"
            variant="primary"
            className="w-full"
            loading={loading}
          >
            Se connecter
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-400">
          Pas encore de compte ?{' '}
          <a href="#" className="text-purple-400 hover:text-purple-300">
            S'inscrire
          </a>
        </div>
      </div>
    </div>
  );
}
