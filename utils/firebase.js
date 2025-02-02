// Firebase services and auth functions
try {
  // Create Firebase instances (auth and db already initialized in index.html)
  const auth = firebase.auth();
  const db = firebase.firestore();
  const googleProvider = new firebase.auth.GoogleAuthProvider();

  // Enable persistence
  db.enablePersistence()
    .catch((err) => {
      if (err.code === 'failed-precondition') {
        console.error('Multiple tabs open, persistence can only be enabled in one tab at a time.');
      } else if (err.code === 'unimplemented') {
        console.error('The current browser does not support persistence.');
      }
    });

  // Configure auth persistence
  auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
    .catch((error) => {
      console.error('Error setting auth persistence:', error);
    });

  // Auth functions
  const signInWithGoogle = async () => {
    try {
      console.log('Starting Google sign in process');
      const result = await auth.signInWithPopup(googleProvider);
      console.log('Google sign in successful:', result);

      const { user } = result;
      const userDoc = await db.collection('users').doc(user.uid).get();

      if (!userDoc.exists) {
        console.log('Creating new user profile');
        await createUserProfile(user);
      } else {
        console.log('User profile already exists');
      }

      return user;
    } catch (error) {
      console.error('Google sign in error:', error);
      let errorMessage;

      switch (error.code) {
        case 'auth/popup-closed-by-user':
          errorMessage = 'La fenêtre de connexion a été fermée';
          break;
        case 'auth/popup-blocked':
          errorMessage = 'La fenêtre de connexion a été bloquée par le navigateur';
          break;
        case 'auth/cancelled-popup-request':
          errorMessage = 'La demande de connexion a été annulée';
          break;
        case 'auth/network-request-failed':
          errorMessage = 'Erreur réseau. Vérifiez votre connexion internet';
          break;
        case 'auth/unauthorized-domain':
          errorMessage = 'Ce domaine n\'est pas autorisé pour l\'authentification';
          break;
        case 'auth/configuration-not-found':
          errorMessage = 'Configuration Firebase non trouvée ou invalide';
          break;
        default:
          errorMessage = `Erreur lors de la connexion avec Google: ${error.message}`;
      }

      throw new Error(errorMessage);
    }
  };

  const createUserProfile = async (user) => {
    try {
      console.log('Creating user profile for:', user.uid);
      const userRef = db.collection('users').doc(user.uid);
      const snapshot = await userRef.get();

      if (!snapshot.exists) {
        const userData = {
          email: user.email,
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          lastLoginAt: firebase.firestore.FieldValue.serverTimestamp(),
          accountType: user.accountType || 'individual',
          firstName: user.firstName || '',
          lastName: user.lastName || '',
          phone: user.phone || '',
          companyName: user.companyName || '',
          siret: user.siret || '',
          properties: [],
          tenants: [],
          transactions: []
        };

        await userRef.set(userData);
        console.log('User profile created successfully');
        return userData;
      }

      await userRef.update({
        lastLoginAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      console.log('User profile updated with last login');
      
      return snapshot.data();
    } catch (error) {
      console.error('Error creating user profile:', error);
      throw new Error(`Erreur lors de la création du profil utilisateur: ${error.message}`);
    }
  };

  const getUserProfile = async (userId) => {
    try {
      console.log('Fetching user profile for:', userId);
      const userRef = db.collection('users').doc(userId);
      const snapshot = await userRef.get();
      
      if (!snapshot.exists) {
        throw new Error('Profil utilisateur non trouvé');
      }
      
      const userData = {
        id: snapshot.id,
        ...snapshot.data()
      };
      console.log('User profile fetched:', userData);
      return userData;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw new Error(`Erreur lors de la récupération du profil utilisateur: ${error.message}`);
    }
  };

  // Export services globally
  window.firebaseServices = {
    auth,
    db,
    signInWithGoogle,
    createUserProfile,
    getUserProfile
  };

} catch (error) {
  console.error('Firebase initialization error:', error);
  reportError(error);
}
