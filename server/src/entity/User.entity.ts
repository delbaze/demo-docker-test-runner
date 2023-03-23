import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { ObjectType, Field, InputType } from "type-graphql";
// import { GraphQLEmailAddress } from "graphql-scalars";

@ObjectType()
@Entity()
export default class User {
  @Field()
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  password: string;

  @Field()
  @Column({ unique: true })
  email: string;
}

@InputType({ description: "Register" })
export class CreateInput implements Partial<User> {
  @Field()
  name: string;

  @Field()
  email: string;

  @Field()
  password: string;
}


@InputType({ description: "Authentication" })
export class LoginInput implements Partial<User> {
    @Field()
    email: string;

    @Field()
    password: string;
}

@ObjectType()
export class Login {
    @Field()
    success: boolean;

    @Field()
    token?: string;
}

@ObjectType()
export class TokenValidation {
    @Field()
    valid: boolean;
}