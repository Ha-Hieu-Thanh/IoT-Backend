import { MongodbModule } from './mongodb/mongodb.module';
import { MysqlModule } from './mysql/mysql.module';

export const DatabaseModule = [MysqlModule, MongodbModule];
