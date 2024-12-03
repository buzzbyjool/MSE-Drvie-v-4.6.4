import { useState, useEffect } from 'react';
import Navigation from './Navigation';
import { getNews, NewsItem } from '../utils/airtable';
import { Calendar } from 'lucide-react';

function formatContent(content: string) {
  return content.split('\n').map((line, index) => {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('•') || trimmedLine.startsWith('-')) {
      return (
        <div key={index} className="flex items-start space-x-2 mb-3">
          <div className="w-2 h-2 mt-2 bg-lime-500 rounded-full flex-shrink-0" />
          <span className="text-gray-300">{trimmedLine.substring(1).trim()}</span>
        </div>
      );
    }
    return (
      <p key={index} className="text-gray-300 mb-4">
        {trimmedLine}
      </p>
    );
  });
}

function formatDate(dateString: string) {
  try {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Date unavailable';
  }
}

export default function News() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const newsItems = await getNews();
        setNews(newsItems);
        setError(null);
      } catch (err) {
        console.error('Error fetching news:', err);
        setError('Failed to load news');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900">
        <Navigation />
        <div className="max-w-7xl mx-auto py-8 px-4">
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lime-500"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900">
      <Navigation />
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-100 mb-8">Club News</h1>

        {error && (
          <div className="bg-red-900 border-l-4 border-red-500 p-4 mb-6">
            <p className="text-sm text-red-100">{error}</p>
          </div>
        )}

        <div className="grid gap-6 md:gap-8">
          {news.map((item) => (
            <article
              key={item.id}
              className="bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden 
                         transition-all duration-300 hover:border-lime-500 hover:shadow-lime-500/10"
            >
              <div className="md:flex">
                {item.image && (
                  <div className="md:w-1/2 lg:w-2/5">
                    <div className="relative h-80 md:h-full">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-gray-900/50 to-transparent md:bg-gradient-to-l"></div>
                    </div>
                  </div>
                )}
                
                <div className="p-6 md:flex-1">
                  <div className="flex items-center text-sm text-gray-400 mb-3">
                    <Calendar className="w-4 h-4 mr-2 text-lime-500" />
                    {formatDate(item.publicationDate)}
                  </div>

                  <h2 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-lime-500 to-green-500 
                               bg-clip-text text-transparent mb-4">
                    {item.title}
                  </h2>

                  <div className="prose prose-invert max-w-none">
                    <div className="space-y-2">
                      {formatContent(item.content)}
                    </div>
                  </div>
                </div>
              </div>
            </article>
          ))}

          {news.length === 0 && !error && (
            <div className="text-center py-12">
              <p className="text-gray-400">No news available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}