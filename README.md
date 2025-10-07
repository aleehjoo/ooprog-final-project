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
| **MongoDB** | NoSQL database | Flexible schema design ideal for managing tenant, payment, and room data; integrates easily with Spring Boot |
| **Spring Data MongoDB** | Database interaction from Java backend | Simplifies database access and CRUD operations using repository patterns |
| **Axios / Fetch API** | Communication between frontend and backend | Streamlined API requests and error handling |
| **Docker (optional)** | Containerization | Simplifies deployment and ensures consistent development environment |
| **JWT (JSON Web Tokens)** | Authentication | Secure and stateless user sessions between Java and Next.js |
| **Maven / Gradle** | Java build and dependency management | Reliable and widely supported for Java projects |
| **Vercel** | Web deployment | Simple and free-tier hosting for Next.js apps |
| **Render** | Backend hosting | Easy and cost-effective cloud platform for deploying Spring Boot applications with MongoDB connectivity |

---

### 🧩 Summary

RoomEase is a **Java + Next.js (TypeScript)** property management platform that helps small landlords digitalize their tenant tracking and billing workflow. It’s simple enough for two students to build in weeks, yet robust enough to scale into a **commercial-grade management tool** with payment integration, real-time updates, and analytics in future iterations.


## References

https://chatgpt.com/share/68e507d4-5cf0-8009-8fef-b19bda6cd767
