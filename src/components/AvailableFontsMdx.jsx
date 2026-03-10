import React, {useEffect, useMemo, useState} from 'react';

const VARIANT_KEYWORDS = [
  'Regular', 'Bold', 'Italic', 'Black', 'Thin', 'Light', 'Medium',
  'SemiBold', 'ExtraBold', 'ExtraLight', 'VariableFont', 'Condensed',
  'Expanded', 'Narrow', 'Wide', 'Heavy', 'Ultra', 'Demi', 'Book',
  'Oblique', 'Hairline',
];

function extractFamily(fontName) {
  const parts = fontName.split('-');
  let family = fontName;
  for (let i = 1; i < parts.length; i += 1) {
    if (VARIANT_KEYWORDS.some((keyword) => parts[i].startsWith(keyword))) {
      family = parts.slice(0, i).join('-');
      break;
    }
  }

  return family
    .replace(/_\d+pt/g, '')
    .replace(/_(?:Semi|Extra)?Condensed/g, '');
}

function groupFonts(fonts) {
  const groups = new Map();
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

export default function AvailableFontsMdx() {
  const [fonts, setFonts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://api.pdfdancer.com/font/get')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to fetch fonts');
        }
        return response.json();
      })
      .then((data) => {
        setFonts(data.fontNames || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const families = useMemo(() => groupFonts(fonts), [fonts]);

  if (loading) {
    return (
      <div style={{padding: '20px', textAlign: 'center'}}>
        <p>Loading available fonts...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{padding: '20px', color: 'var(--ifm-color-danger)'}}>
        <p>Error loading fonts: {error}</p>
      </div>
    );
  }

  return (
    <div style={{marginTop: '20px'}}>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '10px',
        }}
      >
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
            <summary style={{cursor: 'pointer', fontWeight: 600}}>
              {family}{' '}
              <span style={{fontWeight: 400, color: 'var(--ifm-color-emphasis-600)'}}>
                ({variants.length} {variants.length === 1 ? 'variant' : 'variants'})
              </span>
            </summary>
            <ul style={{listStyleType: 'none', padding: 0, marginTop: '8px'}}>
              {variants.map((variant) => (
                <li
                  key={variant}
                  style={{padding: '4px 0', fontFamily: 'var(--ifm-font-family-monospace)'}}
                >
                  <code>{variant}</code>
                </li>
              ))}
            </ul>
          </details>
        ))}
      </div>
      <p style={{marginTop: '20px', fontSize: '14px', color: 'var(--ifm-color-emphasis-700)'}}>
        Total fonts available: <strong>{fonts.length}</strong> across <strong>{families.size}</strong> families
      </p>
    </div>
  );
}
