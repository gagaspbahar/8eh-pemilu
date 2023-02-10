import { QueryOrRollback } from "./database";

const getUserByEmail = async (email) => {
  const res = await QueryOrRollback(
    "SELECT id, email, password FROM public.user WHERE email = $1",
    [email]
  );
  return res;
};

const getUserById = async (id) => {
  QueryOrRollback("SELECT * FROM public.user WHERE id = $1", [id], (err, res) => {
    if (err) {
      console.log(err);
    }
    return res.rows[0];
  });
};

export { getUserByEmail, getUserById}
