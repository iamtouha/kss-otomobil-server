"use strict";
const axios = require("axios");

const { AVTO_KEY, AVTO_BASE } = process.env;
const base = `${AVTO_BASE}/xml/json?code=${AVTO_KEY}`;
/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/concepts/controllers.html#core-controllers)
 * to customize this controller
 */

module.exports = {
  async getDates() {
    try {
      const query = `select DATE(auction_date), COUNT(auction_date) 
                    from main 
                    group by DATE(auction_date) 
                    limit 15`;
      const url = `${base}&sql=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      return data.map((item) => ({ date: item["TAG0"], count: item["TAG1"] }));
    } catch (error) {
      return error;
    }
  },
  async findMakers(ctx) {
    try {
      const date = ctx.params.date;
      if (!date) return error;
      const query = `SELECT marka_id,marka_name, COUNT(marka_id) 
                    FROM main WHERE DATE(auction_date) IN ('${date}') 
                    GROUP BY marka_id`;
      const url = `${base}&sql=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return error;
    }
  },
  async findModels(ctx) {
    try {
      const items = ctx.params.makers;
      const date = ctx.params.date;
      if (!date || !items) return error;
      const query = `SELECT model_id,model_name,images,COUNT(model_id) 
                    FROM main 
                    WHERE (date(auction_date) = '${date}' AND MARKA_ID in (${items})) 
                    GROUP BY model_id
                    LIMIT 30`;
      const url = `${base}&sql=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return error;
    }
  },
  async findCars(ctx) {
    try {
      const items = ctx.params.models;
      const date = ctx.params.date;
      if (!date || !items) return error;
      const query = `SELECT id,model_id,model_name,images,auction,auction_date,year,color,AVG_PRICE
                    FROM main 
                    WHERE (date(auction_date) = '${date}' AND MODEL_ID in (${items})) 
                    LIMIT 30`;
      const url = `${base}&sql=${encodeURIComponent(query)}`;
      const { data } = await axios.get(url);
      return data;
    } catch (error) {
      return error;
    }
  },
};
