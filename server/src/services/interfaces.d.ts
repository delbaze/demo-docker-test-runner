import { Repository } from "typeorm";

export interface IService {
    db: Repository<User>;
}

