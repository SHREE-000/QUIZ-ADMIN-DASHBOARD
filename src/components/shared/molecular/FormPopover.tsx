import { Button, Group, Popover, Portal } from "@chakra-ui/react";

const FormPopover = ({
  isEditMode,
  label,
  resolve,
  reject,
  content,
  onClick,
  ref,
}: {
  content: string;
  label: string;
  resolve: string;
  reject: string;
  isEditMode: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onClick: () => void;
}) => {
  return (
    <Popover.Root
      initialFocusEl={() => (ref as React.RefObject<HTMLButtonElement>).current}
    >
      <Popover.Trigger asChild>
        <Button disabled={!isEditMode}>{label}</Button>
      </Popover.Trigger>
      <Portal>
        <Popover.Positioner>
          <Popover.Content>
            <Popover.Arrow />
            <Popover.Body>{content}</Popover.Body>
            <Popover.Footer>
              <Group flex="1" justifyContent="flex-end" gap="2">
                <Popover.CloseTrigger asChild>
                  <Button size="sm" ref={ref}>
                    {reject}
                  </Button>
                </Popover.CloseTrigger>
                <Popover.CloseTrigger asChild>
                  <Button size="sm" type="submit" onClick={onClick}>
                    {resolve}
                  </Button>
                </Popover.CloseTrigger>
              </Group>
            </Popover.Footer>
            <Popover.CloseTrigger />
          </Popover.Content>
        </Popover.Positioner>
      </Portal>
    </Popover.Root>
  );
};

export default FormPopover;
