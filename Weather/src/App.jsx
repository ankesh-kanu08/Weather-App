import { useState } from 'react'
import Navbar from './component/Navbar'
import Search from './component/Search'
import Comingdays from './component/Comingdays'
import Api from './component/Api'
import WeatherDashboard from './component/WeatherDashboard'
import {UserContextProvider} from './component/UserContext'

function App() {


  return (
    <>
    <UserContextProvider>
     <Navbar/>
     <Search/>
     <WeatherDashboard/>
     <Comingdays/>
     </UserContextProvider>
     {/* <Api/> */}
    </>
  )
}

export default App;
