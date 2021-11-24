"use strict";

const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  /**
   * Create a record.
   *
   * @return {Object}
   */

  async create(ctx) {
    let entity;

    const userId = ctx.state.user.id;

    const userObject = await strapi.query("user", "users-permissions").find({
      id: userId,
    });

    // find their store
    const store = userObject[0].store.id;

    ctx.request.body.store = store;
    entity = await strapi.services.product.create(ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.product });
  },
};
