function PersonalInfoForm({ initialData, onSubmit, onClose }) {
  const [formData, setFormData] = React.useState(initialData || {
    maritalStatus: 'single',
    children: 0,
    salary: 0,
    perContribution: 0,
    withholding: 0
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      onSubmit(formData);
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>

      <Input
        label="Situation matrimoniale"
        type="select"
        value={formData.maritalStatus}
        onChange={e => setFormData({...formData, maritalStatus: e.target.value})}
        required
      >
        <option value="single">Célibataire</option>
        <option value="married">Marié(e)/Pacsé(e)</option>
      </Input>

      <Input
        label="Nombre d'enfants"
        type="number"
        min="0"
        value={formData.children}
        onChange={e => setFormData({...formData, children: parseInt(e.target.value) || 0})}
        required
      />

      <Input
        label="Salaire annuel"
        type="number"
        value={formData.salary}
        onChange={e => setFormData({...formData, salary: parseFloat(e.target.value) || 0})}
        required
      />

      <Input
        label="Cotisation PER"
        type="number"
        value={formData.perContribution}
        onChange={e => setFormData({...formData, perContribution: parseFloat(e.target.value) || 0})}
        required
      />

      <Input
        label="Prélèvement à la source mensuel"
        type="number"
        value={formData.withholding}
        onChange={e => setFormData({...formData, withholding: parseFloat(e.target.value) || 0})}
        required
      />

      <div className="flex justify-end space-x-4">
        <Button variant="secondary" onClick={onClose} type="button">
          Annuler
        </Button>
        <Button type="submit" variant="primary">
          Enregistrer
        </Button>
      </div>
    </form>
  );
}
