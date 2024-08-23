import { Client, Users } from 'node-appwrite';
import conf from '../conf/conf';

// This is your Appwrite function
export default async ({ req, res, log, error }) => {
  // Initialize the Appwrite client
  const client = new Client();

  // Initialize the Users service
  const users = new Users(client);

  // Set the endpoint and project ID
  client
    .setEndpoint(conf.appwriteUrl) // Your Appwrite Endpoint
    .setProject(conf.appwriteProjectId) // This comes from environment variables
    .setKey(conf.appwriteApiKey); // Your API Key from environment variables

  // Log the request
  log('Fetching user details...');

  // Get the userId from the request payload
  const { userId } = JSON.parse(req.payload);

  try {
    // Fetch the user details
    const user = await users.get(userId);
    
    // Send back the user data
    return res.json({
      success: true,
      user,
    });
  } catch (err) {
    // Log the error
    error(`Error fetching user: ${err.message}`);

    // Send back the error message
    return res.json({
      success: false,
      message: err.message,
    });
  }
};
