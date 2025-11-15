import { Select, createListCollection, Portal } from "@chakra-ui/react";
import { Types } from "mongoose";

interface Dto {
  _id: string | Types.ObjectId;
  data: string;
}

const FormSelect = ({
  label,
  items,
  defaultValue,
  disabled = false,
  onChange,
}: {
  label: string;
  items: Dto[];
  disabled?: boolean;
  defaultValue?: string;
  onChange: (value: string[]) => void;
}) => {
  const list = createListCollection({
    items: items.map((item) => ({
      label: item.data,
      value: String(item._id),
    })),
  });
  return (
    <Select.Root
      disabled={disabled}
      collection={list}
      defaultValue={[String(defaultValue)]}
      size="sm"
      width="full"
      onValueChange={(details) => onChange(details.value)}
    >
      <Select.HiddenSelect />
      <Select.Label>Select {label}</Select.Label>
      <Select.Control>
        <Select.Trigger>
          <Select.ValueText placeholder={`Select ${label}`} />
        </Select.Trigger>
        <Select.IndicatorGroup>
          <Select.Indicator />
        </Select.IndicatorGroup>
      </Select.Control>

      <Portal>
        <Select.Positioner>
          <Select.Content>
            {list.items.map((item) => (
              <Select.Item item={item} key={item.value}>
                <Select.ItemText>{item.label}</Select.ItemText>
                <Select.ItemIndicator />
              </Select.Item>
            ))}
          </Select.Content>
        </Select.Positioner>
      </Portal>
    </Select.Root>
  );
};

export default FormSelect;
