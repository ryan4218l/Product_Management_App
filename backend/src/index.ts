import { MikroORM } from '@mikro-orm/core';
import dotenv from 'dotenv';
import { initApp } from './app';
import config from './mikro-orm.config';

// Load environment variables
dotenv.config();

async function mainApp() {
  try {
    console.log('🚀 Starting server initialization...');
    console.log(`📁 Environment: ${process.env.NODE_ENV || 'development'}`);
    
    // Initialize MikroORM with the configuration
    console.log('📊 Initializing database connection...');
    const orm = await MikroORM.init(config);
    
    console.log('✅ Database connection established');

    // Check if we need to run migrations
    if (process.env.RUN_MIGRATIONS !== 'false') {
      console.log('🔄 Running database migrations...');
      const migrator = orm.getMigrator();
      const pendingMigrations = await migrator.getPendingMigrations();
      
      if (pendingMigrations.length > 0) {
        console.log(`📋 Found ${pendingMigrations.length} pending migration(s)`);
        await migrator.up();
        console.log('✅ Migrations executed successfully');
      } else {
        console.log('✅ Database is up to date - no migrations needed');
      }
    }

    // Initialize Express application
    console.log('⚙️ Initializing Express application...');
    const app = await initApp(orm);

    // Start the server
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🎉 Server is running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api/health`);
      console.log('📝 Ready to handle requests!');
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Received shutdown signal');
  console.log('👋 Shutting down gracefully...');
  process.exit(0);
});

// Start the application
mainApp();