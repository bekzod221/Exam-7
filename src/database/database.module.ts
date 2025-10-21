// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { ConfigModule, ConfigService } from '@nestjs/config';

// @Module({
//   imports: [
//     TypeOrmModule.forRootAsync({
//       imports: [ConfigModule],
//       inject: [ConfigService],
//       useFactory: (configService: ConfigService) => ({
//         type: 'postgres',
//         host: configService.get<string>('database.host'),
//         port: configService.get<number>('database.port'),
//         username: configService.get<string>('database.username'),
//         password: configService.get<string>('database.password'),
//         database: configService.get<string>('database.name'), // ✅ to‘g‘rilandi
//         entities: [__dirname + '/../**/*.entity{.ts,.js}'],
//         autoLoadEntities: true,
//         synchronize: true,
//       }),
//     }),
//   ],
// })
// export class DatabaseModule {}


import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        const db = configService.get('database');
        console.log('🧩 DB CONFIG:', db);

        return {
          type: 'postgres',
          host: db.host,
          port: db.port,
          username: db.username,
          password: String(db.password ?? ''), // bu MUHIM
          database: db.database,
          autoLoadEntities: true,
          synchronize: true,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
