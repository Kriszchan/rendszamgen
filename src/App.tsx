import { useState } from 'react'

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomLetters(length: number): string {
  return Array.from({ length }, () => LETTERS[randomInt(0, LETTERS.length - 1)]).join('')
}

function randomDigits(length: number): string {
  return Array.from({ length }, () => randomInt(0, 9).toString()).join('')
}

function generateModernPlate(): string {
  return `${randomLetters(2)}   ${randomLetters(2)}-${randomDigits(3)}`
}


function createPlate(): string {
  return generateModernPlate()
}

function App() {

  const [plate, setPlate] = useState([createPlate(), createPlate(), createPlate(), createPlate(), createPlate()])
  const plateImageUrl = '/plate-bg.png'

  const generate = () => {
    setPlate([createPlate(), createPlate(), createPlate(), createPlate(), createPlate()])
  }


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')
    
    if (value.length > 2) {
      value = value.slice(0, 2) + ' ' + value.slice(2)
    }
    if (value.length > 5) {
      value = value.slice(0, 5) + '-' + value.slice(5)
    }

    setPlate([value, ...plate.slice(1)])
  }

  return (
    <div className="container py-5 h-80 my-auto overflow-y-hidden">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-3">Magyar rendszámtábla generátor</h2>
              <div className="mb-3 mt-4">
                <label className="form-label text-muted small text-center mx-auto w-100">Rendszám szerkesztése</label>
                <input 
                  type="text" 
                  className="form-control form-control-lg text-center fw-bold text-uppercase mb-4 w-50 mx-auto" 
                  style={{ letterSpacing: '2px' }}
                  value={plate[0]} 
                  onChange={handleInputChange} 
                  placeholder="AA BB-123"
                />
              </div>
              {
                plate.map((p, index) => (
                  <div key={index} className="d-flex justify-content-center mb-3">
                    <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
                      <img src={plateImageUrl} alt="plate background" className="img-fluid d-block" style={{ width: '100%', height: 'auto' }} />
                      <div aria-live="polite" style={{
                          position: 'absolute',
                          left: '58.5%',
                          top: '56%',
                          transform: 'translate(-50%, -50%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '85%',
                          textAlign: 'center',
                          fontSize: '5.2rem',
                          fontWeight: 800,
                          color: '#0b0b0b',
                          textTransform: 'uppercase',
                          letterSpacing: '1rem',
                          fontFamily: 'HuLi-Regular, Arial, sans-serif',
                          pointerEvents: 'none'
                        }}
                      >
                        {p}
                      </div>
                    </div>
                  </div>
                ))
                  
              }

              <div className="d-flex gap-2 justify-content-center mb-2">
                <button className="btn btn-primary" type="button" onClick={generate}>Generálj véletlenszerűt</button>
              </div>
              
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
