import * as bcrypt from "bcrypt";
import * as jwt from "jsonwebtoken";
import datasource from "../lib/datasource";
import User from "../entity/User.entity";
import { Repository } from "typeorm";

export default class UtilitiesService {
  dbUser: Repository<User>;
  constructor() {
    this.dbUser = datasource.getRepository(User);
  }

  async checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
  }

  generateToken(payload: any) {
    let token = jwt.sign(payload, `${process.env.SECRET_KEY}`, {
      expiresIn: "2h",
    });
    return token;
  }

  getPayload(token: string) {
    try {
      let payload = jwt.verify(token, `${process.env.SECRET_KEY}`);
      return payload;
    } catch (err: any) {
      console.log(err);
      throw new Error(err.message);
    }
  }
}
