import { NavLink } from "react-router"
import { useAuth } from "../stores/authStore"

function Header() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)
  const logout = useAuth((state) => state.logout)
  const currentUser = useAuth((state) => state.currentUser)

  return (
    <nav className="sticky top-0 w-full bg-white/80 backdrop-blur-md border-b border-slate-100 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
              B
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">
              Blog<span className="text-primary">App</span>
            </span>
          </NavLink>

          {/* Navigation */}
          <div className="flex items-center gap-4 sm:gap-6">
            {isAuthenticated ? (
              <div className="flex items-center gap-3 sm:gap-6">
                <NavLink 
                  to={currentUser.role === "USER" ? "/user-dashboard" : currentUser.role === "AUTHOR" ? "/author-dashboard" : "/admin-dashboard"}
                  className={({isActive}) => 
                    `text-sm font-medium transition-colors px-3 py-2 rounded-lg ${
                      isActive 
                        ? "text-primary bg-primary/10" 
                        : "text-slate-600 hover:text-primary hover:bg-slate-50"
                    }`
                  }
                >
                  Dashboard
                </NavLink>

                <div className="hidden sm:flex flex-col items-end border-r border-slate-100 pr-4">
                  <span className="text-sm font-semibold text-slate-900">
                    {currentUser.firstName}
                  </span>
                  <span className="text-[10px] text-primary uppercase tracking-wider font-bold">
                    {currentUser.role}
                  </span>
                </div>
                
                <NavLink 
                  to="/profile"
                  className="flex items-center gap-2 group"
                >
                  <div className="relative">
                    <img
                      src={currentUser.profileImageUrl || `https://ui-avatars.com/api/?name=${currentUser.firstName}+${currentUser.lastName}&background=0ea5e9&color=fff`}
                      alt="Profile"
                      className="w-9 h-9 rounded-full border-2 border-transparent group-hover:border-primary transition-all object-cover"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></div>
                  </div>
                </NavLink>

                <button 
                  onClick={() => {
                    logout();
                    window.location.href = "/login";
                  }}
                  className="text-sm font-medium text-slate-600 hover:text-red-600 transition-colors cursor-pointer"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <NavLink
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-primary transition-colors px-4 py-2"
                >
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="btn-primary py-2 px-5 text-sm"
                >
                  Get Started
                </NavLink>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Header