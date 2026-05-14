# BlogApp Frontend

A modern, responsive frontend for the BlogApp built with React, Vite, and Tailwind CSS.

## 🚀 Features

- **Author Dashboard**: Create, edit, and manage articles.
- **User Dashboard**: Browse and read articles, add comments.
- **Authentication**: Secure login and registration with role-based access control.
- **Responsive Design**: Beautiful UI optimized for all devices.

## 🛠️ Tech Stack

- **Framework**: React 19
- **Build Tool**: Vite
- **Styling**: Tailwind CSS 4
- **State Management**: Zustand
- **API Client**: Axios
- **Form Handling**: React Hook Form
- **Notifications**: React Hot Toast

## 📦 Deployment

### Deploying to Vercel

1.  **Push your code** to a GitHub/GitLab/Bitbucket repository.
2.  **Import the project** in Vercel.
3.  **Configure Environment Variables**:
    -   Go to Project Settings > Environment Variables.
    -   Add `VITE_API_BASE_URL` and set it to your backend's URL (e.g., `https://your-backend.render.com`).
4.  **Deploy**: Vercel will automatically detect the Vite setup and deploy.

### Local Development

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Create a `.env` file and add your backend URL:
    ```env
    VITE_API_BASE_URL=http://localhost:5000
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```

## 📄 License

MIT
