import {
  Box,
  Button,
  ButtonGroup,
  Container,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  HStack,
  Heading,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  VisuallyHidden,
  useDisclosure,
  useMergeRefs,
} from "@chakra-ui/react";
import { forwardRef, useRef, useState } from "react";
import { HiEye, HiEyeOff } from "react-icons/hi";
import { auth } from "../lib/firebase";
import LinkItem from "../components/link-item";
import { GitHubIcon, GoogleIcon, TwitterIcon } from "../components/oauth-icons";
import { useRouter } from "next/router";

const providers = [
  {
    name: "Google",
    icon: <GoogleIcon boxSize="5" />,
  },
  {
    name: "Twitter",
    icon: <TwitterIcon boxSize="5" />,
  },
  {
    name: "GitHub",
    icon: <GitHubIcon boxSize="5" />,
  },
];

const OAuthButtonGroup = () => (
  <ButtonGroup variant="outline" spacing="4" width="full">
    {providers.map(({ name, icon }) => (
      <Button key={name} width="full">
        <VisuallyHidden>Sign in with {name}</VisuallyHidden>
        {icon}
      </Button>
    ))}
  </ButtonGroup>
);

const PasswordField = forwardRef((props, ref) => {
  const { isOpen, onToggle } = useDisclosure();
  const inputRef = useRef(null);
  const mergeRef = useMergeRefs(inputRef, ref);
  const onClickReveal = () => {
    onToggle();
    if (inputRef.current) {
      inputRef.current.focus({
        preventScroll: true,
      });
    }
  };

  const [isValid, setIsValid] = useState(false);
  const validatePassword = (value) => {
    if (value.length < 8) {
      setIsValid(false);
    } else {
      setIsValid(true);
    }
  };

  return (
    <FormControl isInvalid={!isValid}>
      <FormLabel htmlFor="password">
        Password{" "}
        <Text as="span" color="#FF6B6B">
          *
        </Text>
      </FormLabel>
      <InputGroup>
        <InputRightElement>
          <IconButton
            variant="link"
            aria-label={isOpen ? "Mask password" : "Reveal password"}
            icon={isOpen ? <HiEyeOff /> : <HiEye />}
            onClick={onClickReveal}
          />
        </InputRightElement>
        <Input
          id="password"
          ref={mergeRef}
          name="password"
          type={isOpen ? "text" : "password"}
          autoComplete="current-password"
          required
          onBlur={(e) => validatePassword(e.target.value)}
          {...props}
        />
      </InputGroup>
      {!isValid && (
        <FormErrorMessage>
          Password must be at least 8 characters long
        </FormErrorMessage>
      )}
    </FormControl>
  );
});

PasswordField.displayName = "PasswordField";

const Signup = (props) => {
  const router = useRouter();
  const { path } = props;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <Container
      maxW="lg"
      py={{
        base: "12",
        md: "24",
      }}
      px={{
        base: "0",
        sm: "8",
      }}
    >
      <Stack spacing="8">
        <Stack spacing="6">
          {/* <Logo /> */}
          <Stack
            spacing={{
              base: "2",
              md: "3",
            }}
            textAlign="center"
          >
            <Heading
              size={{
                base: "xs",
                md: "sm",
              }}
            >
              Create an account
            </Heading>
            <HStack spacing="1" justify="center">
              <Text color="muted">Already have an account?</Text>
              <LinkItem href="/login" path={path}>
                <Button variant="link" colorScheme="blue">
                  Login
                </Button>
              </LinkItem>
            </HStack>
          </Stack>
        </Stack>
        <Box
          py={{
            base: "0",
            sm: "8",
          }}
          px={{
            base: "4",
            sm: "10",
          }}
          bg={{
            base: "transparent",
            sm: "bg-surface",
          }}
          boxShadow={{
            base: "none",
            sm: "0 0 6px 3px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06)",
          }}
          borderRadius={{
            base: "none",
            sm: "xl",
          }}
          shadow="lg"
        >
          <Stack spacing="6">
            <Stack spacing="5">
              <FormControl>
                <FormLabel htmlFor="email">
                  Email{" "}
                  <Text as="span" color="#FF6B6B">
                    *
                  </Text>
                </FormLabel>

                <Input
                  id="email"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </FormControl>
              <PasswordField
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </Stack>
            <Stack spacing="6">
              <Button
                variant="custom"
                onClick={() => {
                  auth
                    .createUserWithEmailAndPassword(email, password)
                    .then((userCredential) => {
                      // User account created successfully
                      const user = userCredential.user;
                      console.log("User account created successfully:", user);
                      router.push("/home"); // Redirect to home page
                    })
                    .catch((error) => {
                      // An error occurred
                      const errorCode = error.code;
                      const errorMessage = error.message;
                      console.error(
                        "Error creating user account:",
                        errorCode,
                        errorMessage
                      );
                    });
                }}
              >
                Create account
              </Button>
              <HStack>
                <Divider />
                <Text fontSize="sm" whiteSpace="nowrap" color="muted">
                  or sign up with
                </Text>
                <Divider />
              </HStack>
              <OAuthButtonGroup />
            </Stack>
          </Stack>
        </Box>
      </Stack>
    </Container>
  );
};

export default Signup;
