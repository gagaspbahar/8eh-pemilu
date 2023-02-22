import { countVote } from "@/service/vote_service";


export default async function handler(req, res) {
  const queryRes = await countVote();
  res.status(200).json({ count: queryRes.rows[0].count });
}