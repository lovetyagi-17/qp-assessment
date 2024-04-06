import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import config from "../config";
import commonRoutes from "../../api/routes";

import { statusCode } from "../utils/StatusCodes";

export default ({ app }: { app: express.Application }) => {
  // request logging. dev: console | production: file
  app.use(
    morgan(
      "method: :method :url status: :status :res[content-length] response-time: :response-time ms"
    )
  );

  /* Useful if you're behind a reverse proxy (Heroku, Bluemix, AWS ELB, Nginx, etc)
  It shows the real origin IP in the heroku or Cloudwatch logs */
  app.enable("trust proxy");

  /* The magic package that prevents frontend developers going nuts
  Alternate description: Enable Cross Origin Resource Sharing to all origins by default */
  app.use(
    cors({
      origin: function (origin, callback) {
        if (config.NODE_ENV !== "development") {
          if (!origin) return callback(null, true);
          /*   if (config.WHITELIST.indexOf(origin) === -1) {
            const msg =
              'The CORS policy for this site does not ' + 'allow access from the specified Origin.';
            return callback(new Error(msg), false);
          } */ else return callback(null, true);
        } else return callback(null, true);
      },
    })
  );

  /* secure apps by setting various HTTP headers */
  app.use(helmet());

  /* Middleware that transforms the raw string of req.body into json */
  app.use(express.json({ limit: "50mb" }));
  /* support parsing of application/x-www-form-urlencoded post data */
  app.use(
    express.urlencoded({
      limit: "150mb",
      extended: true,
      parameterLimit: 500000000,
    })
  );

  app.set("views", "src/views");
  app.set("view engine", "ejs");

  /* Load API routes */
  app.use(config.API_PREFIX, commonRoutes);

  // handle celebrate data validation errors
  app.use((err, req, res, next) => {
    // if (isCelebrateError) {
    //   //if joi produces an error, it's likely a client-side problem
    //   if (err.details.get('body')) {
    //     const errorBody = err.details.get('body'); // 'details' is a Map()
    //     let { details } = errorBody;
    //     details = details[0];
    //     return res
    //       .status(statusCode.BAD_REQUEST)
    //       .json({ status: statusCode.BAD_REQUEST, message: details.message, type: 'body' });
    //   }
    //   if (err.details.get('query')) {
    //     const errorBody = err.details.get('query'); // 'details' is a Map()
    //     let { details } = errorBody;
    //     details = details[0];
    //     return res
    //       .status(statusCode.BAD_REQUEST)
    //       .json({ status: statusCode.BAD_REQUEST, message: details.message, type: 'query' });
    //   }
    //   if (err.details.get('params')) {
    //     const errorBody = err.details.get('params'); // 'details' is a Map()
    //     let { details } = errorBody;
    //     details = details[0];
    //     return res
    //       .status(statusCode.BAD_REQUEST)
    //       .json({ status: statusCode.BAD_REQUEST, message: details.message, type: 'params' });
    //   }
    // }
    next(err);
  });

  app.get("/", (req, res) => {
    res.send(true);
  });

  /* Catch 404 and forward to error handler */
  app.use((req, res, next) => {
    const err = new Error("Route Not Found");
    err["status"] = statusCode.NOT_FOUND;

    return next(err);
  });

  /* Handle unauthorized errors */
  app.use((err, req, res, next) => {
    /* Handle 401 thrown by express-jwt library */
    if (err.name === "UnauthorizedError") {
      return res.status(err.status).send({ message: err.message }).end();
    }
    return next(err);
  });
  app.use((err, req, res, next) => {
    console.error(err);
    res.status(err.status || statusCode.INTERNAL_SERVER_ERROR);
    res.json({ errors: { message: err.message } });
  });
};
