require('dotenv').config();
require('express-async-errors');

//security packeges
const helmet=require('helmet');
const cors=require('cors');
const xss=require('xss-clean');
const rateLimiter=require('express-rate-limit');

//swagger ui
const swaggerUI=require('swagger-ui-express');
const YAML=require('yamaljs');
const swaggerDocument=YAML.load('./swagger.yaml');


const express=require('express');
const app=express();

app.set('trust proxy',1);
app.use(rateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
}));

app.use(express.json());
app.use(helmet());
app.use(cors());
app.use(xss());
//db connection
const connectDb=require('./db/connect');

//middlewares
const notFoundMiddleware=require('./middleware/not-found');
const errorHandlerMiddleware=require('./middleware/error-handler');
const authenticate=require('./middleware/authentication');

//routes
const authRoute=require('./routes/auth');
const jobsRoute=require('./routes/jobs');

app.get('/',(req,res)=>{
  res.send('<h1>Jobs Api</h1><a href="/api-docs">Documentation</a>');
})
app.use('/api-docs',swaggerUI.serve,swaggerUI.setup(swaggerDocument));

//using routes
app.use('/api/v1/auth',authRoute);
app.use('/api/v1/jobs',authenticate,jobsRoute);


//using middlewares
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const port=process.env.PORT || 80;


const start=async ()=>{
  try{
    await connectDb(process.env.MONGO_URI);
    console.log("Database connected sucessfully");
    app.listen(port,()=> console.log(`Server is up and running on port ${port}`));
}
catch(error){
  console.log(error);
}
}
start();
