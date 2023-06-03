import { Box, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const WelcomeContent = () => {
  const [fact, setFact] = useState(null);
  useEffect(() => {
    const getFact = async () => {
      const res = await fetch("https://dogapi.dog/api/v2/facts");
      const data = await res.json();
      setFact(data.data[0].attributes.body);
    };
    getFact();
  }, []);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      bg="white"
      flex="1"
    >
      {fact ? (
        <Text margin="20px">{fact}</Text>
      ) : (
        <Text>Random dog fact. </Text>
      )}
    </Box>
  );
};

export default WelcomeContent;
