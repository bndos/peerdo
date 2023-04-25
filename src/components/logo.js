import Link from "next/link";
import Image from "next/image";
import { Text, useColorModeValue } from "@chakra-ui/react";

import styled from "@emotion/styled";

const LogoBox = styled.span`
  font-weight: bold;
  font-size: 18px;
  display: inline-flex;
  align-items: center;
  height: 40px;
  line-height: 20px;
  padding: 10px;

  &:hover img {
    transform: rotate(360deg);
  }
`;

const Logo = () => {
  const peerdoImg = `/images/psychology.png`;

  return (
    <Link href="/">
      <LogoBox>
        <Image src={peerdoImg} width={45} height={45} mt={10} alt="logo" />
        <Text
          color={useColorModeValue("gray.800", "white")}
          fontFamily="M PLUS Rounded 1c"
          fontWeight="bold"
          ml={2}
          mt={4}
        >
          Peerdo
        </Text>
      </LogoBox>
    </Link>
  );
};

export default Logo;
