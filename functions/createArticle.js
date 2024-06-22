const { createClient } = require('@sanity/client');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

exports.handler = async (event) => {
  console.log('Received event:', event);

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Method Not Allowed' }),
    };
  }

  let data;
  try {
    data = JSON.parse(event.body);
    console.log('Parsed data:', data);
  } catch (error) {
    console.error('Failed to parse event body:', error.message);
    console.error('Event body:', event.body);
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Invalid JSON format' }),
    };
  }

  const doc = {
    _type: 'post',
    title: data.title,
    body: data.body,
  };

  try {
    const createdDoc = await client.create(doc);
    console.log('Document created:', createdDoc);
    return {
      statusCode: 200,
      body: JSON.stringify(createdDoc),
    };
  } catch (error) {
    console.error('Failed to create document:', error.message);
    if (error.response) {
      console.error('Sanity response error:', error.response.body);
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
