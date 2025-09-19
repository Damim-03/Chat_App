Explanation of the Inventory and Sales Management System Project

Project Overview : 
This project is a comprehensive inventory and sales management system built using modern technologies like Prisma ORM and TypeScript. The system supports product management, sales, purchases, customer management, and debt tracking.

Project Infrastructure

```
backend/src/
├── controllers/ # Application controllers
│ ├── product/ # Product controllers
│ ├── unit/ # Unit controllers
│ └── sales/ # Sales controllers
├── db/ # Database configuration
├── interface/ # TypeScript interfaces
├── middleware/ # Application middleware
├── prisma/
│ └── migrations/ # Database migrations
│ └── schema.prisma # Main database schema
├── routes/ # Route definitions
│ ├── product/ # Product routes
│ └── sales/ # Sales routes
└── utils/ # Utility functions
```

Key Features : 

 1. Comprehensive Product Management
 Barcode and quantity tracking
 Multiple pricing levels
 Expiration date management
 Product categorization by categories and units

 2. Sales and Purchase System
 Sales and purchase invoices
 Discount and tax calculations
 Debt tracking and accounts receivable
 Multiple payment management

 3. Customer Management
 Customer database
 Customer debt tracking
 Customer sales history
 Payment and credit management

 4. Reporting and Analytics
 Daily and monthly sales reports
 Accounts receivable reports
 Product movement reports

Technologies Used
 Prisma ORM: For database management and operations
 TypeScript: For type-safe code development
 MySQL: Database management system
 Node.js: Server-side JavaScript runtime environment
System Workflow
 Product Management: Add/edit products with categorization by categories and units
 Purchases: Record purchase invoices with automatic inventory updates
 Sales: Create sales invoices with automatic inventory and debt updates
 Customer Management: Track customer data and their debts
 Reporting: Generate performance and financial reports
