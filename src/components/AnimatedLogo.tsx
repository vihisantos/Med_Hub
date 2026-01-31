import React from 'react';

const AnimatedLogo: React.FC = () => {
  return (
    <div className="flex items-center justify-center transform scale-150">
      <style>
        {`
        .loading svg polyline {
          fill: none;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-linejoin: round;
        }

        .loading svg polyline#back {
          fill: none;
          stroke: #616c73; /* brand-grey */
          opacity: 0.3;
        }

        .loading svg polyline#front {
          fill: none;
          stroke: #7d8f9a; /* brand-light-blue */
          stroke-dasharray: 48, 144;
          stroke-dashoffset: 192;
          animation: dash_682 3s linear infinite;
        }

        @keyframes dash_682 {
          72.5% {
            opacity: 0;
          }

          to {
            stroke-dashoffset: 0;
          }
        }
        `}
      </style>
      <div className="loading">
        <svg width="64px" height="48px">
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="back" />
          <polyline points="0.157 23.954, 14 23.954, 21.843 48, 43 0, 50 24, 64 24" id="front" />
        </svg>
      </div>
    </div>
  );
}

export default AnimatedLogo;
