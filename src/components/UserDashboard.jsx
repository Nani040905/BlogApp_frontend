import React, { useEffect, useState } from "react";
import { NavLink } from "react-router";
import api from "../api/axios";

function UserDashboard() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function getData() {
      setLoading(true);
      try {
        const res = await api.get(`/user-api/articles`);
        setArticles(res.data.payload);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-rose-500 font-bold">
        Failed to load stories. Please try again later.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-6 lg:p-12">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Explore Stories</h1>
            <p className="text-slate-500 mt-2 font-medium">Discover fresh perspectives from our community of writers.</p>
          </div>
        </div>

        {articles.length === 0 ? (
          <div className="card text-center py-24 border-dashed">
            <p className="text-slate-400 font-medium text-lg">No articles have been published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.map((obj) => (
              <div
                key={obj._id}
                className="card group flex flex-col hover:border-primary/20 transition-all animate-fade-in"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="px-2.5 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">
                    {obj.category || 'General'}
                  </span>
                  <span className="text-slate-300">•</span>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                    {Math.ceil(obj.content.split(' ').length / 200)} min read
                  </span>
                </div>
                
                <h2 className="text-2xl font-bold text-slate-900 mb-4 leading-tight group-hover:text-primary transition-colors">
                  {obj.title}
                </h2>
                
                <p className="text-slate-600 mb-8 line-clamp-3 text-sm leading-relaxed">
                  {obj.content}
                </p>
                
                <div className="mt-auto pt-6 border-t border-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-primary font-bold text-xs border border-primary/10">
                      {obj.author?.firstName?.[0] || 'A'}
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-900">{obj.author?.firstName || 'Unknown Author'}</p>
                      <p className="text-[10px] text-slate-400 font-bold">{new Date(obj.updatedAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  <NavLink
                    to={`/article/${obj._id}`}
                    className="text-primary text-sm font-bold hover:underline underline-offset-4"
                  >
                    Read Story
                  </NavLink>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserDashboard;