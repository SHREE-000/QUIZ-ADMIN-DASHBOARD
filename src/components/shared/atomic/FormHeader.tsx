import { Fieldset, Stack } from "@chakra-ui/react";

const FormHeader = ({
  legend,
  helperText,
}: {
  legend: string;
  helperText: string;
}) => {
  return (
    <Stack>
      <Fieldset.Legend>{legend}</Fieldset.Legend>
      <Fieldset.HelperText>{helperText}</Fieldset.HelperText>
    </Stack>
  );
};

export default FormHeader;
