import { useState } from 'react';

export default function App() {
  const [url, setUrl] = useState('');
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setData(null);

    try {
      const res = await fetch('https://your-supabase-edge-url/fetchMedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });
      const result = await res.json();
      if (!result.success) throw new Error(result.error);
      setData(result.data);
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
    }
  }

  return (
    <main style={{ maxWidth: 600, margin: 'auto', padding: '1rem' }}>
      <h1>Instagram Downloader</h1>
      <form onSubmit={handleSubmit}>
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste Instagram link..."
          style={{ width: '100%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ marginTop: '1rem' }}>
          Download
        </button>
      </form>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {data && (
        <div>
          <img src={data.thumbnail} alt="thumbnail" style={{ width: '100%' }} />
          <ul>
            {data.downloadOptions.map((item: any, i: number) => (
              <li key={i}>
                <a href={item.url} download>
                  Download {item.quality} ({item.size})
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </main>
  );
}
