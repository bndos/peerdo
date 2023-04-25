import { Container, Box, Heading, useColorModeValue } from "@chakra-ui/react";

const Page = () => {
  return (
    <Container>
      <Box
        borderRadius="lg"
        bg={useColorModeValue("#F6F1E1", "#2C2A25")}
        mt={5}
        mb={6}
        p={3}
        align="center"
      >
        Hello are you a peerdoer? You could benefit greatly by using this app
      </Box>

      <Box display={{ md: "flex" }}></Box>
      <Box flexGrow={1}>
        <Heading as="h2" variant="page-title">
          Peerdo
        </Heading>
      </Box>
    </Container>
  );
};

export default Page;
