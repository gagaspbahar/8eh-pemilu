const fs = require("fs");
const sendMail = require("./gmail");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");
const dotenv = require("dotenv");
dotenv.config();
const { Pool } = require("pg");


const parseCSV = () => new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream("./kru.csv")
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => {
      resolve(results);
    });
})

const QueryOrRollback = async (query, params) => {
  const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
  });
  let res;
  const client = await pool.connect();
  try {
    res = await client.query('BEGIN');
    try {
      res = await client.query(query, params);
      await client.query('COMMIT')
    } catch (err) {
      await client.query('ROLLBACK')
      throw err
    }
  }
  finally {
    client.release()
  }
  return res;
}

const registerUser = async (email, password, name, angkatan_kru) => {
  const res = await QueryOrRollback(
    "INSERT INTO public.user(email, password, name, angkatan_kru) VALUES ($1, $2, $3, $4) RETURNING id",
    [email, password, name, angkatan_kru]
  );
  return res.rows[0];
};

function generatePassword() {
  var length = 8,
      charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
      retVal = "";
  for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
  }
  return retVal;
}

const main = async () => {
  const results = await parseCSV();
  const messageIds = [];
  for (let i = 0; i < results.length; i++) {
    let email = results[i].email;
    const name = results[i].nama;
    const angkatan = results[i].angkatan;
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);
    if (email == "") {
      email = generatePassword() + "@dummyemail.com"
    }

    const id = await registerUser(email, hashedPassword, name, angkatan);

    const options = {
      to: email,
      replyTo: "teknik8ehradioitb@gmail.com",
      subject:
        "Halo kru, ini adalah kredensial untuk melakukan voting pada Pemilu 8EH",
      // text: 'This email is sent from the command line',
      html: `<h2>
          Akun untuk melakukan voting.
      </h2>
      
      <p>
          Kru: ${name} - Kru ${angkatan}
      </p>
      <p>
          Email: ${email}
      </p>
      <p>
          Password: ${password}
      </p>
      <a href="https://8eh-pemilu.vercel.app/login">Login</a>
      `,
      textEncoding: "base64",
    };

    const messageId = await sendMail(options);
    console.log("Sent message with id: ", messageId)
    messageIds.push(messageId);
  }

  return messageIds;
};

main()
  .then((messageIds) =>
    console.log(messageIds.length, " messages sent successfully:")
  )
  .catch((err) => console.error(err));
