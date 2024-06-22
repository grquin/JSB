const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

exports.handler = async (event) => {
  console.log('Received event:', event);

  let data;
  try {
    data = JSON.parse(event.body);
    console.log('Parsed data:', data);
  } catch (error) {
    console.error('Failed to parse event body:', error);
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
    console.error('Failed to create document:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
