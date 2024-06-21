require('dotenv').config();
const { google } = require('googleapis');
const sheets = google.sheets('v4');

let oauth2Client;

async function authenticate() {
  const { client_secret, client_id, redirect_uris } = require('./sheet_credentials.json').installed;
  oauth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

  oauth2Client.setCredentials({
    refresh_token: process.env.GOOGLE_REFRESH_TOKEN,
  });

  google.options({ auth: oauth2Client });
}

async function getEmailsFromSheet() {
  await authenticate();
  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE,
  });
  return response.data.values || [];
}

async function removeDuplicates(emails) {
  const uniqueEmails = [];
  const emailSet = new Set();

  emails.forEach(row => {
    if (!emailSet.has(row[0])) {
      uniqueEmails.push(row);
      emailSet.add(row[0]);
    }
  });

  return uniqueEmails;
}

async function updateSheetWithUniqueEmails(uniqueEmails) {
  await authenticate();
  await sheets.spreadsheets.values.clear({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE,
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: process.env.GOOGLE_SHEET_ID,
    range: process.env.GOOGLE_SHEET_RANGE,
    valueInputOption: 'RAW',
    requestBody: {
      values: uniqueEmails,
    },
  });
}

exports.handler = async () => {
  try {
    const emails = await getEmailsFromSheet();
    const uniqueEmails = await removeDuplicates(emails);
    await updateSheetWithUniqueEmails(uniqueEmails);

    return { statusCode: 200, body: 'Email management complete' };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to manage emails' }),
    };
  }
};
