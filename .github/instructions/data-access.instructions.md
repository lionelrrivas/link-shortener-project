---
description: >
  Read this file to understand how to access data in the project. 
  This includes how to connect to databases, query data, and manage data access securely and efficiently.
---
# Data Access Guidelines
This document provides guidelines for accessing data in the project, including best practices for connecting to 
databases, querying data, and managing data access securely and efficiently in a Next.js application. Adhering to these
guidelines will help ensure that data access is performed in a consistent, secure, and performant manner across the application.

## 1. Use Server Components for Data Fetching
In Next.js, **always** use Server Components to fetch data on the server side. This allows you to keep sensitive database 
credentials secure and reduces the amount of data sent to the client. **Never** fetch data directly in Client Components.

## 2. Data Fetching Methods
**Always** use the helper functions provided in the `/data` directory for fetching data. 
These functions are designed to handle database connections, query execution, and error handling in a consistent way. 
**Do not** write raw database queries directly in your components.

**All** helper functions in the `/data` directory use Drizzle ORM for database interactions. 
This provides a type-safe and efficient way to query the database while abstracting away the underlying SQL.
