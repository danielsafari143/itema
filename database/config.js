const fs = require('fs');
const path = require('path');

// File-based Database Simulation
// This replaces PostgreSQL with JSON file storage for development purposes

class FileBasedDB {
  constructor() {
    this.dataDir = path.join(__dirname, 'data');
    this.initializeDB();
  }

  // Initialize database with default data
  initializeDB() {
    // Create data directory if it doesn't exist
    if (!fs.existsSync(this.dataDir)) {
      fs.mkdirSync(this.dataDir, { recursive: true });
    }

    // Initialize bookings table
    const bookingsFile = path.join(this.dataDir, 'bookings.json');
    if (!fs.existsSync(bookingsFile)) {
      fs.writeFileSync(bookingsFile, JSON.stringify([], null, 2));
    }

    // Initialize admin_prices table with default prices
    const pricesFile = path.join(this.dataDir, 'admin_prices.json');
    if (!fs.existsSync(pricesFile)) {
      const defaultPrices = [
        { id: 1, event_type: 'wedding', price: 500, updated_at: new Date().toISOString() },
        { id: 2, event_type: 'birthday', price: 300, updated_at: new Date().toISOString() },
        { id: 3, event_type: 'baptism', price: 200, updated_at: new Date().toISOString() }
      ];
      fs.writeFileSync(pricesFile, JSON.stringify(defaultPrices, null, 2));
    }
  }

  // Read data from file
  readData(table) {
    const filePath = path.join(this.dataDir, `${table}.json`);
    try {
      const data = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      console.error(`Error reading ${table} data:`, error);
      return [];
    }
  }

  // Write data to file
  writeData(table, data) {
    const filePath = path.join(this.dataDir, `${table}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.error(`Error writing ${table} data:`, error);
      throw error;
    }
  }

  // Simulate SQL query execution
  async query(sql, params = []) {
    try {
      // Parse SQL to determine operation
      const operation = this.parseSQL(sql);
      
      switch (operation.type) {
        case 'SELECT':
          return this.handleSelect(operation, params);
        case 'INSERT':
          return this.handleInsert(operation, params);
        case 'UPDATE':
          return this.handleUpdate(operation, params);
        default:
          throw new Error('Unsupported SQL operation');
      }
    } catch (error) {
      console.error('File-based DB Error:', error);
      throw error;
    }
  }

  // Parse SQL to determine operation type and table
  parseSQL(sql) {
    const upperSQL = sql.toUpperCase().trim();
    
    if (upperSQL.startsWith('SELECT')) {
      return { type: 'SELECT', table: this.extractTableFromSelect(sql) };
    } else if (upperSQL.startsWith('INSERT')) {
      return { type: 'INSERT', table: this.extractTableFromInsert(sql) };
    } else if (upperSQL.startsWith('UPDATE')) {
      return { type: 'UPDATE', table: this.extractTableFromUpdate(sql) };
    }
    
    throw new Error('Unsupported SQL operation');
  }

  // Extract table name from SELECT query
  extractTableFromSelect(sql) {
    const match = sql.match(/FROM\s+(\w+)/i);
    return match ? match[1] : null;
  }

  // Extract table name from INSERT query
  extractTableFromInsert(sql) {
    const match = sql.match(/INTO\s+(\w+)/i);
    return match ? match[1] : null;
  }

  // Extract table name from UPDATE query
  extractTableFromUpdate(sql) {
    const match = sql.match(/UPDATE\s+(\w+)/i);
    return match ? match[1] : null;
  }

  // Handle SELECT operations
  handleSelect(operation, params) {
    const table = operation.table;
    const data = this.readData(table);
    
    // Simulate WHERE clause for admin_prices
    if (table === 'admin_prices' && params.length > 0) {
      const filteredData = data.filter(item => item.event_type === params[0]);
      return { rows: filteredData };
    }
    
    return { rows: data };
  }

  // Handle INSERT operations
  handleInsert(operation, params) {
    const table = operation.table;
    const data = this.readData(table);
    
    if (table === 'bookings') {
      const newBooking = {
        id: Date.now(), // Simple ID generation
        event_type: params[0],
        full_name: params[1],
        phone: params[2],
        email: params[3],
        event_date: params[4],
        guests: params[5],
        message: params[6],
        price: params[7],
        created_at: new Date().toISOString()
      };
      
      data.push(newBooking);
      this.writeData(table, data);
      
      return { rows: [newBooking] };
    }
    
    return { rows: [] };
  }

  // Handle UPDATE operations
  handleUpdate(operation, params) {
    const table = operation.table;
    const data = this.readData(table);
    
    if (table === 'admin_prices') {
      const index = data.findIndex(item => item.event_type === params[1]);
      if (index !== -1) {
        data[index].price = parseFloat(params[0]);
        data[index].updated_at = new Date().toISOString();
        this.writeData(table, data);
      }
    }
    
    return { rowCount: 1 };
  }

  // Close connection (no-op for file-based storage)
  async end() {
    // No cleanup needed for file-based storage
  }
}

// Create and export the database instance
const db = new FileBasedDB();

// Simulate connection events
console.log('✅ Connected to File-based database');

module.exports = db;
