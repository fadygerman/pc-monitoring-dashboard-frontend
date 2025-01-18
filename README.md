# PC Monitoring Dashboard

This project is a React-based monitoring system designed to track the status of PCs in real-time. It uses Firebase as the backend service for real-time data synchronization and authentication.

## Table of Contents

- [Project Structure](#project-structure)
- [Features](#features)
- [Getting Started](#getting-started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Contributing](#contributing)
- [License](#license)

## Project Structure

The project is organized as a single React application with Firebase integration.

### Frontend

- **.gitignore**: Specifies files and directories to be ignored by Git.
- **package.json**: Contains metadata and dependencies for the React app.
- **firebase.json**: Firebase configuration and deployment settings.
- **public/**: Contains static files for the React app.
  - **index.html**: Main HTML entry point.
  - **manifest.json**: Web app metadata.
- **src/**: Contains the source code.
  - **App.js**: Main application component.
  - **components/**: React components for the dashboard.
  - **services/**: Firebase service integrations.
  - **hooks/**: Custom React hooks.
  - **contexts/**: React contexts for state management.
  - **utils/**: Utility functions.

## Features

- **Real-time Dashboard**: Live updates using Firebase Realtime Database.
- **User Authentication**: Firebase Authentication for secure access.
- **PC Status Management**: Update PC status with immediate synchronization.
- **Group Management**: Organize PCs into groups.
- **User Tracking**: Monitor who is using each PC.
- **Offline Support**: Firebase offline persistence.

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```sh
   npm install
   ```
3. Set up Firebase:
   - Create a Firebase project
   - Add your Firebase configuration to `src/firebase-config.js`
   - Enable Authentication and Realtime Database
4. Start the development server:
   ```sh
   npm start
   ```

## Environment Variables

Create a `.env` file with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_DATABASE_URL=your_database_url
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

## Deployment

### Azure Static Web Apps

Deploy the application using Azure Static Web Apps through GitHub Actions:

1. Ensure your repository is connected to Azure Static Web Apps.
2. Create a GitHub Actions workflow file in `.github/workflows` directory:
   ```yaml
   name: Azure Static Web Apps CI/CD

   on:
     push:
       branches:
         - main

   jobs:
     build_and_deploy:
       runs-on: ubuntu-latest
       steps:
         - uses: actions/checkout@v2
         - name: Set up Node.js
           uses: actions/setup-node@v2
           with:
             node-version: '14'
         - run: npm install
         - run: npm run build
         - name: Deploy to Azure Static Web Apps
           uses: Azure/static-web-apps-deploy@v1
           with:
             azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_API_TOKEN }}
   ```
3. Commit and push the workflow file to your repository.

## Usage

1. Log in using your Firebase authentication credentials
2. View the dashboard to see all PC statuses in real-time
3. Click on a PC to update its status
4. Filter PCs by group or status
5. View usage history and current users

## Contributing

1. Fork the repository
2. Create a feature branch:
   ```sh
   git checkout -b feature-name
   ```
3. Commit your changes:
   ```sh
   git commit -m "Description of changes"
   ```
4. Push to your fork:
   ```sh
   git push origin feature-name
   ```
5. Create a pull request

## License

This project is licensed under the MIT License.
