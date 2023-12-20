import express from "express";
import brevo from "@getbrevo/brevo";
import { Author } from "./models/authors.js";

const emailRouter = express.Router();

let apiInstance = new brevo.TransactionalEmailsApi();

let apiKey = apiInstance.authentications["apiKey"];
apiKey.apiKey = process.env.BREVO_API_KEY;

emailRouter.post("/", async (req, res) => {
  try {
    const { authorEmail } = req.body;

    const author = await Author.findOne({ email: authorEmail });

    if (!author) {
      return res.status(404).send("Author not found for the given email");
    }

    let sendSmtpEmail = new brevo.SendSmtpEmail();
    sendSmtpEmail.subject = "Email di benvenuto";

    sendSmtpEmail.htmlContent = `<html><body><h1>Email di benvenuto a ${author.name} ${author.surname}</h1></body></html>`;
    sendSmtpEmail.sender = {
      name: "Strive Blog",
      email: "strive.blog@gmail.com",
    };
    sendSmtpEmail.to = [
      { email: authorEmail, name: `${author.name} ${author.surname}` },
    ];
    sendSmtpEmail.replyTo = {
      name: "Alice",
      email: "alice.ibba5@gmail.com",
    };

    sendSmtpEmail.headers = { "Some-Custom-Name": "unique-id-1234" };

    sendSmtpEmail.params = {
      parameter: "macarena",
      subject: "Email di benvenuto",
    };

    const data = await apiInstance.sendTransacEmail(sendSmtpEmail);

    console.log(
      "API called successfully. Returned data: " + JSON.stringify(data)
    );

    res.send(data);
  } catch (error) {
    console.error("Error sending welcome email:", error);
    res.status(500).send("Error sending welcome email: " + error.message);
  }
});
export default emailRouter;
