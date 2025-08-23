# Pro Appliance Admin Portal

A React-based admin dashboard for managing customer quote requests from the Pro Appliance Installation website.

## 📋 Project Overview

This admin portal provides a professional interface for viewing, searching, and managing customer quote submissions. It connects to the same Supabase database as the main Pro Appliance Installation website to display real-time quote data in an organized, searchable format.

## 🛠️ Tech Stack

- **Frontend**: React 18 + React Bootstrap 5
- **Database**: Supabase (PostgreSQL)
- **Routing**: React Router DOM
- **Styling**: Bootstrap + Custom CSS
- **Icons**: FontAwesome

## ✅ Current Features

### Dashboard
- Real-time quote display from Supabase database
- Search functionality (customer name, email, phone)
- Smart sorting (date, name, email - ascending/descending)
- Statistics cards (total quotes, today's quotes, filtered results)
- Professional UI with Pro Appliance branding

### Quote Detail Views
- Comprehensive individual quote pages
- Customer information and contact details
- Installation address and site details
- Selected appliances with specifications
- Service preferences (delivery, uninstall, haul away)
- Project timeline and preferences
- Uploaded files display

### Development Tools
- Test data seeding system
- Responsive design for all devices
- Loading states and error handling

## 🔮 Planned Features

- [x] Authentication system for secure access
- [ ] Quote status management (pending, reviewed, completed)
- [ ] Export functionality (CSV/PDF)
- [ ] Advanced filtering options
- [ ] Customer communication tools
- [ ] Analytics and reporting dashboard

## 🚀 Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables:
   ```env
   REACT_APP_SUPABASE_URL=your_supabase_url
   REACT_APP_SUPABASE_ANON_KEY=your_supabase_key
4. Start development server: `npm start`

## 📁 Project Structure
src/
├── pages/
│   ├── Dashboard.js      # Main quote overview
│   ├── QuoteView.js      # Individual quote details
│   └── Login.js          # Authentication (future)
├── lib/
│   └── supabase.js       # Database connection
├── styles/
│   └── variables.css     # Shared styling variables
└── utils/
    └── seedData.js       # Test data generation

Part of the Pro Appliance Installation business automation system.
