function DocumentUpload({ onUpload, progress, scanning }) {
  const [dragOver, setDragOver] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  const fileInputRef = React.useRef();

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    setFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);
  };

  const handleUpload = async () => {
    try {
      for (const file of files) {
        await onUpload(file);
      }
    } catch (error) {
      reportError(error);
    }
  };

  return (
    <div data-name="document-upload" className="space-y-6">
      <h2 className="text-xl font-semibold">Upload de documents</h2>

      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center ${
          dragOver ? 'border-purple-500 bg-purple-500 bg-opacity-10' : 'border-gray-600'
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current.click()}
      >
        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          multiple
          onChange={handleFileSelect}
        />
        <i className="fas fa-cloud-upload-alt text-4xl text-gray-400 mb-4"></i>
        <p className="text-gray-400">
          Glissez-déposez vos fichiers ici ou cliquez pour sélectionner
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          <h3 className="font-medium">Fichiers sélectionnés :</h3>
          <ul className="space-y-2">
            {files.map((file, index) => (
              <li key={index} className="flex justify-between items-center bg-gray-700 p-2 rounded">
                <span>{file.name}</span>
                <span className="text-sm text-gray-400">{formatFileSize(file.size)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Upload en cours...</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className="bg-purple-500 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      )}

      {scanning && (
        <div className="text-center py-4">
          <Loading />
          <p className="text-sm text-gray-400 mt-2">
            Analyse du document en cours...
          </p>
        </div>
      )}

      <div className="flex justify-end space-x-4">
        <Button
          variant="secondary"
          onClick={() => setFiles([])}
          disabled={files.length === 0 || progress > 0}
        >
          Annuler
        </Button>
        <Button
          variant="primary"
          onClick={handleUpload}
          disabled={files.length === 0 || progress > 0}
          loading={progress > 0}
        >
          Uploader
        </Button>
      </div>
    </div>
  );
}
