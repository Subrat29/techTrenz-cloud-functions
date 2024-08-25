// import { Client, Users } from 'node-appwrite';

// export default async ({ req, res, log, error }) => {
//   try {
//     // Initialize the Appwrite client
//     const client = new Client();

//     // Log the environment variables
//     log(`Appwrite URL: ${process.env.APPWRITE_URL}`);
//     log(`Appwrite Project ID: ${process.env.APPWRITE_PROJECT_ID}`);
//     log(`Appwrite API Key: ${process.env.APPWRITE_API_KEY}`);

//     // Initialize the Users service
//     const users = new Users(client);

//     // Set the endpoint, project ID, and API key
//     client
//       .setEndpoint(process.env.APPWRITE_URL) // Use environment variable for Appwrite Endpoint
//       .setProject(process.env.APPWRITE_PROJECT_ID) // Use environment variable for Project ID
//       .setKey(process.env.APPWRITE_API_KEY); // Use environment variable for API Key

//     // Extract userId from request body or query parameters
//     const userId = req.body?.userId || req.query?.userId || req.headers['x-user-id'];

//     // Log the extracted userId
//     log(`Extracted userId: ${userId}`);

//     // Check if userId is provided
//     if (!userId) {
//       error('No userId provided');
//       return res.json({
//         success: false,
//         message: 'userId is required',
//       });
//     }

//     try {
//       // Attempt to fetch user details from Appwrite
//       const user = await users.get(userId);

//       // Log the fetched user details
//       log(`User details fetched successfully: ${JSON.stringify(user)}`);

//       // Return the successful response
//       return res.json({
//         success: true,
//         user,
//       });
//     } catch (err) {
//       // Log any errors encountered during the fetch operation
//       error(`Error fetching user: ${err.message} | Stack: ${err.stack}`);
//       return res.json({
//         success: false,
//         message: err.message,
//       });
//     }
//   } catch (globalErr) {
//     // Catch any global errors that might occur
//     error(`Unexpected error: ${globalErr.message} | Stack: ${globalErr.stack}`);
//     return res.json({
//       success: false,
//       message: 'An unexpected error occurred',
//     });
//   }
// };


import { Client, Users } from 'node-appwrite';

// Initialize the Appwrite client
const client = new Client();

// Set up Appwrite services
const users = new Users(client);

// Environment variables
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;
const endpoint = process.env.APPWRITE_URL;

client
  .setEndpoint(endpoint) // Your Appwrite endpoint
  .setProject(projectId) // Your Appwrite project ID
  .setKey(apiKey);       // Your Appwrite API key

export async function main(req, res) {
  try {
    const { userId } = JSON.parse(req.payload);
    
    // Fetch user details by userId
    const user = await users.get(userId);
    
    res.json({
      success: true,
      user: user
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: 'Failed to fetch user details',
      error: error.message
    });
  }
}

