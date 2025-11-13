import { FaEdit } from "react-icons/fa";
import { MdEditOff } from "react-icons/md";
import { Tooltip } from "../../ui/tooltip";

const ConditionEdit = ({
  isEditMode,
  content,
  onClick
}: {
  content: string;
  isEditMode: boolean;
  onClick: React.MouseEventHandler<SVGElement>;
}) => {
  return (
    <>
      {isEditMode ? (
        <Tooltip content={`Disable ${content}`}>
          <FaEdit
            onClick={onClick}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      ) : (
        <Tooltip content={`Enable ${content}`}>
          <MdEditOff
            onClick={onClick}
            style={{ cursor: "pointer" }}
          />
        </Tooltip>
      )}
    </>
  );
};

export default ConditionEdit;
