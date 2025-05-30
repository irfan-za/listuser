# User Management App with Next.js

This is a User Management App built with Next.js (App Router) that features CRUD (Create, Read, Update, Delete) operations. The data is migrated to/connected with a PostgreSQL database, utilizing two main tables: Users and Addresses.

**Demo Project:** [listuser-taupe.vercel.app](https://listuser-taupe.vercel.app/)

## Technologies Used

- Next.js (App Router)
- TypeScript
- PostgreSQL
- Drizzle ORM
- Zod (for input validation)
- Shadcn UI

## Database Schema

1.  **Users Table**

    - `id` (primary key)
    - `firstname` (string)
    - `lastname` (string)
    - `birthdate` (date)

2.  **Addresses Table** (One-to-One relationship with User)
    - `id` (primary key)
    - `user_id` (foreign key to Users table)
    - `street` (string)
    - `city` (string)
    - `province` (string)
    - `postal_code` (string)

## Features

### Mandatory Features

1.  **CRUD List User:**

    - Add new users
    - Edit users
    - Delete users
    - Display a list of users (Name, Birth Date, Address)

2.  **Database Migration (ORM Drizzle) Using PostgreSQL**

3.  **One-to-One Relationship between User and Address**

### Additional Features

1.  **TypeScript:** The project is written in TypeScript for type safety and improved developer experience.

2.  **Pagination & Searching on User List:**

    - Pagination: Display limited to 5 items per page.
    - Searching: Based on the `firstname` field.
    - Implements debounce search with delay for better performance and reduced API calls.

3.  **ORM Drizzle:** Implements Drizzle ORM for database migrations.

4.  **Input Validation with Zod:** Ensures that all inputs are validated before being stored in the database.

5.  **UI Using Shadcn:** Utilizes UI components from Shadcn for a modern look and feel.

## Setup Instructions

### Prerequisites

- Node.js installed
- PostgreSQL database set up

### Environment Variables

Create a `.env` file in the root directory with the following content:

```env
# Database URL
DATABASE_URL=postgresql://USER:PASSWORD@localhost:5432/listuser

```

Replace `USER`, `PASSWORD`, and `listuser` with your PostgreSQL credentials and database name.

### Install Dependencies

Run the following command to install the project dependencies:

```bash
pnpm install
```

### Database Migration

Run the following command to migrate the database using Drizzle ORM:

```bash
pnpm run db:migrate
```

### Development Server

Run the development server with the following command:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Usage

- To add a new user, click on the "Add User" button.
- To edit a user, click on the "Edit" button next to the user in actions column.
- To delete a user, click on the "Delete" button next to the user in actions column.
