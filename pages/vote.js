import {
  Box,
  Button,
  Container,
  Stack,
  Text,
  Image,
  useToast,
  Toast,
  Flex,
  Spacer,
  HStack,
} from "@chakra-ui/react";
import { useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/AuthContext";
import { decode } from "jsonwebtoken";

function Vote() {
  const toast = useToast();
  const [token, setToken] = useState(null);
  const [disabled, setDisabled] = useState(false);


  useEffect(() => {
    const theToken = localStorage.getItem("token");
    setToken(localStorage.getItem("token"));
    if (theToken == null) {
      window.location.href = "/login";
    }
  }, [token]);
  const user = token ? decode(token) : { name: "No User" };

  const signOut = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleSubmit = async (vote) => {
    const resCheck = await fetch("/api/voteCheck", {
      method: "POST",
      body: JSON.stringify({ token:token }),
    });
    const resCheckJson = await resCheck.json();
    if (resCheckJson.status === "TRUE") {
      toast({
        title: "Anda sudah melakukan voting",
        duration: 5000,
        isClosable: true,
      });
      setDisabled(true);
      return;
    }


    const res = await fetch("/api/vote", {
      method: "POST",
      body: JSON.stringify({ token:token, vote:vote }),
    });
    const resJson = await res.json();
    if (resJson.status === "Vote success")
      toast({
        title: "Vote success",
        duration: 5000,
        isClosable: true,
      });
  };

  return (
    <Box>
      <Container py="1.5rem" px={{ base: "0.75rem", md: "2.5rem" }} h="auto">
        <Flex align="center">
          <Button fontSize="lg" fontFamily="heading" variant="text">
            Pemilu 8EH 2023
          </Button>
          <Spacer />
          <HStack spacing="1rem">
            {token ? (
              <Button
                variant="text"
                fontWeight="normal"
                fontSize="16px"
                color={"red.500"}
                _hover={{ color: "red.700" }}
                onClick={() => {
                  signOut();
                  toast({
                    title: "Logout berhasil",
                    status: "success",
                    duration: 3000,
                    position: "top",
                  });
                }}
              >
                Keluar
              </Button>
            ) : null}
          </HStack>
        </Flex>
      </Container>
      <Container
        display="flex"
        justifyContent="center"
        alignItems="center"
        // width="100vw"
        // height="80vh"
        flexDirection="column"
      >
        <Text fontSize={"3xl"} fontWeight="bold" margin={5}>
          Halo, Kru {user.name}
        </Text>
        <Stack
          justifyContent="center"
          flexDirection="column"
          alignItems="center"
          display="flex"
        >
          <Box
            display="flex"
            flexDirection="column"
            // justifyContent="center"
            alignItems="center"
          >
            <Image width="200px" alt="gv" src="https://cdn.discordapp.com/attachments/723179759453995072/1077584827311726602/gv.png" />
            <Text textAlign="center" fontWeight={"bold"}>Ca-GM No. Urut 1: Grace Vania</Text>
            <Button variant="solid" size="md" onClick={() => handleSubmit(1)} disabled={disabled}>
              Vote
            </Button>
          </Box>
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
          >
            <Image width="200px" alt="kotak kosong" src="https://cdn.discordapp.com/attachments/723179759453995072/1077584845024272534/messageImage_1676977618829.jpg"/>
            <Text textAlign="center" fontWeight={"bold"}>Kotak kosong</Text>
            <Button variant="solid" size="md" onClick={() => handleSubmit(2)} disabled={disabled}>
              Vote
            </Button>
          </Box>
          <Spacer height={"10vh"}/>
        </Stack>
      </Container>
    </Box>
  );
}

export default Vote;
