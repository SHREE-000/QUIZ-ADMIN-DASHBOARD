import { Field, Span, TagsInput } from "@chakra-ui/react";

const FormTags = ({
  label,
  onChange,
}: {
  label: string;
  onChange: (value: string[]) => void;
}) => {
  return (
    <Field.Root>
      <TagsInput.Root onValueChange={(details) => onChange(details.value)}>
        <TagsInput.Label></TagsInput.Label>
        <TagsInput.Control>
          <TagsInput.Items />
          <TagsInput.Input placeholder={`Add ${label}...`} />
        </TagsInput.Control>
        <Span textStyle="xs" color="fg.muted" ms="auto">
          Press Enter or Return to add {label}
        </Span>
      </TagsInput.Root>
    </Field.Root>
  );
};

export default FormTags;
