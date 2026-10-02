import { pool } from '../config/database.js'

const getEvents = async (req, res) => {
    try {
        const results = await pool.query(`
            SELECT events.*, locations.name AS location_name, locations.slug AS location_slug
            FROM events
            JOIN locations ON events.location_id = locations.id
            ORDER BY events.date ASC
        `)
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getEventById = async (req, res) => {
    try {
        const { id } = req.params
        const results = await pool.query('SELECT * FROM events WHERE id = $1', [id])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Event not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getEventsByLocation = async (req, res) => {
    try {
        const { slug } = req.params
        const results = await pool.query(`
            SELECT events.*
            FROM events
            JOIN locations ON events.location_id = locations.id
            WHERE locations.slug = $1
            ORDER BY events.date ASC
        `, [slug])
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    getEvents,
    getEventById,
    getEventsByLocation
}
