import React from 'react';
import {
  Box,
  Button,
  Heading,
  Input,
  HStack,
  VStack,
  IconButton,
} from '@chakra-ui/react';

function PatternEditor({ patterns, onChange }) {
  const addPattern = () => {
    onChange([
      ...patterns,
      { type: '', pattern: '', replacement: '[REDACTED]' }
    ]);
  };

  const removePattern = (index) => {
    const newPatterns = patterns.filter((_, i) => i !== index);
    onChange(newPatterns);
  };

  const updatePattern = (index, field, value) => {
    const newPatterns = patterns.map((p, i) => {
      if (i === index) {
        return { ...p, [field]: value };
      }
      return p;
    });
    onChange(newPatterns);
  };

  return (
    <Box>
      <Heading size="md" mb={4}>Sensitive Data Patterns</Heading>
      <VStack spacing={4} align="stretch">
        {patterns.map((pattern, index) => (
          <HStack key={index} spacing={4}>
            <Input
              placeholder="Type"
              value={pattern.type}
              onChange={(e) => updatePattern(index, 'type', e.target.value)}
            />
            <Input
              placeholder="Pattern (regex)"
              value={pattern.pattern}
              onChange={(e) => updatePattern(index, 'pattern', e.target.value)}
            />
            <Input
              placeholder="Replacement"
              value={pattern.replacement}
              onChange={(e) => updatePattern(index, 'replacement', e.target.value)}
            />
            <IconButton
              aria-label="Remove pattern"
              icon={<span>×</span>}
              onClick={() => removePattern(index)}
            />
          </HStack>
        ))}
        <Button onClick={addPattern} colorScheme="blue">
          Add Pattern
        </Button>
      </VStack>
    </Box>
  );
}

export default PatternEditor;