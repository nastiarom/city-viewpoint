import React from 'react';
import { Range } from 'react-range';

const STEP = 1000;
const MIN = 0;
const MAX = 1000000;

function BudgetSlider({ budgetRange, setBudgetRange }) {
  const handleInputChange = (index, value) => {
    let val = Number(value);
    if (isNaN(val)) return;
    if (val < MIN) val = MIN;
    if (val > MAX) val = MAX;

    if (index === 0) {
      if (val > budgetRange[1]) val = budgetRange[1];
      setBudgetRange([val, budgetRange[1]]);
    } else {
      if (val < budgetRange[0]) val = budgetRange[0];
      setBudgetRange([budgetRange[0], val]);
    }
  };

  return (
    <div style={{ marginBottom: '1rem' }}>
      <label><b style={{ fontSize:'1.4rem'}}>Бюджет (₽):</b></label>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginTop: '0.5rem',
          justifyContent: 'center',
        }}
      >
        <div style={{ width: '90%', marginTop:'2.4rem'}}>
          <Range
            step={STEP}
            min={MIN}
            max={MAX}
            values={budgetRange}
            onChange={values => setBudgetRange(values)}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '6px',
                  width: '93%',
                  backgroundColor: '#e0dada',
                  borderRadius: '3px',
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props, index }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '20px',
                  width: '20px',
                  borderRadius: '50%',
                  backgroundColor: '#a7bd70',
                  boxShadow: '0px 2px 6px #AAA',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    top: '-28px',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: '12px',
                    padding: '4px 6px',
                    borderRadius: '4px',
                    backgroundColor: '#a7bd70',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {budgetRange[index].toLocaleString()}
                </div>
              </div>
            )}
          />
        </div>
      </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '1rem'}}>
          <span style={{ whiteSpace: 'nowrap', fontSize: '1.3rem' }}>От:</span>
          <input
            type="number"
            min={MIN}
            max={budgetRange[1]}
            step={STEP}
            value={budgetRange[0]}
            onChange={e => handleInputChange(0, e.target.value)}
            style={{
              width: '90px',
              padding: '6px 8px',
              fontSize: '1.2rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              transition: 'background-color 0.3s ease',
            }}
            onFocus={e => (e.target.style.backgroundColor = '#a7bd70')}
            onBlur={e => (e.target.style.backgroundColor = 'white')}
          />
          <span style={{ whiteSpace: 'nowrap', fontSize: '1.3rem' }}>₽</span>
        </div>
              {/* Поле "До" с текстом */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px',  marginTop: '0.5rem' }}>
          <span style={{ whiteSpace: 'nowrap', fontSize: '1.3rem' }}>До:</span>
          <input
            type="number"
            min={budgetRange[0]}
            max={MAX}
            step={STEP}
            value={budgetRange[1]}
            onChange={e => handleInputChange(1, e.target.value)}
            style={{
              width: '90px',
              padding: '6px 8px',
              fontSize: '1.2rem',
              borderRadius: '4px',
              border: '1px solid #ccc',
              transition: 'background-color 0.3s ease',
            }}
            onFocus={e => (e.target.style.backgroundColor = '#a7bd70')}
            onBlur={e => (e.target.style.backgroundColor = 'white')}
          />
            <span style={{ whiteSpace: 'nowrap', fontSize: '1.3rem' }}>₽</span>
        </div>
    </div>
  );
}

export default BudgetSlider;
