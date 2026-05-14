import React, { useEffect, useState } from 'react'
import { useAdminStore } from '../stores/adminStore'
import { useAuth } from '../stores/authStore'
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
        { label: 'Total Users', value: users.length, icon: '👤', color: 'bg-blue-500' },
        { label: 'Total Authors', value: authors.length, icon: '✍️', color: 'bg-purple-500' },
        { label: 'Active Articles', value: articles.filter(a => a.isArticleActive).length, icon: '📝', color: 'bg-green-500' },
        { label: 'Inactive Articles', value: articles.filter(a => !a.isArticleActive).length, icon: '🚫', color: 'bg-red-500' }
    ]

    return (
        <div className="min-h-screen bg-[#f8f9fa] p-6 lg:p-10 font-sans">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Admin Terminal</h1>
                        <p className="text-gray-500 mt-2">Manage your platform's users and content with precision.</p>
                    </div>
                </div>

                {/* Tabs */}
                <div className="flex space-x-1 bg-gray-200/50 p-1 rounded-xl mb-8 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                                activeTab === tab.id
                                    ? 'bg-white text-gray-900 shadow-sm'
                                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/80'
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
                    </div>
                ) : (
                    <div className="space-y-8 animate-in fade-in duration-500">
                        
                        {/* Overview Tab */}
                        {activeTab === 'overview' && (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                                {stats.map((stat, i) => (
                                    <div key={i} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                                        <div className={`w-12 h-12 ${stat.color} rounded-xl flex items-center justify-center text-2xl mb-4 text-white shadow-lg`}>
                                            {stat.icon}
                                        </div>
                                        <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">{stat.label}</p>
                                        <p className="text-3xl font-bold text-gray-900 mt-1">{stat.value}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Users & Authors Table */}
                        {(activeTab === 'users' || activeTab === 'authors') && (
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="bg-gray-50/50 border-b border-gray-100">
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">User</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Email</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600">Status</th>
                                            <th className="px-6 py-4 text-sm font-semibold text-gray-600 text-right">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-50">
                                        {(activeTab === 'users' ? users : authors).map((user) => (
                                            <tr key={user._id} className="hover:bg-gray-50/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="flex items-center space-x-3">
                                                        <img src={user.profileImageUrl || 'https://via.placeholder.com/40'} alt="" className="w-10 h-10 rounded-full object-cover border border-gray-200" />
                                                        <span className="font-medium text-gray-900">{user.firstName} {user.lastName}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-gray-600">{user.email}</td>
                                                <td className="px-6 py-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                    }`}>
                                                        {user.isActive ? 'Active' : 'Blocked'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-right">
                                                    <button
                                                        onClick={() => toggleUserStatus(user._id, user.isActive)}
                                                        className={`px-4 py-1.5 rounded-lg text-sm font-bold transition-all ${
                                                            user.isActive 
                                                                ? 'text-red-600 hover:bg-red-50' 
                                                                : 'text-green-600 hover:bg-green-50'
                                                        }`}
                                                    >
                                                        {user.isActive ? 'Block' : 'Unblock'}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {(activeTab === 'users' ? users : authors).length === 0 && (
                                    <div className="p-10 text-center text-gray-500">No {activeTab} found.</div>
                                )}
                            </div>
                        )}

                        {/* Articles Grid */}
                        {activeTab === 'articles' && (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {articles.map((article) => (
                                    <div key={article._id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col hover:shadow-md transition-shadow">
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-3 py-1 bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider rounded-full">
                                                    {article.category}
                                                </span>
                                                <span className={`w-3 h-3 rounded-full ${article.isArticleActive ? 'bg-green-500' : 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]'}`}></span>
                                            </div>
                                            <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2">{article.title}</h3>
                                            <div className="flex items-center space-x-2 mt-4">
                                                <img src={article.author?.profileImageUrl || 'https://via.placeholder.com/24'} alt="" className="w-6 h-6 rounded-full" />
                                                <p className="text-xs text-gray-500 font-medium">By {article.author?.firstName} {article.author?.lastName}</p>
                                            </div>
                                        </div>
                                        <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex justify-between items-center">
                                            <span className="text-xs font-semibold text-gray-400">
                                                {new Date(article.createdAt).toLocaleDateString()}
                                            </span>
                                            <button
                                                onClick={() => toggleArticleStatus(article._id, article.isArticleActive)}
                                                className={`text-sm font-bold transition-all px-4 py-1.5 rounded-lg ${
                                                    article.isArticleActive 
                                                        ? 'text-red-600 hover:bg-red-100/50' 
                                                        : 'text-green-600 hover:bg-green-100/50'
                                                }`}
                                            >
                                                {article.isArticleActive ? 'Deactivate' : 'Activate'}
                                            </button>
                                        </div>
                                    </div>
                                ))}
                                {articles.length === 0 && (
                                    <div className="col-span-full p-10 text-center text-gray-500 bg-white rounded-2xl border border-gray-100">
                                        No articles found.
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