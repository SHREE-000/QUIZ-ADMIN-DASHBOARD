import { Popover } from "@chakra-ui/react";

export const PopoverText = ({
  open,
  closeButton,
  title,
  content,
}: {
  open: boolean;
  closeButton?: React.ReactNode;
  title?: string;
  content: string;
}) => {
  return (
    <Popover.Root open={open}>
      <Popover.Trigger>{title}</Popover.Trigger>
      <Popover.Positioner>
        <Popover.Content>
          {closeButton}
          <PopoverStatus open={open} content={content} />
        </Popover.Content>
      </Popover.Positioner>
    </Popover.Root>
  );
};

const PopoverStatus = ({ content }: { open: boolean; content: string }) => {
  return <div>{content}</div>;
};
