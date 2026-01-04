// Google Sheets integration service for DukaScan

import { Product } from '../types';

export interface SaveProductResult {
  success: boolean;
  message: string;
}

/**
 * Save product data to Google Sheets via Google Apps Script
 * @param scriptUrl - The deployed Google Apps Script web app URL
 * @param product - Product data to save
 * @returns Result object with success status and message
 */
export const saveProduct = async (
  scriptUrl: string,
  product: Product
): Promise<SaveProductResult> => {
  // Validate script URL
  if (!scriptUrl || scriptUrl.trim() === '') {
    return {
      success: false,
      message: 'Google Script URL is not configured. Please go to Settings and add your script URL.',
    };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        barcode: product.barcode,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Check if the script returned a duplicate warning
    if (data.status === 'duplicate') {
      return {
        success: false,
        message: 'This barcode already exists in your inventory.',
      };
    }

    return {
      success: true,
      message: 'Product saved successfully!',
    };
  } catch (error) {
    console.error('Error saving product:', error);
    
    // Provide user-friendly error messages
    if (error instanceof TypeError && error.message.includes('Network request failed')) {
      return {
        success: false,
        message: 'Network error. Please check your internet connection and try again.',
      };
    }
    
    return {
      success: false,
      message: 'Failed to save product. Please check your Script URL in Settings and try again.',
    };
  }
};

/**
 * Test connection to Google Apps Script
 * @param scriptUrl - The deployed Google Apps Script web app URL
 * @returns Result object with success status and message
 */
export const testConnection = async (
  scriptUrl: string
): Promise<SaveProductResult> => {
  if (!scriptUrl || scriptUrl.trim() === '') {
    return {
      success: false,
      message: 'Please enter a Script URL first.',
    };
  }

  try {
    const response = await fetch(scriptUrl, {
      method: 'GET',
    });

    if (response.ok) {
      return {
        success: true,
        message: 'Connection successful!',
      };
    } else {
      return {
        success: false,
        message: `Connection failed with status: ${response.status}`,
      };
    }
  } catch (error) {
    console.error('Error testing connection:', error);
    return {
      success: false,
      message: 'Connection failed. Please check the URL and try again.',
    };
  }
};
