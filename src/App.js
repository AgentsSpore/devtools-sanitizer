import React, { useState } from 'react';
import { Box, Container, Heading, Text, VStack } from '@chakra-ui/react';
import FileUploader from './components/FileUploader';
import PatternEditor from './components/PatternEditor';
import Preview from './components/Preview';
import { sanitizeContent } from './utils/sanitizer';

function App() {
  const [fileContent, setFileContent] = useState('');
  const [patterns, setPatterns] = useState([
    { type: 'email', pattern: '[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}', replacement: '[EMAIL]' },
    { type: 'apiKey', pattern: '[A-Za-z0-9]{32}', replacement: '[API_KEY]' },
    { type: 'ipAddress', pattern: '\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b', replacement: '[IP_ADDRESS]' }
  ]);
  const [sanitizedContent, setSanitizedContent] = useState('');

  const handleFileUpload = (content) => {
    setFileContent(content);
    const cleaned = sanitizeContent(content, patterns);
    setSanitizedContent(cleaned);
  };

  const handlePatternsChange = (newPatterns) => {
    setPatterns(newPatterns);
    if (fileContent) {
      const cleaned = sanitizeContent(fileContent, newPatterns);
      setSanitizedContent(cleaned);
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading as="h1" size="2xl" mb={2}>DevTools Sanitizer</Heading>
          <Text fontSize="lg" color="gray.600">
            Clean sensitive data from logs and API payloads in one click
          </Text>
        </Box>

        <FileUploader onUpload={handleFileUpload} />
        <PatternEditor patterns={patterns} onChange={handlePatternsChange} />
        <Preview original={fileContent} sanitized={sanitizedContent} />
      </VStack>
    </Container>
  );
}

export default App;