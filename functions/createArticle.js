const sanityClient = require('@sanity/client');

const client = sanityClient({
  projectId: process.env.SANITY_PROJECT_ID,
  dataset: process.env.SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

exports.handler = async (event) => {
  const data = JSON.parse(event.body);
  const doc = {
    _type: 'post',
    title: data.title,
    body: data.body,
  };

  try {
    const createdDoc = await client.create(doc);
    return {
      statusCode: 200,
      body: JSON.stringify(createdDoc),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};
