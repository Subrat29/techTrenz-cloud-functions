import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    // Log the start of the function
    log('Function execution started.');

    // Log environment variables
    log(`APPWRITE_PROJECT_ID: ${process.env.APPWRITE_PROJECT_ID}`);
    log(`APPWRITE_API_KEY: ${process.env.APPWRITE_API_KEY.slice(0, 4)}...${process.env.APPWRITE_API_KEY.slice(-4)}`);

    // Initialize the Appwrite client
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint if different
      .setProject(process.env.APPWRITE_PROJECT_ID)
      .setKey(process.env.APPWRITE_API_KEY);

    // Log client setup success
    log('Client setup complete.');

    // Initialize the Users service
    const users = new Users(client);

    if (req.method === 'POST') {
      // Log request method
      log('Request method is POST.');

      // Parse the userId from the request body
      const { userId } = req.body;

      if (!userId) {
        error('userId is missing in the request body.');
        return res.json({ error: 'userId is required' }, 400);
      }

      log(`Fetching user details for userId: ${userId}`);

      // Fetch user details by userId
      const user = await users.get(userId);

      // Log successful retrieval
      log(`User details retrieved successfully for userId: ${userId}`);

      // Send user details in the response
      return res.json(user);
    }

    // If the request is not a POST, send a default response
    log('Request method is not POST. Returning default response.');
    return res.send('Send a POST request with a userId to fetch user details.');
  } catch (err) {
    // Log any errors with more details
    error(`An error occurred: ${err.message}`);
    return res.json({ error: `An error occurred: ${err.message}` }, 500);
  }
};
