import { DataSource } from "typeorm";
import User from "../entity/User.entity";
export default new DataSource({
  type: "postgres",
  host: "db",
  port: 5432,
  username: "postgres",
  password: "postgres",
  database: "database",
  synchronize: true,
  entities: [User],
  logging: ["query", "error"],
});
