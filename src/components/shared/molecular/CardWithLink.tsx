import { Button, Heading, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { LuArrowRight } from "react-icons/lu";

const CardWithLink = ({
  heading,
  content,
  buttonText,
  link,
}: {
  heading: string;
  content: string;
  buttonText: string;
  link: string;
}) => {
  return (
    <Stack
      boxShadow="rgba(50, 50, 93, 0.25) 0px 30px 60px -12px inset, rgba(0, 0, 0, 0.3) 0px 18px 36px -18px inset;"
      gap={6}
      p={4}
    >
      <Heading size="2xl" fontWeight="bold">
        {heading}
      </Heading>
      <Text mb="3" fontSize="md" color="fg.muted">
        {content}
      </Text>
      <Stack mt="auto" align="flex-end">
        <Link href={link}>
          <Button direction="row">
            {buttonText}
            <LuArrowRight />
          </Button>
        </Link>
      </Stack>
    </Stack>
  );
};

export default CardWithLink;
