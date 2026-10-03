import React from 'react'
import { useRoutes, Link, NavLink } from 'react-router-dom'
import Locations from './pages/Locations'
import LocationEvents from './pages/LocationEvents'
import Events from './pages/Events'
import './App.css'

const App = () => {
  // Which page to show for each URL
  let element = useRoutes([
    {
      // Front page: the tour map
      path: '/',
      element: <Locations />
    },
    {
      // Every event at every location
      path: '/events',
      element: <Events />
    },
    {
      // One route for all locations: /uk, /sweden, /france...
      // :slug is a placeholder that LocationEvents reads with useParams().
      // React Router prefers exact paths, so /events never lands here.
      path: '/:slug',
      element: <LocationEvents />
    }
  ])

  return (
    <div className='app'>

      {/* Top bar shown on every page */}
      <header className='site-header'>
        <h1 className='brand'><Link to='/'>Riff Road</Link></h1>

        {/* NavLink adds an "active" class to the link for the current page, used to highlight it.
            "end" makes Tour Map active only on "/" exactly, not on every page. */}
        <nav className='site-nav'>
          <NavLink to='/' end>Tour Map</NavLink>
          <NavLink to='/events'>All Events</NavLink>
        </nav>
      </header>

      {/* The current page, chosen by the routes above */}
      <main className='site-main'>
        {element}
      </main>
    </div>
  )
}

export default App
