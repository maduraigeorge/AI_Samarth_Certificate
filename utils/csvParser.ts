
// Parses a CSV string into an array of objects
export const parseCSV = (text: string): Record<string, string>[] => {
  const lines = text.split('\n');
  if (lines.length === 0) return [];

  const headers = parseCSVLine(lines[0]);
  const results = [];
  
  for (let i = 1; i < lines.length; i++) {
    const currentLine = lines[i];
    if (!currentLine || currentLine.trim() === '') continue;
    
    const values = parseCSVLine(currentLine);
    const obj: Record<string, string> = {};
    
    // Map headers to values
    headers.forEach((header, index) => {
      // Clean header name (remove quotes, trim)
      const cleanHeader = header.trim().replace(/^"|"$/g, '');
      const value = values[index] ? values[index].trim().replace(/^"|"$/g, '') : '';
      obj[cleanHeader] = value;
    });
    
    results.push(obj);
  }
  return results;
};

// Handle CSV lines with quoted strings that might contain commas
const parseCSVLine = (text: string): string[] => {
  const result: string[] = [];
  let start = 0;
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    if (text[i] === '"') {
      inQuotes = !inQuotes;
    } else if (text[i] === ',' && !inQuotes) {
      result.push(text.substring(start, i));
      start = i + 1;
    }
  }
  result.push(text.substring(start));
  return result;
};
