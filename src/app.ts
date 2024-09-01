import bodyParser from "body-parser";
import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import passport from "passport";
import Redis from "ioredis";
import redisStore from "connect-redis";
import { API_CONFIG, EXPRESS_SESSION_SECRET } from "./config/config";
import "./database";
import { aclMiddleWare } from "./middlewares/aclMiddleware";
import { passportMiddleware } from "./middlewares/passportMiddleware";
import session from "express-session";
import routes from "./routes";
import { initBackendServices } from "./services/initServices/initBackendServices";

const redisClient = new Redis({
  host: "localhost",
  port: 6379,
});

const app = express();

app.use(helmet());

app.use(compression());

app.use(cors({ origin: "*", optionsSuccessStatus: 200 }));

app.use(bodyParser.json({ limit: "10mb" }));

app.use(
  bodyParser.urlencoded({
    limit: "10mb",
    extended: true,
    parameterLimit: 50000,
  })
);

app.use(express.static("public"));

app.use(morgan("combined"));

initBackendServices();

const RedisStore = new redisStore({
  client: redisClient,
});

app.use(
  session({
    store: RedisStore,
    resave: false,
    saveUninitialized: false,
    secret: EXPRESS_SESSION_SECRET,
  })
);

app.use(passport.initialize());

app.use(passport.session());

app.use(
  `${API_CONFIG.BASE_ENDPOINT}/${API_CONFIG.API_VERSION}`,
  routes.preRoute
);

app.use(passportMiddleware.authenticate("jwt", { session: false }));

app.use(aclMiddleWare());

app.use(`${API_CONFIG.BASE_ENDPOINT}/${API_CONFIG.API_VERSION}`, routes.route);

export default app;
