import { vote } from "@/service/vote_service";

const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  const { method } = req;

  switch (method) {
    case "GET":
      // Get data from your database
      res.status(200).json({ name: "John Doe" });
      break;
    case "POST":
      // Update or create data in your database
      let body;
      try {
        body = JSON.parse(req.body)
      } catch (error) {
        body = req.body
        console.log(error)
      }

      const decoded = jwt.verify(body.token, process.env.JWT_SECRET);
      
      const queryRes = await vote(decoded.userId, body.vote);
      console.log(queryRes)
      res.status(200).json({ status: "Vote success"});
      break;
    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}