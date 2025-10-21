"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = () => ({
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
//# sourceMappingURL=configuration.js.map