# API CDN

This project is a RESTful API designed to manage users, authentication, file uploads (CDN), logging, and more. It is built with Node.js and provides endpoints for user management, authentication, file storage, and system logging.

## Main Features

- **User Management**: Create, update, delete, and retrieve users. Role-based access control is implemented (admin, user, uploadImg).
- **Authentication**: Secure login, signup, password reset, and account management with JWT-based authentication.
- **CDN (Content Delivery Network)**: Upload, update, and delete images in organized folders. File access is protected by roles and authentication.
- **Logging**: API and system logs are generated for actions and errors, with endpoints to retrieve or purge logs.
- **Role Management**: Manage user roles and permissions.
- **UUID Management**: Handle password reset links and unique identifiers.
- **Mail Service**: Send password reset emails using templates.
- **Python Integration**: Run Python scripts for advanced processing (e.g., image or audio manipulation).
- **OpenAI Integration**: Embedding and text generation features via OpenAI API.
- **Cron Jobs**: Automated tasks such as cleaning up old UUIDs.

## Endpoints Overview

- `/api/auth`: Authentication (login, signup, password reset, account management)
- `/api/user`: User CRUD operations
- `/api/cdn`: Image upload, update, delete, and listing
- `/api/log`: Retrieve and purge API/system logs
- `/api/role`: Role management
- `/api/uuid`: UUID and password reset management

## Requirements

- Node.js
- Python (for script integration)
- Mailjet account (for email sending)
- OpenAI API key (for AI features)

## Getting Started

1. Clone the repository.
2. Install dependencies: `npm install`
3. Configure environment variables (see `.env.example`).
4. Start the server: `node app.js`