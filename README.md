# BizCircle - Professional Networking & Referral Platform

BizCircle is a full-stack professional networking platform designed to streamline the referral process. It enables users to connect, refer candidates for opportunities, and manage professional relationships in real-time.

## 🚀 Key Features

- **Real-time Notifications**: Instant alerts for referrals and system updates using Socket.io.
- **Secure Authentication**: Integrated Google OAuth and JWT-based authentication.
- **Admin Dashboard**: Comprehensive management suite for monitoring user activity, managing groups, and analyzing platform growth with interactive charts.
- **Referral Tracking**: End-to-end tracking of candidate referrals.
- **Responsive Design**: Modern UI built with Tailwind CSS and Next.js.

## 🛠️ Tech Stack

**Frontend:**
- Next.js 15
- React 19
- Tailwind CSS
- Recharts (for Analytics)
- Socket.io Client
- Lucide React (Icons)

**Backend:**
- Node.js & Express.js
- MongoDB (via Mongoose)
- Socket.io (Real-time updates)
- Google Auth Library
- Nodemailer / Resend (for Email notifications)

## 📦 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB
- Google Cloud Console project (for OAuth)

### 1. Clone the repository
```bash
git clone https://github.com/Shreya2k05/BizCircle.git
cd BizCircle
```

### 2. Backend Setup
```bash
cd backend
npm install
```
Create a `.env` file in the `backend` folder and add:
```env
PORT=5000
MONGODB_URI=your_mongodb_uri
JWT_SECRET=your_secret
GOOGLE_CLIENT_ID=your_id
```
Start the backend:
```bash
npm run dev
```

### 3. Frontend Setup
```bash
cd ../frontend
npm install
```
Start the frontend:
```bash
npm run dev
```

## 📄 License
This project is licensed under the ISC License.
