import swaggerJSDoc from "swagger-jsdoc";

const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Lottery API",
    version: "1.0.0",
    description: "API documentation for the lottery system",
  },
  servers: [
    {
      url: "http://localhost:5000",
      description: "Local server",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./routes/*.js"], // Path to your API route files
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec;
