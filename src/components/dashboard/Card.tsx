"use client";

import { useRouter } from "next/navigation";
import { Button, Card } from "@chakra-ui/react";

const CustomCard = ({
  stream,
  idx,
}: {
  stream: {
    _id: string;
    stream: string;
    description: string;
  },
  idx: number;
}) => {
    const router = useRouter();
  return (
    <Card.Root width="100%" variant="subtle" key={idx}>
      <Card.Body gap="2">
        <Card.Title mb="2">{stream.stream}</Card.Title>
        <Card.Description>{stream.description}</Card.Description>
      </Card.Body>
      <Card.Footer justifyContent="flex-end">
        <Button onClick={() => router.push(`/dashboard/stream/${stream._id}`)}>
          Manage
        </Button>
      </Card.Footer>
    </Card.Root>
  );
};

export default CustomCard;
