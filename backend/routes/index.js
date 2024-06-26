import express from 'express';
import auth from './auth.js'
import user from './user.js'
import product from './product.js'
import cart from './cart.js'

export const routes = () => {
  const router = express.Router();

  router.get("/", (req, res) => {
    res.send("API is running...");
  });
  
  auth(router);
  user(router);
  product(router);
  cart(router);

  return router;
};

export default routes;
