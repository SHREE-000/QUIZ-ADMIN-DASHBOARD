import axios from "axios";
import "../style.css";
import { For, Heading, SimpleGrid, Stack } from "@chakra-ui/react";
import CustomCard from "@/src/components/dashboard/Card";
import CardWithLink from "@/src/components/shared/molecular/CardWithLink";

export default async function DashboardPage() {
  const res = await axios.get(process.env.NEXT_PUBLIC_API + "/stream");
  const data = res.data;

  return (
    <Stack align="center" justifyContent="center" p={4} gap={6}>
      <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 4 }} gap={6} p={4}>
        <CardWithLink
          heading="Create New Streams"
          content="Create new streams by clicking below button."
          buttonText="Create Stream"
          link={"/dashboard/stream/create"}
        />
        <CardWithLink
          heading="Create New Subject"
          content="Create new subjects by clicking below button."
          buttonText="Create Subject"
          link={"/dashboard/subject/create"}
        />
        <CardWithLink
          heading="Create New Topic"
          content="Create new topic by clicking below button."
          buttonText="Create Topic"
          link={"/dashboard/topic/create"}
        />
        <CardWithLink
          heading="Create New Question"
          content="Create new question by clicking below button."
          buttonText="Create Question"
          link={"/dashboard/question/create"}
        />
      </SimpleGrid>
      <Heading>STREAMS</Heading>
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
          ) => <CustomCard category="stream" data={stream} idx={idx} />}
        </For>
      </SimpleGrid>
    </Stack>
  );
}
