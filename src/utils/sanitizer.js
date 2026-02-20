export function sanitizeContent(content, patterns) {
  let sanitized = content;
  
  patterns.forEach(({ pattern, replacement }) => {
    if (pattern && replacement) {
      try {
        const regex = new RegExp(pattern, 'g');
        sanitized = sanitized.replace(regex, replacement);
      } catch (error) {
        console.error(`Invalid regex pattern: "${pattern}". Error: ${error.message}. Skipping this pattern.`);
      }
    }
  });
  
  return sanitized;
}
