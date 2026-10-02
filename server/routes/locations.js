import express from 'express'
import LocationsController from '../controllers/locations.js'
import EventsController from '../controllers/events.js'

const router = express.Router()

router.get('/', LocationsController.getLocations)
router.get('/:slug', LocationsController.getLocationBySlug)
router.get('/:slug/events', EventsController.getEventsByLocation)

export default router
