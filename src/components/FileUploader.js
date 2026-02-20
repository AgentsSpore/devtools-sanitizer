import React, { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Text, VStack } from '@chakra-ui/react';

function FileUploader({ onUpload }) {
  const onDrop = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    const reader = new FileReader();
    
    reader.onload = () => {
      onUpload(reader.result);
    };
    
    reader.readAsText(file);
  }, [onUpload]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <Box>
      <VStack
        {...getRootProps()}
        p={10}
        border="2px dashed"
        borderColor={isDragActive ? 'blue.400' : 'gray.200'}
        borderRadius="lg"
        bg={isDragActive ? 'blue.50' : 'gray.50'}
        cursor="pointer"
        transition="all 0.2s"
        _hover={{ borderColor: 'blue.400', bg: 'blue.50' }}
      >
        <input {...getInputProps()} />
        <Text textAlign="center">
          {isDragActive
            ? 'Drop the file here'
            : 'Drag and drop a log file here, or click to select'}
        </Text>
      </VStack>
    </Box>
  );
}

export default FileUploader;