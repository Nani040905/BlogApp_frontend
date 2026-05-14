import React from 'react'
import { NavLink } from 'react-router'

function Footer() {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-8">
          <NavLink to="/" className="flex items-center gap-2">
            <div className="w-6 h-6 bg-primary rounded flex items-center justify-center text-white font-bold text-sm">
              B
            </div>
            <span className="font-bold text-slate-900 tracking-tight">
              Blog<span className="text-primary">App</span>
            </span>
          </NavLink>
          
          <div className="flex gap-8 text-sm font-medium text-slate-500">
            <NavLink to="/" className="hover:text-primary transition-colors">Home</NavLink>
            <NavLink to="/login" className="hover:text-primary transition-colors">Explore</NavLink>
            <NavLink to="/register" className="hover:text-primary transition-colors">Write</NavLink>
          </div>
          
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} BlogApp. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer