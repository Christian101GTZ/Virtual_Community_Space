import { pool } from '../config/database.js'

const getLocations = async (req, res) => {
    try {
        const results = await pool.query('SELECT * FROM locations ORDER BY id ASC')
        res.status(200).json(results.rows)
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

const getLocationBySlug = async (req, res) => {
    try {
        const { slug } = req.params
        const results = await pool.query('SELECT * FROM locations WHERE slug = $1', [slug])

        if (results.rows.length === 0) {
            return res.status(404).json({ error: 'Location not found' })
        }

        res.status(200).json(results.rows[0])
    }
    catch (error) {
        res.status(409).json({ error: error.message })
    }
}

export default {
    getLocations,
    getLocationBySlug
}
