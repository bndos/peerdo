import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

const styles = {
  global: (props) => ({
    body: {
      bg: mode("#ffffff", "#202023")(props),
    },
  }),
};

const components = {
  Heading: {
    variants: {
      "section-title": {
        textDecoration: "underline",
        fontSize: 20,
        textUnderlineOffset: 6,
        textDecorationColor: "#525252",
        textDecorationThickness: 4,
        marginTop: 3,
        marginBottom: 4,
      },
    },
  },
  Link: {
    baseStyle: (props) => ({
      color: mode("#3d7aed", "#ff63c3")(props),
      textUnderlineOffset: 3,
    }),
  },
  Button: {
    variants: {
      custom: (props) => ({
        bg: mode("blue.500", "blue.200")(props),
        color: mode("white", "black")(props),
        _hover: {
          bg: mode("blue.700", "blue.400")(props),
        },
      }),
    },
  },
  Box: {
    variants: {
      call: (props) => ({
        bg: mode("gray.50", "gray.900")(props),
        color: mode("gray.800", "white")(props),
      }),
    },
  },
  IconButton: {
    defaultProps: {
      variant: "call",
      colorScheme: "gray",
    },
  },
};

const fonts = {
  heading: "'M PLUS Rounded 1c'",
};

const colors = {
  grassTeal: "#88ccca",
};

const config = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

const theme = extendTheme({ config, styles, components, fonts, colors });
export default theme;
