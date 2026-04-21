export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">
              SM
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Server Monitor</h1>
              <p className="text-xs text-gray-500">Real-time infrastructure monitoring</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-4">
            <a href="/" className="text-gray-700 hover:text-primary-600 font-medium">
              Dashboard
            </a>
            <a href="/alerts" className="text-gray-700 hover:text-primary-600 font-medium">
              Alerts
            </a>
            <button className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 font-medium">
              + Add Server
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
