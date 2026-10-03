import React from 'react'
import '../css/Event.css'

// One event card. The parent page passes in the event's data as props.
const Event = ({ title, date, image }) => {
    // The database sends the date as a string like "2026-10-25T03:00:00.000Z".
    // new Date() turns it into a Date object, shown in the viewer's own time zone.
    const eventDate = new Date(date)

    // Split the date into the pieces the card shows: "Oct", "24", "Saturday", 2026
    const month = eventDate.toLocaleDateString('en-US', { month: 'short' })
    const day = eventDate.toLocaleDateString('en-US', { day: 'numeric' })
    const weekday = eventDate.toLocaleDateString('en-US', { weekday: 'long' })
    const year = eventDate.getFullYear()

    // e.g. "8:00 PM"
    const formattedTime = eventDate.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit'
    })

    return (
        <article className='event-card'>
            <div className='event-image'>
                <img src={image} alt={title} />
            </div>

            <div className='event-body'>
                {/* Calendar-style date block on the left */}
                <div className='event-date'>
                    <span className='event-month'>{month}</span>
                    <span className='event-day'>{day}</span>
                    <span className='event-year'>{year}</span>
                </div>

                <div className='event-text'>
                    <h3>{title}</h3>
                    <p>{weekday}, {formattedTime}</p>
                </div>
            </div>
        </article>
    )
}

export default Event
