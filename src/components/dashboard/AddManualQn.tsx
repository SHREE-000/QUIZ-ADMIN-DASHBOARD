import { Stack, Heading, Button } from "@chakra-ui/react";
import FormSelect from "../shared/molecular/FormSelect";
import FormTags from "../shared/atomic/FormTags";
import Collapse from "../shared/molecular/Collapse";
import { LANGUAGES } from "@/src/utils/constant";
import ParentCollapse from "../shared/atomic/ParentCollapse";
import FormNumberInput from "../shared/atomic/FormNumberInput";
import { QnA } from "@/src/utils/interface";

const AddManualQn = ({
  changeType,
  changeDifficult,
  changeTag,
  changePassage,
  changeExplanation,
  addQn,
  updateQn,
  questions,
}: //   type = "SINGLE",
//   difficulty = "easy",
//   tags = [],
//   passage,
//   exp,
//   qna
{
  changeType: (value: string[]) => void;
  changeDifficult: (value: string[]) => void;
  changeTag: (value: string[]) => void;
  changePassage: (lang: string, value: string) => void;
  changeExplanation: (lang: string, value: string) => void;
  addQn: () => void;
  updateQn: (index: number, field: string, value: number | string) => void;
  questions: QnA[];
}) =>
  //  {
  // type: "SINGLE" | "PASSAGE";
  // difficulty: "easy" | "medium" | "hard";
  // tags?: string[];
  // passage: Map<string, string>;
  // exp: Map<string, string>;
  // qna: QnA[]
  // }
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
        <FormTags label="Tags" onChange={changeTag} />
        <ParentCollapse
          label="Add Passage of Question"
          component={LANGUAGES.map((lan: string, idx: number) => {
            return (
              <Collapse
                label="passage"
                language={lan}
                key={idx}
                handleChange={changePassage}
              />
            );
          })}
        />
        <ParentCollapse
          label="Add Explanation of Question"
          component={LANGUAGES.map((lan: string, idx: number) => {
            return (
              <Collapse
                label="explanation"
                language={lan}
                key={idx}
                handleChange={changeExplanation}
              />
            );
          })}
        />
        <ParentCollapse
          label="Add Questions"
          component={
            <>
              {questions.map((question, idx: number) => (
                <>
                  <FormSelect
                    index={idx}
                    type="custom"
                    onChange={updateQn}
                    field="difficulty"
                    defaultValue={"easy"}
                    label="difficulty of question"
                    items={[
                      { data: "EASY", _id: "easy" },
                      { data: "MEDIUM", _id: "medium" },
                      { data: "HARD", _id: "hard" },
                    ]}
                  />
                  <FormNumberInput idx={idx} onChange={updateQn} label="ans" />
                  <FormNumberInput
                    idx={idx}
                    onChange={updateQn}
                    label="score"
                  />
                  <Heading>Add Question</Heading>
                  {LANGUAGES.map((lan: string, idx: number) => {
                    return (
                      <Collapse
                        label="question"
                        language={lan}
                        key={idx}
                        handleChange={changeExplanation}
                      />
                    );
                  })}
                <Heading>Add Options</Heading>
                  {LANGUAGES.map((lan: string, idx: number) => {
                    return (
                      <Collapse
                        label="question"
                        language={lan}
                        key={idx}
                        handleChange={changeExplanation}
                      />
                    );
                  })}
                </>
              ))}
              <Button colorScheme="blue" onClick={addQn}>
                + Add More Question
              </Button>
            </>
          }
        />
      </Stack>
    );
  };

export default AddManualQn;
