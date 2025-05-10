# ✈️ Cloud Trip

**Cloud Trip** is a fully responsive, feature-rich flight booking platform built with **React.js**, **Tailwind CSS**, **Node.js**, and **MongoDB**. It supports dynamic flight pricing, OTP-based login, wallet integration, and PDF ticket generation. The application is optimized for both web and mobile, delivering a seamless travel booking experience.

## 🚀 Live Demo

🌐 **Frontend Deployed at**: [https://flight-booking-frontend-sigma.vercel.app](https://flight-booking-frontend-sigma.vercel.app)  
📁 **GitHub Repository**: [KarthikBandi75/FlightBookings](https://github.com/KarthikBandi75/FlightBookings)

---

## 🧠 Features

### 🔍 Flight Search
- Search for flights using **Auto Suggest API** by city or airport.
- Displays 10 flight results per search with prices ranging from **₹2,000 to ₹3,000**.
- Integrated with **Amadeus API** for accurate airport and flight data.

### 💸 Dynamic Pricing Engine
- Flight price increases by **10%** if the same flight is selected **3 times within 5 minutes**.
- Price resets to the original amount after **10 minutes**.

### 🛫 Booking System
- Users start with a default wallet balance of **₹50,000**.
- On booking, the wallet amount is deducted and a **PDF ticket voucher** is generated.

### 📄 PDF Ticket Generation
- A clean and printable ticket is generated as a **PDF** after successful booking.

### 🔐 OTP-based Authentication
- **Signup & Login** via OTP sent to the user's email.
- **Forgot Password** functionality also includes email OTP verification before allowing reset.

### 📦 Booking History
- View all past flight bookings in a user-friendly booking history section.

### 🛠 Admin-Ready Backend
- Built using **Node.js** and **Express.js**.
- Flight data and dynamic pricing are stored in **MongoDB**.
- Scalable backend logic supports new airlines, pricing updates, and more.

### 🧑‍🎨 Modern UI/UX
- Frontend built with **React.js**, styled using **Tailwind CSS**.
- Animations powered by **Framer Motion**.
- Fully responsive layout — compatible with both mobile and desktop screens.

---

## 🛠 Tech Stack

| Frontend        | Backend         | Database | APIs & Services                   | Deployment |
|----------------|------------------|----------|------------------------------------|------------|
| React.js        | Node.js          | MongoDB  | Amadeus API (airport/flight data)  | Vercel (Frontend) |
| Tailwind CSS    | Express.js       | —        | Nodemailer (for OTP email)         | Render (Backend) |
| Framer Motion   |                 |          |                                    |            |

---

## 🔧 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/KarthikBandi75/FlightBookings.git
