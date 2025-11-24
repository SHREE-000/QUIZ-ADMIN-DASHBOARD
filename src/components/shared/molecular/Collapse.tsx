import { Collapsible, Stack, Text, Textarea } from "@chakra-ui/react";
import { LuChevronRight } from "react-icons/lu";

const Collapse = ({
  language,
  label,
  handleChange,
}:
{
  language: string;
  label: string;
  handleChange: (lang: string, value: string) => void;
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
        <Text cursor={"pointer"}>{language.toUpperCase()}</Text>
      </Collapsible.Trigger>
      <Collapsible.Content>
        <Stack padding="4" borderWidth="1px">
          <Textarea
            onChange={(e) => handleChange(language, e.target.value)}
            placeholder={`Add ${label} in ${language.toUpperCase()} language`}
          />
        </Stack>
      </Collapsible.Content>
    </Collapsible.Root>
  );
};

export default Collapse;
