import React from 'react';
import {
  Box,
  Button,
  Grid,
  Heading,
  Text,
  useClipboard,
} from '@chakra-ui/react';

function Preview({ original, sanitized }) {
  const { hasCopied, onCopy } = useClipboard(sanitized);

  const downloadSanitized = () => {
    const blob = new Blob([sanitized], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sanitized-output.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!original && !sanitized) {
    return null;
  }

  return (
    <Box>
      <Heading size="md" mb={4}>Preview</Heading>
      <Grid templateColumns="repeat(2, 1fr)" gap={6}>
        <Box>
          <Text fontWeight="bold" mb={2}>Original</Text>
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            whiteSpace="pre-wrap"
            maxHeight="400px"
            overflowY="auto"
          >
            {original || 'No content'}
          </Box>
        </Box>
        <Box>
          <Text fontWeight="bold" mb={2}>Sanitized</Text>
          <Box
            p={4}
            bg="gray.50"
            borderRadius="md"
            whiteSpace="pre-wrap"
            maxHeight="400px"
            overflowY="auto"
          >
            {sanitized || 'No content'}
          </Box>
          <Button onClick={onCopy} mt={4} mr={2}>
            {hasCopied ? 'Copied!' : 'Copy to Clipboard'}
          </Button>
          <Button onClick={downloadSanitized} mt={4} colorScheme="blue">
            Download
          </Button>
        </Box>
      </Grid>
    </Box>
  );
}

export default Preview;