function SignUpPage() {
  const { login } = useAuth();
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
    console.log('Validating form data:', formData);

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
    console.log('Form submission started');

    try {
      setLoading(true);
      
      if (!validateForm()) {
        return;
      }

      console.log('Form validated, creating user account');

      // Create user account
      const { user } = await auth.createUserWithEmailAndPassword(
        formData.email,
        formData.password
      );

      console.log('User account created:', user);

      // Prepare user data
      const userData = {
        uid: user.uid,
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        accountType: formData.accountType,
        companyName: formData.companyName,
        siret: formData.siret,
        displayName: `${formData.firstName} ${formData.lastName}`,
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      console.log('Creating user profile with data:', userData);

      // Create user profile in Firestore
      await db.collection('users').doc(user.uid).set(userData);

      console.log('User profile created in Firestore');

      // Update Firebase user profile
      await user.updateProfile({
        displayName: userData.displayName
      });

      console.log('Firebase user profile updated');

      // Login the user
      await login('email', {
        email: formData.email,
        password: formData.password
      });

      console.log('User logged in successfully');
    } catch (error) {
      console.error('Sign up error:', error);
      setError(error.message);
      
      // Log detailed error information
      if (error.code) {
        console.error('Firebase error code:', error.code);
      }
      if (error.details) {
        console.error('Error details:', error.details);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting Google sign in');
      
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await auth.signInWithPopup(provider);
      
      console.log('Google sign in successful:', result.user);

      // Create or update user profile
      const userData = {
        uid: result.user.uid,
        email: result.user.email,
        displayName: result.user.displayName,
        photoURL: result.user.photoURL,
        accountType: 'individual',
        createdAt: new Date(),
        lastLoginAt: new Date()
      };

      await db.collection('users').doc(result.user.uid).set(userData, { merge: true });
      console.log('User profile created/updated in Firestore');

    } catch (error) {
      console.error('Google sign in error:', error);
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
            <div className="flex justify-center mb-6">
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading}
                className="w-full bg-white text-gray-900 py-3 px-4 rounded-lg flex items-center justify-center font-medium hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                {loading ? (
                  <div className="w-6 h-6 border-4 border-gray-900 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <img
                    src="https://www.google.com/favicon.ico"
                    alt="Google"
                    className="w-6 h-6 mr-2"
                  />
                )}
                S'inscrire avec Google
              </button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-gray-800 text-gray-400">
                  Ou avec votre email
                </span>
              </div>
            </div>

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
