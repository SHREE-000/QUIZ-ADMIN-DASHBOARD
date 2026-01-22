"use client";

import {
  Box,
  Flex,
  Button,
  IconButton,
  Stack,
  useDisclosure,
  HStack,
} from "@chakra-ui/react";
import { FiMenu, FiX } from "react-icons/fi";
import Link from "next/link";
import { useRouter } from "next/navigation";
import axios from "axios";
import { useEffect, useState } from "react";

interface NavbarProps {
  isAuthenticated: boolean;
}

export default function Navbar({ isAuthenticated }: NavbarProps) {
  console.log("isAuthenticated", isAuthenticated);
  
  const { open, onOpen, onClose } = useDisclosure();
  const router = useRouter();

  const handleLogout = async () => {
    sessionStorage.removeItem("user");
      await axios.get("/api/logout");
      router.push("/auth/login");
      window.location.reload();
  };

  return (
    <Box bg="gray.800" px={4}>
      <Flex h={16} alignItems="center" justifyContent="space-between">
        {/* Left */}
        <HStack gap={8} alignItems="center">
          <Box color="white" fontWeight="bold">
            Quiz App
          </Box>

          <HStack as="nav" gap={4} display={{ base: "none", md: "flex" }}>
            <NavLink href="/dashboard">Home</NavLink>
          </HStack>
        </HStack>

        {/* Right */}
        <Flex alignItems="center">
          <HStack gap={4} display={{ base: "none", md: "flex" }}>
            {!isAuthenticated ? (
              <>
                <NavLink href="/auth/login">Login</NavLink>
                <NavLink href="/auth/register">Register</NavLink>
              </>
            ) : (
              <Button size="sm" colorScheme="red" onClick={handleLogout}>
                Logout
              </Button>
            )}
          </HStack>

          {/* Mobile Menu Button */}
          <IconButton
            size="md"
            aria-label="Toggle Menu"
            display={{ md: "none" }}
            onClick={open ? onClose : onOpen}
            ml={2}
          >
            {open ? <FiX /> : <FiMenu />}
          </IconButton>
        </Flex>
      </Flex>

      {/* Mobile Menu */}
      {open && (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as="nav" gap={4}>
            <NavLink href="/dashboard">Home</NavLink>

            {!isAuthenticated ? (
              <>
                <NavLink href="/auth/login">Login</NavLink>
                <NavLink href="/auth/register">Register</NavLink>
              </>
            ) : (
              <Button
                size="sm"
                colorScheme="red"
                onClick={handleLogout}
                alignSelf="flex-start"
              >
                Logout
              </Button>
            )}
          </Stack>
        </Box>
      )}
    </Box>
  );
}

const NavLink = ({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) => (
  <Link href={href}>
    <Box
      px={2}
      py={1}
      rounded="md"
      color="gray.200"
      _hover={{
        textDecoration: "none",
        bg: "gray.700",
      }}
    >
      {children}
    </Box>
  </Link>
);
