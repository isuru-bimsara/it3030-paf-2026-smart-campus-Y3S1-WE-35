# Smart Campus Operations Hub (Smart-Uni-System)

[![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.2.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.3.1-blue.svg)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4.8-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4.13-38B2AC.svg)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A comprehensive, full-stack university management system designed to streamline campus operations, resource bookings, and maintenance workflows. This system provides a unified platform for students, faculty, and administrative staff to manage academic life efficiently.

---

## 🚀 Features

### 🔐 Authentication & Authorization
- **Multi-Role Support**: Admin, Operation Manager, Technician, and Student/Staff (User).
- **Secure Access**: JWT-based authentication and Spring Security.
- **Social Login**: Google OAuth2 integration for seamless access.

### 📅 Booking Management
- **Resource Booking**: Seamlessly book university resources like lecture halls, labs, and equipment.
- **Workflow Management**: Bookings go through a lifecycle: `Pending` → `Approved`/`Rejected` → `Cancelled`.
- **Conflicts Resolution**: Real-time checking for resource availability.

### 🛠️ Maintenance & Ticketing (Technician)
- **Support Tickets**: Users can raise tickets for technical issues.
- **Technician Dashboard**: Specialized view for technicians to manage and resolve maintenance requests.

### 📊 Administrative Tools
- **User Management**: Admins can manage user accounts and permissions.
- **Resource Management**: Define and update campus resources and facilities.
- **Reporting**: Visualized data insights using Recharts for booking trends and usage.

### 🔔 Real-time Notifications
- Stay updated with status changes on bookings and maintenance requests.

---

## 🛠️ Technology Stack

### **Frontend**
- **Framework**: [React](https://reactjs.org/) (v18)
- **Build Tool**: [Vite](https://vitejs.dev/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Components**: [Headless UI](https://headlessui.com/), [Heroicons](https://heroicons.com/), [Lucide React](https://lucide.dev/)
- **State/Routing**: [React Router DOM](https://reactrouter.com/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **HTTP Client**: [Axios](https://axios-http.com/)

### **Backend**
- **Language**: [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- **Framework**: [Spring Boot 3.2.5](https://spring.io/projects/spring-boot)
- **Security**: [Spring Security](https://spring.io/projects/spring-security) (OAuth2, JWT)
- **Database**: [MySQL](https://www.mysql.com/) (Prod), [H2](https://www.h2database.com/) (Dev)
- **Persistence**: [Spring Data JPA](https://spring.io/projects/spring-data-jpa)
- **Utilities**: [Lombok](https://projectlombok.org/), [Maven](https://maven.apache.org/)

---

## 📦 Project Structure

```bash
Smart-Uni-System/
├── frontend/             # React Frontend (Vite)
│   ├── src/
│   │   ├── api/          # Axios API configurations
│   │   ├── component/    # Reusable UI components
│   │   ├── context/      # React Context (Auth)
│   │   ├── pages/        # Role-specific pages (Admin, Ops, Tech, User)
│   │   ├── utils/        # Helper functions
│   │   └── App.jsx       # Main Routing
│   └── tailwind.config.js
├── Uni/                  # Spring Boot Backend
│   ├── src/main/java/com/smart/Uni/
│   │   ├── config/       # Security & App configuration
│   │   ├── controller/   # REST Endpoints
│   │   ├── dto/          # Data Transfer Objects
│   │   ├── entity/       # JPA Entities
│   │   ├── repository/   # Data Access Layer
│   │   └── service/      # Business Logic
│   └── pom.xml           # Maven Dependencies
└── README.md             # Project Documentation
```

---

## ⚙️ Getting Started

### Prerequisites
- **Node.js** (v18+)
- **Java JDK 17**
- **Maven**
- **MySQL** (Optional, H2 used by default in dev)

### Backend Setup
1. Navigate to the `Uni` directory:
   ```bash
   cd Uni
   ```
2. Configure your database in `src/main/resources/application.properties` (if using MySQL).
3. Run the application (Default port: `8083`):
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server (Default port: `5173`):
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:5173`.
   - *Note: API requests are proxied to `http://localhost:8083/api`*

---

## 🤝 Contributing

1. Fork the Project.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

## 📧 Contact

**Project Lead**: Isuru Bimsara
**Project Repo**: [it3030-paf-2026-smart-campus-Y3S1-WE-35](https://github.com/isuru-bimsara/it3030-paf-2026-smart-campus-Y3S1-WE-35)
