const db = require('./config');

const createTables = async () => {
  try {
    // The database is automatically initialized when the config is loaded
    // This script now just verifies the setup
    
    // Test reading from the database
    const pricesResult = await db.query('SELECT * FROM admin_prices');
    const bookingsResult = await db.query('SELECT * FROM bookings');
    
    console.log('✅ File-based database initialized successfully');
    console.log(`✅ Default prices loaded: ${pricesResult.rows.length} price entries`);
    console.log(`✅ Bookings table ready: ${bookingsResult.rows.length} existing bookings`);
    console.log('✅ Database is ready to use!');
    
  } catch (error) {
    console.error('❌ Error initializing database:', error);
  } finally {
    await db.end();
  }
};

createTables();
