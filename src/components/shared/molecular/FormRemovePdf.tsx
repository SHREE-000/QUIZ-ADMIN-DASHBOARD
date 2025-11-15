import {
  Box,
  Button,
  Field,
  Flex,
  Group,
  Popover,
  Portal,
  Text,
  VStack,
} from "@chakra-ui/react";
import { Tooltip } from "../../ui/tooltip";
import { MdOutlineClose } from "react-icons/md";
import { useColorModeValue } from "../../ui/color-mode";
import { FiFileText } from "react-icons/fi";

const FormRemovePdf = ({
  values,
  label,
  onClick,
  isEditMode = false,
  ref,
}: {
  label: string;
  values?: string[];
  isEditMode?: boolean;
  ref?: React.Ref<HTMLButtonElement>;
  onClick: (imgUrl: string) => void;
}) => {
    const bg = useColorModeValue("gray.50", "gray.800");
    const border = useColorModeValue("gray.200", "gray.700");
  return (
   <Field.Root>
                 <Field.Label>{label}</Field.Label>
                 <VStack align="stretch" gap={2} mt={4}>
                   {values?.map((file) => (
                     <Flex
                       key={file}
                       align="center"
                       justify="space-between"
                       p={2}
                       borderWidth="1px"
                       borderColor={border}
                       rounded="md"
                       bg={bg}
                       _hover={{ bg }}
                     >
                       <Flex align="center" justify="space-between" gap={2}>
                         <Box color="blue.500">
                           <FiFileText />
                         </Box>
                         <Text fontSize="sm">
                           {file.split("/")[file.split("/").length - 1]}
                         </Text>
                         <Popover.Root initialFocusEl={() => (ref as React.RefObject<HTMLButtonElement>)?.current}>
                           <Popover.Trigger asChild>
                             <Button
                               disabled={!isEditMode}
                               size="xs"
                               colorScheme="red"
                               alignItems="right"
                               top="2px"
                               right="2px"
                               aria-label="Remove PDF"
                               rounded="full"
                               bg="yellow.100"
                               _hover={{ bg: "red.100" }}
                             >
                               {isEditMode ? (
                                 <Tooltip content="Remove PDF">
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
                                     {file.split("/")[file.split("/").length - 1]}
                                   </Text>{" "}
                                   PDF?
                                 </Popover.Body>
                                 <Popover.Footer>
                                   <Group
                                     flex="1"
                                     justifyContent="flex-end"
                                     gap="2"
                                   >
                                     <Popover.CloseTrigger asChild>
                                       <Button size="sm" ref={ref}>
                                         Cancel
                                       </Button>
                                     </Popover.CloseTrigger>
                                     <Popover.CloseTrigger asChild>
                                       <Button
                                         size="sm"
                                         onClick={() => onClick(file)}
                                       >
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
                       </Flex>
                     </Flex>
                   ))}
   
                   {values?.length === 0 && (
                     <Box textAlign="center" color="gray.500" py={2}>
                       No PDF files uploaded
                     </Box>
                   )}
                 </VStack>
               </Field.Root>
  );
};

export default FormRemovePdf;
