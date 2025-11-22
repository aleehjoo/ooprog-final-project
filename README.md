## 👥 Authors
**Mark Cyrus Serrano**  
**Alejandro Umila**  
**Section:** C2B  

> 📈 **UML Diagram:** [*(link here)*](https://www.figma.com/board/OzD9np7jKdQ6uz3eBXRI62/Untitled?node-id=0-1&t=GgXQzGZGsnTuQPgr-1)
# Project Structure

```
/root
 ├── frontend       → Next.js UI
 └── backend        → Spring Boot API + MongoDB
```

## Backend Setup (Spring Boot + MongoDB)

1. Navigate to backend folder:

```bash
cd backend
```

2. Clean the build (optional but recommended when resetting):

```bash
.\mvnw.cmd clean package
```

3. Run the backend server:

```bash
.\mvnw.cmd spring-boot:run
```

4. Verify the server is running:

```bash
curl http://localhost:8080/api/health
```

If everything is working, you should receive a success JSON response.

## Frontend Setup (Next.js)

1. Navigate to frontend folder:

```bash
cd frontend
```

2. Install the required dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. View in browser:

Open http://localhost:3000 or [Tap me!](http://localhost:3000)


# 🏠 RoomEase — Smart Property & Tenant Management System

## 📘 Project Description

**RoomEase** is a lightweight yet scalable property management system designed to help **small landlords, dorm managers, or boarding house owners** track tenants, payments, and room availability efficiently. The system addresses a common real-world challenge: most small property owners still rely on **manual logs, spreadsheets, or chat messages** to handle tenant data — a process prone to delays, confusion, and record inconsistencies.

RoomEase bridges this gap through a **Java-based backend** and a **Next.js (TypeScript) web interface**, providing a clear and responsive way to manage properties, track balances, and process maintenance requests.  
The **Java backend** handles file I/O, business logic, and optional offline storage, while the **Next.js frontend** offers a modern, responsive dashboard accessible from any device.  

Data synchronization is managed via a **RESTful API** built with **Spring Boot (Java)**, connecting seamlessly with a **NoSQL** database for flexible schema design. Users can log in as landlords or tenants — landlords can register tenants, view payment history, and mark rooms as occupied, while tenants can check balances, submit maintenance requests, and upload proof of payment.  

Future improvements could include automated rent reminders, payment gateway integration (e.g., PayMongo or Stripe), and real-time dashboards using WebSockets for instant updates. The system remains achievable within 4–5 weeks, yet holds **strong scalability and real-world relevance**, ideal for a student-led project with professional-grade potential.

---

## ⚙️ Tech Stack

| **Technology** | **Purpose** | **Why Use It** |
|----------------|-------------|----------------|
| **Java (Spring Boot)** | Backend API and business logic | Reliable, scalable, and widely used for enterprise-level RESTful services |
| **Next.js (TypeScript)** | Frontend web application | Provides a modern, performant UI with strong typing for maintainability |
| **MongoDB Atlas** | NoSQL database | Flexible schema design ideal for managing tenant, payment, and room data; integrates easily with Spring Boot |
| **Maven / Gradle** | Java build and dependency management | Reliable and widely supported for Java projects |

---

### 🧩 Summary
## 🌟 Key Features

### 🧩 1. Login and User Roles
- Users can login as **Landlords**.  
- Landlords can manage their dorm and assign tenants to rooms.  

**Tech Stack:** Next.js forms, MongoDB user storage.  

---

### 🏠 2. Room Management
- Add, edit, or remove rooms dynamically.  
- Each room shows real-time status: *Available*, *Reserved* or *Occupied*.  
- Auto-syncs with tenant assignments and reservations.  

**Tech Stack:** Java CRUD logic, MongoDB, Next.js for interactive UI.  

---

### 📊 3. Dashboard Overview
- Landlords get a snapshot of total tenants, rooms, and active payments.  
- Tenants see their rent status and current revenue.  
- Clean data visualization.  

**Tech Stack:** Java backend summaries, Next.js frontend 

---

## 🧭 Summary
**RoomEase** is a web-based dorm management system powered by **Java (backend)**, **Next.js (frontend)**, and **MongoDB (database)**.  
Its features include room and payment management, and dashboard summaries.  

RoomEase is a **Java + Next.js (TypeScript)** property management platform that helps small landlords digitalize their tenant tracking and billing workflow. It’s simple enough for two students to build in weeks, yet robust enough to scale into a **commercial-grade management tool** with payment integration, real-time updates, and analytics in future iterations.


## References

https://chatgpt.com/share/68e507d4-5cf0-8009-8fef-b19bda6cd767
https://chatgpt.com/share/68e507d4-5cf0-8009-8fef-b19bda6cd767 <br>
https://chatgpt.com/share/68e79488-2968-8009-9b2c-8bf8d1b0cfbd
