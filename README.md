# 📹 VideoTube – Full Stack Video Sharing Platform

A modern and fully responsive **Video Sharing Platform** built using the **MERN Stack (MongoDB, Express.js, React, and Node.js)**. The application provides a YouTube-like experience with secure authentication, video management, Cloudinary media uploads, channel subscriptions, tweet interactions, and watch history tracking.

---

## 📸 Preview

<img width="400" alt="videotube" src="https://github.com/user-attachments/assets/1dd3109f-2d21-4dd6-b3e0-d1bf85779b4f" />
<img width="400" alt="Screenshot (275)" src="https://github.com/user-attachments/assets/7092dd7f-0159-4ac2-80cc-21ba0020b026" />


---

## 🚀 Live Demo

🔗 **Live Website:** [https://videotube-seven-gamma.vercel.app/](https://videotube-seven-gamma.vercel.app/)

---

## ✨ Key Features

- **Secure Authentication:** Signup and login using JWT access and refresh tokens stored in HTTP-only cookies.
- **Media Uploads:** Upload videos, avatars, and cover images using Multer and Cloudinary.
- **Video Management:** Upload, view, and organize videos with view counts, video duration, and watch history.
- **Channel Subscriptions:** Subscribe to and unsubscribe from channels with subscriber count updates.
- **Community Tweets:** Create, view, delete, and like/unlike tweets on user profile pages.
- **Like System:** Like and unlike videos and community tweets.
- **Responsive Dark UI:** YouTube-inspired dark interface optimized for mobile, tablet, and desktop devices using Tailwind CSS.

---

## 🛠️ Tech Stack

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Redux Toolkit](https://img.shields.io/badge/Redux_Toolkit-593D88?style=for-the-badge&logo=redux&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448C5?style=for-the-badge&logo=cloudinary&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)

---

## ⚙️ Installation & Setup

Clone the repository

```bash
git clone https://github.com/sabirkhandev/videotube.git
```

Go to the project directory

```bash
cd videotube
```

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:

```env
PORT=8000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:5173
ACCESS_TOKEN_SECRET=your_access_token_secret
ACCESS_TOKEN_EXPIRY=1d
REFRESH_TOKEN_SECRET=your_refresh_token_secret
REFRESH_TOKEN_EXPIRY=10d
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Start the backend server:

```bash
npm run dev
```

### Frontend Setup

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Create a `.env` file in the frontend directory:

```env
VITE_BACKEND_URL=http://localhost:8000/api/v1
```

Start the frontend development server:

```bash
npm run dev
```

---

## 🔮 Future Improvements

- 💬 Video Commenting System
- 🔍 Advanced Video Search and Category Filtering

---

## 👨‍💻 Author

**Sabir Ali Khan**

- GitHub: [https://github.com/sabirkhandev](https://github.com/sabirkhandev)
- LinkedIn: [https://www.linkedin.com/in/sabir-ali-khan](https://www.linkedin.com/in/sabir-ali-khan)

---

⭐ If you found this project helpful, consider giving it a **Star ⭐** on GitHub.
