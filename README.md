# HR Management System - solution

This is a solution to the [Tech Genius Test Project - HR Administration System to manage employee details]

## Table of contents

- [Overview](#overview)
  - [The challenge](#the-challenge)
  - [Screenshot](#screenshot)
- [My process](#my-process)
  - [Built with](#built-with)
  - [What I learned](#what-i-learned)
- [How to run the App](#run-app)

## Overview

### The challenge

- Employees can only view and edit their own data, but cannot change their manager or status
- Managers can view all employees in their departments, but cannot modify manager or status fields
- HR Administrators can view and edit all employees and departments, including changing manager and status

## My process

### Built with

- t3 stack (npm create t3-app@latest)
- Language: Typescript
- Styling: Tailwind CSS / Material UI/ shadcn
- Database: sqlite
- ORM: prisma
- Framework: next.js
- Authentication: NextAuth.js
- Client-Server API: tRPC
- Form validation: Zod
- React-hook-form with Zod resolver/validation

### What I learned

I've learned a lot, including using TypeScript and Prisma for database management. Most importantly, I had fun and found it challenging to build middleware with Next.js

### How to run the App
- Clone the App
- Navigate to root directory
- Run command "npm install"
- After that start the server by command "npm run dev"
- Development server should be running and you can visit your app at http://localhost:3000
