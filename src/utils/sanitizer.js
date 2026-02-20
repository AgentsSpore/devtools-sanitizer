export function sanitizeContent(content, patterns) {
  let sanitized = content;
  
  patterns.forEach(({ pattern, replacement }) => {
    if (pattern && replacement) {
      const regex = new RegExp(pattern, 'g');
      sanitized = sanitized.replace(regex, replacement);
    }
  });
  
  return sanitized;
}