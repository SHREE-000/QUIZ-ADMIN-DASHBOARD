import { Box, Center, Spinner, Text, VStack } from "@chakra-ui/react";

export default function Spin() {
  return (
    <Box pos="absolute" inset="0" bg="bg/80">
      <Center h="lvh">
        <VStack colorPalette="teal">
          <Spinner color="colorPalette.600" />
          <Text color="colorPalette.600">Loading...</Text>
        </VStack>
      </Center>
    </Box>
  );
}
