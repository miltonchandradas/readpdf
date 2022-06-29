const fs = require("fs");
const pdf = require("pdf-parse");
const multer = require("multer");
const express = require("express");
const upload = multer({ dest: "uploads/" });

const app = express();
const PORT = process.env.PORT || 3000;

app.post("/uploadPDF", upload.single("file"), async (req, res) => {
   console.log(req.file);

   try {
      let buffer = fs.readFileSync("uploads/" + req.file.filename);
      let data = await pdf(buffer);

      console.log("Number of pages: ", data.numpages);
      console.log("PDF info: ", data.info);
      console.log("File content: ", data.text);

      return res.status(200).send("File content: " + data.text);
   } catch (error) {
      console.log("Error: ", error);
      return res.status(500).send("Something is not right...");
   }
});

app.post("/uploadBLOB", async (req, res) => {
   let payload = "";

   req.on("data", async (chunk) => {
      payload += chunk;
      console.log(payload);
   });

   req.on("end", async () => {
      console.log(payload);

      try {
         let data = await pdf(Buffer.from(payload, "binary"));

         console.log("Number of pages: ", data.numpages);
         console.log("PDF info: ", data.info);
         console.log("File content: ", data.text);

         return res.status(200).send("File content: " + data.text);
      } catch (error) {
         console.log("Error: ", error);
         return res.status(500).send("Something is not right...");
      }
   });
});

app.listen(PORT, () => console.log(`Listenting on port ${PORT}`));
