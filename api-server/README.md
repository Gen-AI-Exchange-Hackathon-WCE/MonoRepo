## Setup Instructions

Follow these steps to set up and run the project locally:

### 1. Install dependencies

```bash
npm install
```

This will install all required packages.

### 2. Configure environment variables

* Copy the `.env.example` file to create a new `.env` file in the project root:

```bash
cp .env.example .env
```

* Open `.env` and update it with your environment-specific values, including the new database connection string.

### 3. Generate Prisma Client

```bash
npx prisma generate
```

This will generate the Prisma client based on the schema.

### 4. Apply database migrations

**If you have made changes to `schema.prisma`, or if you are connecting to a new database, run one of the following:**

* Apply migrations to the new database:

```bash
npx prisma migrate deploy
```

* (Optional, development only) Reset the database and apply all migrations from scratch:

```bash
npx prisma migrate reset
```

* Create a new migration after schema changes:

```bash
npx prisma migrate dev --name migration_name
```

Replace `migration_name` with a descriptive name for your migration.

### 5. Start the server

```bash
npm run dev
```

This will start the development server and you can begin using the application.


