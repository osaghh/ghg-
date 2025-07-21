import React, { useState } from 'react';

interface DownloadOption {
  quality: string;
  size: string;
  url: string;
}

interface ApiResponse {
  success: boolean;
  data?: {
    type: string;
    url: string;
    thumbnail: string;
    downloadOptions: DownloadOption[];
  };
  error?: string;
}

function App() {
  const [url, setUrl] = useState('');
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState(false);

const handleDownload = async () => {
  setLoading(true);
  setResult(null);
  try {
    const res = await fetch('https://gqfmokuvggwgvqycdhdp.supabase.co/functions/v1/rapid-processor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer YOUR_SUPABASE_ANON_KEY'
      },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();
    setResult(data);
  } catch (error) {
    setResult({ success: false, error: 'Failed to fetch media.' });
  } finally {
    setLoading(false);
  }
};
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-bold mb-6">Instagram Content Downloader</h1>
      <div className="w-full max-w-md">
        <input
          type="text"
          placeholder="Enter Instagram URL"
          className="w-full p-2 text-black rounded mb-4"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button
          className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded w-full"
          onClick={handleDownload}
          disabled={loading}
        >
          {loading ? 'Processing...' : 'Download'}
        </button>
      </div>

      {result && (
        <div className="mt-6 w-full max-w-md">
          {result.success ? (
            <div>
              <img src={result.data?.thumbnail} alt="Preview" className="rounded mb-4" />
              <div className="space-y-2">
                {result.data?.downloadOptions.map((opt, i) => (
                  <a
                    key={i}
                    href={opt.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-green-600 hover:bg-green-700 px-4 py-2 rounded text-center"
                  >
                    Download {opt.quality} ({opt.size})
                  </a>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-red-500 mt-4">{result.error}</p>
          )}
        </div>
      )}
    </div>
  );
}

export default App;
