import React, {JSX, useEffect, useMemo, useState} from 'react';

interface FontsResponse {
  fontNames: string[];
}

const VARIANT_KEYWORDS = [
  'Regular', 'Bold', 'Italic', 'Black', 'Thin', 'Light', 'Medium',
  'SemiBold', 'ExtraBold', 'ExtraLight', 'VariableFont', 'Condensed',
  'Expanded', 'Narrow', 'Wide', 'Heavy', 'Ultra', 'Demi', 'Book',
  'Oblique', 'Hairline',
];

function extractFamily(fontName: string): string {
  // Split off variant keywords after `-`
  const parts = fontName.split('-');
  let family = fontName;
  for (let i = 1; i < parts.length; i++) {
    if (VARIANT_KEYWORDS.some(kw => parts[i].startsWith(kw))) {
      family = parts.slice(0, i).join('-');
      break;
    }
  }
  // Strip size suffixes like _18pt, _120pt and style suffixes like _SemiCondensed
  return family
    .replace(/_\d+pt/g, '')
    .replace(/_(?:Semi|Extra)?Condensed/g, '');
}

function groupFonts(fonts: string[]): Map<string, string[]> {
  const groups = new Map<string, string[]>();
  for (const font of fonts) {
    const family = extractFamily(font);
    const list = groups.get(family);
    if (list) {
      list.push(font);
    } else {
      groups.set(family, [font]);
    }
  }
  return groups;
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

  const families = useMemo(() => groupFonts(fonts), [fonts]);

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
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '10px',
      }}>
        {Array.from(families.entries()).map(([family, variants]) => (
          <details
            key={family}
            style={{
              padding: '12px 16px',
              backgroundColor: 'var(--ifm-color-emphasis-100)',
              borderRadius: '6px',
              border: '1px solid var(--ifm-color-emphasis-300)',
              fontSize: '14px',
            }}
          >
            <summary style={{ cursor: 'pointer', fontWeight: 600 }}>
              {family}{' '}
              <span style={{ fontWeight: 400, color: 'var(--ifm-color-emphasis-600)' }}>
                ({variants.length} {variants.length === 1 ? 'variant' : 'variants'})
              </span>
            </summary>
            <ul style={{ listStyleType: 'none', padding: 0, marginTop: '8px' }}>
              {variants.map(v => (
                <li key={v} style={{ padding: '4px 0', fontFamily: 'var(--ifm-font-family-monospace)' }}>
                  <code>{v}</code>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <p style={{ marginTop: '20px', fontSize: '14px', color: 'var(--ifm-color-emphasis-700)' }}>
        Total fonts available: <strong>{fonts.length}</strong> across <strong>{families.size}</strong> families
      </p>
    </div>
  );
}
