import React from 'react';

const OpenMRSRadar = ({ data }) => {
  const cx = 210;
  const cy = 170;
  const maxR = 125; // pixels = 100%

  const scale = (val) => (val / 100) * maxR;

  // Data point positions along each axis
  const topPt    = [cx,                        cy - scale(data.codeReviews)];
  const bottomPt = [cx,                        cy + scale(data.pullRequests)];
  const leftPt   = [cx - scale(data.commits),  cy];
  const rightPt  = [cx + scale(data.issues),   cy];

  const poly = `${topPt[0]},${topPt[1]} ${rightPt[0]},${rightPt[1]} ${bottomPt[0]},${bottomPt[1]} ${leftPt[0]},${leftPt[1]}`;

  const lineColor = '#1a7f64';
  const textColor = '#57606a';
  const fs = 12;
  const DOT_R = 4.5;

  return (
    <svg viewBox="0 0 420 340" style={{ width: '100%', overflow: 'visible' }}>

      {/* Full cross axis lines */}
      <line x1={cx - maxR} y1={cy} x2={cx + maxR} y2={cy}
        stroke={lineColor} strokeWidth={1.5} />
      <line x1={cx} y1={cy - maxR} x2={cx} y2={cy + maxR}
        stroke={lineColor} strokeWidth={1.5} />

      {/* Filled polygon area */}
      <polygon points={poly} fill={lineColor} fillOpacity={0.15} />

      {/* Dots at each data point */}
      <circle cx={topPt[0]}    cy={topPt[1]}    r={DOT_R} fill="white" stroke={lineColor} strokeWidth={2} />
      <circle cx={bottomPt[0]} cy={bottomPt[1]} r={DOT_R} fill="white" stroke={lineColor} strokeWidth={2} />
      <circle cx={leftPt[0]}   cy={leftPt[1]}   r={DOT_R} fill="white" stroke={lineColor} strokeWidth={2} />
      {data.issues > 0 && (
        <circle cx={rightPt[0]} cy={rightPt[1]} r={DOT_R} fill="white" stroke={lineColor} strokeWidth={2} />
      )}

      {/* Top label — Code review */}
      <text x={cx} y={cy - maxR - 16} textAnchor="middle" fill={textColor} fontSize={fs}>{data.codeReviews}%</text>
      <text x={cx} y={cy - maxR - 3}  textAnchor="middle" fill={textColor} fontSize={fs}>Code review</text>

      {/* Bottom label — Pull requests */}
      <text x={cx} y={cy + maxR + 17} textAnchor="middle" fill={textColor} fontSize={fs}>{data.pullRequests}%</text>
      <text x={cx} y={cy + maxR + 30} textAnchor="middle" fill={textColor} fontSize={fs}>Pull requests</text>

      {/* Left label — Commits */}
      <text x={cx - maxR - 8} y={cy - 7} textAnchor="end" fill={textColor} fontSize={fs}>{data.commits}%</text>
      <text x={cx - maxR - 8} y={cy + 7} textAnchor="end" fill={textColor} fontSize={fs}>Commits</text>

      {/* Right label — Issues */}
      {data.issues > 0 && (
        <text x={cx + maxR + 8} y={cy - 7} textAnchor="start" fill={textColor} fontSize={fs}>{data.issues}%</text>
      )}
      <text x={cx + maxR + 8} y={cy + (data.issues > 0 ? 7 : 4)} textAnchor="start" fill={textColor} fontSize={fs}>Issues</text>

    </svg>
  );
};

export default OpenMRSRadar;