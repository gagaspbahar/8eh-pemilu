import { getVote } from "@/service/vote_service";

const jwt = require("jsonwebtoken");

export default async function handler(req, res) {
  let body;
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    body = req.body
    console.log(error)
  }

  const decoded = jwt.verify(body.token, process.env.JWT_SECRET);
  const queryRes = await getVote(decoded.userId);
  if (queryRes.rows.length === 0) {
    res.status(404).json({ status: "FALSE"});
  } else {
    res.status(200).json({ status: "TRUE"});
  }
}