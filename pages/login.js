import { Box, Button, Input, Text } from "@chakra-ui/react";
import { useState } from "react";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleChangeEmail = (e) => {
    setEmail(e.target.value);
  };

  const handleChangePassword = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async () => {
    const res = await fetch("/api/login", {
      method: "POST",
      body: JSON.stringify({email, password }),
    });
  };

  return (
    <Box>
      <Text fontSize={"4xl"}>Login Page</Text>
      <Input placeholder="Enter email" onChange={handleChangeEmail} />
      <Input
        placeholder="Enter password"
        type="password"
        onChange={handleChangePassword}
      />
      <Button onClick={handleSubmit}>Login</Button>
    </Box>
  );
}
