/**
 * Maximum iterations allowed for regex replacement to prevent catastrophic backtracking
 */
const MAX_ITERATIONS = 100000;

/**
 * Known dangerous regex patterns that can cause ReDoS attacks
 */
const DANGEROUS_PATTERNS = [
  /(.)\1{10,}/,  // Excessive repetition
  /\((.*\+.*){3,}\)/,  // Nested quantifiers
  /(.*){10,}/,  // High repetition of greedy groups
];

/**
 * Validates if a regex pattern is potentially dangerous
 * @param {string} pattern - The regex pattern to validate
 * @returns {boolean} - True if pattern appears safe, false otherwise
 */
function isPatternSafe(pattern) {
  for (const dangerousPattern of DANGEROUS_PATTERNS) {
    if (dangerousPattern.test(pattern)) {
      return false;
    }
  }
  return true;
}

/**
 * Safely creates a RegExp object with validation
 * @param {string} pattern - The regex pattern
 * @returns {RegExp|null} - RegExp object or null if invalid
 */
function createSafeRegex(pattern) {
  try {
    // Check for dangerous patterns
    if (!isPatternSafe(pattern)) {
      console.warn(`Pattern "${pattern}" appears to contain dangerous constructs and was skipped`);
      return null;
    }
    
    // Attempt to create the regex
    const regex = new RegExp(pattern, 'g');
    return regex;
  } catch (error) {
    console.error(`Invalid regex pattern "${pattern}": ${error.message}`);
    return null;
  }
}

/**
 * Safely replaces content using regex with iteration limit to prevent ReDoS
 * @param {string} content - Content to sanitize
 * @param {RegExp} regex - Compiled regex pattern
 * @param {string} replacement - Replacement string
 * @returns {string|null} - Sanitized content or null if unsafe
 */
function safeReplace(content, regex, replacement) {
  try {
    let iterations = 0;
    let result = content;
    let lastResult;
    
    // Detect if we're in an infinite loop or catastrophic backtracking
    const startTime = Date.now();
    const MAX_TIME = 5000; // 5 seconds max
    
    do {
      lastResult = result;
      iterations++;
      
      // Check iteration limit
      if (iterations > MAX_ITERATIONS) {
        throw new Error('Maximum iteration limit exceeded - possible ReDoS attack');
      }
      
      // Check time limit
      if (Date.now() - startTime > MAX_TIME) {
        throw new Error('Regex execution timeout - possible ReDoS attack');
      }
      
      // Perform single replacement
      result = result.replace(regex, replacement);
      
    } while (result !== lastResult && regex.global);
    
    return result;
  } catch (error) {
    console.error(`Regex replacement failed: ${error.message}`);
    return null;
  }
}

/**
 * Sanitizes content by replacing patterns with safe replacements
 * @param {string} content - The content to sanitize
 * @param {Array} patterns - Array of pattern objects with {pattern, replacement}
 * @returns {string} - Sanitized content
 */
export function sanitizeContent(content, patterns) {
  let sanitized = content;
  const errors = [];
  
  patterns.forEach(({ pattern, replacement, type }) => {
    if (!pattern || !replacement) {
      return;
    }
    
    // Create safe regex
    const regex = createSafeRegex(pattern);
    
    if (!regex) {
      errors.push(`Skipped invalid or unsafe pattern${type ? ` (${type})` : ''}: "${pattern}"`);
      return;
    }
    
    // Perform safe replacement
    const result = safeReplace(sanitized, regex, replacement);
    
    if (result === null) {
      errors.push(`Failed to apply pattern${type ? ` (${type})` : ''}: "${pattern}"`);
    } else {
      sanitized = result;
    }
  });
  
  // Log any errors to console for user awareness
  if (errors.length > 0) {
    console.warn('Sanitization completed with warnings:');
    errors.forEach(err => console.warn('  - ' + err));
  }
  
  return sanitized;
}
