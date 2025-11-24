import { Items } from "@/src/utils/interface";
import { HStack, RadioGroup } from "@chakra-ui/react";

const FormRadio = ({
  size = "lg",
  defaultValue = "manual",
  items = [
    { label: "manual", value: "manual" },
    { label: "ai", value: "ai" },
  ],
  onChange
}: {
  size?: "sm" | "md" | "lg";
  defaultValue?: "manual" | "ai";
  items?: Items[];
  onChange: (value: "manual" | "ai") => void;   
}) => {
  return (
    <RadioGroup.Root onValueChange={(details) => onChange(details.value as "manual" | "ai")} size={size} key={size} defaultValue={defaultValue}>
      <HStack gap="6">
        {items.map((item) => (
          <RadioGroup.Item key={item.value} value={item.value}>
            <RadioGroup.ItemHiddenInput />
            <RadioGroup.ItemIndicator />
            <RadioGroup.ItemText>{item.label}</RadioGroup.ItemText>
          </RadioGroup.Item>
        ))}
      </HStack>
    </RadioGroup.Root>
  );
};

export default FormRadio;
