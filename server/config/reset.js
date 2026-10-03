import { pool } from './database.js'

// ---------- DATA ----------

const locations = [
    {
        slug: 'uk',
        name: 'The Foundry',
        city: 'Sheffield',
        country: 'United Kingdom',
        description: 'An old steelworks turned sweaty metalcore club.',
        image: 'https://picsum.photos/seed/foundry/800/500'
    },
    {
        slug: 'central',
        name: 'Neon Bunker',
        city: 'Berlin',
        country: 'Germany',
        description: 'A concrete bunker full of lasers, synths and breakdowns.',
        image: 'https://picsum.photos/seed/bunker/800/500'
    },
    {
        slug: 'sweden',
        name: 'Norrland Forge',
        city: 'Umeå',
        country: 'Sweden',
        description: 'An industrial hall in the frozen north, built for heavy, technical sounds.',
        image: 'https://picsum.photos/seed/forge/800/500'
    },
    {
        slug: 'nordic',
        name: 'The Frozen Chapel',
        city: 'Jyväskylä',
        country: 'Finland',
        description: 'A candlelit lakeside chapel for doom, sorrow and blackgaze.',
        image: 'https://picsum.photos/seed/chapel/800/500'
    },
    {
        slug: 'france',
        name: 'Le Sanctuaire',
        city: 'Bayonne',
        country: 'France',
        description: 'An open-air amphitheater by the Atlantic, dreamy and massive.',
        image: 'https://picsum.photos/seed/sanctuaire/800/500'
    }
]

// location = the slug of the venue the event happens at
const events = [
    { location: 'uk', title: 'Bring Me The Horizon: Sheffield Homecoming', date: '2026-09-12 20:00', image: '/images/bmth.jpg' },
    { location: 'uk', title: 'Architects: Brighton to Sheffield Night', date: '2026-10-30 20:00', image: 'https://picsum.photos/seed/architects/600/600' },

    { location: 'central', title: 'Electric Callboy: Neon Rave Pit', date: '2026-09-19 21:00', image: 'https://picsum.photos/seed/callboy/600/600' },
    { location: 'central', title: 'Annisokay: Post-Hardcore Night', date: '2026-10-16 20:00', image: 'https://picsum.photos/seed/annisokay/600/600' },
    { location: 'central', title: 'Harakiri for the Sky: Dark Room Session', date: '2026-11-20 22:00', image: 'https://picsum.photos/seed/harakiri/600/600' },

    { location: 'sweden', title: 'Meshuggah + Cult of Luna: Umeå Double Bill', date: '2026-08-29 19:30', image: '/images/cult-of-luna.jpg' },
    { location: 'sweden', title: 'Imminence: Strings & Breakdowns', date: '2026-10-24 20:00', image: 'https://picsum.photos/seed/imminence/600/600' },
    { location: 'sweden', title: 'Opeth: Acoustic & Electric Evening', date: '2026-12-05 19:00', image: 'https://picsum.photos/seed/opeth/600/600' },

    { location: 'nordic', title: 'Swallow the Sun: Winter Doom Mass', date: '2026-09-26 20:00', image: '/images/swallow-the-sun.jpg' },
    { location: 'nordic', title: 'Hour of the Nightingale: Trees of Eternity Tribute Night', date: '2026-11-07 19:00', image: 'https://picsum.photos/seed/trees/600/600' },
    { location: 'nordic', title: 'MØL: Blackgaze at the Lake', date: '2026-11-28 20:00', image: 'https://picsum.photos/seed/mol/600/600' },

    { location: 'france', title: 'Alcest: Sunset Set', date: '2026-09-05 19:00', image: '/images/alcest.jpg' },
    { location: 'france', title: 'Resolve: Prog Metalcore Showcase', date: '2026-10-10 20:00', image: 'https://picsum.photos/seed/resolve/600/600' },
    { location: 'france', title: 'Gojira: Ocean Benefit Show', date: '2026-11-14 20:30', image: '/images/gojira.jpg' }
]

// ---------- TABLES ----------

const createTables = async () => {
    await pool.query(`
        DROP TABLE IF EXISTS events;
        DROP TABLE IF EXISTS locations;

        CREATE TABLE locations (
            id SERIAL PRIMARY KEY,
            slug VARCHAR(50) UNIQUE NOT NULL,
            name VARCHAR(100) NOT NULL,
            city VARCHAR(100) NOT NULL,
            country VARCHAR(100) NOT NULL,
            description TEXT,
            image TEXT
        );

        CREATE TABLE events (
            id SERIAL PRIMARY KEY,
            title VARCHAR(200) NOT NULL,
            date TIMESTAMP NOT NULL,
            image TEXT,
            location_id INTEGER NOT NULL REFERENCES locations(id) ON DELETE CASCADE
        );
    `)
    console.log('tables created')
}

// ---------- SEED DATA ----------

const seedLocations = async () => {
    const ids = {}

    for (const location of locations) {
        const result = await pool.query(
            `INSERT INTO locations (slug, name, city, country, description, image)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING id`,
            [location.slug, location.name, location.city, location.country, location.description, location.image]
        )
        ids[location.slug] = result.rows[0].id
    }

    console.log(` ${locations.length} locations added`)
    return ids
}

const seedEvents = async (locationIds) => {
    for (const event of events) {
        await pool.query(
            `INSERT INTO events (title, date, image, location_id)
             VALUES ($1, $2, $3, $4)`,
            [event.title, event.date, event.image, locationIds[event.location]]
        )
    }

    console.log(` ${events.length} events added`)
}

// ---------- RUN ----------

const reset = async () => {
    try {
        await createTables()
        const locationIds = await seedLocations()
        await seedEvents(locationIds)
    }
    catch (error) {
        console.error('reset failed:', error.message)
    }
    finally {
        await pool.end()
    }
}

reset()
