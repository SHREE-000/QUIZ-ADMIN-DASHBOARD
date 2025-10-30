'use client';
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();
  useEffect(() => {
    const user = localStorage.getItem("user") || "";
    const token = user ? JSON.parse(user).userDetails?.token : null;
    setToken(token);
  }, [])

  const logout = () => {
    localStorage.removeItem("user");
    setToken(null);
    router.push("/auth/login");
  }

  //   const { colorMode, toggleColorMode } = useColorMode();
  // const bg = useColorModeValue("red.100", "red.900");
  // const color = useColorModeValue("yellow.600", "green.600");
//             <>
//             <Box
//       minH="100vh"
//       bg={bg}
//       color={color}
//       display="flex"
//       flexDirection="column"
//       alignItems="center"
//       justifyContent="center"
//       gap={4}
//     >
//       <Text fontSize="2xl" fontWeight="bold">
//         Chakra UI + Next.js Color Mode Example
//       </Text>

//       <Text>
//         Current Mode: <strong>{colorMode}</strong>
//       </Text>

//       {/* You can use either your custom button or Chakra’s */}
//       <ColorModeButton />

//       {/* or Chakra’s built-in way */}
//       <Button onClick={toggleColorMode}>
//         Toggle manually ({colorMode === "dark" ? "Light" : "Dark"} Mode)
//       </Button>
//             <ColorModeButton />
//             <LightMode>
//   <Button colorScheme="red">Always light button</Button>
// </LightMode>
//     </Box></>
  return (
    <nav className="navbar">
      {token ? <div style={{display:"flex", justifyContent:"space-between", width:"100%"}}>
        <Link href="/dashboard">  <h2>LMS App</h2></Link>
        <Link href="/profile">Profile</Link>
        <a onClick={logout} >Logout</a>
      </div> : <div>
        <Link href="/auth/login">Login</Link>
        <Link href="/auth/register">Register</Link>
      </div>}
    </nav>
  );
}
