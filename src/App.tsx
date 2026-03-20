import { useEffect, useState, type ChangeEvent } from 'react'

const PLATE_API_URL = 'https://pk-backend.jcloud.jedlik.cloud'

async function fetchPlateFromBackend() {
  const response = await fetch(PLATE_API_URL)

  if (!response.ok) {
    throw new Error('Plate API request failed')
  }

  const data: unknown = await response.json()

  console.log(data)
  if (Array.isArray(data)) {
    const plates = data.filter((item): item is string => typeof item === 'string')
    if (plates.length > 0) {
      return data as string[]
    }
  }

  if (typeof data === 'string') {
    return data
  }

  if (typeof data === 'object' && data !== null && 'plate' in data) {
    const plate = (data as { plate?: unknown }).plate
    if (typeof plate === 'string') {
      return plate
    }
  }

  throw new Error('Invalid response format from plate API')
}

function App() {
  const [plate, setPlate] = useState<string[]>([''])
  const plateImageUrl = '/plate-bg.png'
  const [inputValue, setInputValue] = useState('')
  const [errorMessage, setErrorMessage] = useState('')

  const setRandomPlate = async () => {
    try {
      setErrorMessage('')
      const generatedPlate = await fetchPlateFromBackend()
      setPlate(generatedPlate as string[])
    } catch {
      setErrorMessage('Nem sikerült lekérni a rendszámot a backendből.')
    }
  }

  const generate = async () => {
    setInputValue('')
    await setRandomPlate()
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, '')

    if (v.length > 2) {
      v = v.slice(0, 2) + ' ' + v.slice(2)
    }
    if (v.length > 5) {
      v = v.slice(0, 5) + '-' + v.slice(5)
    }

    setInputValue(v)

    if (v.length === 9) {
      setPlate([v])
      setErrorMessage('')
    }
  }

  useEffect(() => {
    void setRandomPlate()
  }, [])

  return (
    <div className="container py-5 h-80 my-auto overflow-y-hidden">
      <div className="row justify-content-center">
        <div className="col-md-9 col-lg-7">
          <div className="card shadow-sm">
            <div className="card-body">
              <h2 className="card-title text-center mb-3">Magyar rendszámtábla generátor</h2>
              <div className="mb-3 mt-4">
                <label className="form-label text-muted small text-center mx-auto w-100">Rendszám szerkesztése</label>
                {
                  inputValue.length !== 9 && inputValue.length > 0 && (
                    <div className="alert alert-danger text-center w-50 mx-auto" role="alert">
                      Rendszám nem érvényes!
                    </div>
                  )
                }
                {
                  errorMessage && (
                    <div className="alert alert-danger text-center w-50 mx-auto" role="alert">
                      {errorMessage}
                    </div>
                  )
                }
                <input
                  type="text"
                  className="form-control form-control-lg text-center fw-bold text-uppercase mb-4 w-50 mx-auto"
                  style={{ letterSpacing: '2px' }}
                  maxLength={9}
                  value={inputValue}
                  onChange={handleInputChange}
                  placeholder="AA BB-123"
                />
              </div>
              {
                plate.map((p, index) => (
                  <div key={index} className="d-flex justify-content-center mb-3">
                    <div style={{ position: 'relative', width: '100%', maxWidth: 560 }}>
                      <img src={plateImageUrl} alt="plate background" className="img-fluid d-block" style={{ width: '100%', height: 'auto' }} />
                      <div
                        aria-live="polite"
                        style={{
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
