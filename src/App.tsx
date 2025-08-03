import * as d3 from "d3";
import { useEffect, useMemo, useRef, useState } from "react";
import { FancyCheckbox } from "./FancyCheckbox";
import { FancyHeading } from "./FancyHeading";
import "./index.css";

const PRIME_FACTORS = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29];

const isPrime = num => {
  if (num <= 1) return false;
  if (num <= 3) return true;
  if (num % 2 === 0 || num % 3 === 0) return false;
  for (let i = 5; i * i <= num; i += 6) {
    if (num % i === 0 || num % (i + 2) === 0) return false;
  }
  return true;
};

const isMultipleOf = (num, multiple) => num % multiple === 0;

const lineOptions = [
  { x1: 0.02, y1: 0.02, x2: 0.02, y2: 0.98 },
  { x1: 0.02, y1: 0.02, x2: 0.98, y2: 0.02 },
  { x1: 0.02, y1: 0.02, x2: 0.98, y2: 0.98 },

  { x1: 0.98, y1: 0.98, x2: 0.98, y2: 0.02 },
  { x1: 0.98, y1: 0.98, x2: 0.02, y2: 0.98 },
  { x1: 0.98, y1: 0.02, x2: 0.02, y2: 0.98 },

  { x1: 0.5, y1: 0.02, x2: 0.5, y2: 0.98 },
  { x1: 0.02, y1: 0.5, x2: 0.98, y2: 0.5 },
  { x1: 0.98, y1: 0.5, x2: 0.98, y2: 0.5 },
];

