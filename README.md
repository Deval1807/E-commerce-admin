# Admin Dashboard

This is the repository for the Admin Dashboard, a secure CMS for managing the e-commerce store. It includes features for efficient store management and secure authorization.

## Features

- Secure authorization for admin access through Clerk
- Effortless store management through a comprehensive dashboard
- Integration with Stripe for managing payments

## Tech Stack

- **Next.js**: Framework for building server-rendered React applications
- **PrismaDB**: ORM for database management
- **MySQL (AWS RDS)**: Relational database service
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Component library for building user interfaces
- **Stripe**: Payment processing platform

## Getting Started

### Prerequisites

- Node.js
- MySQL database 
- Registered Account on:
    - Cloudinary (For uploading images)
    - Clerk (For authentication)
- Stripe configuration 

### Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/Deval1807/E-commerce-admin
    cd admin-dashboard
    ```

2. Install dependencies:
    ```bash
    npm install
    ```

3. Configure environment variables:
    - Create a `.env` file in the root directory.
    - Add your database and Stripe configurations.
    ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=<your-clerk-pubilshable-key>
    CLERK_SECRET_KEY=<your-clerk-key>
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
    NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

    DATABASE_URL="<your-db-url>"

    NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="<your-cloudinary-account>"

    STRIPE_API_KEY=<your-stripe-key>

    STRIPE_WEBHOOK_SECRET=<your-stripe-webhook-secret-key>
 
    FRONTEND_STORE_URL=<your-frontend-store-url>
    ```

4. Run database migrations:
    ```bash
    npx prisma migrate dev
    ```

5. Start the development server:
    ```bash
    npm run dev
    ```

6. Open your browser and navigate to `http://localhost:3000`.

## Deployment

You can find the deployed site at: https://e-commerce-admin-jade-psi.vercel.app/

## Contributing

We welcome contributions from the community. To contribute, please fork the repository, create a new branch, and submit a pull request. Make sure to follow the coding standards and ethical practices.

## Contact

For questions or support, please contact Deval Darji by following ways:

1. LinkedIn: [Deval Darji](https://www.linkedin.com/in/deval-darji-a15002226/)

2. Email: [deval135darji@gmail.com](mailto:deval135darji@gmail.com)
