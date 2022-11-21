// import path first to support dotenv, dotenv used to support variables based on code environment
const path = require("node:path");
require("dotenv").config({ path: path.resolve(__dirname, "./.env") });

const express = require('express');

const app = express();

app.use(express.json());

// model to build test json recipe list
// videos.forEach((video) => {
//   axios
//     .get(`https://project-2-api.herokuapp.com/videos/${video.id}?api_key=12`)
//     .then((response) => {
//       console.log(response.data);
//       fs.appendFile(
//         path.join(__dirname, "./data/videos-details.json"),
//         JSON.stringify(response.data),
//         (err) => {
//           if (err) console.log(err);
//         }
//       );
//     });
// });

const PORT = process.env.PORT || 1024
app.listen(PORT, ()=>{
    console.log(`Server running, port ${PORT}`)
})