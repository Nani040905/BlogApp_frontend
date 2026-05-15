import React, { useEffect, useState } from 'react'
import { NavLink, useNavigate } from 'react-router'
import api from '../api/axios'
import { useAuth } from '../stores/authStore'

function Home() {
  const [articles, setArticles] = useState([])
  const [loading, setLoading] = useState(false)
  const { isAuthenticated, currentUser } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    async function fetchArticles() {
      setLoading(true)
      try {
        // Fetch public articles from common-api instead of protected user-api
        const res = await api.get('/common-api/articles')
        setArticles(res.data.payload.slice(0, 6)) // Show latest 6
      } catch (err) {
        console.error("Failed to fetch articles", err)
      } finally {
        setLoading(false)
      }
    }
    fetchArticles()
  }, [])


  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 sm:py-32">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] bg-primary/10 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-bold tracking-wider uppercase mb-8 animate-fade-in">
            Now open for everyone
          </div>
          
          <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight mb-6 animate-fade-in">
            A simple place to <br/>
            <span className="text-primary">write and read</span>
          </h1>
          
          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            This is where you can share your thoughts and find interesting things to read. We kept it clean and easy to use, so you can focus on the words.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            {isAuthenticated ? (
              <NavLink 
                to={currentUser.role === 'USER' ? "/user-dashboard" : currentUser.role === 'AUTHOR' ? "/author-dashboard" : "/admin-dashboard"} 
                className="btn-primary w-full sm:w-auto px-10 py-4 text-lg"
              >
                Go to my dashboard
              </NavLink>
            ) : (
              <>
                <NavLink to="/register" className="btn-primary w-full sm:w-auto px-10 py-4 text-lg">
                  Start writing
                </NavLink>
                <NavLink to="/login" className="btn-secondary w-full sm:w-auto px-10 py-4 text-lg">
                  Browse stories
                </NavLink>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-10">
          <h2 className="text-2xl font-bold text-slate-900">Recent stories</h2>
          <NavLink to={isAuthenticated ? "/user-dashboard" : "/login"} className="text-primary font-semibold hover:underline">View all</NavLink>
        </div>
        
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="card animate-pulse h-80 bg-slate-50"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.length > 0 ? (
              articles.map((article, i) => (
                <NavLink 
                  to={isAuthenticated ? `/article/${article._id}` : "/login"} 
                  key={article._id} 
                  className="card group cursor-pointer animate-fade-in" 
                  style={{ animationDelay: `${0.3 + i * 0.1}s` }}
                >
                  <div className="space-y-4">
                    <div className="flex gap-2">
                      <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{article.category || 'Story'}</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">•</span>
                      <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                        {new Date(article.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="text-slate-600 line-clamp-3 text-sm leading-relaxed">
                      {article.content}
                    </p>
                    <div className="pt-4 flex items-center gap-3 border-t border-slate-50">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                        {article.author?.firstName?.[0] || 'A'}
                      </div>
                      <span className="text-sm font-bold text-slate-700">
                        {article.author?.firstName} {article.author?.lastName}
                      </span>
                    </div>
                  </div>
                </NavLink>
              ))
            ) : (
              <div className="col-span-full py-20 text-center card border-dashed text-slate-400 font-medium">
                Nothing posted here yet. Maybe you should be the first.
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  )
}

export default Home
