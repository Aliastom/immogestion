function Header() {
  return (
    <header data-name="header" className="bg-gray-800 p-4 flex justify-between items-center">
      <div data-name="search" className="flex-1 max-w-xl">
        <div className="relative">
          <input
            type="text"
            placeholder="Rechercher..."
            className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-600"
          />
          <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
        </div>
      </div>
      
      <div data-name="user-menu" className="flex items-center ml-4">
        <button className="relative p-2 text-gray-400 hover:text-white">
          <i className="fas fa-bell"></i>
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </button>
        
        <div className="ml-4 flex items-center">
          <img
            src="https://via.placeholder.com/40"
            alt="Profile"
            className="h-8 w-8 rounded-full"
          />
          <span className="ml-2 text-white">John Doe</span>
          <i className="fas fa-chevron-down ml-2 text-gray-400"></i>
        </div>
      </div>
    </header>
  );
}
