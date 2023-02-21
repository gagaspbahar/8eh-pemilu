import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "@/styles/Home.module.css";
import { Box, Button, Container, Spinner, Text } from "@chakra-ui/react";
import Link from "next/link";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {

  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      window.location.href = "/vote";
    }
    else {
      window.location.href = "/login";
    }
  }
  return (
    <>
      <Spinner />
    </>
  );
}
