// api.ts
import axios from 'axios';

const NEWS_API_KEY = '884cf3746c204fa09a496745989490a8';
const BASE_URL = 'https://newsapi.org/v2';

/**
 * Fetch news articles.
 * 
 * @param params Optional parameters to filter news
 * @returns Articles list
 */
export const fetchNews = async ({
  query = 'apple',
  from,
  to,
  pageSize = 20,
  sortBy = 'publishedAt', // Get latest first
}: {
  query?: string;
  from?: string;
  to?: string;
  pageSize?: number;
  sortBy?: 'relevancy' | 'popularity' | 'publishedAt';
} = {}) => {
  try {
    const response = await axios.get(`${BASE_URL}/everything`, {
      params: {
        q: query,
        ...(from && { from }),
        ...(to && { to }),
        sortBy,
        pageSize,
        apiKey: NEWS_API_KEY,
      },
    });

    return response.data.articles;
  } catch (error: any) {
    console.error('Error fetching news:', error.response?.data || error.message);
    throw new Error(error.response?.data?.message || error.message || 'Failed to fetch news');
  }
};
