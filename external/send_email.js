const fs = require("fs");
const sendMail = require("./gmail");
const csv = require("csv-parser");
const bcrypt = require("bcrypt");
import { registerUser } from "../service/auth_service";


const parseCSV = () => new Promise((resolve, reject) => {
  const results = [];
  fs.createReadStream("./kru.csv")
    .pipe(csv())
    .on("data", (row) => results.push(row))
    .on("end", () => {
      resolve(results);
    });
})

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
    const email = results[i].email;
    const name = results[i].nama;
    const angkatan = results[i].angkatan;
    const password = generatePassword();
    const hashedPassword = await bcrypt.hash(password, 10);

    const id = await registerUser(email, hashedPassword);

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
      </p>`,
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
