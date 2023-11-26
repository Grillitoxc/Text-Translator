import { useEffect, useState } from 'react'
import { useStore } from './hooks/Store'
import './styles/card.css'
import './styles/swap.css'
import './styles/scrollbar.css'
import './styles/header-footer.css'
import './styles/toggle-darkmode.css'
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

  const githubProject = 'https://github.com/Grillitoxc/Google-Translate-GPT-Api'
  const githubAuthor = 'https://github.com/Grillitoxc'
  const openLink = (link: string) => {
    window.open(link, '_blank')
  }

  const handleSpeaker = (language: Language, text: string) => {
    const utterance = new SpeechSynthesisUtterance(text)
    utterance.lang = language
    speechSynthesis.getVoices()
    utterance.rate = 0.9
    speechSynthesis.speak(utterance)
  }

  const handleClipboard = (text: string) => {
    navigator.clipboard.writeText(text).catch((error) => {
      console.error('No se pudo copiar el texto: ', error)
    })
  }

  const [isDarkMode, setIsDarkMode] = useState(false)
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode)
    document.body.classList.toggle('dark', !isDarkMode)
  }

  return (
    <>
      <div className="header">
        <h1>Traductor de texto</h1>
      </div>
      <div className="container">
        <div className="card input-wrapper">
          <div className="from-text">
            <span className="heading">Idioma:</span>
            <div className={`dropdown-container ${inputDropdownOpen ? 'active' : ''}`} id="input-text">
              <div className="dropdown-toggle" onClick={toggleInputDropdown}>
                <i className="fa-solid fa-globe"></i>
                <span className="selected">{inputSelectedLanguage}</span>
                <i className={`fa-solid fa-chevron-${inputDropdownOpen ? 'up' : 'down'}`}></i>
              </div>
              <ul className="dropdown-menu">
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
            <div className="icons-container">
              <div className="icons">
                <i className="fa-solid fa-copy" onClick={() => { handleClipboard(inputText) }}></i>
                <i className="fa-solid fa-volume-high" onClick={() => { handleSpeaker(fromLanguage as Language, inputText) }}></i>
              </div>
              <span id="input-chars">{inputText.length} / 300</span>
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
            <div className="icons">
              <i className="fa-solid fa-copy" onClick={() => { handleClipboard(translatedText) }}></i>
              <i className="fa-solid fa-volume-high" onClick={() => { handleSpeaker(toLanguage as Language, translatedText) }}></i>
            </div>
          </div>
        </div>
      </div>
      <div className="footer">
        <i className="fa-brands fa-github" onClick={() => { openLink(githubProject) }}></i>
        <p
          className='footer-text'
          onClick={() => { openLink(githubAuthor) }}>
          Hecho por <span className='github-author'>Grillitoxc</span>
        </p>
        <div className="toggle-switch">
          <label className="switch-label">
            <input type="checkbox" className="checkbox" onClick={toggleDarkMode} />
            <span className="slider" ></span>
          </label>
        </div>
      </div>
    </>
  )
}

export default App
