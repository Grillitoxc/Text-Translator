import { useStore } from './hooks/Store'
import './styles/styles.css'

function App () {
  const { fromLanguage, setFromLanguage } = useStore()

  return (
    <div className='container'>
      <div className='card input-wrapper'>
        <div className="from-text">
          <span className="heading">
            From:</span>
          {/* dropdown to select the language */}
          <div className="dropdown-container active" id='input-text'>
            <div className="dropdown-toggle">
              <span className="selected">Detección automática</span>
            </div>
            <ul className='dropdown-menu'>
              <li className="option active">Español</li>
              <li className="option">Inglés</li>
              <li className="option">Francés</li>
            </ul>
          </div>
        </div>
      </div>
      <div className="center"></div>
      <div className='card output-wrapper'></div>
    </div>
  )
}

export default App
