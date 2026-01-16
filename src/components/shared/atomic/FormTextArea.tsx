import { Field, Textarea } from "@chakra-ui/react";

const FormTextArea = ({
  label,
  onChange,
  required = false,
  value,
  disabled = false,
  type = "Description",
  addOnLabel = "",
  action,
}: {
  label: string;
  type?: "Description" | "Passage" | "Explanation" | "Question";
  addOnLabel?: string | number;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
  value?: string;
  disabled?: boolean;
  action?: React.ReactNode;
}) => {
  return (
    <Field.Root>
      <Field.Label>{type} {addOnLabel} {action && action}</Field.Label>
      <Textarea
        value={value}
        disabled={disabled}
        onChange={onChange}
        name={`${label} ${type.toLowerCase()}`}
        placeholder={`Enter ${label} ${type.toLowerCase()}`}
        required={required}
      />
    </Field.Root>
  );
};

export default FormTextArea;
