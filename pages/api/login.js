import { getUserByEmail } from "@/service/auth_service";

const bcrypt = require("bcrypt");

export default async function loginHandler(req, res) {
  const body = JSON.parse(req.body)
  const user = await getUserByEmail(body.email);

  if (user.rows.length === 0) {
    res.status(401).json({ message: "User not found" });
  } else {
    const userObj = user.rows[0];

    if (await bcrypt.compare(body.password, userObj.password)) {
      res
        .status(200)
        .json({ data: { userId: userObj.id }, message: "Login success" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  }
}
