# Project Assessment Rubric

**Project:** RoomEase - Smart Property & Tenant Management System
**Section:** C2B
**Course:** Object Oriented Programming

## Grading Breakdown

### 1. Class Diagram Completeness (25%)
**Score:** 3/5
**Notes:** Class diagram is referenced via Figma link (https://www.figma.com/board/OzD9np7jKdQ6uz3eBXRI62/Untitled). While a diagram exists, external links can become inaccessible. A local image or PDF would be more reliable. Cannot fully verify diagram quality without viewing the Figma board.

### 2. Java Program - OOP Concepts (50%)
**Score:** 4/5
**Notes:** Good implementation of OOP concepts in Spring Boot architecture:
- **Encapsulation:** Private fields with public getters/setters in Room, Tenant, and BaseEntity classes
- **Inheritance:** Clear inheritance with Room and Tenant extending abstract BaseEntity class
- **Polymorphism:** Abstract methods (isValid(), getDisplayName()) overridden in concrete classes; EntityService interface provides polymorphic service pattern
- **Abstraction:** Abstract BaseEntity class and EntityService interface demonstrate abstraction principles
The project uses modern Spring Boot patterns with repositories and services, showing solid OOP design. However, the inheritance hierarchy is relatively simple with only two concrete entity classes.

### 3. Git Usage & Collaboration (15%)
**Score:** 4/5
**Notes:** Good collaboration with 3 contributors: Cyrus (9 commits), aleehjoo (8 commits), and Michael Ong (1 commit). Balanced participation between two primary contributors shows active teamwork.

### 4. Base Grade (10%)
**Score:** 5/5

---

## Final Grade: 87/100

*Assessment generated based on project analysis.*
