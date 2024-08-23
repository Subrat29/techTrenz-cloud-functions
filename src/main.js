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

  // Log the request
  log('Fetching user details...');

  let userId;
  try {
    const body = JSON.parse(req.body);
    userId = body.userId;
  } catch (err) {
    error(`Failed to parse JSON payload: ${err.message}` );
    return res.json({
      success: false,
      message: 'Invalid JSON payload'
    });
  }

  if (!userId) {
    error('No userId provided');
    return res.json({
      success: false,
      message: 'userId is required'
    });
  }

  try {
    const user = await users.get(userId);
    
    const result = res.json({
      success: true,
      user,
    });
    log('User details fetched successfully ${JSON.stringify(result)}');
    return result
  } catch (err) {
    error(`Error fetching user: ${err.message} | Stack: ${err.stack}`);
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
