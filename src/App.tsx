import { useStore } from './hooks/Store'

function App () {
  const { fromLanguage, setFromLanguage } = useStore()

  return (
    <div>
      <h1>Google Translate</h1>
      <button onClick={() => { setFromLanguage('es') }}>
        Cambiar a español
      </button>
      {fromLanguage}
    </div>
  )
}

export default App
