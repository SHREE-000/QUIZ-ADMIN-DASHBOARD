import { Stack } from "@chakra-ui/react";
import FormSelect from "../shared/molecular/FormSelect";
import { QnA } from "@/src/utils/interface";
import FormTextArea from "../shared/atomic/FormTextArea";

const AddManualQn = ({
  changeType,
  changeDifficult,
  changePassage,
  changeExplanation
}:
{
  changeType: (value: string[]) => void;
  changeDifficult: (value: string[]) => void;
  changePassage: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  changeExplanation: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  addQn: () => void;
  updateQn: (index: number, field: string, value: number | string) => void;
  questions: QnA[];
}) =>
  {
    return (
      <Stack>
        <FormSelect
          onChange={changeType}
          defaultValue={"SINGLE"}
          label="type of question"
          items={[
            { data: "SINGLE", _id: "SINGLE" },
            { data: "PASSAGE", _id: "PASSAGE" },
          ]}
        />
        <FormSelect
          onChange={changeDifficult}
          defaultValue={"easy"}
          label="difficulty of all questions"
          items={[
            { data: "EASY", _id: "easy" },
            { data: "MEDIUM", _id: "medium" },
            { data: "HARD", _id: "hard" },
          ]}
        />
        <FormTextArea type="Passage" label="question" onChange={changePassage} />
        <FormTextArea type="Explanation" label="question" onChange={changeExplanation} />
      </Stack>
    );
  };

export default AddManualQn;
