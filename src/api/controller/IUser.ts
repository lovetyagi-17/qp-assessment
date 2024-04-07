/*
 - Phase 1
    . setup of users model with required fileds(schema designing)
    . setup of user using seeder.
    . user login & signout api implementation.
    . get user profile api.
    . users api documetation using swagger.
    . users api expose & deploy.
 -----------------------------------------------------------------------------------

 - Phase 2
    . Implemetation of user registration, set password, forget password api flow.
    . update user profile flow & sockets as per requirement.
 -----------------------------------------------------------------------------------

 - Phase 3
    . Access to user to post, like, share & comment to recipes.
    . Delete user accout flow ad users data deletion.
 */

// import { UsersModel } from "../../common/models";
import { statusCode } from "../../common/utils/StatusCodes";

export class Users {
  userService;
  constructor() {
    // this.userService = new UserService(UsersModel);
  }

  static async login(data: any) {
    try {
      return { status: statusCode.OK, message: "success" };
    } catch (error) {
      console.error(error);
    }
  }
}
