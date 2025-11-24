import { CategoryDto } from "@/src/utils/interface";
import { Select, createListCollection, Portal } from "@chakra-ui/react";

const FormSelect = ({
  label,
  items,
  defaultValue,
  disabled = false,
  onChange,
  type = "default",
  index,
  field,
}: {
  label: string;
  items: CategoryDto[];
  disabled?: boolean;
  defaultValue?: string;
  type?: "default" | "custom";
  field?: "difficulty";
  onChange:
    | ((value: string[]) => void)
    | ((index: number, field: string, value: string) => void);
  index?: number;
}) => {
  const list = createListCollection({
    items: items.map((item) => ({
      label: item.data,
      value: String(item._id),
    })),
  });
  type DefaultChange = (details: { value: string[] }) => void;
  type NumericChange = (details: { value: string[] }) => void;
  let handleChange: DefaultChange | NumericChange;
  if (type === "default") {
    handleChange = (details) => {
      (onChange as (value: string[]) => void)(details.value);
    };
  } else {
    handleChange = (details: { value: string[] }) => {
      const idx = index ?? -1;
      const fieldVal = field ?? "";
      (onChange as (index: number, field: string, value: string) => void)(
        idx,
        fieldVal,
        details.value[0]
      );
    };
  }
  return (
    <Select.Root
      disabled={disabled}
      collection={list}
      defaultValue={[String(defaultValue)]}
      size="sm"
      width="full"
      onValueChange={handleChange}
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
