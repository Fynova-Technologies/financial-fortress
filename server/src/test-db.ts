import { db } from './utils/db.js'; // path to your db file
import { users } from './models/index.js'; // import at least one table

async function testDB() {
  try {
    // Try selecting all users
      
    const allUsers = await db.select().from(users);
    console.log('Users:', allUsers);

    console.log('Database connection successful!');
  } catch (err) {
    console.error('Database connection failed:', err);
  }
}

testDB();
