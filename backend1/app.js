require("dotenv").config();
const cluster = require('cluster');
const http = require('http')
const express = require("express");
const numCPUs = require("os").cpus().length;
const cors = require('cors');

//const redisClient = require('./Apps/databases/init.redis');
// const { rateLimit } = require('express-rate-limit');
// const { RedisStore } = require('rate-limit-redis');
const compression = require('compression');
const helmet = require('helmet');
const path = require("path");
require("colors");

const DBConnection = require("./Apps/config/db");
DBConnection();

//require DB
require("./Apps/models/UserModel");
require("./Apps/models/AssignModel");
require("./Apps/models/AttendanceModel");
require("./Apps/models/ClassModel");
require("./Apps/models/DeviceModel");
require("./Apps/models/FileModel");
require("./Apps/models/QuetionModel");
require("./Apps/models/DocsModel");
require("./Apps/models/TranscriptModel");
require("./Apps/models/NotiModel");
require("./Apps/models/ClassRoomModel");
require("./Apps/models/StudentModel");
require("./Apps/models/FileModel");
require("./Apps/models/LogAssignModel")

// Routes
const userRoutes = require("./Apps/routes/UserRoute")
const assignRoutes = require("./Apps/routes/AssignRoute")
const attendanceRoutes = require("./Apps/routes/AttendanceRoute")
const classRoutes = require("./Apps/routes/ClassRoute")
const deviceRoutes = require("./Apps/routes/DeviceRoute")
const FileRoute = require("./Apps/routes/FileRoute")
const quetionRoutes = require("./Apps/routes/QuetionRoute")
const docsRoutes = require("./Apps/routes/DocsRoute")
const transcriptRoutes = require("./Apps/routes/TranscriptRoute")
const notiRoutes = require("./Apps/routes/NotiRoute")
const classroomRoutes = require("./Apps/routes/ClassroomRoute")
const bootingRoutes = require("./Apps/routes/BootingRoute");
const ScheduleRoutes = require("./Apps/routes/ScheduleRoute");
const LogRoutes = require("./Apps/routes/LogRoute");
const authRoutes = require("./Apps/routes/AuthRoute");
const parentRoutes = require("./Apps/routes/ParentRoute");
const studentRoutes = require("./Apps/routes/StudentRoute");
const logassignRoutes = require("./Apps/routes/LogAssignRoute");

// init Epress App
const app = express();

app.use(express.json());
app.use(cors());
const httpServer = http.createServer(app);

app.use(express.static(path.join(__dirname, "Apps/public")));
const versionOne = (routeName) => `/api/v1/${routeName}`;

// register routes
app.use(versionOne("users"), userRoutes);
app.use(versionOne("student"), studentRoutes);
app.use(versionOne("assign"), assignRoutes);
app.use(versionOne("attendance"), attendanceRoutes);
app.use(versionOne("class"), classRoutes);
app.use(versionOne("device"), deviceRoutes);
app.use(versionOne("file"), FileRoute);
app.use(versionOne("quetion"), quetionRoutes);
app.use(versionOne("docs"), docsRoutes);
app.use(versionOne("transcript"), transcriptRoutes);
app.use(versionOne("notifications"), notiRoutes);
app.use(versionOne("classroom"), classroomRoutes);
app.use(versionOne("booting"), bootingRoutes);
app.use(versionOne("schedule"), ScheduleRoutes);
app.use(versionOne("auth"), authRoutes);
app.use(versionOne("log"), LogRoutes);
app.use(versionOne("parent"), parentRoutes);
app.use(versionOne("logassign"), logassignRoutes);

// const limiter = rateLimit({
//     // Rate limiter configuration
//     windowMs: 15 * 60 * 1000, // 15 minutes
//     max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
//     standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
//     legacyHeaders: false, // Disable the `X-RateLimit-*` headers

//     // Redis store configuration
//     store: new RedisStore({
//         sendCommand: (...args) => redisClient.sendCommand(args),
//     }),
// });

app.use(compression());
app.use(helmet());
//app.use(limiter);

var i = 0;

const PORT = 9001;

var serverProcess ; 

if (cluster.isMaster) {
    console.log(`Master ${process.pid} is running`);

    serverProcess = httpServer.listen(PORT, () => {
        console.log(
            `Server is running on port ${PORT}`.yellow.bold
        );
    });

    for (let i = 0; i < numCPUs; i++) {
        cluster.fork();
    }

    cluster.on("exit", (worker) => {
        console.log(`Worker ${worker.process.pid} died`);
        cluster.fork();
    });
    
} else {
    console.log(`Worker ${process.pid} started`);
}

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
    console.log(`Error: ${err.message}`.red);
    // Close server & exit process
    serverProcess.close(() => process.exit(1));
});

//