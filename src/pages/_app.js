import { ChakraProvider } from "@chakra-ui/react";
import Layout from "../components/layouts/main";
import theme from "../lib/theme";
import { RoomProvider } from "../lib/room-context";
import { P2PProvider } from "../lib/p2p-context";

const Website = ({ Component, pageProps, router }) => {
  return (
    <ChakraProvider theme={theme}>
      <Layout router={router}>
        <P2PProvider>
          <RoomProvider>
            <Component {...pageProps} key={router.route} />
          </RoomProvider>
        </P2PProvider>
      </Layout>
    </ChakraProvider>
  );
};

export default Website;
