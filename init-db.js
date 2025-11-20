const { neon, Pool } = require('@neondatabase/serverless');
const fs = require('fs');
const path = require('path');

async function initializeDatabase() {
  let pool;
  try {
    // Create a pool connection
    pool = new Pool({ connectionString: process.env.DATABASE_URL });
    const client = await pool.connect();
    
    // Read the schema file
    const schemaPath = path.join(__dirname, 'scripts', 'init_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    
    // Split by semicolon and execute each statement
    const statements = schema.split(';').filter(stmt => stmt.trim());
    
    console.log(`Executing ${statements.length} SQL statements...`);
    
    for (const statement of statements) {
      if (statement.trim()) {
        try {
          await client.query(statement);
          console.log('✓ Executed:', statement.substring(0, 50) + '...');
        } catch (err) {
          console.error('✗ Error executing statement:', statement.substring(0, 50));
          console.error('Error:', err.message);
        }
      }
    }
    
    client.release();
    console.log('Database initialization complete!');
  } catch (error) {
    console.error('Failed to initialize database:', error);
    process.exit(1);
  } finally {
    if (pool) await pool.end();
  }
}

initializeDatabase();
