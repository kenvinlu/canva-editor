export default {
  routes: [
    {
      method: 'GET',
      path: '/product/:slug',
      handler: 'product.findBySlug',
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};


