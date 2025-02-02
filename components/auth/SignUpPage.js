function SignUpPage() {
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [formData, setFormData] = React.useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    phone: '',
    accountType: 'individual',
    companyName: '',
    siret: '',
    acceptTerms: false
  });

  const validateForm = () => {
    if (!formData.email || !formData.password || !formData.confirmPassword) {
      throw new Error('Veuillez remplir tous les champs obligatoires');
    }

    if (!formData.firstName || !formData.lastName) {
      throw new Error('Le prénom et le nom sont requis');
    }

    if (formData.password !== formData.confirmPassword) {
      throw new Error('Les mots de passe ne correspondent pas');
    }

    if (formData.password.length < 8) {
      throw new Error('Le mot de passe doit contenir au moins 8 caractères');
    }

    if (!formData.acceptTerms) {
      throw new Error('Vous devez accepter les conditions d\'utilisation');
    }

    if (formData.accountType === 'professional' && (!formData.companyName || !formData.siret)) {
      throw new Error('Les informations de l\'entreprise sont requises pour un compte professionnel');
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      setLoading(true);
      
      if (!validateForm()) {
        return;
      }

      const { data: { user }, error } = await window.supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            account_type: formData.accountType,
            company_name: formData.companyName,
            siret: formData.siret
          }
        }
      });

      if (error) throw error;

      // Créer le profil utilisateur dans la table profiles
      const { error: profileError } = await window.supabase
        .from('profiles')
        .insert([{
          id: user.id,
          first_name: formData.firstName,
          last_name: formData.lastName,
          phone: formData.phone,
          company_name: formData.companyName,
          siret: formData.siret,
          account_type: formData.accountType
        }]);

      if (profileError) throw profileError;

      setError('Vérifiez votre email pour confirmer votre inscription.');
    } catch (error) {
      console.error('Erreur d\'inscription:', error.message);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  return (
    <div data-name="signup-page" className="min-h-screen bg-gray-900 py-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">Créer un compte</h1>
          <p className="text-gray-400">
            Rejoignez ImmoGestion pour gérer efficacement vos biens immobiliers
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

        <div className="bg-gray-800 rounded-lg p-6 shadow-xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Prénom"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Nom"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
              />
            </div>

            <Input
              label="Email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />

            <Input
              label="Téléphone"
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
            />

            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Mot de passe"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                required
              />
              <Input
                label="Confirmer le mot de passe"
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                required
              />
            </div>

            <div className="space-y-4">
              <label className="block text-gray-400">Type de compte</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  className={`p-4 rounded-lg border ${
                    formData.accountType === 'individual'
                      ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'individual' }))}
                >
                  <i className="fas fa-user text-2xl mb-2"></i>
                  <div className="font-medium">Particulier</div>
                  <div className="text-sm text-gray-400">
                    Pour gérer vos biens personnels
                  </div>
                </button>
                <button
                  type="button"
                  className={`p-4 rounded-lg border ${
                    formData.accountType === 'professional'
                      ? 'border-purple-500 bg-purple-500 bg-opacity-10'
                      : 'border-gray-700 hover:border-gray-600'
                  }`}
                  onClick={() => setFormData(prev => ({ ...prev, accountType: 'professional' }))}
                >
                  <i className="fas fa-building text-2xl mb-2"></i>
                  <div className="font-medium">Professionnel</div>
                  <div className="text-sm text-gray-400">
                    Pour les agences et professionnels
                  </div>
                </button>
              </div>
            </div>

            {formData.accountType === 'professional' && (
              <div className="space-y-4">
                <Input
                  label="Nom de l'entreprise"
                  name="companyName"
                  value={formData.companyName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  label="Numéro SIRET"
                  name="siret"
                  value={formData.siret}
                  onChange={handleInputChange}
                  required
                />
              </div>
            )}

            <div className="flex items-center">
              <input
                type="checkbox"
                id="acceptTerms"
                name="acceptTerms"
                checked={formData.acceptTerms}
                onChange={handleInputChange}
                className="h-4 w-4 rounded border-gray-700 bg-gray-700 text-purple-500 focus:ring-purple-500"
              />
              <label htmlFor="acceptTerms" className="ml-2 text-sm text-gray-400">
                J'accepte les{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  conditions d'utilisation
                </a>{' '}
                et la{' '}
                <a href="#" className="text-purple-400 hover:text-purple-300">
                  politique de confidentialité
                </a>
              </label>
            </div>

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              loading={loading}
            >
              {loading ? 'Création du compte...' : 'Créer mon compte'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-400">
            Déjà inscrit ?{' '}
            <a href="/login" className="text-purple-400 hover:text-purple-300">
              Se connecter
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
