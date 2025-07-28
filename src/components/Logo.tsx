import React from "react";

type Props = React.HTMLAttributes<SVGElement>;

const Logo: React.FC<Props> = (props) => (
  <svg viewBox="85 110 430 430" fill="none" {...props}>
    <path
      stroke="darkred"
      fill="darkred"
      strokeWidth="15"
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M 96 265 L 300 520 L 504 265"
    />
    <path
      fill="cornsilk"
      d="M 300 500 L 100 250 C 150 150 250 150 300 200 C 350 150 450 150 500 250 L 300 500"
    />
    <path stroke="lightgray" strokeWidth="3" d="M 300 200 L 300 500" />
    <path
      stroke="black"
      strokeWidth="10"
      strokeLinecap="round"
      d="M 300 500 L 100 250 C 150 150 250 150 300 200 C 350 150 450 150 500 250 L 300 500"
    />

    <path
      fill="black"
      d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
    />
    <g transform="translate(55, 80), scale(0.8,0.8)">
      <path
        fill="black"
        d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
      />
      <g transform="translate(60, 90), scale(0.8,0.8)">
        <path
          fill="black"
          d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
        />
      </g>
    </g>
    <g transform="translate(600), scale(-1, 1)">
      <path
        fill="black"
        d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
      />
      <g transform="translate(55, 80), scale(0.8,0.8)">
        <path
          fill="black"
          d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
        />
        <g transform="translate(60, 90), scale(0.8,0.8)">
          <path
            fill="black"
            d="M 160 260 L 150 250 C 180 210 230 200 280 230 L 280 235 C 230 210 190 220 160 260"
          />
        </g>
      </g>
    </g>
  </svg>
);

export default Logo;
