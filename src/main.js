import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    // Initialize the Appwrite client
    const client = new Client()
      .setEndpoint('https://cloud.appwrite.io/v1') // Replace with your Appwrite endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID) // Project ID from environment variables
      .setKey(process.env.APPWRITE_API_KEY); // API key from environment variables

    // Initialize the Users service
    const users = new Users(client);

    // Log the request method
    log(`Request method: ${req.method}`);

    if (req.method === 'POST') {
      // Parse the userId from the request body
      const { userId } = req.body;

      if (!userId) {
        return res.json({ error: 'userId is required' }, 400);
      }

      // Fetch user details by userId
      const user = await users.get(userId);

      // Send user details in the response
      return res.json(user);
    }

    // If the request is not a POST, send a default response
    return res.send('Send a POST request with a userId to fetch user details.');
  } catch (err) {
    // Log any errors
    error(`An error occurred: ${err.message}`);

    // Send an error response
    return res.json({ error: 'An error occurred while fetching user details' }, 500);
  }
};
