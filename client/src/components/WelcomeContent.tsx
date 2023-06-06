import { Box, Text, Image } from "@chakra-ui/react";
import { useEffect, useState } from "react";

const WelcomeContent = () => {
  const [fact, setFact] = useState(null);
  const [image, setImage] = useState(null);
  useEffect(() => {
    const getFact = async () => {
      const res = await fetch("https://dogapi.dog/api/v2/facts");
      const data = await res.json();
      setFact(data.data[0].attributes.body);
    };
    const getImage = async () => {
      const res = await fetch("https://dog.ceo/api/breeds/image/random");
      const data = await res.json();
      setImage(data.message);
    };
    getFact();
    getImage();
  }, []);
  return (
    <Box ml="220px" padding="1px 16px" textAlign="center">
      {fact ? (
        <Text margin="20px">{fact}</Text>
      ) : (
        <Text>Pending random dog fact. </Text>
      )}
      {image ? (
        <Image
          src={image}
          alt="Random doggie image"
          margin="0 auto"
          borderRadius="10px"
          boxShadow="md"
          mt="50px"
        />
      ) : (
        <Text>Pending random dog image. </Text>
      )}
    </Box>
  );
};

export default WelcomeContent;
