import Navbar from './component/Navbar'
import WeatherDashboard from './component/WeatherDashboard'
import {UserContextProvider} from './component/UserContext'
import './App.css'

function App() {
  return (
    <UserContextProvider>
      <div className="app-page">
        <div className="app-glow app-glow-top" />
        <div className="app-glow app-glow-bottom" />
        <main className="app-shell">
          <Navbar />
          <WeatherDashboard />
        </main>
      </div>
    </UserContextProvider>
  )
}

export default App;
