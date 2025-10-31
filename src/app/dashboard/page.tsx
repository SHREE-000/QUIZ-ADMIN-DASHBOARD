import axios from "axios";
import "./style.css";
import {
  Button,
  Card,
  For,
  Heading,
  SimpleGrid,
  Stack,
  Text,
} from "@chakra-ui/react";
import { LuArrowRight } from "react-icons/lu";
import Link from "next/link";

export default async function DashboardPage() {
  const res = await axios.get(process.env.NEXT_PUBLIC_API + "/stream");
  const data = res.data;

  return (
    <Stack align="center" p={4} gap={6}>
      <Stack w={{ sm: "full", md: "1/2", lg: "1/3" }} boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;" gap={6} p={4}>
        <Heading size="2xl" fontWeight="bold">Create and Manage Streams</Heading>
        <Text mb="3" fontSize="md" color="fg.muted">
          Below are the streams you have created. You can manage existing
          streams or create new ones to organize your quiz content effectively.
        </Text>
        <Button>
          <Link href="/dashboard/streams/create">Create Stream <LuArrowRight /></Link>
        </Button>
      </Stack>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
        <For each={data}>
          {(
            stream: {
              _id: string;
              stream: string;
              description: string;
              videoContent: string[];
              imageContent: string[];
              pdfContent: string[];
            },
            idx: number
          ) => (
            <Card.Root width="100%" variant="subtle" key={idx}>
              <Card.Body gap="2">
                <Card.Title mb="2">{stream.stream}</Card.Title>
                <Card.Description>{stream.description}</Card.Description>
              </Card.Body>
              <Card.Footer justifyContent="flex-end">
                <Button>Manage</Button>
              </Card.Footer>
            </Card.Root>
          )}
        </For>
      </SimpleGrid>
    </Stack>
  );
}
