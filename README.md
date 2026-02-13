# Tourmate - A Complete Tour Management Platform

- Presentation [Video](https://drive.google.com/file/d/1dX8abe7UKN240VrgiJIv1yhSv9YmH7la/view?usp=sharing), [Slide](https://1drv.ms/p/c/9c26f137e074ec86/Ed8CWFyYYstDvInGaW-u0o4BtElww7TWcspifa5n_CaLxg?e=rPj3OR)

###### Manage Hotels, Flights, Cars, and Attractions in One Place

## <u>Overview</u>

Tourmate is your all-in-one solution for seamless tour management, catering to diverse user roles like admins, tourists, and hotel management. It provides a streamlined experience for organizing and booking trips, complete with detailed dashboards, user management, and advanced features.

---

## <u>Software Development Life Cycle</u>

Tourmate follows a structured SDLC approach to ensure quality, scalability, and user satisfaction.

### <i><u>Choosing a SDLC Model</u></i>

###### **Development Model Priority Criteria**

| Criteria                        | Waterfall | V-Shape | Iterative | Spiral  | Agile   | Prototype |
| ------------------------------- | --------- | ------- | --------- | ------- | ------- | --------- |
| **Well-known requirement (5)**  | Yes (5)   | Yes (5) | No (0)    | No (0)  | Yes (5) | Yes (5)   |
| **Technological knowledge (3)** | Yes (3)   | Yes (3) | Yes (3)   | No (0)  | Yes (5) | Yes (3)   |
| **Efficiency (6)**              | Yes (6)   | Yes (6) | Yes (6)   | No (0)  | No (0)  | Yes (6)   |
| **Risk analysis (3)**           | No (0)    | Yes (3) | Yes (3)   | Yes (3) | Yes (5) | No (0)    |
| **User testing ability (5)**    | No (0)    | No (0)  | Yes (5)   | Yes (5) | Yes (5) | No (0)    |
| **Security (5)**                | Yes (5)   | Yes (5) | Yes (5)   | Yes (5) | Yes (5) | Yes (5)   |
| **Time consuming (3)**          | Yes (3)   | Yes (3) | No (0)    | No (0)  | Yes (3) | Yes (3)   |
| **Total Score (Weight: 30)**    | **22**    | **25**  | **22**    | **13**  | **28**  | **22**    |

This table summarizes the evaluation of different development models based on specific priority criteria.

##### Recommended SDLC Model for Tourmate is Agile Model.

#### **Why Agile for Tourmate?**

- **Adaptability**: Agile's flexibility allows Tourmate to incorporate changing requirements based on user feedback and market demands.
- **Iterative Development**: Features are developed in small, manageable increments, ensuring early releases with core functionality.
- **Collaboration**: Agile promotes continuous communication with stakeholders to refine features and address issues as they arise.
- **User Testing**: Frequent iterations allow for comprehensive user testing, helping to identify issues early and ensure high user satisfaction.
- **Security**: Agile practices ensure that security is addressed during every sprint, ensuring a secure platform.

---

Below are the key phases of the development process:

###### <u>Planning and Requirements Analysis</u>

## <u>Planning</u>

### <i><u>Users of the Application</u></i>

1. **Tourists**

   - Search for destinations and tourist spots.
   - View hotel listings and book hotels.
   - Leave reviews and manage personal bookings.

2. **Hotel Management**

   - Manage hotel listings and update availability.
   - Handle bookings and communicate with tourists for any issues.

3. **Admin**
   - Oversee tourists and hotel management activities.
   - Manage system-level configurations.
   - Resolve disputes and generate reports for business analysis.

---

### <i><u>Inspiration Behind the Project</u></i>

During a visit to Cox's Bazar, the challenges of tour planning inspired the idea for this platform. Motivated by platforms like **Booking.com**, this project aims to make touring easier and more organized for everyone.

---

### <i><u>Objective</u></i>

Create an all-in-one tour management platform that simplifies travel for tourists and streamlines operations for hotel management and admins.

---

### <i><u>Background</u></i>

This project was developed while learning React development. It serves as an extended version of the **The Wild Oasis** project, integrating advanced features like:

- Role-based access.
- Enhanced booking and review systems.
- Scalable design for real-world applications.

---

## <u>Requirements Analysis</u>

### <i><u>Functional Requirements</u></i>

1. **User Roles and Permissions**

   - **Tourists**:
     - Search for destinations, view tourist spots, and book hotels.
     - Leave reviews and manage personal bookings.
   - **Hotel Management**:
     - Manage hotel listings, handle bookings, and communicate with tourists.
   - **Admin**:
     - Oversee all activities, resolve disputes, and generate reports.

2. **Booking Management**

   - Tourists can book hotels, modify bookings, and cancel reservations.
   - Hotel management can confirm, update, and cancel bookings.

3. **Dashboard Features**

   - Admins and hotel management can access dashboards for analytics:
     - View reports on bookings, user activity, and revenue.
     - Filter and analyze data by custom timeframes (7, 30, or 90 days).

4. **User Authentication and Profiles**

   - Secure login/signup for all users. (Signup only for tourist, Hotel management is registered by admin)
   - Users can upload avatars and update personal information.

5. **Review System**
   - Tourists can leave reviews for hotels and tourist spots.
   - Reviews are visible to other users.

---

### <i><u>Non-Functional Requirements</u></i>

1. **Scalability**

   - The platform must support an increasing number of users and data.

2. **Performance**

   - Ensure quick load times for hotel searches and dashboard analytics.

3. **Security**

   - Implement authentication using JSON Web Tokens (JWT).
   - Encrypt sensitive user data and enforce role-based access control.

4. **Usability**

   - Responsive design using ReactJS and Bootstrap for a seamless user experience across devices.

5. **Reliability**
   - Ensure consistent uptime with proper error handling and fail-safe mechanisms.

---

### <i><u>Technical Requirements</u></i>

1. **Frontend**:

   - **Next.js**: Used for the home page.
   - **ReactJS**: Used for server-side rendering and SPA.
   - **Bootstrap**: For responsive and clean design.

2. **Backend and Database**:

   - **Supabase**: Used as the backend and database solution (PostgreSQL).

###### **Technology Stack**

| Category                | Technology                                                                                                                                                                                                                    |
| ----------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Routing                 | <img src="https://reactrouter.com/favicon-light.png" alt="React Router" width="24"/> [React Router](https://reactrouter.com)                                                                                                  |
| Styling                 | <img src="https://styled-components.com/favicon.png" alt="Styled Components" width="24"/> [Styled Components](https://styled-components.com)                                                                                  |
| Remote State Management | <img src="https://i.ibb.co/zSvTDLc/logos-react-query-icon.png" alt="React Query" width="24"/> [React Query](https://react-query.tanstack.com)                                                                                 |
| UI State Management     | <img src="https://reactjs.org/favicon.ico" alt="Context API" width="24"/> [Context API](https://reactjs.org)                                                                                                                  |
| Form Management         | <img src="https://i.ibb.co/k2rDfVW/simple-icons-reacthookform.png" alt="React Hook Form" width="24"/> [React Hook Form](https://react-hook-form.com)                                                                          |
| Authentication          | <img src="https://jwt.io/img/favicon/favicon-32x32.png" alt="JWT" width="24"/> [JWT](https://jwt.io) / <img src="https://firebase.google.com/favicon.ico" alt="Firebase" width="24"/> [Firebase](https://firebase.google.com) |
| Other Tools             | React Icons / React Hot Toast / Recharts / date-fns / Supabase                                                                                                                                                                |

---

## <u>System Design</u>

### <i><u>Data Flow Diagram</u></i>

DFD level 0, 1, 2 for your project using lucidchart.

![dfd0]()
![dfd1]()
![dfd2]()

---

### <i><u>Use Case Diagram</u></i>

(both in hand using pen-paper and in lucid chart software

### <i><u>Sequence Diagram</u></i>

## ![sequence](https://i.ibb.co.com/j9NnG2Vs/Eyasir-Ahamed-15.png)

### <i><u>Wireframing</u></i>

to view online: https://balsamiq.cloud/s138lnh/py6ok9

- Front page (visible for all users).

  ![front_page](https://i.ibb.co.com/NWRK8w3/public-front-page.png)

- Registration / Sign in page
- Admin portal
- Hotel Management portal
- Tourist portal

---

### <i><u>Database Design</u></i>

---

## <u>Implementation</u>

- Developed the application in incremental sprints:
  - Authentication, user roles, and dashboard integration.
  - Features like booking management, payment integration, and analytics.
- Focused on clean and maintainable code with modern practices like React Redux.

---

## <u>Testing</u>

- Conducted unit testing for individual components.
- Performed integration testing for seamless communication between frontend, backend, and database.
- Tested for edge cases:
  - Invalid booking inputs.
  - Role-based access violations.

---

## <u>Deployment</u>

- Deployed the platform on a scalable cloud infrastructure.
- Optimized database queries and server responses for better performance.

---

## <u>Maintenance</u>

- Regular updates to address bug fixes and performance improvements.
- Monitoring analytics to enhance user experience and identify new features.
</pre>

---

#

### Necessary Pages

| Categories     | Pages               | Works                          |
| -------------- | ------------------- | ------------------------------ |
| Landing Page   | /                   | front page. visible for public |
| Bookings       | /bookings           | booking management             |
| Cabins         | /cabins             | cabin management               |
| Guests         | /guests             | guest homepage                 |
| Admin          | /admin              | admin homepage                 |
| Managers       | /managers           | manager homepage               |
| Employees      | /employees          | employee homepage              |
| Dashboard      | /dashboard          | dashboard of each user         |
| Check in/out   | /checkin/:bookingId | check in/out management        |
| App Settings   | /settings           | hotel setting                  |
| Authentication | /users              | user info                      |
|                | /account            | account info..basically login  |
|                | /signup             | signup page for guest          |
|                | /login              | login page for all user        |

---

## Project Setup

It's initial project setup. We do not need it when we clone this project.

    npm create vite@latest //5.5.3
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

Clone the repository:

```bash
git clone https://github.com/eyasir329/tourmate.git
cd tourmate
npm i
npm run dev
```

## Folder Structure

![folder_structure](https://i.ibb.co.com/Q9CvXrz/Screenshot-from-2024-10-04-17-42-09.png)

## Setting up Routes and Pages

For this purpose, we are using **react-router-dom** package.
<code>
npm i react-router-dom
</code>

<code>App.jsx</code>

    <BrowserRouter>
        <Routes>
          <Route index element={<Home />} />
          {/* main app */}
          <Route path="/app" element={<AppLayout />}>
            {/* admin */}
            <Route path="admin" element={<Admin />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="create_hotel" element={<CreateHotel />} />
              <Route path="delete_hotel" element={<DeleteHotel />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* manager */}
            <Route path="manager" element={<Manager />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="settings" element={<Settings />} />
              <Route path="create_employee" element={<CreateEmployee />} />
              <Route path="delete_employee" element={<DeleteEmployee />} />
              <Route path="history" element={<History />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* employee */}
            <Route path="employee" element={<Employee />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>
            {/* guest */}
            <Route path="guest" element={<Guest />}>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="users" element={<Users />} />
              <Route path="account" element={<Account />} />
              <Route path="*" element={<PageNotFound />} />{" "}
            </Route>

            <Route path="*" element={<PageNotFound />} />
          </Route>

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />

          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </BrowserRouter>

## App Layout

Necessary package,
<code>npm i react-icons</code>

Using CSS Grid, to make <code>AppLayout.jsx</code> app layout.

![app-layout](https://i.ibb.co.com/m4Rv24Y/Screenshot-from-2024-10-12-17-56-53.png)

<code>Dashboard.jsx</code>
