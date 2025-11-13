import {
  Box,
  Button,
  Field,
  Group,
  Image,
  Popover,
  Portal,
  Stack,
  Text,
} from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";
import { MdOutlineClose } from "react-icons/md";

const FormRemoveImg = ({
  img,
  label,
  onClick,
  isEditMode = false,
  ref,
}: {
  label: string;
  img?: string[];
  isEditMode?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onClick: (imgUrl: string) => void;
}) => {
  return (
    <Field.Root>
      <Field.Label>{label}</Field.Label>
      {img && typeof img[0] === "string" && (
        <Stack direction="row" gap={4} wrap="wrap">
          {img.map((imgUrl, idx) => (
            <Box
              key={idx}
              position="relative"
              display="inline-block"
              m={2}
              w="160px"
              h="160px"
            >
              <Image
                src={imgUrl}
                alt={`Uploaded image ${idx + 1}`}
                rounded="md"
                boxSize="160px"
                objectFit="cover"
              />
              <Popover.Root positioning={{ placement: "bottom-end" }}>
                <Popover.Trigger asChild>
                  <Button
                    disabled={!isEditMode}
                    size="xs"
                    colorScheme="red"
                    position="absolute"
                    top="2px"
                    right="2px"
                    aria-label="Remove image"
                    rounded="full"
                    bg="yellow.100"
                    _hover={{ bg: "red.100" }}
                  >
                    {isEditMode ? (
                      <Tooltip content="Remove image">
                        <MdOutlineClose color="black" />
                      </Tooltip>
                    ) : (
                      <MdOutlineClose color="grey" />
                    )}
                  </Button>
                </Popover.Trigger>
                <Portal>
                  <Popover.Positioner>
                    <Popover.Content>
                      <Popover.Arrow />
                      <Popover.Body>
                        Are you sure you want to remove{" "}
                        <Text fontWeight="bold">
                          {imgUrl.split("/")[imgUrl.split("/").length - 1]}
                        </Text>{" "}
                        image?
                      </Popover.Body>
                      <Popover.Footer>
                        <Group flex="1" justifyContent="flex-end" gap="2">
                          <Popover.CloseTrigger asChild>
                            <Button size="sm" ref={ref}>
                              Cancel
                            </Button>
                          </Popover.CloseTrigger>
                          <Popover.CloseTrigger asChild>
                            <Button size="sm" onClick={() => onClick(imgUrl)}>
                              Remove
                            </Button>
                          </Popover.CloseTrigger>
                        </Group>
                      </Popover.Footer>
                      <Popover.CloseTrigger />
                    </Popover.Content>
                  </Popover.Positioner>
                </Portal>
              </Popover.Root>
            </Box>
          ))}
        </Stack>
      )}
      {img?.length === 0 && (
        <Box textAlign="center" color="gray.500" py={2}>
          No Image files uploaded
        </Box>
      )}
    </Field.Root>
  );
};

export default FormRemoveImg;
