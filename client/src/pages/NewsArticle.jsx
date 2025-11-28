import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { ArrowLeft, Clock, ExternalLink, Share2, Bookmark } from 'lucide-react'

export default function NewsArticle() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [article, setArticle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [relatedNews, setRelatedNews] = useState([])

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await fetch(`http://localhost:5001/api/news/${id}`)

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                setArticle(data.data)
            } catch (error) {
                console.error('Error fetching article:', error)
            } finally {
                setLoading(false)
            }
        }

        const fetchRelatedNews = async () => {
            try {
                const response = await fetch('http://localhost:5001/api/news')

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`)
                }

                const data = await response.json()
                // Get 3 random news items excluding current article
                const filtered = data.data.filter((_, idx) => idx.toString() !== id)
                setRelatedNews(filtered.slice(0, 3))
            } catch (error) {
                console.error('Error fetching related news:', error)
            }
        }

        fetchArticle()
        fetchRelatedNews()
    }, [id])

    const getTagColor = (tag) => {
        const colors = {
            'BREAKING': 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg shadow-red-500/20',
            'TRANSFER': 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/20',
            'UCL': 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/20',
            'EPL': 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg shadow-purple-500/20',
            'INJURY': 'bg-gradient-to-r from-yellow-500 to-orange-500 text-slate-900 shadow-lg shadow-yellow-500/20',
            'MANAGER': 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/20',
            'MATCH': 'bg-gradient-to-r from-green-500 to-emerald-500 text-white shadow-lg shadow-green-500/20',
            'NEWS': 'bg-gradient-to-r from-slate-600 to-slate-700 text-white shadow-lg shadow-slate-500/20'
        }
        return colors[tag] || colors['NEWS']
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <p className="text-slate-400 text-lg">Loading article...</p>
                </div>
            </div>
        )
    }

    if (!article) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-slate-400 text-lg mb-4">Article not found</p>
                    <button
                        onClick={() => navigate('/home')}
                        className="px-6 py-3 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition"
                    >
                        Back to Home
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 pb-12">
            {/* Header */}
            <div className="bg-gradient-to-r from-slate-800/50 to-slate-900/50 backdrop-blur-sm border-b border-slate-700/50 sticky top-0 z-10">
                <div className="max-w-5xl mx-auto px-8 py-4">
                    <button
                        onClick={() => navigate('/home')}
                        className="flex items-center gap-2 text-slate-400 hover:text-white transition group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        <span className="font-medium">Back to Home</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-5xl mx-auto px-8 py-8">
                {/* Article Header */}
                <div className="mb-8">
                    {/* Tag and Source */}
                    <div className="flex items-center justify-between mb-4">
                        <span className={`inline-block px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider ${getTagColor(article.tag)}`}>
                            {article.tag}
                        </span>
                        {article.source && (
                            <span className="text-slate-500 text-sm uppercase tracking-wider font-semibold">
                                {article.source}
                            </span>
                        )}
                    </div>

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
                        {article.title}
                    </h1>

                    {/* Meta Info */}
                    <div className="flex items-center gap-6 text-slate-400 text-sm mb-6">
                        <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>{article.time}</span>
                        </div>
                        {article.author && (
                            <div className="flex items-center gap-2">
                                <span>By {article.author}</span>
                            </div>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-3">
                        {article.link && article.link !== '#' && (
                            <a
                                href={article.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/30 transition"
                            >
                                <ExternalLink className="w-4 h-4" />
                                <span className="text-sm font-medium">View Original</span>
                            </a>
                        )}
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition">
                            <Share2 className="w-4 h-4" />
                            <span className="text-sm font-medium">Share</span>
                        </button>
                        <button className="flex items-center gap-2 px-4 py-2 bg-slate-700/50 text-slate-300 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition">
                            <Bookmark className="w-4 h-4" />
                            <span className="text-sm font-medium">Save</span>
                        </button>
                    </div>
                </div>

                {/* Article Image (if available) */}
                {article.image && (
                    <div className="mb-8 rounded-xl overflow-hidden border border-slate-700/50">
                        <img
                            src={article.image}
                            alt={article.title}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                )}

                {/* Article Content */}
                <div className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-8 mb-8">
                    <div className="prose prose-invert prose-lg max-w-none">
                        {article.content ? (
                            <div className="text-slate-300 leading-relaxed space-y-4">
                                {article.content.split('\n').map((paragraph, idx) => (
                                    <p key={idx} className="text-base leading-relaxed">
                                        {paragraph}
                                    </p>
                                ))}
                            </div>
                        ) : (
                            <div className="text-slate-300 leading-relaxed space-y-4">
                                <p className="text-base leading-relaxed">
                                    {article.summary || article.title}
                                </p>
                                <div className="bg-slate-700/30 border border-slate-600/50 rounded-lg p-6 my-6">
                                    <p className="text-slate-400 text-sm mb-3">
                                        📰 This is a news headline from {article.source}. For the full article, please visit the original source.
                                    </p>
                                    {article.link && article.link !== '#' && (
                                        <a
                                            href={article.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-emerald-400 hover:text-emerald-300 transition font-medium"
                                        >
                                            <span>Read full article</span>
                                            <ExternalLink className="w-4 h-4" />
                                        </a>
                                    )}
                                </div>
                                <p className="text-slate-400 text-sm italic">
                                    Stay tuned for more updates on this developing story.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Related News */}
                {relatedNews.length > 0 && (
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-6">Related News</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {relatedNews.map((news, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => navigate(`/news/${idx}`)}
                                    className="group bg-gradient-to-br from-slate-800/90 to-slate-900/90 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 hover:border-emerald-500/50 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300 text-left"
                                >
                                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider mb-2 ${getTagColor(news.tag)}`}>
                                        {news.tag}
                                    </span>
                                    <p className="text-slate-200 text-sm leading-snug mb-2 group-hover:text-white transition-colors duration-300 font-medium line-clamp-2">
                                        {news.title}
                                    </p>
                                    <p className="text-slate-500 text-xs flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {news.time}
                                    </p>
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
