import { Field, Textarea } from "@chakra-ui/react";

const FormTextArea = ({
  label,
  onChange,
  required = false,
}: {
  label: string;
  type?: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  required?: boolean;
}) => {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      <Textarea
        onChange={onChange}
        name={`${label} description`}
        placeholder={`Enter ${label} description`}
        required={required}
      />
    </Field.Root>
  );
};

export default FormTextArea;
