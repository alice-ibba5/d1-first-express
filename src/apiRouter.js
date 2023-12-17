import express from "express";
import authorRouter from "./authorRouter.js";
import cors from "cors";
import blogPostRouter from "./blogPostRouter.js";
import emailRouter from "./emailRouter.js";
import commentRouter from "./commentRouter.js";
import path from "path";
import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { v2 as cloudinary } from "cloudinary";

const apiRouter = express.Router();

apiRouter.use(cors());

apiRouter.use(express.json());

apiRouter.get("/", (req, res) => {
  res.status(200).send(/*html*/ `
    <!doctype html>
    <html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <title>Bootstrap demo</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-T3c6CoIi6uLrA9TneNEoa7RxnatzjcDSCmG1MXxSR1GAsXEV/Dwwykc2MPK8M2HN" crossorigin="anonymous">
      </head>
      <body>
        <h1>Hello, world!</h1>
        <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/js/bootstrap.bundle.min.js" integrity="sha384-C6RzsynM9kWDrMNeT87bh95OGNyZPhcTNXj1NW7RuBCsyN/o0jlpcV8Qyq46cDfL" crossorigin="anonymous"></script>
      </body>
    </html>
      `);
});

apiRouter.get("/test", (req, res) => {
  res.json({ message: "Hello, world!" });
});

apiRouter.post("/body", (req, res) => {
  console.log(req.body);

  res.status(200).send();
});

/*const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "epicode-folder-test",
  },
});

const upload = multer({ storage: cloudinaryStorage });

apiRouter.patch("/upload", upload.single("avatar"), (req, res, next) => {
  // qui dentro avremo bisogno di salvare il percorso del file dentro al nostro
  // database, in modo da poter recuperare il nostro file quando ne avremo bisogno

  // req.file contiene le informazioni del file caricato
  console.log(req.file.path)
  res.send({ url: req.file.path })
})*/

apiRouter.use("/authors", authorRouter);
apiRouter.use("/blogposts", blogPostRouter);
apiRouter.use("/verifyEmail", emailRouter);
//apiRouter.use("/blogposts/:id/comments", commentRouter);

export default apiRouter;
