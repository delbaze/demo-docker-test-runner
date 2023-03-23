import UserService from "../services/User.service";
import User, {
  CreateInput,
  Login,
  LoginInput,
} from "../entity/User.entity";
import { Arg, Mutation, Query, Resolver } from "type-graphql";
import UtilitiesService from "../services/Utilities.service";

@Resolver()
export default class UserResolver {
  @Query(() => Login)
  async login(@Arg("loginInput") loginInput: LoginInput) {
    const { email, password } = loginInput;
    let result: Login = {
      token: "",
      success: false,
    };
    try {
      let user = await new UserService().readOneByEmail(email);
      let checkPassword = await new UtilitiesService().checkPassword(
        password,
        user.password
      );
      console.log("CHECK PASSWORD", checkPassword);
      if (checkPassword) {
        //créer un token
        let token = new UtilitiesService().generateToken({ email });
        result = {
          success: true,
          token,
        };
      }
    } catch (err) {
      throw new Error(err.message);
    }

    return result;
  }

  @Query(() => [User])
  async listUsers(
  ): Promise<User[]> {
    let users = await new UserService().listUsers();
    return users;
  }

  @Query(() => User)
  async findUser(@Arg("id") id: string) {
    console.log(id);
    return null;
  }

  @Mutation(() => User)
  async createUser(
    @Arg("createInput") createInput: CreateInput
  ): Promise<User> {
    const { name, email, password } = createInput;

    let user = await new UserService().createUser({
      name,
      email,
      password,
    });
    return user;
  }
}
