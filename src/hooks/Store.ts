import { useReducer } from 'react'
import { type Language, type Action, type State, type LanguageOptions } from '../types.d'
import { AUTO_LANGUAGE } from '../constants'

const initialState: State = {
  fromLanguage: 'auto',
  toLanguage: 'en',
  inputText: '',
  translatedText: '',
  loading: false
}

function reducer (state: State, action: Action) {
  const { type } = action
  if (type === 'INTERCHANGE_LANGUAGES') {
    if (state.fromLanguage === AUTO_LANGUAGE) return state
    return {
      ...state,
      fromLanguage: state.toLanguage,
      toLanguage: state.fromLanguage
    }
  } else if (type === 'SET_FROM_LANGUAGE') {
    return {
      ...state,
      fromLanguage: action.payload
    }
  } else if (type === 'SET_TO_LANGUAGE') {
    return {
      ...state,
      toLanguage: action.payload
    }
  } else if (type === 'SET_INPUT_TEXT') {
    return {
      ...state,
      loading: true,
      inputText: action.payload
    }
  } else if (type === 'SET_TRANSLATED_TEXT') {
    return {
      ...state,
      loading: false,
      translatedText: action.payload
    }
  }
  return state
}

export function useStore () {
  const [{
    fromLanguage,
    toLanguage,
    inputText,
    translatedText,
    loading
  }, dispatch] = useReducer(reducer, initialState)

  const interchangeLanguages = () => { dispatch({ type: 'INTERCHANGE_LANGUAGES' }) }
  const setFromLanguage = (payload: LanguageOptions) => { dispatch({ type: 'SET_FROM_LANGUAGE', payload }) }
  const setToLanguage = (payload: Language) => { dispatch({ type: 'SET_TO_LANGUAGE', payload }) }
  const setInputText = (payload: Language) => { dispatch({ type: 'SET_INPUT_TEXT', payload }) }
  const setTranslatedText = (payload: Language) => { dispatch({ type: 'SET_TRANSLATED_TEXT', payload }) }

  return {
    fromLanguage,
    toLanguage,
    inputText,
    translatedText,
    loading,
    interchangeLanguages,
    setFromLanguage,
    setToLanguage,
    setInputText,
    setTranslatedText
  }
}
