import "dotenv/config";
import express from "express";
import session from "express-session";
import cookieParser from "cookie-parser";
import cors from "cors";

// middlewares
import logger from "./middlewares/loggingMiddleware.mjs"

// routes
import usersRouter from "./routes/user.mjs";
import authRouter from "./routes/auth.mjs";
import scadaRouter from "./routes/scada.mjs";

const app = express();
const PORT = process.env.PORT || 3000;

// 🟢 Middlewares globaux
app.use(express.json());

app.use(cors({
    origin: "*", // pour dev
    credentials: true
}));

app.use(cookieParser(process.env.SECRET_COOKIE));

// 🟡 Session
app.use(session({
    secret: process.env.SESSION || "scada-secret",
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: 1000 * 60 * 60 * 2 // 2h
    }
}));

// 🟢 Logging
app.use(logger);

// 🔵 Routes API
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/scada", scadaRouter);

// 🟣 Route test
app.get("/", (req, res) => {
    req.session.visited = true;

    res.cookie("name", "scada-user", {
        maxAge: 1000 * 60 * 60 * 24,
        signed: true
    });

    res.status(200).json({
        msg: "SCADA Backend Running",
        session: req.session.id
    });
});

// 🔴 Lancer serveur
app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});