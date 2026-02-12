# 🚀 Online Job Portal with AI Skill Matching

A Full Stack Job Portal built using Spring Boot (Backend) and React (Frontend).  
The system uses AI-based skill matching to connect candidates with relevant job opportunities.

---

## 📌 Features

- 🔐 JWT Authentication
- 👤 User Registration & Login
- 🛡 Role-Based Authorization (ADMIN / USER)
- 📄 Protected APIs using Spring Security
- 🏢 Job Management Module (CRUD)
- 🧠 AI Skill Matching (Coming Soon)

---

## 🛠 Tech Stack

### Backend
- Java 17
- Spring Boot
- Spring Security (JWT)
- JPA / Hibernate
- PostgreSQL
- Maven

### Frontend (Planned)
- React
- Axios

### AI & Search (Planned)
- Elasticsearch
- Custom Skill Matching Algorithm

---

## 📂 Project Structure

backend/
 ├── config/
 ├── controller/
 ├── dto/
 ├── entity/
 ├── repository/
 ├── service/

---

## 🔐 Authentication Flow

1. User registers
2. User logs in
3. JWT token generated
4. Token required for protected APIs
5. Role-based access enforced (ADMIN / USER)
 

## 📡 Available APIs

### 🔓 Public APIs

POST  /api/auth/register  
POST  /api/auth/login  

### 🔐 Protected APIs

GET   /api/users  
POST  /api/users (ADMIN only)  

GET   /api/jobs  
POST  /api/jobs (ADMIN only)  

---
 
## 📊 Current Status

✅ JWT Authentication Completed  
✅ Role-Based Security Completed  
✅ User Module Completed  
🚧 Job Module In Progress  
🚧 AI Matching Coming Next  

---

## 🎯 Future Improvements

- Apply Job Feature
- Resume Upload
- AI-Based Job Recommendation
- Admin Dashboard
- Pagination & Filtering
- Full React Frontend

---

## 👨‍💻 Author

Rohan Arun Chavan  
Java Full Stack Developer (In Progress 🚀)
