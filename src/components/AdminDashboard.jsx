import React, { useEffect, useState } from 'react'
import { useAdminStore } from '../stores/adminStore'
import { useNavigate } from 'react-router'
import { toast } from 'react-hot-toast'

function AdminDashboard() {
    const { 
        users, authors, articles, loading, 
        fetchUsers, fetchAuthors, fetchArticles, 
        toggleUserStatus, toggleArticleStatus 
    } = useAdminStore()
    
    const [activeTab, setActiveTab] = useState('overview')
    const navigate = useNavigate()

    useEffect(() => {
        fetchUsers()
        fetchAuthors()
        fetchArticles()
    }, [])

    const tabs = [
        { id: 'overview', label: 'Overview' },
        { id: 'users', label: 'Users' },
        { id: 'authors', label: 'Authors' },
        { id: 'articles', label: 'Articles' }
    ]

    const stats = [
        { label: 'Total Users', value: users.length, icon: '👤', color: 'bg-primary' },
        { label: 'Total Authors', value: authors.length, icon: '✍️', color: 'bg-sky-400' },
        { label: 'Active Articles', value: articles.filter(a => a.isArticleActive).length, icon: '📝', color: 'bg-emerald-400' },
        { label: 'Inactive Articles', value: articles.filter(a => !a.isArticleActive).length, icon: '🚫', color: 'bg-rose-400' }
    ]

    return (
        <div className="min-h-screen bg-background p-6 lg:p-10">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-10">
                    <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">Admin Terminal</h1>
                    <p className="text-slate-500 mt-2">Manage your platform's users and content with precision.</p>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-slate-100 p-1 rounded-xl mb-10 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-8 py-2.5 text-sm font-bold rounded-lg transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-primary shadow-sm'
                                    : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-fade-in">
                        
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="card group">
                                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-xl mb-4 text-white shadow-lg shadow-${stat.color.split('-')[1] || 'primary'}/20 group-hover:scale-110 transition-transform`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{stat.label}</p>
                                        <p className="text-3xl font-extrabold text-slate-900 mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Users & Authors Table */}
                        {(activeTab === 'users' || activeTab === 'authors') && (
                            <div className="card !p-0 overflow-hidden border-slate-100">
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left border-collapse">
                                        <thead>
                                            <tr className="bg-slate-50/50 border-b border-slate-100">
                                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">User</th>
                                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Email</th>
                                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider">Status</th>
                                                <th className="px-6 py-5 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50">
                                            {(activeTab === 'users' ? users : authors).map((user) => (
                                                <tr key={user._id} className="hover:bg-slate-50/50 transition-colors group">
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center space-x-3">
                                                            <img 
                                                                src={user.profileImageUrl || `https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=e0f2fe&color=0ea5e9`} 
                                                                alt="" 
                                                                className="w-10 h-10 rounded-full object-cover border-2 border-transparent group-hover:border-primary/20 transition-all" 
                                                            />
                                                            <span className="font-bold text-slate-900">{user.firstName} {user.lastName}</span>
                                                        </div>
                                                    </td>
                                                    <td className="px-6 py-4 text-slate-600 font-medium">{user.email}</td>
                                                    <td className="px-6 py-4">
                                                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold ${
                                                            user.isActive ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'
                                                        }`}>
                                                            {user.isActive ? 'Active' : 'Blocked'}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <button
                                                            onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                                                                user.isActive 
                                                                    ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' 
                                                                    : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                                            }`}
                                                        >
                                                            {user.isActive ? 'Block User' : 'Unblock User'}
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                                {(activeTab === 'users' ? users : authors).length === 0 && (
                                    <div className="p-20 text-center text-slate-400 font-medium">No {activeTab} found in the database.</div>
                                )}
                            </div>
                        )}

                        {/* Articles Grid */}
                        {activeTab === 'articles' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article) => (
                                    <div key={article._id} className="card group flex flex-col hover:border-primary/20 transition-all">
                                        <div className="flex justify-between items-start mb-4">
                                            <span className="px-3 py-1 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider rounded-lg">
                                                {article.category}
                                            </span>
                                            <div className={`w-2.5 h-2.5 rounded-full ${article.isArticleActive ? 'bg-emerald-500' : 'bg-rose-500'} shadow-sm`}></div>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-4 line-clamp-2 group-hover:text-primary transition-colors">{article.title}</h3>
                                        <div className="flex items-center space-x-3 mt-auto pt-6 border-t border-slate-50">
                                            <img src={article.author?.profileImageUrl || `https://ui-avatars.com/api/?name=${article.author?.firstName}&background=e0f2fe&color=0ea5e9`} alt="" className="w-8 h-8 rounded-full border border-slate-100" />
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">By {article.author?.firstName}</p>
                                                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(article.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() => toggleArticleStatus(article._id, article.isArticleActive)}
                                            className={`mt-6 w-full py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                article.isArticleActive 
                                                    ? 'text-rose-600 bg-rose-50 hover:bg-rose-100' 
                                                    : 'text-emerald-600 bg-emerald-50 hover:bg-emerald-100'
                                            }`}
                                        >
                                            {article.isArticleActive ? 'Deactivate Story' : 'Activate Story'}
                                        </button>
                                    </div>
                                ))}
                                {articles.length === 0 && (
                                    <div className="col-span-full p-20 text-center text-slate-400 card border-dashed">
                                        No articles have been published yet.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}

export default AdminDashboard