import { useEffect, useState } from 'react'
import { useStore } from './hooks/Store'
import './styles/card.css'
import './styles/swap.css'
import { SUPPORTED_LANGUAGES, AUTO_LANGUAGE } from './constants'
import { type Language, type LanguageOptions } from './types'

function App() {
  const {
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    inputText,
    setInputText,
    translatedText,
    setTranslatedText,
    loading,
    setLoading
  } = useStore()

  const [inputDropdownOpen, setInputDropdownOpen] = useState<boolean>(false)
  const [outputDropdownOpen, setOutputDropdownOpen] = useState<boolean>(false)
  const [inputSelectedLanguage, setInputSelectedLanguage] = useState<string>(AUTO_LANGUAGE)
  const [outputSelectedLanguage, setOutputSelectedLanguage] = useState<string>('Inglés')

  const toggleInputDropdown = () => {
    setInputDropdownOpen(!inputDropdownOpen)
  }

  const selectInputLanguage = (language: LanguageOptions, value: string) => {
    return () => {
      setFromLanguage(language)
      setInputSelectedLanguage(value)
      toggleInputDropdown()
    }
  }

  const toggleOutputDropdown = () => {
    setOutputDropdownOpen(!outputDropdownOpen)
  }

  const selectOutputLanguage = (language: Language, value: string) => {
    return () => {
      setToLanguage(language)
      setOutputSelectedLanguage(value)
      toggleOutputDropdown()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value.slice(0, 5000)
    setInputText(newText as Language)
  }

  return (
    <div className="container">
      <div className="card input-wrapper">
        <div className="from-text">
          <span className="heading">Idioma:</span>
          <div className={`dropdown-container ${inputDropdownOpen ? 'active' : ''}`} id="input-text">
            <div className="dropdown-toggle" onClick={toggleInputDropdown}>
              <i className="fa-solid fa-globe"></i>
              <span className="selected">{inputSelectedLanguage === 'auto' ? 'Detección automática' : inputSelectedLanguage}</span>
              <i className={`fa-solid fa-chevron-${inputDropdownOpen ? 'up' : 'down'}`}></i>
            </div>
            <ul className="dropdown-menu">
              {fromLanguage !== 'auto' && (
                <li
                  className={`option ${inputSelectedLanguage === 'auto' ? 'active' : ''}`}
                  onClick={selectInputLanguage('auto', 'Detección automática')}
                >
                  Detección automática
                </li>
              )}
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
                <li
                  key={key}
                  className={`option ${inputSelectedLanguage === value ? 'active' : ''}`}
                  onClick={selectInputLanguage(key as LanguageOptions, value)}
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-area">
          <textarea
            className="input"
            placeholder="Escribe algo..."
            id="input-text"
            value={inputText}
            onChange={handleInputChange}
          ></textarea>
          <div className="chars">
            <span id="input-chars">{inputText.length}</span>/5000
          </div>
        </div>

      </div>
      <div className="center">
        <div className="swap-position">
          <i className="fa-solid fa-right-left"></i>
        </div>
      </div>

      <div className='card output-wrapper'>
        <div className="from-text">
          <span className="heading">Idioma:</span>
          <div className={`dropdown-container ${outputDropdownOpen ? 'active' : ''}`} id="input-text">
            <div className="dropdown-toggle" onClick={toggleOutputDropdown}>
              <i className="fa-solid fa-globe"></i>
              <span className="selected">{outputSelectedLanguage}</span>
              <i className={`fa-solid fa-chevron-${outputDropdownOpen ? 'up' : 'down'}`}></i>
            </div>
            <ul className="dropdown-menu">
              {Object.entries(SUPPORTED_LANGUAGES).map(([key, value]) => (
                <li
                  key={key}
                  className={`option ${outputSelectedLanguage === value ? 'active' : ''}`}
                  onClick={selectOutputLanguage(key as Language, value)}
                >
                  {value}
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="text-area">
          <textarea
            className="output"
            disabled
            placeholder="Traducción"
            id="output-text"
            value={translatedText}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default App
