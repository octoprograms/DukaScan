/**
 * DukaScan - Google Apps Script Backend
 * 
 * This script receives product data from the DukaScan mobile app
 * and saves it to a Google Sheet.
 * 
 * SETUP INSTRUCTIONS:
 * 1. Create a new Google Sheet
 * 2. Go to Extensions → Apps Script
 * 3. Paste this entire code
 * 4. Save the project
 * 5. Deploy as Web App:
 *    - Click "Deploy" → "New deployment"
 *    - Type: "Web app"
 *    - Execute as: "Me"
 *    - Who has access: "Anyone"
 *    - Click "Deploy"
 * 6. Copy the Web App URL and paste it in the DukaScan app settings
 */

// Configuration
const SHEET_NAME = 'Products'; // Name of the sheet tab
const HEADERS = ['Timestamp', 'Barcode', 'Name', 'Description', 'Price', 'Quantity'];

/**
 * Initialize the spreadsheet with headers if needed
 */
function initializeSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  // Create sheet if it doesn't exist
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
  }
  
  // Add headers if the sheet is empty
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(HEADERS);
    
    // Format header row
    const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#1B5E20');
    headerRange.setFontColor('#FFFFFF');
    
    // Freeze header row
    sheet.setFrozenRows(1);
    
    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
  }
  
  return sheet;
}

/**
 * Check if a barcode already exists in the sheet
 */
function isDuplicateBarcode(sheet, barcode) {
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  // Skip header row (index 0)
  for (let i = 1; i < values.length; i++) {
    if (values[i][1] === barcode) { // Barcode is in column B (index 1)
      return true;
    }
  }
  
  return false;
}

/**
 * Handle GET requests (for testing connection)
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'success',
      message: 'DukaScan backend is running!',
      timestamp: new Date().toISOString()
    }))
    .setMimeType(ContentService.MimeType.JSON);
}

/**
 * Handle POST requests (save product data)
 */
function doPost(e) {
  try {
    // Parse the incoming JSON data
    const data = JSON.parse(e.postData.contents);
    
    // Validate required fields
    if (!data.barcode || !data.name || !data.price) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'error',
          message: 'Missing required fields: barcode, name, or price'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Initialize the sheet
    const sheet = initializeSheet();
    
    // Check for duplicate barcode
    if (isDuplicateBarcode(sheet, data.barcode)) {
      return ContentService
        .createTextOutput(JSON.stringify({
          status: 'duplicate',
          message: 'This barcode already exists in the inventory'
        }))
        .setMimeType(ContentService.MimeType.JSON);
    }
    
    // Prepare row data
    const timestamp = new Date();
    const rowData = [
      timestamp,
      data.barcode,
      data.name,
      data.description || '',
      parseFloat(data.price) || 0,
      parseInt(data.quantity) || 1
    ];
    
    // Append the new row
    sheet.appendRow(rowData);
    
    // Format the new row
    const lastRow = sheet.getLastRow();
    
    // Format timestamp
    sheet.getRange(lastRow, 1).setNumberFormat('yyyy-mm-dd hh:mm:ss');
    
    // Format price as currency
    sheet.getRange(lastRow, 5).setNumberFormat('$#,##0.00');
    
    // Center align quantity
    sheet.getRange(lastRow, 6).setHorizontalAlignment('center');
    
    // Auto-resize columns
    for (let i = 1; i <= HEADERS.length; i++) {
      sheet.autoResizeColumn(i);
    }
    
    // Return success response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'Product saved successfully!',
        data: {
          barcode: data.barcode,
          name: data.name,
          row: lastRow
        }
      }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return error response
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: 'Failed to save product: ' + error.message
      }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Optional: Function to manually test the script
 * Run this from the script editor to test functionality
 */
function testScript() {
  const testData = {
    barcode: '1234567890123',
    name: 'Test Product',
    description: 'This is a test product',
    price: '19.99',
    quantity: '5'
  };
  
  const mockEvent = {
    postData: {
      contents: JSON.stringify(testData)
    }
  };
  
  const result = doPost(mockEvent);
  Logger.log(result.getContent());
}
