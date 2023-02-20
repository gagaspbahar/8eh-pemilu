import { getUserByEmail } from "@/service/auth_service";

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

export default async function loginHandler(req, res) {
  let body;
  try {
    body = JSON.parse(req.body)
  } catch (error) {
    body = req.body
    console.log(error)
  }
  // const body = JSON.parse(req.body);
  const user = await getUserByEmail(body.email);

  if (user.rows.length === 0) {
    res.status(401).json({ message: "User not found" });
  } else {
    const userObj = user.rows[0];

    if (await bcrypt.compare(body.password, userObj.password)) {
      const token = jwt.sign(
        { userId: userObj.id, name: userObj.name, angkatan: userObj.angkatan },
        process.env.JWT_SECRET
      );

      res
        .status(200)
        .json({ data: { token: token }, message: "Login success" });
    } else {
      res.status(401).json({ message: "Incorrect password" });
    }
  }
}
