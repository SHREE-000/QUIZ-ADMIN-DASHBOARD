import { Collapsible, Heading, Stack } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const ParentCollapse = ({
  label,
  component,
}:
{
  label: string;
  component: React.ReactNode;
}) => {
  return (
    <Collapsible.Root>
      <Collapsible.Trigger
        paddingY="3"
        display="flex"
        gap="2"
        alignItems="center"
      >
        <Collapsible.Indicator
          transition="transform 0.2s"
          _open={{ transform: "rotate(90deg)" }}
          cursor={"pointer"}
        >
          <LuChevronRight />
        </Collapsible.Indicator>
        <Heading cursor={"pointer"}>{label.toUpperCase()}</Heading>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack padding="4" borderWidth="1px">
          {component}
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default ParentCollapse;
