import React from 'react';

const StatCards = ({ data }) => {
  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 1fr 1fr',
      gap: 16,
      marginBottom: 20
    }}>
      <div>
        <div style={{
          fontSize: 12,
          color: '#888',
          marginBottom: 2
        }}>
          Total PRs
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 500
        }}>
          {data.mergedPRs + data.openPRs}
        </div>
      </div>

      <div>
        <div style={{
          fontSize: 12,
          color: '#888',
          marginBottom: 2
        }}>
          Merged PRs
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 500,
          color: '#1a7f64'
        }}>
          {data.mergedPRs}
        </div>
      </div>

      <div>
        <div style={{
          fontSize: 12,
          color: '#888',
          marginBottom: 2
        }}>
          PR Reviews
        </div>
        <div style={{
          fontSize: 22,
          fontWeight: 500
        }}>
          {data.codeReviews}
        </div>
      </div>
    </div>
  );
};

export default StatCards;