"use strict";

const _ = require("lodash");

/**
 * Throws an ApolloError if context body contains a bad request
 * @param contextBody - body of the context object given to the resolver
 * @throws ApolloError if the body is a bad request
 */
function checkBadRequest(contextBody) {
  if (_.get(contextBody, "statusCode", 200) !== 200) {
    const message = _.get(contextBody, "error", "Bad Request");
    const exception = new Error(message);
    exception.code = _.get(contextBody, "statusCode", 400);
    exception.data = contextBody;
    throw exception;
  }
}

module.exports = {
  /**
   * Retrieve authenticated user.
   * @return {Object|Array}
   */

  definition: /* GraphQL */ `
    extend type UsersPermissionsMe {
      first_name: String
      last_name: String
      phone_number: String
      store: ID
      addresses: [ComponentUserAddresses]
      terms_and_conditions: Boolean
      wish_list: JSON
      orders(sort: String, limit: Int, start: Int, where: JSON): [Orders]
      messages(sort: String, limit: Int, start: Int, where: JSON): [Messages]
    }

    input PJSUsersPermissionsRegisterInput {
      password: String!
      first_name: String
      last_name: String
      email: String
      phone_number: String
      terms_and_conditions: Boolean
      addresses: [ComponentUserAddressInput]
    }

    type PJSUsersPermissionsLoginPayload {
      jwt: String
      user: UsersPermissionsMe!
    }
  `,

  mutation: `
    PJSRegister(input: PJSUsersPermissionsRegisterInput!): PJSUsersPermissionsLoginPayload!
  `,
  resolver: {
    Mutation: {
      PJSRegister: {
        description: "Register a user with extra details",
        resolverOf: "plugins::users-permissions.auth.register",
        resolver: async (obj, options, { context }) => {
          context.request.body = _.toPlainObject(options.input);

          await strapi.plugins["users-permissions"].controllers.auth.register(
            context
          );

          let output = context.body.toJSON
            ? context.body.toJSON()
            : context.body;

          checkBadRequest(output);

          return {
            user: output.user || output,
            jwt: output.jwt,
          };
        },
      },
    },
  },
};
