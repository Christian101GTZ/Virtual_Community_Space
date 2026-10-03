const getAllLocations = async () => {
    const response = await fetch('/api/locations')
    if (!response.ok) throw new Error('Failed to load locations')
    return response.json()
}

const getLocationBySlug = async (slug) => {
    const response = await fetch(`/api/locations/${slug}`)
    if (!response.ok) throw new Error('Location not found')
    return response.json()
}

export default {
    getAllLocations,
    getLocationBySlug
}
