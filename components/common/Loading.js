function Loading() {
  return (
    <div data-name="loading" className="flex items-center justify-center p-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
      <span className="ml-2 text-gray-400">Chargement...</span>
    </div>
  );
}
