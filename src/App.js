import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  const [fields, setFields] = useState([]);
  const [selectedMode, setSelectedMode] = useState("");
  const [selectedField, setSelectedField] = useState(null);
  const [showGrid, setShowGrid] = useState(false);
  const [showList, setShowList] = useState(false);
  const [activeCells, setActiveCells] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://60816d9073292b0017cdd833.mockapi.io/modes');
        if (!response.ok) {
          throw new Error('Network error');
        }
        const jsonData = await response.json();
        setFields(jsonData);
      } catch (error) {
        console.error('Fetching error:', error);
      }
    };

    fetchData();
  }, []);

  const handleModeChange = (event) => {
    setSelectedField(fields.find((field) => field.name === event.target.value));
    setSelectedMode(event.target.value);
    setShowGrid(false);
    setShowList(false);
    setActiveCells([]);
  };

  const handleStart = () => {
    setShowGrid(true);
    setShowList(true);
  };

  const handleReset = () => {
    setActiveCells([]);
  };

  const handleCellHover = (row, col) => {
    const cellKey = `row${row}-col${col}`;
    if (activeCells.includes(cellKey)) {
      setActiveCells(activeCells.filter((cell) => cell !== cellKey));
    } else {
      setActiveCells([...activeCells, cellKey]);
    }
  };

  const generateGrid = () => {
    const grid = [];

    for (let row = 1; row <= selectedField.field; row++) {
      const rowCells = [];

      for (let col = 1; col <= selectedField.field; col++) {
        const cellStyle = {
          width: `${100 / selectedField.field}%`,
          paddingBottom: `${100 / selectedField.field}%`,
          border: '1px solid #565961',
          backgroundColor: activeCells.includes(`row${row}-col${col}`)
            ? '#1E90FF'
            : 'white',
        };

        rowCells.push(
          <div
            key={`${row}-${col}`}
            style={cellStyle}
            className={`row${row}-col${col}`}
            onMouseEnter={() => handleCellHover(row, col)}
          ></div>
        );
      }

      grid.push(
        <div key={row} className={`row row${row}`}>
          {rowCells}
        </div>
      );
    }

    return <div className='grid'>{grid}</div>;
  };

  const chosenFieldClasses = selectedField ? 'active' : '';

  return (
    <main className='main'>
      <div className='control-panel'>
        <select
          id='fieldSelect'
          onChange={handleModeChange}
          value={selectedMode}
          className='select'
        >
          <option value="" disabled>
            Pick mode
          </option>

          {fields.map(({ name, id }) => (
            <option key={id} value={name}>
              {name}
            </option>
          ))}
        </select>

        <button className='button' onClick={handleStart}>
          Start
        </button>

        <button className='button' onClick={handleReset}>
          Reset
        </button>
      </div>

      <div className={`chosen-field ${chosenFieldClasses}`}>
        {selectedMode 
          ? `Chosen field: ${selectedField.field}x${selectedField.field}` 
          : ''}
      </div>

      <div className={`container`}>
        <div className={`field ${showGrid ? 'active' : ''}`}>
          {showGrid && selectedField && generateGrid()}
        </div>

        {showList && (
          <div className={`active-cells-list ${showList && selectedField ? 'active' : ''}`}>
            <h3>Active Cells:</h3>
            <ul>
              {activeCells.map((cell) => (
                <li key={cell}>{cell}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}

export default App;