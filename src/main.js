import { Client, Users } from 'node-appwrite';

// This is your Appwrite function
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client();

  // Initialize the Users service
  const users = new Users(client);

  // Set the endpoint and project ID
  client
    .setEndpoint(process.env.APPWRITE_URL) // Use environment variable for Appwrite Endpoint
    .setProject(process.env.APPWRITE_PROJECT_ID) // Use environment variable for Project ID
    .setKey(process.env.APPWRITE_API_KEY); // Use environment variable for API Key


  log(`Appwrite URL: ${process.env.APPWRITE_URL}`);
  log(`Appwrite Project ID: ${process.env.APPWRITE_PROJECT_ID}`);
  log(`Appwrite API Key: ${process.env.APPWRITE_API_KEY}`);


  // Log the request
  log('Fetching user details...');
  log(`Request : ${JSON.stringify(req)}`); // Changed from req.payload to req
  log(`req.body : ${req.body}`); // Changed from req.payload to req
  log(`req.body.userId : ${req.body.userId}`); // Changed from req.payload to req

  // Parse the request payload
  let userId;
  try {
    const body = JSON.parse(req.body); // Changed from req.payload to req.body
    log(` JSON.parse(req.body) : ${body}`); // Changed from req.payload to req
    userId = body.userId;
    log(`body.userId : ${userId}`); // Changed from req.payload to req
  } catch (err) {
    error(`Failed to parse JSON payload: ${err.message}`);
    return res.json({
      success: false,
      message: 'Invalid JSON payload'
    });
  }

  // Validate userId
  if (!userId) {
    error('No userId provided');
    return res.json({
      success: false,
      message: 'userId is required'
    });
  }

  try {
    // Fetch the user details
    const user = await users.get(userId);

    // Send back the user data
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    // Log the error with detailed info
    error(`Error fetching user: ${err.message} | Stack: ${err.stack}`);

    // Send back the error message
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
