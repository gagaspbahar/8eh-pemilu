import { QueryOrRollback } from "./database";

const vote = async (id, vote) => {
  const res = await QueryOrRollback(
    "INSERT INTO public.vote(user_id, voted_to) VALUES ($1, $2)",
    [id, vote]
  );
  return res;
}

const getVote = async (id) => {
  const res = await QueryOrRollback(
    "SELECT id FROM public.vote WHERE user_id = $1",
    [id]
  );
  return res;
}

const countVote = async () => {
  const res = await QueryOrRollback(
    "SELECT COUNT(*) FROM public.vote",
  );
  return res;
}

export { vote, getVote, countVote };