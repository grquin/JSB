require('dotenv').config();
const { google } = require('googleapis');
const sheets = google.sheets('v4');

let oauth2Client;

async function authenticate() {
  try {
    const { client_secret, client_id, redirect_uris } = require('./sheet_credentials.json').web;
    oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

    oauth2Client.setCredentials({
      refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
    });

    google.options({ auth: oauth2Client });
    console.log(`[${new Date().toISOString()}] Authentication successful`);
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Authentication error:`, error);
    throw error;
  }
}

async function addEmailToSheet(email) {
  await authenticate();
  const date = new Date().toISOString();
  console.log(`[${new Date().toISOString()}] Adding email: ${email}, Date: ${date}`);
  try {
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [[email, date]],
      },
    });
    console.log(`[${new Date().toISOString()}] Email added to sheet:`, response.data);
    return response;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error adding email to sheet:`, error);
    throw error;
  }
}

async function checkDuplicate(email) {
  await authenticate();
  console.log(`[${new Date().toISOString()}] Checking duplicate for email: ${email}`);
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: process.env.GOOGLE_SHEET_ID,
      range: process.env.GOOGLE_SHEET_RANGE,
    });
    const rows = response.data.values || [];
    const isDuplicate = rows.some(row => row[0] === email);
    console.log(`[${new Date().toISOString()}] Duplicate check result: ${isDuplicate}`);
    return isDuplicate;
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error checking duplicate:`, error);
    throw error;
  }
}

exports.handler = async (event) => {
  const { email } = JSON.parse(event.body);
  console.log(`[${new Date().toISOString()}] Received email: ${email}`);
  try {
    if (await checkDuplicate(email)) {
      console.log(`[${new Date().toISOString()}] Email already submitted`);
      return {
        statusCode: 409,
        body: JSON.stringify({ error: 'Email already submitted' }),
      };
    }

    await addEmailToSheet(email);
    console.log(`[${new Date().toISOString()}] Subscription successful`);

    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Subscription successful' }),
    };
  } catch (error) {
    console.error(`[${new Date().toISOString()}] Error occurred:`, error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to save email' }),
    };
  }
};
