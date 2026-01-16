import { Items } from "@/src/utils/interface";
import { HStack, RadioGroup } from "@chakra-ui/react";

const FormRadio = ({
  size = "lg",
  defaultValue = "single",
  items = [
    { label: "single", value: "single" },
    { label: "passage", value: "passage" },
  ],
  onChange
}: {
  size?: "sm" | "md" | "lg";
  defaultValue?: "single" | "passage";
  items?: Items[];
  onChange: (value: "single" | "passage") => void;   
}) => {
  return (
    <RadioGroup.Root onValueChange={(details) => onChange(details.value as "single" | "passage")} size={size} key={size} defaultValue={defaultValue}>
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
