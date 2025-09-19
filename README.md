# Inventory and Sales Management System

A comprehensive inventory and sales management system built with modern technologies including Prisma ORM, TypeScript, and Node.js. This system supports product management, sales processing, purchase tracking, customer management, and debt monitoring.

## 🌟 Features

### Product Management
- **Barcode Integration**: Track products with unique barcode identifiers
- **Multi-level Pricing**: Support for different pricing tiers
- **Expiration Tracking**: Monitor product expiration dates
- **Categorization**: Organize products by categories and units
- **Inventory Control**: Real-time stock quantity management

### Sales & Purchase System
- **Invoice Management**: Generate sales and purchase invoices
- **Tax & Discount Calculations**: Automated financial computations
- **Debt Tracking**: Comprehensive accounts receivable management
- **Multiple Payment Methods**: Support for various payment options

### Customer Management
- **Customer Database**: Centralized customer information storage
- **Debt Monitoring**: Track customer outstanding balances
- **Sales History**: Complete record of customer transactions
- **Credit Management**: Control customer credit limits and terms

### Reporting & Analytics
- **Daily/Monthly Reports**: Sales performance tracking over time
- **Accounts Receivable**: Detailed debtors reports
- **Inventory Movement**: Product transaction history
- **Financial Analytics**: Revenue and profit analysis

## 🛠️ Technology Stack

- **Backend Framework**: Node.js with Express
- **Database ORM**: Prisma
- **Database**: MySQL
- **Programming Language**: TypeScript
- **API**: RESTful architecture

## 📁 Project Structure

```bash
backend/src/
├── controllers/ # Application controllers
│ ├── product/ # Product-related controllers
│ ├── unit/ # Unit management controllers
│ └── sales/ # Sales transaction controllers
├── db/ # Database configuration
├── interface/ # TypeScript type definitions
├── middleware/ # Custom middleware functions
├── prisma/
│ └── migrations/ # Database migration files
│ └── schema.prisma # Main database schema
├── routes/ # API route definitions
│ ├── product/ # Product-related routes
│ └── sales/ # Sales-related routes
└── utils/ # Utility functions and helpers
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MySQL database
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Damim-03/Chat_App.git
cd Chat_App
```

```bash
npm install
```


The Author : https://github.com/Damim-03


