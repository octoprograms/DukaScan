// Validation utilities for DukaScan

/**
 * Validates a URL string ensuring it uses HTTPS protocol
 */
export const validateUrl = (url: string): boolean => {
  if (!url || url.trim() === '') {
    return false;
  }
  
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === 'https:';
  } catch {
    return false;
  }
};

/**
 * Validates that a string contains a valid numeric value
 */
export const validateNumeric = (value: string): boolean => {
  if (!value || value.trim() === '') {
    return false;
  }
  
  const num = parseFloat(value);
  return !isNaN(num) && num >= 0;
};

/**
 * Validates the complete product form
 */
export const validateProductForm = (
  name: string,
  price: string,
  quantity: string
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  if (!name || name.trim() === '') {
    errors.push('Product name is required');
  }
  
  if (!price || price.trim() === '') {
    errors.push('Price is required');
  } else if (!validateNumeric(price)) {
    errors.push('Price must be a valid number');
  }
  
  if (quantity && !validateNumeric(quantity)) {
    errors.push('Quantity must be a valid number');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
};
