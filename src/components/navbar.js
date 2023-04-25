import {
  Box,
  Container,
  Flex,
  Heading,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import Link from "next/link";
import Logo from "./logo";
import NextLink from "next/link";
import ThemeToggleButton from "./theme-toggle-button";

const LinkItem = ({ href, path, target, children, ...props }) => {
  const active = path === href;
  const inactiveColor = useColorModeValue("gray200", "whiteAlpha.900");
  return (
    <Link
      as={NextLink}
      href={href}
      scroll={false}
      p={2}
      bg={active ? "grassTeal" : undefined}
      color={active ? "#202023" : inactiveColor}
      target={target}
      {...props}
    >
      {children}
    </Link>
  );
};

const Navbar = (props) => {
  const { path } = props;
  return (
    <Box
      position="fixed"
      as="nav"
      w="100%"
      bg={useColorModeValue("#ffffff40", "#20202380")}
      style={{ backdropFilter: "blur(10px)" }}
      zIndex={1}
      {...props}
    >
      <Container
        display="flex"
        p={2}
        maxW="container.md"
        wrap="wrap"
        align="center"
        justify="flex-end"
      >
        <Flex align="center" mr={5}>
          <Heading as="h1" size="lg" letterSpacing={"tighter"}>
            <Logo />
          </Heading>
        </Flex>
        <Stack
          direction={{ base: "row", md: "row" }}
          display={{ base: "inline-flex", md: "flex" }}
          width={{ base: "full", md: "auto" }}
          alignItems="center"
          flexGrow={1}
          mt={{ base: 4, nmd: 0 }}
          justify="flex-end"
        >
          <LinkItem href="/explore" path={path}>
            <Text
              color={useColorModeValue("gray.800", "white")}
              fontFamily="M PLUS Rounded 1c"
            >
              Explore
            </Text>
          </LinkItem>
          <Box
            py={1}
            px={3}
            borderRadius="full"
            bg={useColorModeValue("black", "white")}
          >
            <LinkItem href="/login" path={path}>
              <Text
                color={useColorModeValue("white", "gray.800")}
                fontFamily="M PLUS Rounded 1c"
                fontSize="sm"
              >
                Login
              </Text>
            </LinkItem>
          </Box>
        </Stack>
        <Box flex={1} align="right">
          <ThemeToggleButton />
        </Box>
      </Container>
    </Box>
  );
};

export default Navbar;
