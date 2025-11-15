import { Field, Input } from "@chakra-ui/react";

const FormInput = ({
  label,
  type = "text",
  onChange,
  required = true,
  disabled = false,
  value
}: {
  label: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
}) => {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Input
        value={value}
        disabled={disabled}
        onChange={onChange}
        name={label}
        type={type}
        placeholder={`Enter ${label} name`}
        required={required}
      />
    </Field.Root>
  );
};

export default FormInput;
