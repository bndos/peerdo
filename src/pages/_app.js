import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/layouts/main";
import theme from "../lib/theme";
import { RoomProvider } from "../lib/room-context";

const Website = ({ Component, pageProps, router }) => {
  return (
    <ChakraProvider theme={theme}>
      <Layout router={router}>
        <RoomProvider>
          <Component {...pageProps} key={router.route} />
        </RoomProvider>
      </Layout>
    </ChakraProvider>
  );
};

export default Website;
