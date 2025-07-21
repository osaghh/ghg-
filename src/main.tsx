import { useState } from 'react';

function App() {
  const [instagramUrl, setInstagramUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  const fetchMedia = async () => {
    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('https://gqfmokuvggwgvqycdhdp.supabase.co/functions/v1/rapid-processor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: instagramUrl }),
      });

      const data = await response.json();

      if (data.success) {
        setResult(data.data);
      } else {
        setError(data.error || 'Failed to fetch media');
      }
    } catch (err) {
      setError('Request failed. Check your network.');
    }

    setLoading(false);
  };

  return (
    <div className="p-6 max-w-xl mx-auto text-center space-y-4">
      <h1 className="text-2xl font-bold">Instagram Downloader</h1>

      <input
        className="w-full border rounded px-3 py-2"
        placeholder="Paste Instagram link..."
        value={instagramUrl}
        onChange={(e) => setInstagramUrl(e.target.value)}
      />

      <button
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded disabled:opacity-50"
        disabled={!instagramUrl || loading}
        onClick={fetchMedia}
      >
        {loading ? 'Processing...' : 'Download'}
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {result && (
        <div className="mt-6 space-y-2">
          <img src={result.thumbnail} alt="Thumbnail" className="w-full rounded" />
          {result.downloadOptions.map((media: any, index: number) => (
            <a
              key={index}
              href={media.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-500 underline"
            >
              Download ({media.quality}) - {media.size}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
