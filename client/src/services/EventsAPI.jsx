const getAllEvents = async () => {
    const response = await fetch('/api/events')
    if (!response.ok) throw new Error('Failed to load events')
    return response.json()
}

const getEventsById = async (id) => {
    const response = await fetch(`/api/events/${id}`)
    if (!response.ok) throw new Error('Event not found')
    return response.json()
}

const getEventsByLocation = async (slug) => {
    const response = await fetch(`/api/locations/${slug}/events`)
    if (!response.ok) throw new Error('Failed to load events')
    return response.json()
}

export default {
    getAllEvents,
    getEventsById,
    getEventsByLocation
}
