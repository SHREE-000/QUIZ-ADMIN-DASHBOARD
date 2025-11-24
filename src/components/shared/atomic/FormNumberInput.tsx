import { Field, NumberInput } from "@chakra-ui/react";

const FormNumberInput = ({ label = "", idx = -1, onChange }: {
    label: string;
    idx: number;
    onChange: (index: number, field: string, value: number) => void;
}) => {
  return (
    <Field.Root>
      <Field.Label>Enter {label}</Field.Label>
      <NumberInput.Root min={1} max={10} w={"full"}>
        <NumberInput.Control />
        <NumberInput.Input onChange={(e) => onChange(idx, label, Number(e.target.value))} />
      </NumberInput.Root>
      <Field.HelperText>Enter {label} between 1 and 10</Field.HelperText>
    </Field.Root>
  );
};

export default FormNumberInput;
