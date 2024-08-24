import { Client, Users } from 'node-appwrite';

// This is your Appwrite function
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client();

  // Log the environment variables
  log(`Appwrite URL: ${process.env.APPWRITE_URL}`);
  log(`Appwrite Project ID: ${process.env.APPWRITE_PROJECT_ID}`);
  log(`Appwrite API Key: ${process.env.APPWRITE_API_KEY}`);

  // Initialize the Users service
  const users = new Users(client);

  // Set the endpoint and project ID
  client
    .setEndpoint(process.env.APPWRITE_URL) // Use environment variable for Appwrite Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Use environment variable for Project ID
    .setKey(process.env.APPWRITE_API_KEY); // Use environment variable for API Key

  // Log the request being made
  log('Fetching user details...');

  let userId;
  try {
    // Log the raw request body to inspect what was received
    log(`Raw request body: ${JSON.stringify(req.body)}`);

    // Determine the type of req.body
    log(`Type of request body: ${typeof req.body}`);

    let body;

    // Check if req.body is a string
    if (typeof req.body === 'string') {
      // Parse the string into a JSON object
      body = JSON.parse(req.body);
      log('Request body was a string and has been parsed into JSON.');
    } else if (typeof req.body === 'object' && req.body !== null) {
      // Use the object directly
      body = req.body;
      log('Request body is already a JSON object.');
    } else {
      // Handle unexpected types
      throw new Error('Unsupported request body format.');
    }

    // Extract userId from the body
    userId = body.userId;

    // Log the extracted userId
    log(`Extracted userId: ${userId}`);
  } catch (err) {
    // Log the error if parsing fails
    error(`Failed to parse JSON payload: ${err.message}`);
    return res.json({
      success: false,
      message: 'Invalid JSON payload',
    });
  }

  // Check if userId is provided
  if (!userId) {
    error('No userId provided');
    return res.json({
      success: false,
      message: 'userId is required',
    });
  }

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
};