function App() {
  const [cols, setCols] = useState(12);
  const [rows, squareSize] = useMemo(() => {
    // get square size from cols
    const squareSize = Math.floor(window.innerWidth / cols);
    // get screen height
    const screenHeight = window.innerHeight;
    // get number of rows
    const rows = Math.floor(screenHeight / squareSize);
    return [rows, squareSize];
  }, [cols]);

  const [showNumbers, setShowNumbers] = useState(true);
  const [showPrimes, setShowPrimes] = useState(false);
  const [primeColor, setPrimeColor] = useState("#ff8888");
  const [primeMultiplesToMark, setPrimeMultiplesToMark] = useState<number[]>(
    []
  );
  const [primeToShapeMap, setPrimeToShapeMap] = useState<
    Record<number, { x1: number; y1: number; x2: number; y2: number }>
  >({
    2: lineOptions[0],
    3: lineOptions[1],
    5: lineOptions[2],
    7: lineOptions[3],
    11: lineOptions[4],
    13: lineOptions[5],
    17: lineOptions[6],
    19: lineOptions[7],
    23: lineOptions[8],
  });

  const svgRef = useRef(null);

  useEffect(() => {
    const data = Array.from({ length: cols * rows }).map((_, index) => ({
      number: index,
      x: (index % cols) * squareSize,
      y: Math.floor(index / cols) * squareSize,
      isPrime: showPrimes ? isPrime(index) : false,
    }));

    // TODO enter, update, exit, animations
    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous content
    const group = svg.selectAll("g").data(data).enter().append("g");

    group
      .append("rect")
      .attr("x", d => d.x)
      .attr("y", d => d.y)
      .attr("width", squareSize)
      .attr("height", squareSize)
      .attr("fill", d => (d.isPrime ? primeColor : "white"))
      .attr("stroke", "lightgrey");

    if (showNumbers) {
      group
        .append("text")
        .attr("x", d => d.x + squareSize / 2)
        .attr("y", d => d.y + squareSize / 2)
        .attr("dy", ".35em")
        .attr("text-anchor", "middle")
        .attr("font-size", squareSize / 3)
        .attr("font-weight", d => (d.isPrime ? "bold" : "normal"))
        .text(d => d.number);
    }

    Object.entries(primeToShapeMap).forEach(([primeString, shape]) => {
      const prime = Number(primeString);
      if (primeMultiplesToMark.includes(prime)) {
        group
          .filter(d => isMultipleOf(d.number, prime))
          .append("line")
          .attr("x1", d => d.x + shape.x1 * squareSize)
          .attr("y1", d => d.y + shape.y1 * squareSize)
          .attr("x2", d => d.x + shape.x2 * squareSize)
          .attr("y2", d => d.y + shape.y2 * squareSize)
          .attr("stroke", "black")
          .attr("offset-path", 2)
          .attr("stroke-width", 2);
      }
    });
  }, [
    cols,
    rows,
    squareSize,
    showPrimes,
    showNumbers,
    primeMultiplesToMark,
    primeToShapeMap,
    primeColor,
  ]);

  return (
    <div className="w-screen h-screen flex gap-2 p-3">
      <div className="flex flex-col gap-4">
        {/* alternate color of characters in title */}
        <FancyHeading
          text="Prime Hunter"
          className="text-4xl font-bold space-x-2"
        />
        <img
          // use public/logo.png
          src="/logo.png"
          alt="sydney grammar"
          className="w-80"
        />

        <div className="flex items-center justify-between">
          <label>Number of columns</label>
          <input
            type="range"
            min={1}
            max={100}
            value={cols}
            onChange={e => setCols(+e.target.value)}
            className="ml-2"
          />
        </div>

        {/* Toggle to show/hide numbers */}
        <FancyCheckbox
          checked={showNumbers}
          onChange={setShowNumbers}
          label="Show Numbers"
        />
        {/* Toggle to show/hide primes */}
        <FancyCheckbox
          checked={showPrimes}
          onChange={setShowPrimes}
          label="Show Primes"
        />
        {showPrimes && (
          // color picker input for prime color
          <input
            type="color"
            value={primeColor}
            onChange={e => setPrimeColor(e.target.value)}
          />
        )}

        {/* Toggle all prime factors to mark */}
        <div className="flex flex-col items-center gap-2 p-2">
          <div className="flex items-center gap-4">
            <input
              type="checkbox"
              checked={primeMultiplesToMark.length === PRIME_FACTORS.length}
              onChange={e => {
                if (e.target.checked) {
                  setPrimeMultiplesToMark(PRIME_FACTORS);
                } else {
                  setPrimeMultiplesToMark([]);
                }
              }}
            />
            <div>All</div>
          </div>
          {/* show marking for each prime factor*/}
          {PRIME_FACTORS.map(prime => (
            <div className="w-full flex items-center gap-4 justify-center">
              <input
                type="checkbox"
                checked={primeMultiplesToMark.includes(prime)}
                onChange={e =>
                  setPrimeMultiplesToMark(
                    primeMultiplesToMark.includes(prime)
                      ? primeMultiplesToMark.filter(x => x !== prime)
                      : [...primeMultiplesToMark, prime]
                  )
                }
              />
              <div>{prime}</div>
              <svg
                className=""
                width={squareSize}
                height={squareSize}
                viewBox={`-5 -5 ${squareSize + 5} ${squareSize + 5}`}
              >
                <g>
                  <rect
                    x="0"
                    y="0"
                    width={squareSize * 0.9}
                    height={squareSize * 0.9}
                    fill="white"
                    stroke="lightgrey"
                  />
                  <line
                    x1={(primeToShapeMap[prime]?.x1 ?? 0) * squareSize * 0.9}
                    y1={(primeToShapeMap[prime]?.y1 ?? 0) * squareSize * 0.9}
                    x2={(primeToShapeMap[prime]?.x2 ?? 0) * squareSize * 0.9}
                    y2={(primeToShapeMap[prime]?.y2 ?? 0) * squareSize * 0.9}
                    stroke="black"
                    strokeWidth={2}
                  />
                </g>
              </svg>
            </div>
          ))}
        </div>
      </div>

      <div className="h-full flex-grow">
        <svg ref={svgRef} className="w-full h-full"></svg>
      </div>
    </div>
  );
}

export default App;
