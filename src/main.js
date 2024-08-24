import { Client, Users } from 'node-appwrite';

export default async ({ req, res, log, error }) => {
  try {
    // Initialize the Appwrite client
    const client = new Client();

    // Log the environment variables
    log(`Appwrite URL: ${process.env.APPWRITE_URL}`);
    log(`Appwrite Project ID: ${process.env.APPWRITE_PROJECT_ID}`);
    log(`Appwrite API Key: ${process.env.APPWRITE_API_KEY}`);

    // Initialize the Users service
    const users = new Users(client);

    // Set the endpoint, project ID, and API key
    client
      .setEndpoint(process.env.APPWRITE_URL) // Use environment variable for Appwrite Endpoint
      .setProject(process.env.APPWRITE_PROJECT_ID) // Use environment variable for Project ID
      .setKey(process.env.APPWRITE_API_KEY); // Use environment variable for API Key

    // Extract userId from request body or query parameters
    const userId = req.body?.userId || req.query?.userId;

    // Log the extracted userId
    log(`Extracted userId: ${userId}`);

    // Check if userId is provided
    // if (!userId) {
    //   error('No userId provided');
    //   return res.json({
    //     success: false,
    //     message: 'userId is required',
    //   });
    // }

    try {
      // Attempt to fetch user details from Appwrite
      const user = await users.get(userId);

      // Log the fetched user details
      log(`User details fetched successfully: ${JSON.stringify(user)}`);

      // Return the successful response
      return res.json({
        success: true,
        user,
      });
    } catch (err) {
      // Log any errors encountered during the fetch operation
      error(`Error fetching user: ${err.message} | Stack: ${err.stack}`);
      return res.json({
        success: false,
        message: err.message,
      });
    }
  } catch (globalErr) {
    // Catch any global errors that might occur
    error(`Unexpected error: ${globalErr.message} | Stack: ${globalErr.stack}`);
    return res.json({
      success: false,
      message: 'An unexpected error occurred',
    });
  }
};
