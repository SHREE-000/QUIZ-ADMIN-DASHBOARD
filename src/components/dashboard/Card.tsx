"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@chakra-ui/react";

const CustomCard = ({
  data,
  category,
  idx,
}: {
  data: {
    _id: string;
    stream: string;
    subject?: string;
    topic?: string;
    description: string;
  };
  category: "stream" | "subject" | "topic";
  idx: number;
}) => {
  const router = useRouter();

  return (
    <Card.Root width="100%" variant="subtle" key={idx}>
      <Card.Body gap="2">
        <Card.Title mb="2">{data[category]}</Card.Title>
        <Card.Description>{data.description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button
          onClick={() => {
            if (category === "stream")
              return router.push(`/dashboard/stream/${data._id}`);
            else if (category === "subject")
              return router.push(`/dashboard/stream/${data.stream}/subject/${data._id}`);
            else if (category === "topic")
              return router.push(
                `/dashboard/stream/${data.stream}/subject/${data?.subject}/topic/${data._id}`
              );
          }}
        >
          Manage
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default CustomCard;
