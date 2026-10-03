import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import Event from '../components/Event'
import LocationsAPI from '../services/LocationsAPI'
import EventsAPI from '../services/EventsAPI'
import { regions } from '../data/regions'
import '../css/LocationEvents.css'

// Detail page for one location, e.g. /sweden. Shows the venue and all of its events.
const LocationEvents = () => {
    // Read the :slug part of the URL (set up in App.jsx), e.g. 'sweden'
    const { slug } = useParams()
    const [location, setLocation] = useState(null)
    const [events, setEvents] = useState([])
    const [error, setError] = useState('')

    // Fetch the location and its events. [slug] means this runs again
    // whenever the URL changes to a different location.
    useEffect(() => {
        (async () => {
            try {
                const locationData = await LocationsAPI.getLocationBySlug(slug)
                const eventsData = await EventsAPI.getEventsByLocation(slug)
                setLocation(locationData)
                setEvents(eventsData)
                setError('')
            }
            catch (err) {
                setError(err.message)
            }
        })()
    }, [slug])

    // Unknown slug (e.g. /nowhere) or server problem: show the message and a way back
    if (error) {
        return (
            <div className='location-status'>
                <h2>{error}</h2>
                <Link to='/' className='back-link'>Back to the map</Link>
            </div>
        )
    }

    // The data hasn't arrived yet
    if (!location) return <div className='location-status'><h2>Loading...</h2></div>

    // Stop number and accent color for this location (fallback in case it's not in regions.js)
    const region = regions[slug] || { stop: '', color: 'var(--blood)' }

    return (
        // Setting --accent here gives everything on this page, including the
        // event cards, this region's color
        <div className='location-events' style={{ '--accent': region.color }}>
            <Link to='/' className='back-link'>Back to the map</Link>

            <header className='location-header'>
                <div className='location-image'>
                    <img src={location.image} alt={location.name} />
                </div>

                <div className='location-info'>
                    {/* padStart turns 4 into "04" */}
                    <p className='eyebrow'>Tour stop {String(region.stop).padStart(2, '0')}</p>
                    <h2>{location.name}</h2>
                    <p className='location-place'>{location.city}, {location.country}</p>
                    <p className='location-description'>{location.description}</p>
                </div>
            </header>

            <h3 className='events-heading'>Upcoming and past events</h3>

            {/* One card per event, or a message if this location has none */}
            {
                events.length > 0 ? (
                    <div className='event-grid'>
                        {events.map(event =>
                            <Event
                                key={event.id}
                                title={event.title}
                                date={event.date}
                                image={event.image}
                            />
                        )}
                    </div>
                ) : <p className='no-events'>No events scheduled at this location yet.</p>
            }
        </div>
    )
}

export default LocationEvents
