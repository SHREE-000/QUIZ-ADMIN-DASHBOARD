import { Field, TagsInput } from "@chakra-ui/react";

const FormRemoveTag = ({
  values,
  label,
  onChange,
  isEditMode = false,
}: {
  label: string;
  values: string[];
  isEditMode?: boolean;
  onChange: (value: string[]) => void;
}) => {
  return (
    <Field.Root>
      <TagsInput.Root
        value={values}
        disabled={!isEditMode}
        onValueChange={(details) => onChange(details.value)}  
      >
        <TagsInput.Label>{label}</TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
        </TagsInput.Control>
      </TagsInput.Root>
    </Field.Root>
  );
};

export default FormRemoveTag;
