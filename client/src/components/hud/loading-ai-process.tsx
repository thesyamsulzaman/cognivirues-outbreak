import React from "react";

const LoadingAiProcess = () => {
  return (
    <div className="container">
      <svg
        className="cup shake"
        width="120"
        height="150"
        viewBox="0 0 120 150"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Cup body */}
        <path
          d="M30 20 Q60 0 90 20 L85 130 Q60 145 35 130 Z"
          fill="#e0e0e0"
          stroke="#555"
          strokeWidth="2"
        />
        {/* Water inside */}
        <path
          d="M35 60 Q60 45 85 60 L80 125 Q60 135 40 125 Z"
          fill="#00bfff"
          fillOpacity="0.6"
        />
        {/* Rim */}
        <ellipse
          cx="60"
          cy="20"
          rx="30"
          ry="10"
          fill="#e0e0e0"
          stroke="#555"
          strokeWidth="2"
        />
        {/* Water surface */}
        <ellipse
          cx="60"
          cy="60"
          rx="25"
          ry="8"
          fill="#00bfff"
          fillOpacity="0.7"
        />
      </svg>

      <p className="text-2xl text-center p-4">
        Grab a sip of water — this might take a while. <br />
        Time to hydrate while we work our magic....
      </p>

      <style jsx>
        {`
        .container {
          margin: 40px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .cup {
          transform-origin: center bottom;
        }

        .shake {
          animation: shake 1.2s ease-in-out infinite;
        }

        .caption {
          margin-top: 16px;
          text-align: center;
          color: #555;
          font-style: italic;
          font-size: 14px;
          opacity: 0.8;
        }

        @keyframes shake {
          0%,
          100% {
            transform: rotate(0deg);
          }
          20% {
            transform: rotate(-5deg);
          }
          40% {
            transform: rotate(5deg);
          }
          60% {
            transform: rotate(-5deg);
          }
          80% {
            transform: rotate(5deg);
          }
        }
      `.toString()}
        .
      </style>
    </div>
  );
};

export default LoadingAiProcess;
