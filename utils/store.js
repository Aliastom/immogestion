// Store for managing application state
const store = {
  state: {
    properties: [],
    tenants: [],
    transactions: [],
    documents: [],
    currentUser: null,
    isLoading: false,
    error: null
  },

  listeners: new Set(),

  async init() {
    try {
      // Load initial data from localStorage
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        this.state = JSON.parse(savedState);
      }

      // Initialize with some demo data if empty
      if (this.state.properties.length === 0) {
        this.state.properties = [
          {
            id: 1,
            title: "Appartement Paris 11",
            address: "25 rue de la République, 75011 Paris",
            price: 450000,
            rentAmount: 1500,
            surface: 65,
            rooms: 3,
            type: "appartement",
            status: "loué",
            tenant: "Marie Dubois",
            charges: {
              deductible: {
                maintenance: 1200,
                insurance: 400,
                managementFees: 5,
                propertyTax: 1800
              },
              nonDeductible: {
                loanCapital: 39197,
                improvements: 0
              }
            }
          },
          {
            id: 2,
            title: "Maison Bordeaux",
            address: "12 avenue des Pins, 33000 Bordeaux",
            price: 320000,
            rentAmount: 1200,
            surface: 90,
            rooms: 4,
            type: "maison",
            status: "disponible",
            charges: {
              deductible: {
                maintenance: 2000,
                insurance: 600,
                managementFees: 0,
                propertyTax: 2200
              },
              nonDeductible: {
                loanCapital: 0,
                improvements: 0
              }
            }
          }
        ];

        this.state.tenants = [
          {
            id: 1,
            name: "Marie Dubois",
            email: "marie.dubois@email.com",
            phone: "06 12 34 56 78",
            propertyId: 1,
            rentAmount: 1500,
            leaseStart: "2024-01-01",
            leaseEnd: "2025-01-01",
            deposit: 1500,
            paymentMethod: "virement",
            guarantor: {
              name: "Jean Dubois",
              email: "jean.dubois@email.com",
              phone: "06 98 76 54 32"
            }
          }
        ];

        this.state.transactions = [
          {
            id: 1,
            propertyId: 1,
            date: "2024-01-15",
            type: "revenu",
            category: "loyer",
            amount: 1500,
            description: "Loyer Janvier 2024"
          },
          {
            id: 2,
            propertyId: 1,
            date: "2024-01-10",
            type: "depense",
            category: "charges",
            amount: 200,
            description: "Charges copropriété"
          }
        ];

        this.state.documents = [
          {
            id: 1,
            name: "Bail - Appartement Paris.pdf",
            type: "contract",
            category: "contract",
            size: 2500000,
            createdAt: "2024-01-15T10:30:00",
            updatedAt: "2024-01-15T10:30:00",
            url: "#",
            propertyId: 1,
            extractedData: {
              "Montant du loyer": "1500 €",
              "Date de début": "01/01/2024",
              "Locataire": "Marie Dubois"
            }
          }
        ];
      }
    } catch (error) {
      reportError(error);
      this.state.error = "Erreur lors de l'initialisation des données";
    }
  },

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  },

  notify() {
    this.listeners.forEach(listener => listener(this.state));
    // Persist state to localStorage
    localStorage.setItem('appState', JSON.stringify(this.state));
  },

  // Properties
  async addProperty(property) {
    try {
      const newProperty = {
        id: Date.now(),
        ...property
      };
      this.state.properties.push(newProperty);
      this.notify();
      return newProperty;
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de l'ajout du bien");
    }
  },

  async updateProperty(id, updates) {
    try {
      const index = this.state.properties.findIndex(p => p.id === id);
      if (index !== -1) {
        this.state.properties[index] = { ...this.state.properties[index], ...updates };
        this.notify();
        return this.state.properties[index];
      }
      throw new Error("Bien non trouvé");
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async deleteProperty(id) {
    try {
      this.state.properties = this.state.properties.filter(p => p.id !== id);
      this.notify();
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de la suppression du bien");
    }
  },

  // Tenants
  async addTenant(tenant) {
    try {
      const newTenant = {
        id: Date.now(),
        ...tenant
      };
      this.state.tenants.push(newTenant);
      this.notify();
      return newTenant;
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de l'ajout du locataire");
    }
  },

  async updateTenant(id, updates) {
    try {
      const index = this.state.tenants.findIndex(t => t.id === id);
      if (index !== -1) {
        this.state.tenants[index] = { ...this.state.tenants[index], ...updates };
        this.notify();
        return this.state.tenants[index];
      }
      throw new Error("Locataire non trouvé");
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async deleteTenant(id) {
    try {
      this.state.tenants = this.state.tenants.filter(t => t.id !== id);
      this.notify();
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de la suppression du locataire");
    }
  },

  // Transactions
  async addTransaction(transaction) {
    try {
      const newTransaction = {
        id: Date.now(),
        ...transaction
      };
      this.state.transactions.push(newTransaction);
      this.notify();
      return newTransaction;
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de l'ajout de la transaction");
    }
  },

  async updateTransaction(id, updates) {
    try {
      const index = this.state.transactions.findIndex(t => t.id === id);
      if (index !== -1) {
        this.state.transactions[index] = { ...this.state.transactions[index], ...updates };
        this.notify();
        return this.state.transactions[index];
      }
      throw new Error("Transaction non trouvée");
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async deleteTransaction(id) {
    try {
      this.state.transactions = this.state.transactions.filter(t => t.id !== id);
      this.notify();
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de la suppression de la transaction");
    }
  },

  // Documents
  async addDocument(document) {
    try {
      const newDocument = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...document
      };
      this.state.documents.push(newDocument);
      this.notify();
      return newDocument;
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de l'ajout du document");
    }
  },

  async updateDocument(id, updates) {
    try {
      const index = this.state.documents.findIndex(d => d.id === id);
      if (index !== -1) {
        this.state.documents[index] = {
          ...this.state.documents[index],
          ...updates,
          updatedAt: new Date().toISOString()
        };
        this.notify();
        return this.state.documents[index];
      }
      throw new Error("Document non trouvé");
    } catch (error) {
      reportError(error);
      throw error;
    }
  },

  async deleteDocument(id) {
    try {
      this.state.documents = this.state.documents.filter(d => d.id !== id);
      this.notify();
    } catch (error) {
      reportError(error);
      throw new Error("Erreur lors de la suppression du document");
    }
  },

  // Error handling
  setError(error) {
    this.state.error = error;
    this.notify();
  },

  clearError() {
    this.state.error = null;
    this.notify();
  },

  // Loading state
  setLoading(isLoading) {
    this.state.isLoading = isLoading;
    this.notify();
  }
};

// Initialize store
store.init();
