import { Field, Textarea } from "@chakra-ui/react";

const FormTextArea = ({
  label,
  onChange,
  required = false,
  value = "",
  disabled = false
}: {
  label: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
}) => {
  return (
    <Field.Root>
      <Field.Label>Description</Field.Label>
      <Textarea
        value={value}
        disabled={disabled}
        onChange={onChange}
        name={`${label} description`}
        placeholder={`Enter ${label} description`}
        required={required}
      />
    </Field.Root>
  );
};

export default FormTextArea;
