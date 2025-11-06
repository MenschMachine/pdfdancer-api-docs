import React, { useEffect, useState } from 'react';

interface FontsResponse {
  fontNames: string[];
}

export default function AvailableFonts(): JSX.Element {
  const [fonts, setFonts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('https://api.pdfdancer.com/font/get')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch fonts');
        }
        return response.json();
      })
      .then((data: FontsResponse) => {
        setFonts(data.fontNames || []);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <p>Loading available fonts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', color: 'var(--ifm-color-danger)' }}>
        <p>Error loading fonts: {error}</p>
      </div>
    );
  }

  return (
    <div style={{ marginTop: '20px' }}>
      <ul style={{
        listStyleType: 'none',
        padding: 0,
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
        gap: '10px'
      }}>
        {fonts.map((font) => (
          <li
            key={font}
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--ifm-color-emphasis-100)',
              borderRadius: '6px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              fontFamily: 'var(--ifm-font-family-monospace)',
              fontSize: '14px'
            }}
          >
            <code>{font}</code>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--ifm-color-emphasis-700)' }}>
        Total fonts available: <strong>{fonts.length}</strong>
      </p>
    </div>
  );
}
