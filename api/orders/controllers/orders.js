"use strict";

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */
const { parseMultipartData, sanitizeEntity } = require("strapi-utils");

module.exports = {
  async create(ctx) {
    let entity;

    let params = ctx.request.body;

    params.unique = await strapi.services.utils.getUniqueID();

    entity = await strapi.services.orders.create(ctx.request.body);

    return sanitizeEntity(entity, { model: strapi.models.orders });
  },
};
