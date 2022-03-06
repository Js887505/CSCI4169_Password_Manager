Node Server for CSCI 4169 - Iron Man 2 Group Project

Author(s):
Keith Pineo

Requirements:
NodeJS version 14.17.3 or higher
npm 7.22.0 or higher

How to Use:
Step 1 - Install Node modules:
Using a terminal browse to the directory the server is located in. You should see the files server.js and package.json.
Execute the command "npm install" and it should pull in any node modules you need to run this.

Step 2 - set up env.local:
Copy the file .env.example and rename the file to .env.local
Fill in any missing credentials to .env.local.
Do not commit credentials to a git repository. Doing so is a terrible security practice. 
Ask Keith if there are any configuration options you need help setting.

Step 3 - Run the server:
execute "npm run start" in your terminal while in the server directory

Step 4 - Verify the server is running:
Open a web browser of your choice and go to the URL 
http://localhost/is_the_server_responding_to_requests
OR
http://localhost:####/is_the_server_responding_to_requests
Where #### is the port the server is listening on IF you have set the port to something other than the default HTTP port of 80.

If the server sends back a response then it is running.