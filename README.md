# Tourmate - A Complete Tour Management Platform

**Make your tour easier using our platform.**

Note: Make these project while learning react development, and make as a project of my 3rd Year, 1st Semester - Software Engineering Lab.

## Project Overview

The **Tour and Hotel Management App** is designed to streamline the management of multiple hotels in various tourist destinations. The app provides an interface for tourists, hotel managers, and administrators to manage bookings, hotel staff, and other hotel-related tasks in an efficient manner.

---

## Project Planning

### Idea of these project

- **User** of my app are tourist, hotel employees and admin.

  - Tourists: Can search for places, view tourist spots, and book hotels.
    They can also leave reviews and manage bookings.

  - Hotel Management: Manages hotel listings, handles bookings, and communicates with
    tourists for any booking-related issues.

  - Admin: Oversees both tourists and hotel management, manages system-level activities,
    resolves disputes, and generates reports for business analysis.

### Project Requirements/Features

### 1. **Guest Tourists (Non-Registered Users)**

- Can view the landing page and search for tourist destinations.
- View a list of available hotels for each destination along with a map displaying their locations.
- Must sign up to create a booking.

### 2. **Tourists (Registered Users)**

- Access a personal dashboard showing:
  - Current and past bookings.
  - Favorite destinations or hotels.
  - Personal profile management (upload/change avatar and edit personal details).
- Make a booking, specifying:
  - Number of guests, number of nights, additional services like breakfast.
  - Choose between different booking statuses: "Unconfirmed", "Check-in", or "Check-out".
- Manage bookings (edit, delete, check-in, check-out).
- Pay for the booking during check-in if the payment hasn’t been completed earlier.
- Add breakfast options during check-in if not selected during booking.

### 3. **Hotel Management (Admin and Employees)**

#### **Super Admin**

- **Manage Multiple Hotels**:
  - Add/remove hotels under the company's management.
  - Assign hotel managers for each hotel.
- **Dashboard**:
  - View key statistics for all hotels (bookings, occupancy rates, revenue, etc.).
  - Generate reports for individual hotels or combined statistics.
  - Compare the performance of multiple hotels.

#### **Hotel Manager**

- **Hotel-Specific Management**:
  - Manage rooms, bookings, staff, and hotel settings for their assigned hotel.
  - Access to hotel-specific statistics, guest check-in/check-out records, and sales data.
  - Update room pricing, availability, and discounts.
- Can manage bookings, confirming check-ins, processing check-outs, and accepting payment.
- Can add hotel employees.

#### **Hotel Employees**

- **Booking and Guest Management**:
  - Manage bookings: check-ins, check-outs, and guest services.
  - View guest details: full name, email, national ID, nationality, and country flag for easy identification.
  - Accept payment upon guest arrival and confirm breakfast options if necessary.

### 4. **Booking Management**

- Bookings include:
  - Number of guests, number of nights, and guest observations.
  - Option to add breakfast (price is determined by the admin).
- Bookings can be filtered by status: "Unconfirmed", "Check-in", "Check-out".
- Payment processing during check-in if not prepaid.
- Guests can add services (e.g., breakfast) upon check-in.

### 5. **Dashboard Features**

- The initial screen shows a **dashboard** with:
  - List of guests checking in and checking out.
  - Statistics of bookings, sales, check-ins, and occupancy rates (filterable by the last 7, 30, or 90 days).
  - Charts showing:
    - Daily hotel sales.
    - Stay duration statistics.

### 6. **Other Features**

- **Table View for Cabins/Rooms**:
  - Displays cabin photo, name, capacity, price, discount, and other relevant information.
- **Hotel Settings**:
  - Hotel manager can set breakfast prices, minimum/maximum nights per booking, maximum guests per booking, and other settings.
- **Dark Mode**: The application includes a dark mode for improved usability.

---

## Features Categories

- Admin (Super User)
- Guests
- Hotel Managers
- Hotel Employes
- Dashboard
- Check in and checkout
- App settings
- Authentication
- Map integration

## Necessary Pages

| Categories     | Pages                                                  |
| -------------- | ------------------------------------------------------ |
| Landing Page   | /                                                      |
| Bookings       | /bookings                                              |
| Cabins         | /cabins                                                |
| Guests         | /guest                                                 |
| Admin          | /admin                                                 |
| Employees      | /employee                                              |
| Managers       | /manager                                               |
| Dashboard      | /dashboard                                             |
|                | Note that this one will combine other features as well |
| Check in/out   | /checkin/:bookingId                                    |
| App Settings   | /settings                                              |
| Authentication | /users                                                 |
|                | /login                                                 |
|                | /account                                               |

## Technology Stack

| Category                | Technology                                                                                                                                               |
| ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing                 | <img src="https://reactrouter.com/favicon-light.png" alt="React Router" width="24"/> [React Router](https://reactrouter.com)                             |
| Styling                 | <img src="https://styled-components.com/favicon.png" alt="Styled Components" width="24"/> [Styled Components](https://styled-components.com)             |
| Remote State Management | <img src="https://i.ibb.co.com/zSvTDLc/logos-react-query-icon.png" alt="React Query" width="24"/> [React Query](https://react-query.tanstack.com)        |
| UI State Management     | <img src="https://reactjs.org/favicon.ico" alt="Context API" width="24"/> [Context API](https://reactjs.org)                                             |
| Form Management         | <img src="https://i.ibb.co.com/k2rDfVW/simple-icons-reacthookform.png" alt="React Hook Form" width="24"/> [React Hook Form](https://react-hook-form.com) |
| Other Tools             | React Icons / React Hot Toast / Recharts / date-fns / Supabase                                                                                           |

---

## Project Setup

    npm create vite@latest
    ...
    (base)  eyasir329@eyasirPC  ~/Documents/GitHub  npm create vite@latest
    Need to install the following packages:
    create-vite@5.5.3
    Ok to proceed? (y) y
    ✔ Project name: … tourmate
    ✔ Select a framework: › React
    ✔ Select a variant: › JavaScript

    Scaffolding project in /home/eyasir329/Documents/GitHub/tourmate...

    Done. Now run:

    cd tourmate
    npm install //to install all packagages

    #Delete all unnecessary file

    #Run the project
        npm run dev
    then it's run in port 5173
        http://localhost:5173/

## Installation & Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/eyasir329/tourmate.git
   cd tourmate
   npm i
   npm run dev
   ```

## Folder Structure

![folder_structure](https://i.ibb.co.com/Q9CvXrz/Screenshot-from-2024-10-04-17-42-09.png)

..
