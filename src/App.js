import React from 'react';
import OpenMRSRadar from './components/OpenMRSRadar';
import useOpenMRSActivity from './hooks/useOpenMRSActivity';

function App() {
  const { data, loading, apiError } = useOpenMRSActivity();

  if (loading) {
    return (
      <div style={{
        display: 'flex', justifyContent: 'center', alignItems: 'center',
        height: '100vh', fontSize: 14, color: '#888',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
      }}>
        Loading GitHub activity...
      </div>
    );
  }

  return (
    <div style={{
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      minHeight: '100vh', background: '#f6f8fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif'
    }}>
      <div style={{
        background: '#fff',
        width: 900,
        padding: '20px 24px',
        border: '1px solid #d0d7de',
        borderRadius: 6
      }}>

        {/* Error Banner */}
        {apiError && (
          <div style={{
            padding: '8px 12px', marginBottom: 16,
            background: '#fff8c5', border: '1px solid #d4a72c',
            borderRadius: 6, fontSize: 12, color: '#633c01'
          }}>
            ⚠️ GitHub API error — token may be expired.{' '}
            <a href="https://github.com/settings/tokens" target="_blank" rel="noreferrer">
              Generate a new token
            </a>{' '}and update <code>.env</code>.
          </div>
        )}

        {/* Org Badges */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {data.orgs.map(org => (
            <a
              key={org.login}
              href={`https://github.com/${org.login}`}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                padding: '5px 14px', borderRadius: 20,
                border: '1px solid #d0d7de', background: '#f6f8fa',
                fontSize: 13, fontWeight: 500,
                textDecoration: 'none', color: '#24292f'
              }}
            >
              <img
                src={org.avatar_url}
                alt={org.login}
                style={{ width: 16, height: 16, borderRadius: '50%' }}
                onError={e => { e.target.src = `https://ui-avatars.com/api/?name=${org.login[0].toUpperCase()}&size=16&background=random`; }}
              />
              @{org.login}
            </a>
          ))}
        </div>

        {/* Main Two-Column Layout with divider */}
        <div style={{ display: 'flex', alignItems: 'stretch', minHeight: 260 }}>

          {/* Left: Activity Overview */}
          <div style={{ flex: 1, paddingRight: 32 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#24292f', marginBottom: 14 }}>
              Activity overview
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, color: '#24292f', lineHeight: 1.7 }}>
              {/* Repo icon */}
              <svg height="16" viewBox="0 0 16 16" width="16"
                style={{ marginTop: 4, flexShrink: 0, fill: '#57606a' }}>
                <path d="M2 2.5A2.5 2.5 0 0 1 4.5 0h8.75a.75.75 0 0 1 .75.75v12.5a.75.75 0 0 1-.75.75h-2.5a.75.75 0 0 1 0-1.5h1.75v-2h-8a1 1 0 0 0-.714 1.7.75.75 0 1 1-1.072 1.05A2.495 2.495 0 0 1 2 11.5Zm10.5-1h-8a1 1 0 0 0-1 1v6.708A2.486 2.486 0 0 1 4.5 9h8Z" />
              </svg>
              <div>
                <span>Contributed to </span>
                {data.contributedRepos.length > 0 ? (
                  data.contributedRepos.map((repo, i) => (
                    <React.Fragment key={repo}>
                      <a
                        href={`https://github.com/${repo}`}
                        target="_blank" rel="noreferrer"
                        style={{ color: '#0969da', textDecoration: 'none', fontWeight: 500 }}
                      >
                        {repo}
                      </a>
                      {i < data.contributedRepos.length - 1 && ', '}
                    </React.Fragment>
                  ))
                ) : (
                  <span style={{ color: '#888' }}>no public contributions found</span>
                )}
                {data.otherRepos > 0 && (
                  <span style={{ color: '#57606a' }}>{data.contributedRepos.length > 0 ? ',' : ''} and {data.otherRepos} other repositories</span>
                )}
              </div>
            </div>
          </div>

          {/* Vertical Divider */}
          <div style={{
            width: 1,
            background: '#d0d7de',
            flexShrink: 0
          }} />

          {/* Right: Chart */}
          <div style={{ width: 430, flexShrink: 0, paddingLeft: 32 }}>
            <OpenMRSRadar data={data} />
          </div>

        </div>
      </div>
    </div>
  );
}

export default App;