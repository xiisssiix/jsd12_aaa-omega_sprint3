import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";

import { router as apiRoutes } from "./routes/index.js";
import { connectMongoDb, mongoStatus } from "./config/mongodb.js";
import { connectCloudinary, cloudinaryStatus } from "./config/cloudinary.js";
import { limiter } from "./middlewares/rateLimit.js";

const app = express();

const isProd = process.env.NODE_ENV === "production";

app.use(helmet());

const corsOptions = {
  origin: process.env.FRONTEND_URLS?.split(",") || [],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(limiter);
app.use(express.json());
app.use(express.static("public"));
app.use(cookieParser());

app.get('/', (req, res) => {
  res.send(`
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <link rel="icon" href="/images/favicon.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>AAA Omega Backend - (O_o)i</title>
      <style>
        *         {font-family:Arial, sans-serif;
                   padding:0; margin:0; box-sizing:border-box;}
        body      {display:flex; justify-content:center; align-items:center; min-height:100vh; color:#6a7282; background:#f8fafc;}
        .card     {position:relative; display:flex; flex-direction:column; justify-content:center; gap:20px; text-align:center;
                   padding:32px 16px; border-radius:8px; margin:16px; background:#ffffff; box-shadow:0 25px 50px -12px rgba(0,0,0,.05);}
        .logo img {width:128px;}
        h1        {font-size:20px; font-weight:400; color:#4a5565;}
        .badge    {position:absolute; top:0; right:16px; transform:translate(0,-50%); font-size:10px; color:#ffffff;
                   padding:2px 4px 4px; border-radius:4px; background-color:#d3d6dd;}
        .status   {display:flex; flex-direction:column; gap:16px;}
        .item     {display:flex; flex-wrap:wrap; justify-content:space-between; align-items:center; row-gap:4px; column-gap:8px; font-weight:600;
                    padding:8px 16px; border-radius:8px; background:#f9fafb;}
        .online   {color:#40a448;}
        .offline  {color:#ff525f;}
      </style>
    </head>
    <body>
      <main class="card">
        <div class="logo">
          <img src="/images/logo-aaa-omega.png" alt="AAA Omega Logo" />
        </div>
        <h1>Backend Server Status</h1>
        <div class="badge">(O_o)i</div>
        <div class="status">
          <div class="item">
            <span>Server</span>
            <span class="online">Online</span>
          </div>
          <div class="item">
            <span>MongoDB</span>
            <span class="${mongoStatus === "Connected" ? "online" : "offline"}">
              ${mongoStatus}
            </span>
          </div>
          <div class="item">
            <span>Cloudinary</span>
            <span class="${cloudinaryStatus === "Connected" ? "online" : "offline"}">
              ${cloudinaryStatus}
            </span>
          </div>
        </div>
      </main>
    </body>
    </html>
  `);
})

app.use("/api", apiRoutes);

// Centralized error 404 not found handler
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Centralized error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: isProd
      ? "Internal Server Error"
      : err.message || "Internal Server Error",
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
    ...(isProd ? {} : { stack: err.stack })
  });
});

const PORT = process.env.PORT || 8888;

await connectMongoDb();
await connectCloudinary();

app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});