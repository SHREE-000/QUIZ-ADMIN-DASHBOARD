import { Stack } from "@chakra-ui/react";
import FormTextArea from "../shared/atomic/FormTextArea";

const AddQn = ({
  changeQn,
}:
{
  changeQn: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) =>
  {
    return (
      <Stack>
        <FormTextArea type="Question" label="" onChange={changeQn} />
      </Stack>
    );
  };

export default AddQn;
