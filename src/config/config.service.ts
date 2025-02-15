import * as dotenv from 'dotenv';

export class ConfigService {
  private readonly envConfig: Record<string, string>;
  constructor() {
    const result = dotenv.config();

    if (result.error) {
      this.envConfig = Object.keys(process.env).reduce(
        (acc, key) => {
          if (process.env[key] !== undefined) {
            acc[key] = process.env[key] as string;
          }
          return acc;
        },
        {} as Record<string, string>,
      );
    } else {
      this.envConfig = result.parsed || {};
    }
  }

  public get(key: string): string {
    return this.envConfig[key];
  }

  public async getPortConfig() {
    return this.get('PORT');
  }

  public async getMongoConfig() {
    return {
      uri: this.get('MONGO_URI'),
    };
  }

  public async getMysqlConfig() {
    return {
      type: 'mysql' as const,
      host: this.get('MYSQL_HOST'),
      port: parseInt(this.get('MYSQL_PORT'), 10),
      username: this.get('MYSQL_USER'),
      password: this.get('MYSQL_PASSWORD'),
      database: this.get('MYSQL_DATABASE'),
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true, // Chỉ dùng trong dev
    };
  }
}
