const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const session = require('express-session');

const db = require('./database/config');
const fr = require('./locales/fr');

const app = express();
const PORT = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
    secret: 'event-booking-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 24 * 60 * 60 * 1000 } // 24 hours
}));
app.use(express.static('public'));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Make translations available to all views
app.use((req, res, next) => {
  res.locals.t = fr;
  next();
});

// Helper function to get prices from database
const getPrices = async () => {
  try {
    const result = await db.query('SELECT event_type, price FROM admin_prices');
    const prices = {};
    result.rows.forEach(row => {
      prices[row.event_type] = parseFloat(row.price);
    });
    return prices;
  } catch (error) {
    console.error('Error fetching prices:', error);
    return { wedding: 500, birthday: 300, baptism: 200 };
  }
};

// Routes
app.get('/', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('index', { prices });
  } catch (error) {
    console.error('Error loading home page:', error);
    res.render('index', { prices: { wedding: 500, birthday: 300, baptism: 200 } });
  }
});

app.get('/wedding', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('wedding', { prices });
  } catch (error) {
    console.error('Error loading wedding page:', error);
    res.render('wedding', { prices: { wedding: 500, birthday: 300, baptism: 200 } });
  }
});

app.get('/birthday', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('birthday', { prices });
  } catch (error) {
    console.error('Error loading birthday page:', error);
    res.render('birthday', { prices: { wedding: 500, birthday: 300, baptism: 200 } });
  }
});

app.get('/baptism', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('baptism', { prices });
  } catch (error) {
    console.error('Error loading baptism page:', error);
    res.render('baptism', { prices: { wedding: 500, birthday: 300, baptism: 200 } });
  }
});

app.get('/wedding/booking', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('booking', { 
      eventType: 'wedding', 
      eventName: 'Mariage',
      prices 
    });
  } catch (error) {
    console.error('Error loading wedding booking:', error);
    res.render('booking', { 
      eventType: 'wedding', 
      eventName: 'Mariage',
      prices: { wedding: 500, birthday: 300, baptism: 200 }
    });
  }
});

app.get('/birthday/booking', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('booking', { 
      eventType: 'birthday', 
      eventName: 'Anniversaire',
      prices 
    });
  } catch (error) {
    console.error('Error loading birthday booking:', error);
    res.render('booking', { 
      eventType: 'birthday', 
      eventName: 'Anniversaire',
      prices: { wedding: 500, birthday: 300, baptism: 200 }
    });
  }
});

app.get('/baptism/booking', async (req, res) => {
  try {
    const prices = await getPrices();
    res.render('booking', { 
      eventType: 'baptism', 
      eventName: 'Baptême',
      prices 
    });
  } catch (error) {
    console.error('Error loading baptism booking:', error);
    res.render('booking', { 
      eventType: 'baptism', 
      eventName: 'Baptême',
      prices: { wedding: 500, birthday: 300, baptism: 200 }
    });
  }
});

app.post('/submit-booking', async (req, res) => {
  try {
    const { eventType, fullName, phone, email, eventDate, guests, message } = req.body;
    
    // Get price from database
    const priceResult = await db.query(
      'SELECT price FROM admin_prices WHERE event_type = $1',
      [eventType]
    );
    
    const price = priceResult.rows[0]?.price || 200;
    
    // Save booking to database
    const result = await db.query(
      `INSERT INTO bookings (event_type, full_name, phone, email, event_date, guests, message, price)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [eventType, fullName, phone, email, eventDate, guests, message, price]
    );
    
    const booking = result.rows[0];
    
    res.redirect(`/summary/${booking.id}`);
  } catch (error) {
    console.error('Error submitting booking:', error);
    res.status(500).send('Erreur lors de la soumission de la réservation');
  }
});

app.get('/summary/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    
    if (result.rows.length === 0) {
      return res.redirect('/');
    }
    
    const booking = result.rows[0];
    res.render('summary', { booking });
  } catch (error) {
    console.error('Error loading summary:', error);
    res.redirect('/');
  }
});

// Admin authentication middleware
const adminAuth = (req, res, next) => {
    if (req.session && req.session.isAdmin) {
        return next();
    }
    res.redirect('/admin/login');
};

// Admin login routes
app.get('/admin/login', (req, res) => {
    res.render('admin-login', { t: fr });
});

app.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username === 'admin' && password === 'admin') {
        req.session.isAdmin = true;
        res.redirect('/admin');
    } else {
        res.render('admin-login', { 
            t: fr, 
            error: 'Nom d\'utilisateur ou mot de passe incorrect' 
        });
    }
});

app.get('/admin/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/admin/login');
});

// Protected admin routes
app.get('/admin', adminAuth, async (req, res) => {
    try {
        const bookings = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
        const prices = await db.query('SELECT * FROM admin_prices');
        
        res.render('admin', { 
            t: fr, 
            bookings: bookings.rows || [], 
            prices: prices.rows || [] 
        });
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
        res.status(500).send('Erreur serveur');
    }
});

app.get('/admin/bookings', adminAuth, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM bookings ORDER BY created_at DESC');
        res.json(result.rows || []);
    } catch (error) {
        console.error('Error fetching bookings:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

app.post('/admin/prices', adminAuth, async (req, res) => {
    try {
        const { eventType, price } = req.body;
        await db.query(
            'UPDATE admin_prices SET price = $1, updated_at = $2 WHERE event_type = $3',
            [price, new Date().toISOString(), eventType]
        );
        res.json({ success: true });
    } catch (error) {
        console.error('Error updating price:', error);
        res.status(500).json({ error: 'Erreur serveur' });
    }
});

// Start server
app.listen(PORT, () => {
  console.log(`✅ Serveur démarré sur http://localhost:${PORT}`);
  console.log(`🌍 Application en français`);
  console.log(`🗄️ Base de données File-based connectée`);
});
