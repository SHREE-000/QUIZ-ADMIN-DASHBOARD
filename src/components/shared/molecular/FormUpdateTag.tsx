import { Field, Span, TagsInput } from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";

const FormUpdateTag = ({
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
        <TagsInput.Label>Add New {label}</TagsInput.Label>
        <TagsInput.Control>
          {isEditMode ? (
            <Tooltip content={`Remove ${label}`}>
              <TagsInput.Items />
            </Tooltip>
          ) : (
            <TagsInput.Items style={{ cursor: "not-allowed" }} />
          )}
          <TagsInput.Input
            style={{ cursor: isEditMode ? "text" : "not-allowed" }}
            placeholder={`Add ${label}...`}
          />
        </TagsInput.Control>
        <Span textStyle="xs" color="fg.muted" ms="auto">
          Press Enter or Return to add {label}
        </Span>
      </TagsInput.Root>
    </Field.Root>
  );
};

export default FormUpdateTag;
