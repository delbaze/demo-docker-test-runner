import datasource from "../lib/datasource";
import User from "../entity/User.entity";
import { Repository } from "typeorm";
import { IService } from "./interfaces";
import * as bcrypt from "bcrypt";

export default class UserService implements IService {
  db: Repository<User>;
  constructor() {
    this.db = datasource.getRepository(User);
  }

  async createUser({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) {
    try {
      let passwordHash = bcrypt.hashSync(password, 10);

      const created = await this.db.save({
        name,
        email,
        password: passwordHash,
      });
      return created;
    } catch (err) {
      console.log("ERREUR", err);
      throw new Error("Il y a eu une erreur");
    }
  }

  async listUsers() {
    try {
      const users = await this.db.find();
      return users;
    } catch (err) {
      console.log(err);
      throw new Error("Il y a eu une erreur");
    }
  }

  async readOneByEmail(email: string) {
    const user = await this.db.findOne({
      where: {
        email,
      },
    });
    if (!user) {
      throw new Error("Ce user n'existe pas");
    }
    return user;
  }
}
