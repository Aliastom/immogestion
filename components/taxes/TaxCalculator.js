function TaxCalculator({ onSave, properties, transactions, isCurrentYear }) {
  const [formData, setFormData] = React.useState({
    maritalStatus: 'single',
    children: 0,
    salary: 0,
    perContribution: 0,
    rentalIncome: {
      type: 'reel',
      properties: properties.map(p => {
        const propertyTransactions = transactions.filter(t => t.propertyId === p.id);
        const actualIncome = propertyTransactions
          .filter(t => t.type === 'revenu' && t.category === 'loyer')
          .reduce((sum, t) => sum + t.amount, 0);
        const actualCharges = propertyTransactions
          .filter(t => t.type === 'depense')
          .reduce((sum, t) => sum + t.amount, 0);

        return {
          id: p.id,
          title: p.title,
          expectedIncome: p.rentAmount * 12,
          actualIncome: isCurrentYear ? actualIncome : p.rentAmount * 12,
          charges: {
            deductible: {
              maintenance: isCurrentYear ? actualCharges : p.charges.deductible.maintenance,
              insurance: p.charges.deductible.insurance,
              managementFees: p.charges.deductible.managementFees,
              propertyTax: p.charges.deductible.propertyTax
            }
          }
        };
      })
    },
    reductions: {
      donations: 0,
      employment: 0,
      childcare: 0,
      renovation: 0
    },
    withholding: 0
  });

  const [results, setResults] = React.useState(null);

  const calculateTax = () => {
    try {
      // Calcul du revenu foncier
      let rentalIncome = 0;
      let totalCharges = 0;

      formData.rentalIncome.properties.forEach(property => {
        const annualIncome = isCurrentYear ? property.actualIncome : property.expectedIncome;
        rentalIncome += formData.rentalIncome.type === 'micro' 
          ? annualIncome * 0.7 // Abattement de 30% en micro-foncier
          : annualIncome;

        if (formData.rentalIncome.type === 'reel') {
          totalCharges += Object.values(property.charges.deductible).reduce((sum, value) => 
            sum + (typeof value === 'number' ? value : 0), 0);
        }
      });

      // Revenu imposable total
      const taxableIncome = parseFloat(formData.salary) + 
        (formData.rentalIncome.type === 'reel' ? rentalIncome - totalCharges : rentalIncome) -
        parseFloat(formData.perContribution);

      // Calcul du nombre de parts
      let parts = formData.maritalStatus === 'married' ? 2 : 1;
      parts += formData.children * 0.5;

      // Calcul du quotient familial
      const quotientFamilial = taxableIncome / parts;

      // Barème 2024
      let tax = 0;
      if (quotientFamilial <= 10777) {
        tax = 0;
      } else if (quotientFamilial <= 27478) {
        tax = (quotientFamilial - 10777) * 0.11;
      } else if (quotientFamilial <= 78570) {
        tax = ((quotientFamilial - 27478) * 0.3) + ((27478 - 10777) * 0.11);
      } else if (quotientFamilial <= 168994) {
        tax = ((quotientFamilial - 78570) * 0.41) + ((78570 - 27478) * 0.3) + ((27478 - 10777) * 0.11);
      } else {
        tax = ((quotientFamilial - 168994) * 0.45) + ((168994 - 78570) * 0.41) + ((78570 - 27478) * 0.3) + ((27478 - 10777) * 0.11);
      }

      // Multiplication par le nombre de parts
      tax *= parts;

      // Application des réductions d'impôts
      const totalReductions = (
        (formData.reductions.donations * 0.66) +
        (formData.reductions.employment * 0.5) +
        (formData.reductions.childcare * 0.5) +
        (formData.reductions.renovation * 0.3)
      );

      tax = Math.max(0, tax - totalReductions);

      // Calcul du taux moyen
      const averageRate = (tax / taxableIncome) * 100;

      // Reste à payer après prélèvement à la source
      const remainingTax = tax - formData.withholding;

      const results = {
        taxableIncome,
        rentalIncome: {
          gross: rentalIncome,
          charges: totalCharges,
          net: rentalIncome - totalCharges
        },
        tax,
        averageRate,
        totalReductions,
        remainingTax
      };

      setResults(results);
      if (onSave) {
        onSave(results);
      }
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <div data-name="tax-calculator" className="space-y-6">
      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Situation personnelle</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Situation matrimoniale"
            type="select"
            value={formData.maritalStatus}
            onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
          >
            <option value="single">Célibataire</option>
            <option value="married">Marié(e)/Pacsé(e)</option>
          </Input>

          <Input
            label="Nombre d'enfants"
            type="number"
            value={formData.children}
            onChange={e => setFormData({...formData, children: parseInt(e.target.value) || 0})}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Revenus salariés</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Salaire annuel"
            type="number"
            value={formData.salary}
            onChange={e => setFormData({...formData, salary: parseFloat(e.target.value) || 0})}
          />
          <Input
            label="Cotisation PER"
            type="number"
            value={formData.perContribution}
            onChange={e => setFormData({...formData, perContribution: parseFloat(e.target.value) || 0})}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Revenus fonciers</h3>
        <div className="space-y-4">
          <Input
            label="Régime d'imposition"
            type="select"
            value={formData.rentalIncome.type}
            onChange={e => setFormData({
              ...formData,
              rentalIncome: { ...formData.rentalIncome, type: e.target.value }
            })}
          >
            <option value="micro">Micro-foncier (abattement 30%)</option>
            <option value="reel">Réel</option>
          </Input>

          <div className="space-y-4 mt-4">
            {formData.rentalIncome.properties.map(property => (
              <div key={property.id} className="bg-gray-700 p-4 rounded-lg">
                <h4 className="font-medium mb-3">{property.title}</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-400">Loyers {isCurrentYear ? 'perçus' : 'attendus'}</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(isCurrentYear ? property.actualIncome : property.expectedIncome)}
                    </p>
                  </div>
                  {formData.rentalIncome.type === 'reel' && (
                    <div>
                      <p className="text-sm text-gray-400">Charges déductibles</p>
                      <p className="text-lg font-semibold">
                        {formatCurrency(Object.values(property.charges.deductible).reduce((sum, value) => 
                          sum + (typeof value === 'number' ? value : 0), 0))}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Réductions d'impôt</h3>
        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Dons aux œuvres"
            type="number"
            value={formData.reductions.donations}
            onChange={e => setFormData({
              ...formData,
              reductions: { ...formData.reductions, donations: parseFloat(e.target.value) || 0 }
            })}
          />
          <Input
            label="Emploi à domicile"
            type="number"
            value={formData.reductions.employment}
            onChange={e => setFormData({
              ...formData,
              reductions: { ...formData.reductions, employment: parseFloat(e.target.value) || 0 }
            })}
          />
        </div>
      </div>

      <div className="bg-gray-800 rounded-lg p-6">
        <h3 className="text-lg font-semibold mb-4">Prélèvement à la source</h3>
        <Input
          label="Montant déjà prélevé"
          type="number"
          value={formData.withholding}
          onChange={e => setFormData({...formData, withholding: parseFloat(e.target.value) || 0})}
        />
      </div>

      <div className="flex justify-center">
        <Button
          variant="primary"
          size="lg"
          onClick={calculateTax}
          icon="calculator"
        >
          Calculer
        </Button>
      </div>

      {results && (
        <div className="bg-gray-800 rounded-lg p-6 mt-6">
          <h3 className="text-lg font-semibold mb-4">Résultats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Revenu imposable</p>
              <p className="text-xl font-semibold">{formatCurrency(results.taxableIncome)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Impôt sur le revenu</p>
              <p className="text-xl font-semibold text-red-400">{formatCurrency(results.tax)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Taux moyen d'imposition</p>
              <p className="text-xl font-semibold">{results.averageRate.toFixed(2)}%</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Reste à payer</p>
              <p className="text-xl font-semibold text-red-400">{formatCurrency(results.remainingTax)}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
