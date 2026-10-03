import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import LocationsAPI from '../services/LocationsAPI'
import { MAP_WIDTH, MAP_HEIGHT, landPath, borderPath, gridPath, stopPositions, towns } from '../data/europeMap'
import { regions } from '../data/regions'
import '../css/Locations.css'

// Builds the SVG path string for the tour road, connecting each stop to the next.
// "M x y" moves the pen to the first stop. "Q cx cy x y" draws a curve to the next stop,
// pulled toward a control point (cx, cy) that sits a bit to the side of the straight line,
// so each leg bends slightly and reads as a road instead of a ruler line.
const buildRoute = (stops) => stops.map((stop, i) => {
    if (i === 0) return `M ${stop.x} ${stop.y}`

    const prev = stops[i - 1]

    // Midpoint between the previous stop and this one
    const midX = (prev.x + stop.x) / 2
    const midY = (prev.y + stop.y) / 2

    // Push the midpoint sideways (perpendicular to the leg) to get the curve's control point
    const bendX = midX - (stop.y - prev.y) * 0.18
    const bendY = midY + (stop.x - prev.x) * 0.18

    return `Q ${bendX} ${bendY} ${stop.x} ${stop.y}`
}).join(' ')

// Front page: a road map of Europe with one clickable tour stop per location
const Locations = () => {
    const [locations, setLocations] = useState([])
    const [error, setError] = useState('')
    const navigate = useNavigate()

    // Load all locations from the API once, when the page first renders
    useEffect(() => {
        (async () => {
            try {
                const locationsData = await LocationsAPI.getAllLocations()
                setLocations(locationsData)
            }
            catch (err) {
                setError(err.message)
            }
        })()
    }, [])

    // Combine each location from the database with its map position (europeMap.js)
    // and its stop number, color and label side (regions.js), then sort by tour order.
    // Locations without a map position or region are skipped so they can't break the map.
    const stops = locations
        .filter(location => stopPositions[location.slug] && regions[location.slug])
        .map(location => ({ ...location, ...stopPositions[location.slug], ...regions[location.slug] }))
        .sort((a, b) => a.stop - b.stop)

    const route = buildRoute(stops)

    // SVG shapes aren't real links, so let keyboard users open a stop with Enter or Space
    const handleKeyDown = (event, slug) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault()
            navigate(`/${slug}`)
        }
    }

    return (
        <section className='tour'>
            <div className='tour-intro'>
                <p className='eyebrow'>The Underground Tour Map</p>
                <h2>Pick a stop on the road</h2>
                <p>Five cities, five venues, one route across the European metal underground. Click a stop to see what is happening there.</p>
            </div>

            {error && <p className='tour-error'>Could not load the tour stops: {error}</p>}

            <div className='tour-map'>
                {/* viewBox sets the drawing's coordinate system; CSS scales it to fit the screen */}
                <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role='group' aria-label='Road map of Europe with five tour stops'>

                    {/* Base map, drawn back to front: sea, gridlines, land, country borders */}
                    <rect className='map-sea' width={MAP_WIDTH} height={MAP_HEIGHT} />
                    <path className='map-grid' d={gridPath} />
                    <path className='map-land' d={landPath} />
                    <path className='map-borders' d={borderPath} />

                    {/* Background cities, only there to make it look like a road map */}
                    {towns.map(town =>
                        <g key={town.name} className='map-town'>
                            <circle cx={town.x} cy={town.y} r='2' />
                            <text x={town.x + 6} y={town.y + 4}>{town.name}</text>
                        </g>
                    )}

                    {/* The road is the same path drawn three times, stacked:
                        a thick black edge, red asphalt on top, then dashed lane markings */}
                    <path className='map-route-casing' d={route} />
                    <path className='map-route' d={route} />
                    <path className='map-route-lane' d={route} />

                    {/* One clickable pin per location */}
                    {stops.map(stop =>
                        <g
                            key={stop.slug}
                            className='map-stop'
                            // --accent is a CSS variable, so each pin's styles use that region's color
                            style={{ '--accent': stop.color }}
                            // Move the whole pin group to the stop's map position
                            transform={`translate(${stop.x} ${stop.y})`}
                            // Make the pin behave like a link for keyboard and screen reader users
                            role='link'
                            tabIndex='0'
                            aria-label={`Stop ${stop.stop}: ${stop.name}, ${stop.city}`}
                            onClick={() => navigate(`/${stop.slug}`)}
                            onKeyDown={(event) => handleKeyDown(event, stop.slug)}
                        >
                            <circle className='map-stop-halo' r='20' />
                            <circle className='map-stop-pin' r='11' />
                            <text className='map-stop-number' y='4'>{stop.stop}</text>

                            {/* Venue name and city, placed left or right of the pin (set in regions.js) */}
                            <g className={`map-stop-label ${stop.label}`}>
                                <text className='map-stop-name' x={stop.label === 'left' ? -20 : 20} y='-2'>{stop.name}</text>
                                <text className='map-stop-city' x={stop.label === 'left' ? -20 : 20} y='14'>{stop.city}, {stop.country}</text>
                            </g>
                        </g>
                    )}

                    {/* Compass in the bottom-left corner, with the north half in red */}
                    <g className='map-compass' transform='translate(70 640)'>
                        <circle r='30' />
                        <path d='M 0 -26 L 7 0 L 0 26 L -7 0 Z' />
                        <path className='north' d='M 0 -26 L 7 0 L -7 0 Z' />
                        <text y='-36'>N</text>
                    </g>

                    {/* Legend in the top-left corner, explaining the map symbols */}
                    <g className='map-legend' transform='translate(30 34)'>
                        <path className='map-route-casing' d='M 0 0 L 44 0' />
                        <path className='map-route' d='M 0 0 L 44 0' />
                        <path className='map-route-lane' d='M 0 0 L 44 0' />
                        <text x='56' y='5'>Tour route</text>
                        <circle className='legend-pin' cx='22' cy='30' r='8' />
                        <text x='56' y='35'>Tour stop</text>
                        <circle className='legend-town' cx='22' cy='58' r='2.5' />
                        <text x='56' y='63'>City</text>
                    </g>
                </svg>
            </div>

            {/* The same stops as a list under the map, easier to tap on a phone */}
            <ol className='tour-stops'>
                {stops.map(stop =>
                    <li key={stop.slug} style={{ '--accent': stop.color }}>
                        <Link to={`/${stop.slug}`}>
                            {/* padStart turns 1 into "01" */}
                            <span className='tour-stop-number'>{String(stop.stop).padStart(2, '0')}</span>
                            <span className='tour-stop-name'>{stop.name}</span>
                            <span className='tour-stop-city'>{stop.city}, {stop.country}</span>
                        </Link>
                    </li>
                )}
            </ol>
        </section>
    )
}

export default Locations
