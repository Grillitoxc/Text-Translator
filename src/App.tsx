import { useEffect, useState } from 'react'
import { useStore } from './hooks/Store'
import './styles/card.css'
import './styles/swap.css'
import { SUPPORTED_LANGUAGES } from './constants'
import { type Language, type LanguageOptions } from './types'
import { useDebounce } from './hooks/Debounce'

function App () {
  const {
    fromLanguage,
    setFromLanguage,
    toLanguage,
    setToLanguage,
    inputText,
    setInputText,
    translatedText,
    setTranslatedText,
    loading
  } = useStore()

  const [inputDropdownOpen, setInputDropdownOpen] = useState<boolean>(false)
  const [outputDropdownOpen, setOutputDropdownOpen] = useState<boolean>(false)
  const [inputSelectedLanguage, setInputSelectedLanguage] = useState<string>('Español')
  const [outputSelectedLanguage, setOutputSelectedLanguage] = useState<string>('Inglés')
  const debouncedInputText = useDebounce(inputText, 500)

  useEffect(() => {
    const fetchData = async () => {
      if (debouncedInputText === '') {
        setTranslatedText('' as Language)
        return
      }

      if (fromLanguage === 'es-CL' && toLanguage === 'pt-BR') {
        const macaco: Record<number, string> = {
          0: 'Cabesiña mano',
          1: 'Vanina apunta a la cabeza por el amor de Dios',
          2: 'Las primeras dos rondas no cuentan',
          3: 'Morador...',
          4: 'CT CONCHETUMARE CT',
          5: 'voce e um macaco',
          6: 'Verde amistad, amistad verde',
          7: 'Jungla manito, jungla manito',
          8: 'John Serrano'
        }

        setTimeout(() => {
          const random = Math.floor(Math.random() * 9)
          console.log(random)
          setTranslatedText(macaco[random] as Language)
        }, 500)
        return
      }

      try {
        const apiURL = `https://api.mymemory.translated.net/get?q=${debouncedInputText}&langpair=${fromLanguage}|${toLanguage}`
        const response = await fetch(apiURL)
        const data = await response.json()
        setTranslatedText(data.responseData.translatedText)
        console.log(data.responseData.translatedText)
      } catch (error) {
        console.error('No se pudo traducir el texto: ', error)
      }
    }
    fetchData().catch((error) => {
      console.error('No se pudo traducir el texto: ', error)
    })
  }, [debouncedInputText, fromLanguage, toLanguage])

  const toggleInputDropdown = () => {
    setInputDropdownOpen(!inputDropdownOpen)
  }

  const selectInputLanguage = (language: LanguageOptions, value: string) => {
    return () => {
      if (language === toLanguage) return
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
      if (language === fromLanguage) return
      setToLanguage(language)
      setOutputSelectedLanguage(value)
      toggleOutputDropdown()
    }
  }

  const handleInputChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = event.target.value.slice(0, 300)
    setInputText(newText as Language)
  }

  const handleSwitchLanguages = () => {
    setFromLanguage(toLanguage)
    setToLanguage(fromLanguage as Language)
    setInputSelectedLanguage(outputSelectedLanguage)
    setOutputSelectedLanguage(inputSelectedLanguage)
    setInputText(translatedText as Language)
  }

  return (
    <div className="container">
      <div className="card input-wrapper">
        <div className="from-text">
          <span className="heading">Idioma:</span>
          <div className={`dropdown-container ${inputDropdownOpen ? 'active' : ''}`} id="input-text">
            <div className="dropdown-toggle" onClick={toggleInputDropdown}>
              <i className="fa-solid fa-globe"></i>
              {/* <span className="selected">{inputSelectedLanguage === 'auto' ? 'Detección automática' : inputSelectedLanguage}</span> */ }
              <span className="selected">{inputSelectedLanguage}</span>
              <i className={`fa-solid fa-chevron-${inputDropdownOpen ? 'up' : 'down'}`}></i>
            </div>
            <ul className="dropdown-menu">
              {/* fromLanguage !== 'auto' && (
                <li
                  className={`option ${inputSelectedLanguage === 'auto' ? 'active' : ''}`}
                  onClick={selectInputLanguage('auto', 'Detección automática')}
                >
                  Detección automática
                </li>
              ) */}
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
            <span id="input-chars">{inputText.length}</span>/300
          </div>
        </div>

      </div>
      <div className="center" onClick={handleSwitchLanguages}>
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
            placeholder={loading ? 'Traduciendo...' : 'Traducción'}
            id="output-text"
            value={translatedText}
          ></textarea>
        </div>
      </div>
    </div>
  )
}

export default App
