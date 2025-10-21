// interface DatabaseConfig {
//     host: string;
//     port: number;
//     username: string;
//     password: string;
//     name: string;
//   }
  
//   interface BotConfig {
//     token: string;
//   }
  
//   interface AppConfig {
//     port: number;
//     database: DatabaseConfig;
//     bot: BotConfig;
//   }
  
//   export default (): AppConfig => ({
//     port: parseInt(process.env.PORT ?? '3000', 10),
//     database: {
//       host: process.env.DB_HOST || 'localhost',
//       port: parseInt(process.env.DB_PORT ?? '5432', 10),
//       username: process.env.DB_USER || 'postgres',
//       password: process.env.DB_PASS?.toString() || 'postgres',
//       name: process.env.DB_NAME || 'telegram_bot_db',
//     },
//     bot: {
//       token: process.env.BOT_TOKEN || '',
//     },
//   });
  

// src/config/configuration.ts
export default () => ({
    database: {
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT ?? '5432', 10),
      username: process.env.DB_USER || 'postgres',
      password: process.env.DB_PASS || 'postgres',
      database: process.env.DB_NAME || 'telegram_bot_db',
    },
    bot: {
      token: process.env.BOT_TOKEN || '',
    },
    port: parseInt(process.env.PORT ?? '3000', 10),
  });
  