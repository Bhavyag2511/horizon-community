import { FormEvent, useMemo, useState, type ReactNode } from "react";

import {
  Activity,
  AlertTriangle,
  ArrowRight,
  Bell,
  Building2,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  DoorOpen,
  Dumbbell,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  PackageCheck,
  Phone,
  PieChart,
  Plus,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Users,
  UserRound,
  X,
  Zap,
} from "lucide-react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts";

import "./App.css";

type Role = "Resident" | "Security" | "Admin";

type ComplaintStatus = "Open" | "In Progress" | "Resolved";
type ComplaintPriority = "Low" | "Medium" | "High";

type VisitorStatus =
  | "Pending"
  | "Approved"
  | "Rejected"
  | "Checked In"
  | "Checked Out";

type PageName =
  | "Dashboard"
  | "Announcements"
  | "Complaints"
  | "Visitors"
  | "Facilities"
  | "Events"
  | "Polls"
  | "Emergency";

interface Complaint {
  id: number;
  title: string;
  description: string;
  category: string;
  priority: ComplaintPriority;
  status: ComplaintStatus;
  createdAt: string;
}

interface Visitor {
  id: number;
  name: string;
  purpose: string;
  phone: string;
  date: string;
  time: string;
  status: VisitorStatus;
}

interface Booking {
  id: number;
  facility: string;
  date: string;
  time: string;
  status: "Confirmed" | "Cancelled";
}

interface Announcement {
  id: number;
  title: string;
  content: string;
  category: string;
  date: string;
}

interface CommunityEvent {
  id: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  attendees: number;
}

interface Poll {
  id: number;
  question: string;
  options: string[];
  votes: number[];
}

const CURRENT_DATE = "10 Sep 2026";

const STORAGE_KEYS = {
  complaints: "horizon-community-complaints",
  visitors: "horizon-community-visitors",
  bookings: "horizon-community-bookings",
  events: "horizon-community-events",
  polls: "horizon-community-polls",
  votedPolls: "horizon-voted-polls",
};

const defaultComplaints: Complaint[] = [
  {
    id: 1,
    title: "Water leakage in Block A",
    description:
      "Water is leaking near the staircase on the second floor.",
    category: "Plumbing",
    priority: "High",
    status: "In Progress",
    createdAt: CURRENT_DATE,
  },
  {
    id: 2,
    title: "Gym equipment maintenance",
    description:
      "Treadmill number 3 is making unusual noise.",
    category: "Maintenance",
    priority: "Medium",
    status: "Open",
    createdAt: "09 Sep 2026",
  },
  {
    id: 3,
    title: "Corridor light not working",
    description:
      "The corridor light near apartment B-204 is not working.",
    category: "Electrical",
    priority: "Low",
    status: "Resolved",
    createdAt: "08 Sep 2026",
  },
];

const defaultVisitors: Visitor[] = [
  {
    id: 1,
    name: "Arjun Kumar",
    purpose: "Guest",
    phone: "9876543210",
    date: CURRENT_DATE,
    time: "10:30 AM",
    status: "Approved",
  },
  {
    id: 2,
    name: "Rahul Delivery",
    purpose: "Package Delivery",
    phone: "9123456780",
    date: CURRENT_DATE,
    time: "01:15 PM",
    status: "Checked In",
  },
  {
    id: 3,
    name: "Meena Services",
    purpose: "Maintenance",
    phone: "9988776655",
    date: CURRENT_DATE,
    time: "04:00 PM",
    status: "Pending",
  },
];

const defaultBookings: Booking[] = [
  {
    id: 1,
    facility: "Clubhouse",
    date: CURRENT_DATE,
    time: "06:00 PM",
    status: "Confirmed",
  },
  {
    id: 2,
    facility: "Badminton Court",
    date: CURRENT_DATE,
    time: "06:00 PM",
    status: "Confirmed",
  },
  {
    id: 3,
    facility: "Clubhouse",
    date: "12 Sep 2026",
    time: "07:00 PM",
    status: "Confirmed",
  },
];

const defaultAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Water Supply Maintenance",
    content:
      "Scheduled maintenance will be carried out tomorrow from 10:00 AM to 1:00 PM.",
    category: "Maintenance",
    date: CURRENT_DATE,
  },
  {
    id: 2,
    title: "Community Sports Day",
    content:
      "Registrations are now open for badminton, basketball and table tennis.",
    category: "Events",
    date: "09 Sep 2026",
  },
  {
    id: 3,
    title: "Parking Reminder",
    content:
      "Please ensure that vehicles are parked only in the designated slots.",
    category: "Notice",
    date: "08 Sep 2026",
  },
  {
    id: 4,
    title: "Festival Celebration",
    content:
      "Residents are invited to participate in the upcoming community celebration.",
    category: "Community",
    date: "07 Sep 2026",
  },
];

const defaultEvents: CommunityEvent[] = [
  {
    id: 1,
    title: "Community Sports Day",
    description:
      "A day of fun competitions including badminton, basketball and table tennis.",
    date: "14 Sep 2026",
    time: "08:00 AM",
    location: "Community Ground",
    category: "Sports",
    attendees: 72,
  },
  {
    id: 2,
    title: "Ganesh Chaturthi Celebration",
    description:
      "Community prayer, cultural performances and family activities.",
    date: "17 Sep 2026",
    time: "06:30 PM",
    location: "Clubhouse",
    category: "Festival",
    attendees: 118,
  },
  {
    id: 3,
    title: "Residents Town Hall",
    description:
      "Monthly discussion with the administration and resident community.",
    date: "20 Sep 2026",
    time: "05:00 PM",
    location: "Multipurpose Hall",
    category: "Meeting",
    attendees: 46,
  },
];

const defaultPolls: Poll[] = [
  {
    id: 1,
    question: "Which facility should be upgraded next?",
    options: [
      "Gym",
      "Badminton Court",
      "Children's Area",
      "Clubhouse",
    ],
    votes: [42, 35, 28, 51],
  },
  {
    id: 2,
    question:
      "What should be the preferred community activity?",
    options: [
      "Movie Night",
      "Sports Event",
      "Food Festival",
      "Workshop",
    ],
    votes: [31, 48, 39, 25],
  },
];

const facilities = [
  {
    name: "Clubhouse",
    description:
      "Events, meetings and community activities.",
    icon: Building2,
    capacity: 80,
  },
  {
    name: "Gym",
    description:
      "Modern fitness equipment for residents.",
    icon: Dumbbell,
    capacity: 20,
  },
  {
    name: "Badminton Court",
    description:
      "Indoor court available for resident bookings.",
    icon: Zap,
    capacity: 6,
  },
  {
    name: "Party Hall",
    description:
      "Private space for celebrations and gatherings.",
    icon: Home,
    capacity: 100,
  },
];

function loadStorage<T>(key: string, fallback: T): T {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function saveStorage<T>(key: string, value: T) {
  localStorage.setItem(key, JSON.stringify(value));
}

function formatLongDate(date: string) {
  const parts = date.split(" ");

  if (parts.length !== 3) {
    return date;
  }

  return `${parts[0]} ${parts[1]} ${parts[2]}`;
}

function formatEventDay(date: string) {
  const parts = date.split(" ");

  return {
    day: parts[0] || "",
    month: parts[1] || "",
  };
}

/* =========================================================
   LOGIN
========================================================= */

function LoginPage({
  onLogin,
}: {
  onLogin: (role: Role) => void;
}) {
  const [role, setRole] = useState<Role>("Resident");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onLogin(role);
  };

  return (
    <div className="login-page">
      <div className="login-brand">
        <div className="brand-logo">
          <Sparkles size={22} />
        </div>

        <div>
          <div className="brand-title">
            Horizon Community
          </div>

          <div className="brand-subtitle">
            Smart Society Management
          </div>
        </div>
      </div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-heading">
            <span className="eyebrow">
              WELCOME BACK
            </span>

            <h1>
              Manage your
              <br />
              community.
            </h1>

            <p>
              One intelligent platform for residents,
              security and administration.
            </p>
          </div>

          <div className="role-selector">
            {(["Resident", "Security", "Admin"] as Role[]).map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={`role-btn ${
                    role === item ? "active" : ""
                  }`}
                  onClick={() => setRole(item)}
                >
                  {item === "Resident" && (
                    <UserRound size={17} />
                  )}

                  {item === "Security" && (
                    <Shield size={17} />
                  )}

                  {item === "Admin" && (
                    <Building2 size={17} />
                  )}

                  {item}
                </button>
              ),
            )}
          </div>

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >
            <label>
              <span>Email address</span>

              <input
                type="email"
                value={email}
                onChange={(event) =>
                  setEmail(event.target.value)
                }
                placeholder="name@horizon.com"
              />
            </label>

            <label>
              <span>Password</span>

              <input
                type="password"
                value={password}
                onChange={(event) =>
                  setPassword(event.target.value)
                }
                placeholder="Enter password"
              />
            </label>

            <button
              type="submit"
              className="primary-btn login-btn"
            >
              Sign in
              <ArrowRight size={18} />
            </button>
          </form>

          <div className="demo-account">
            <span className="demo-label">
              Demo access
            </span>

            <span className="demo-value">
              {role.toLowerCase()}@horizon.com / 123456
            </span>
          </div>
        </div>

        <div className="login-side">
          <span className="eyebrow">
            CONNECTED COMMUNITY
          </span>

          <h2>
            Everything your community needs, in one
            place.
          </h2>

          <p>
            Complaints, visitors, facilities,
            announcements, events and emergency support
            — designed around simple resident
            experiences.
          </p>

          <div className="login-feature-list">
            <div>
              <CheckCircle2 size={20} />
              <span>
                Real-time community operations
              </span>
            </div>

            <div>
              <CheckCircle2 size={20} />
              <span>Role-based access</span>
            </div>

            <div>
              <CheckCircle2 size={20} />
              <span>
                Smart insights for administrators
              </span>
            </div>
          </div>

          <div className="login-side-decoration">
            <div />
            <div />
            <div />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   APPLICATION SHELL
========================================================= */

function ApplicationShell({
  role,
  onLogout,
}: {
  role: Role;
  onLogout: () => void;
}) {
  const [activePage, setActivePage] =
    useState<PageName>("Dashboard");

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const navigate = (page: PageName) => {
    setActivePage(page);
    setMobileMenu(false);
  };

  const residentNavigation: {
    label: PageName;
    icon: typeof Home;
  }[] = [
    { label: "Dashboard", icon: Home },
    { label: "Announcements", icon: Bell },
    { label: "Complaints", icon: MessageSquare },
    { label: "Visitors", icon: Users },
    { label: "Facilities", icon: Building2 },
    { label: "Events", icon: CalendarDays },
    { label: "Polls", icon: PieChart },
    { label: "Emergency", icon: AlertTriangle },
  ];

  const securityNavigation: {
    label: PageName;
    icon: typeof Home;
  }[] = [
    { label: "Dashboard", icon: Shield },
    { label: "Visitors", icon: Users },
    { label: "Complaints", icon: MessageSquare },
    { label: "Announcements", icon: Bell },
    { label: "Emergency", icon: AlertTriangle },
  ];

  const adminNavigation: {
    label: PageName;
    icon: typeof Home;
  }[] = [
    { label: "Dashboard", icon: Home },
    { label: "Announcements", icon: Bell },
    { label: "Complaints", icon: MessageSquare },
    { label: "Visitors", icon: Users },
    { label: "Facilities", icon: Building2 },
    { label: "Events", icon: CalendarDays },
    { label: "Polls", icon: PieChart },
    { label: "Emergency", icon: AlertTriangle },
  ];

  const navigation =
    role === "Admin"
      ? adminNavigation
      : role === "Security"
        ? securityNavigation
        : residentNavigation;

  const complaints = loadStorage<Complaint[]>(
    STORAGE_KEYS.complaints,
    defaultComplaints,
  );

  const openComplaints = complaints.filter(
    (item) => item.status !== "Resolved",
  ).length;

  return (
    <div className="app-shell">
      <aside
        className={`sidebar ${
          mobileMenu ? "mobile-open" : ""
        }`}
      >
        <div className="sidebar-top">
          <div className="sidebar-brand">
            <div className="brand-logo small">
              <Sparkles size={18} />
            </div>

            <div>
              <div className="brand-title">
                Horizon
              </div>

              <div className="brand-subtitle">
                Community
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X size={20} />
          </button>
        </div>

        <div className="sidebar-role">
          <div className="role-avatar">
            {role === "Resident" && (
              <UserRound size={18} />
            )}

            {role === "Security" && (
              <Shield size={18} />
            )}

            {role === "Admin" && (
              <Building2 size={18} />
            )}
          </div>

          <div className="sidebar-role-copy">
            <strong>
              {role === "Resident"
                ? "Bhavya"
                : role === "Security"
                  ? "Security Desk"
                  : "Community Admin"}
            </strong>

            <span>{role}</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <span className="nav-heading">
            WORKSPACE
          </span>

          {navigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                type="button"
                className={`nav-item ${
                  activePage === item.label ? "active" : ""
                }`}
                onClick={() => navigate(item.label)}
              >
                <Icon size={19} />
                <span>{item.label}</span>

                {item.label === "Complaints" &&
                  openComplaints > 0 && (
                    <span className="nav-badge">
                      {openComplaints}
                    </span>
                  )}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">
          <div className="sidebar-status">
            <span className="status-dot" />

            <div>
              <strong>Community Online</strong>
              <span>All systems operational</span>
            </div>
          </div>

          <button
            type="button"
            className="logout-btn"
            onClick={onLogout}
          >
            <LogOut size={17} />
            Sign out
          </button>
        </div>
      </aside>

      {mobileMenu && (
        <div
          className="mobile-overlay"
          onClick={() => setMobileMenu(false)}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button
              type="button"
              className="mobile-menu-btn"
              onClick={() => setMobileMenu(true)}
            >
              <Menu size={21} />
            </button>

            <div>
              <span className="topbar-date">
                Thursday · 10 September 2026
              </span>

              <h2>
                {activePage === "Dashboard"
                  ? role === "Admin"
                    ? "Community Control Center"
                    : role === "Security"
                      ? "Security Operations"
                      : "Good evening, Bhavya"
                  : activePage}
              </h2>
            </div>
          </div>

          <div className="topbar-actions">
            <button
              type="button"
              className="icon-btn"
              aria-label="Notifications"
            >
              <Bell size={18} />
              <span className="notification-dot" />
            </button>

            <div className="topbar-user">
              <div className="topbar-avatar">
                {role === "Resident" && "B"}
                {role === "Security" && "S"}
                {role === "Admin" && "A"}
              </div>

              <div className="topbar-user-copy">
                <strong>
                  {role === "Resident"
                    ? "Bhavya"
                    : role === "Security"
                      ? "Security Desk"
                      : "Community Admin"}
                </strong>

                <span>{role}</span>
              </div>
            </div>
          </div>
        </header>

        <div className="page-container">
          {role === "Admin" &&
          activePage === "Dashboard" ? (
            <AdminDashboardPage />
          ) : role === "Security" &&
            activePage === "Dashboard" ? (
            <SecurityDashboardPage />
          ) : activePage === "Dashboard" ? (
            <DashboardPage onNavigate={navigate} />
          ) : activePage === "Announcements" ? (
            <AnnouncementsPage />
          ) : activePage === "Complaints" ? (
            <ComplaintsPage />
          ) : activePage === "Visitors" ? (
            <VisitorsPage />
          ) : activePage === "Facilities" ? (
            <FacilitiesPage />
          ) : activePage === "Events" ? (
            <EventsPage />
          ) : activePage === "Polls" ? (
            <PollsPage />
          ) : (
            <EmergencyPage />
          )}
        </div>
      </main>
    </div>
  );
}

/* =========================================================
   RESIDENT DASHBOARD
========================================================= */

function DashboardPage({
  onNavigate,
}: {
  onNavigate: (page: PageName) => void;
}) {
  const complaints = loadStorage<Complaint[]>(
    STORAGE_KEYS.complaints,
    defaultComplaints,
  );

  const visitors = loadStorage<Visitor[]>(
    STORAGE_KEYS.visitors,
    defaultVisitors,
  );

  const bookings = loadStorage<Booking[]>(
    STORAGE_KEYS.bookings,
    defaultBookings,
  );

  const openComplaints = complaints.filter(
    (item) => item.status !== "Resolved",
  ).length;

  const visitorsToday = visitors.filter(
    (item) => item.date === CURRENT_DATE,
  ).length;

  const activeBookings = bookings.filter(
    (item) =>
      item.status === "Confirmed" &&
      item.date === CURRENT_DATE,
  ).length;

  const upcomingEvent = defaultEvents[0];

  const upcomingEventDate = formatEventDay(
    upcomingEvent.date,
  );

  return (
    <div className="dashboard-page">
      <section className="hero-banner">
        <div className="hero-content">
          <div className="hero-label">
            <span className="status-dot" />
            SMART COMMUNITY
          </div>

          <h1>
            Your community,
            <br />
            connected.
          </h1>

          <p>
            Stay informed, manage requests and connect
            with your neighbourhood from one simple
            dashboard.
          </p>

          <div className="hero-actions">
            <button
              type="button"
              className="hero-btn"
              onClick={() =>
                onNavigate("Announcements")
              }
            >
              Explore community updates
              <ArrowRight size={17} />
            </button>

            <button
              type="button"
              className="hero-secondary-btn"
              onClick={() =>
                onNavigate("Facilities")
              }
            >
              Book a facility
            </button>
          </div>
        </div>

        <div className="hero-decoration">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />

          <div className="hero-core">
            <Sparkles size={36} />
          </div>
        </div>
      </section>

      <div className="stats-grid">
        <StatCard
          icon={<MessageSquare size={20} />}
          title="Open Complaints"
          value={openComplaints}
          subtitle="Requests needing attention"
          onClick={() =>
            onNavigate("Complaints")
          }
        />

        <StatCard
          icon={<Users size={20} />}
          title="Visitors Today"
          value={visitorsToday}
          subtitle="Registered community visits"
          onClick={() =>
            onNavigate("Visitors")
          }
        />

        <StatCard
          icon={<Building2 size={20} />}
          title="Active Bookings"
          value={activeBookings}
          subtitle="Facilities booked today"
          onClick={() =>
            onNavigate("Facilities")
          }
        />

        <StatCard
          icon={<Activity size={20} />}
          title="Community Health"
          value="92%"
          subtitle="Excellent engagement"
        />
      </div>

      <div className="dashboard-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                LATEST UPDATES
              </span>

              <h3>
                Community Announcements
              </h3>
            </div>

            <button
              type="button"
              className="text-btn"
              onClick={() =>
                onNavigate("Announcements")
              }
            >
              View all
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="announcement-list">
            {defaultAnnouncements
              .slice(0, 3)
              .map((item) => (
                <div
                  className="announcement-row"
                  key={item.id}
                >
                  <div className="announcement-icon">
                    <Bell size={18} />
                  </div>

                  <div className="announcement-copy">
                    <div className="announcement-title-line">
                      <strong>{item.title}</strong>

                      <span className="category-pill">
                        {item.category}
                      </span>
                    </div>

                    <span className="announcement-description">
                      {item.content}
                    </span>

                    <small>
                      {formatLongDate(item.date)}
                    </small>
                  </div>
                </div>
              ))}
          </div>
        </section>

        <section className="content-card quick-actions-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                COMMON TASKS
              </span>

              <h3>
                Quick Actions
              </h3>
            </div>
          </div>

          <div className="quick-action-grid">
            <QuickAction
              icon={<MessageSquare size={20} />}
              label="Raise Complaint"
              onClick={() =>
                onNavigate("Complaints")
              }
            />

            <QuickAction
              icon={<Users size={20} />}
              label="Add Visitor"
              onClick={() =>
                onNavigate("Visitors")
              }
            />

            <QuickAction
              icon={<Building2 size={20} />}
              label="Book Facility"
              onClick={() =>
                onNavigate("Facilities")
              }
            />

            <QuickAction
              icon={<CalendarDays size={20} />}
              label="View Events"
              onClick={() =>
                onNavigate("Events")
              }
            />
          </div>
        </section>
      </div>

      <div className="dashboard-feature-grid">
        <section className="maintenance-card">
          <div className="maintenance-top">
            <div className="maintenance-icon">
              <Building2 size={21} />
            </div>

            <span className="payment-status">
              Payment due
            </span>
          </div>

          <div className="maintenance-content">
            <span className="eyebrow">
              MAINTENANCE
            </span>

            <h3>
              September Maintenance
            </h3>

            <p>
              Monthly community maintenance for
              Apartment A-204.
            </p>

            <div className="maintenance-amount">
              <span>Amount due</span>

              <strong>
                ₹4,850
              </strong>
            </div>

            <div className="maintenance-due">
              <div>
                <CalendarDays size={15} />

                <span>
                  Due on
                  <strong>
                    15 September 2026
                  </strong>
                </span>
              </div>

              <span className="days-left">
                5 days left
              </span>
            </div>

            <button
              type="button"
              className="payment-btn"
              onClick={() =>
                alert(
                  "Payment gateway demo — ready for backend integration.",
                )
              }
            >
              Pay maintenance
              <ArrowRight size={16} />
            </button>
          </div>
        </section>

        <section className="upcoming-highlight">
          <div className="highlight-header">
            <div>
              <span className="eyebrow">
                NEXT UP
              </span>

              <h3>
                Upcoming Event
              </h3>
            </div>

            <CalendarDays size={20} />
          </div>

          <div className="highlight-event">
            <div className="highlight-date">
              <strong>
                {upcomingEventDate.day}
              </strong>

              <span>
                {upcomingEventDate.month}
              </span>
            </div>

            <div className="highlight-event-copy">
              <span className="event-category">
                {upcomingEvent.category}
              </span>

              <h4>
                {upcomingEvent.title}
              </h4>

              <p>
                {upcomingEvent.description}
              </p>
            </div>
          </div>

          <div className="highlight-event-meta">
            <span>
              <CalendarDays size={15} />
              {formatLongDate(
                upcomingEvent.date,
              )}
            </span>

            <span>
              <Clock3 size={15} />
              {upcomingEvent.time}
            </span>

            <span>
              <Home size={15} />
              {upcomingEvent.location}
            </span>
          </div>

          <button
            type="button"
            className="highlight-link"
            onClick={() =>
              onNavigate("Events")
            }
          >
            View all events
            <ArrowRight size={15} />
          </button>
        </section>
      </div>

      <div className="dashboard-grid bottom">
        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                RECENT ACTIVITY
              </span>

              <h3>
                Your Activity
              </h3>
            </div>

            <Activity size={19} />
          </div>

          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-icon purple">
                <MessageSquare size={17} />
              </div>

              <div className="activity-copy">
                <strong>
                  Complaint updated
                </strong>

                <span>
                  Water leakage in Block A is now
                  <b> In Progress</b>.
                </span>

                <small>
                  Today · 10:20 AM
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon blue">
                <Users size={17} />
              </div>

              <div className="activity-copy">
                <strong>
                  Visitor approved
                </strong>

                <span>
                  Arjun Kumar has been approved
                  for entry.
                </span>

                <small>
                  Today · 09:45 AM
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon green">
                <Building2 size={17} />
              </div>

              <div className="activity-copy">
                <strong>
                  Facility booked
                </strong>

                <span>
                  Clubhouse booked for 06:00 PM.
                </span>

                <small>
                  Today · 08:30 AM
                </small>
              </div>
            </div>

            <div className="activity-item">
              <div className="activity-icon orange">
                <CalendarDays size={17} />
              </div>

              <div className="activity-copy">
                <strong>
                  Event reminder
                </strong>

                <span>
                  Community Sports Day is coming
                  up on 14 September.
                </span>

                <small>
                  Yesterday · 07:15 PM
                </small>
              </div>
            </div>
          </div>
        </section>

        <section className="content-card community-health-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                COMMUNITY INSIGHT
              </span>

              <h3>
                Community Pulse
              </h3>
            </div>

            <Activity size={20} />
          </div>

          <div className="health-score">
            <div className="health-circle">
              <div>
                <strong>92%</strong>
                <span>Healthy</span>
              </div>
            </div>

            <div className="health-copy">
              <strong>
                Excellent community engagement
              </strong>

              <p>
                Residents are actively participating
                in events, bookings and community
                activities this week.
              </p>

              <div className="health-bar">
                <span
                  style={{
                    width: "92%",
                  }}
                />
              </div>

              <div className="health-metrics">
                <div>
                  <strong>
                    84%
                  </strong>

                  <span>
                    Event participation
                  </span>
                </div>

                <div>
                  <strong>
                    91%
                  </strong>

                  <span>
                    Service resolution
                  </span>
                </div>

                <div>
                  <strong>
                    96%
                  </strong>

                  <span>
                    Facility uptime
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="content-card highlights-section">
        <div className="section-header">
          <div>
            <span className="eyebrow">
              COMMUNITY AT A GLANCE
            </span>

            <h3>
              This Week
            </h3>
          </div>

          <span className="week-label">
            10–16 September 2026
          </span>
        </div>

        <div className="highlights-grid">
          <HighlightStat
            icon={<CalendarDays size={19} />}
            value="06"
            label="Community events"
            note="+2 this week"
            tone="purple"
          />

          <HighlightStat
            icon={<Users size={19} />}
            value="184"
            label="Resident participants"
            note="74% participation"
            tone="blue"
          />

          <HighlightStat
            icon={<Building2 size={19} />}
            value="78%"
            label="Facility utilisation"
            note="Healthy usage"
            tone="green"
          />

          <HighlightStat
            icon={<CheckCircle2 size={19} />}
            value="91%"
            label="Requests resolved"
            note="+8% this month"
            tone="orange"
          />
        </div>
      </section>
    </div>
  );
}

function HighlightStat({
  icon,
  value,
  label,
  note,
  tone,
}: {
  icon: ReactNode;
  value: string;
  label: string;
  note: string;
  tone: string;
}) {
  return (
    <div className="highlight-stat">
      <div
        className={`highlight-stat-icon ${tone}`}
      >
        {icon}
      </div>

      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

      <small>{note}</small>
    </div>
  );
}

function StatCard({
  icon,
  title,
  value,
  subtitle,
  onClick,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
  subtitle: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className={`stat-card ${
        onClick ? "clickable" : ""
      }`}
      onClick={onClick}
    >
      <div className="stat-icon">
        {icon}
      </div>

      <div className="stat-copy">
        <span>{title}</span>

        <strong>{value}</strong>

        <small>{subtitle}</small>
      </div>

      {onClick && (
        <ChevronRight
          className="stat-arrow"
          size={18}
        />
      )}
    </button>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      className="quick-action"
      onClick={onClick}
    >
      <div className="quick-action-icon">
        {icon}
      </div>

      <span>{label}</span>

      <ChevronRight size={15} />
    </button>
  );
}

/* =========================================================
   ANNOUNCEMENTS
========================================================= */

function PageHeading({
  eyebrow,
  title,
  description,
  icon,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}) {
  return (
    <div className="page-heading-row">
      <div>
        <span className="eyebrow">
          {eyebrow}
        </span>

        <h1>{title}</h1>

        <p>{description}</p>
      </div>

      <div className="page-heading-right">
        {action}

        {icon && (
          <div className="page-heading-icon">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

function AnnouncementsPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(
        defaultAnnouncements.map(
          (item) => item.category,
        ),
      ),
    ),
  ];

  const filtered = useMemo(() => {
    return defaultAnnouncements.filter((item) => {
      const term = search.toLowerCase();

      const matchesSearch =
        item.title.toLowerCase().includes(term) ||
        item.content.toLowerCase().includes(term);

      const matchesCategory =
        category === "All" ||
        item.category === category;

      return (
        matchesSearch && matchesCategory
      );
    });
  }, [search, category]);

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="COMMUNITY UPDATES"
        title="Announcements"
        description="Important information shared by the community."
        icon={<Bell size={23} />}
      />

      <div className="toolbar">
        <div className="search-box">
          <Search size={17} />

          <input
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
            placeholder="Search announcements..."
          />
        </div>

        <div className="filter-pills">
          {categories.map((item) => (
            <button
              key={item}
              type="button"
              className={
                category === item ? "active" : ""
              }
              onClick={() =>
                setCategory(item)
              }
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="announcement-grid">
        {filtered.map((item) => (
          <article
            className="announcement-card"
            key={item.id}
          >
            <div className="announcement-card-top">
              <div className="announcement-icon large">
                <Bell size={20} />
              </div>

              <span className="category-pill">
                {item.category}
              </span>
            </div>

            <div className="announcement-card-body">
              <h3>{item.title}</h3>

              <p>{item.content}</p>
            </div>

            <div className="announcement-date">
              <CalendarDays size={15} />
              {formatLongDate(item.date)}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* =========================================================
   COMPLAINTS
========================================================= */

function ComplaintsPage() {
  const [complaints, setComplaints] =
    useState<Complaint[]>(
      loadStorage(
        STORAGE_KEYS.complaints,
        defaultComplaints,
      ),
    );

  const [showForm, setShowForm] =
    useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] =
    useState("");
  const [category, setCategory] =
    useState("Maintenance");

  const addComplaint = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (!title.trim() || !description.trim()) {
      return;
    }

    const normalizedDescription =
      description.toLowerCase();

    const smartCategory =
      normalizedDescription.includes("water")
        ? "Plumbing"
        : normalizedDescription.includes(
              "light",
            ) ||
            normalizedDescription.includes(
              "electric",
            )
          ? "Electrical"
          : category;

    const priority: ComplaintPriority =
      normalizedDescription.includes(
        "urgent",
      ) ||
      normalizedDescription.includes(
        "leak",
      )
        ? "High"
        : "Medium";

    const complaint: Complaint = {
      id: Date.now(),
      title,
      description,
      category: smartCategory,
      priority,
      status: "Open",
      createdAt: CURRENT_DATE,
    };

    const updated = [
      complaint,
      ...complaints,
    ];

    setComplaints(updated);

    saveStorage(
      STORAGE_KEYS.complaints,
      updated,
    );

    setTitle("");
    setDescription("");
    setCategory("Maintenance");
    setShowForm(false);
  };

  const openCount = complaints.filter(
    (item) => item.status === "Open",
  ).length;

  const inProgressCount = complaints.filter(
    (item) => item.status === "In Progress",
  ).length;

  const resolvedCount = complaints.filter(
    (item) => item.status === "Resolved",
  ).length;

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="SERVICE REQUESTS"
        title="Complaints"
        description="Raise issues, track progress and get faster resolutions."
        icon={<MessageSquare size={23} />}
        action={
          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              setShowForm((value) => !value)
            }
          >
            <Plus size={17} />
            New complaint
          </button>
        }
      />

      <div className="summary-strip">
        <div>
          <span>Open</span>
          <strong>{openCount}</strong>
          <small>Needs attention</small>
        </div>

        <div>
          <span>In progress</span>
          <strong>{inProgressCount}</strong>
          <small>Being handled</small>
        </div>

        <div>
          <span>Resolved</span>
          <strong>{resolvedCount}</strong>
          <small>Successfully closed</small>
        </div>
      </div>

      {showForm && (
        <form
          className="form-card"
          onSubmit={addComplaint}
        >
          <div className="form-card-heading">
            <div>
              <span className="eyebrow">
                CREATE REQUEST
              </span>

              <h3>
                Submit a complaint
              </h3>
            </div>

            <Sparkles size={20} />
          </div>

          <div className="form-grid">
            <label>
              Complaint title

              <input
                value={title}
                onChange={(event) =>
                  setTitle(event.target.value)
                }
                placeholder="Example: Water leakage in Block B"
              />
            </label>

            <label>
              Category

              <select
                value={category}
                onChange={(event) =>
                  setCategory(event.target.value)
                }
              >
                <option>
                  Maintenance
                </option>
                <option>
                  Plumbing
                </option>
                <option>
                  Electrical
                </option>
                <option>
                  Security
                </option>
                <option>
                  Cleanliness
                </option>
                <option>
                  Other
                </option>
              </select>
            </label>

            <label className="full">
              Description

              <textarea
                rows={4}
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Describe the issue clearly..."
              />
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Submit complaint
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
      )}

      <div className="complaint-list">
        {complaints.map((complaint) => (
          <article
            className="complaint-card"
            key={complaint.id}
          >
            <div className="complaint-main">
              <div className="complaint-title-row">
                <h3>
                  {complaint.title}
                </h3>

                <PriorityBadge
                  priority={
                    complaint.priority
                  }
                />
              </div>

              <p>
                {complaint.description}
              </p>

              <div className="complaint-meta">
                <span>
                  {complaint.category}
                </span>

                <span>•</span>

                <span>
                  {formatLongDate(
                    complaint.createdAt,
                  )}
                </span>
              </div>
            </div>

            <StatusBadge
              status={complaint.status}
            />
          </article>
        ))}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: ComplaintStatus;
}) {
  return (
    <span
      className={`status-badge ${status
        .replaceAll(" ", "-")
        .toLowerCase()}`}
    >
      {status === "Resolved" && (
        <CheckCircle2 size={14} />
      )}

      {status === "In Progress" && (
        <Clock3 size={14} />
      )}

      {status === "Open" && (
        <AlertTriangle size={14} />
      )}

      {status}
    </span>
  );
}

function PriorityBadge({
  priority,
}: {
  priority: ComplaintPriority;
}) {
  return (
    <span
      className={`priority-badge ${priority.toLowerCase()}`}
    >
      {priority}
    </span>
  );
}

/* =========================================================
   VISITORS
========================================================= */

function VisitorsPage() {
  const [visitors, setVisitors] =
    useState<Visitor[]>(
      loadStorage(
        STORAGE_KEYS.visitors,
        defaultVisitors,
      ),
    );

  const [showForm, setShowForm] =
    useState(false);

  const [name, setName] = useState("");
  const [purpose, setPurpose] =
    useState("Guest");
  const [phone, setPhone] = useState("");
  const [time, setTime] =
    useState("06:00 PM");

  const addVisitor = (
    event: FormEvent,
  ) => {
    event.preventDefault();

    if (
      !name.trim() ||
      !phone.trim()
    ) {
      return;
    }

    const visitor: Visitor = {
      id: Date.now(),
      name,
      purpose,
      phone,
      date: CURRENT_DATE,
      time,
      status: "Pending",
    };

    const updated = [
      visitor,
      ...visitors,
    ];

    setVisitors(updated);

    saveStorage(
      STORAGE_KEYS.visitors,
      updated,
    );

    setName("");
    setPhone("");
    setPurpose("Guest");
    setTime("06:00 PM");
    setShowForm(false);
  };

  const updateStatus = (
    id: number,
    status: VisitorStatus,
  ) => {
    const updated = visitors.map(
      (visitor) =>
        visitor.id === id
          ? {
              ...visitor,
              status,
            }
          : visitor,
    );

    setVisitors(updated);

    saveStorage(
      STORAGE_KEYS.visitors,
      updated,
    );
  };

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="ACCESS MANAGEMENT"
        title="Visitors"
        description="Register and manage guest visits securely."
        icon={<Users size={23} />}
        action={
          <button
            type="button"
            className="primary-btn"
            onClick={() =>
              setShowForm((value) => !value)
            }
          >
            <Plus size={17} />
            Add visitor
          </button>
        }
      />

      {showForm && (
        <form
          className="form-card"
          onSubmit={addVisitor}
        >
          <div className="form-card-heading">
            <div>
              <span className="eyebrow">
                VISITOR ENTRY
              </span>

              <h3>
                Register a visitor
              </h3>
            </div>

            <Users size={20} />
          </div>

          <div className="form-grid">
            <label>
              Visitor name

              <input
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="Enter visitor name"
              />
            </label>

            <label>
              Purpose

              <select
                value={purpose}
                onChange={(event) =>
                  setPurpose(event.target.value)
                }
              >
                <option>Guest</option>
                <option>Delivery</option>
                <option>Maintenance</option>
                <option>Service</option>
                <option>Other</option>
              </select>
            </label>

            <label>
              Phone

              <input
                value={phone}
                onChange={(event) =>
                  setPhone(event.target.value)
                }
                placeholder="10-digit mobile number"
              />
            </label>

            <label>
              Expected time

              <select
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              >
                <option>
                  10:00 AM
                </option>

                <option>
                  12:00 PM
                </option>

                <option>
                  02:00 PM
                </option>

                <option>
                  04:00 PM
                </option>

                <option>
                  06:00 PM
                </option>

                <option>
                  08:00 PM
                </option>
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button
              type="button"
              className="secondary-btn"
              onClick={() =>
                setShowForm(false)
              }
            >
              Cancel
            </button>

            <button
              type="submit"
              className="primary-btn"
            >
              Register visitor
              <ArrowRight size={17} />
            </button>
          </div>
        </form>
      )}

      <div className="visitor-grid">
        {visitors.map((visitor) => (
          <article
            className="visitor-card"
            key={visitor.id}
          >
            <div className="visitor-card-top">
              <div className="visitor-avatar big">
                {visitor.name.charAt(0)}
              </div>

              <VisitorStatusBadge
                status={visitor.status}
              />
            </div>

            <h3>
              {visitor.name}
            </h3>

            <div className="visitor-info">
              <span>
                <UserRound size={15} />
                {visitor.purpose}
              </span>

              <span>
                <Phone size={15} />
                {visitor.phone}
              </span>

              <span>
                <CalendarDays size={15} />
                {formatLongDate(
                  visitor.date,
                )}
              </span>

              <span>
                <Clock3 size={15} />
                {visitor.time}
              </span>
            </div>

            <div className="visitor-card-actions">
              {visitor.status ===
                "Pending" && (
                <>
                  <button
                    type="button"
                    className="approve-btn"
                    onClick={() =>
                      updateStatus(
                        visitor.id,
                        "Approved",
                      )
                    }
                  >
                    <Check size={15} />
                    Approve
                  </button>

                  <button
                    type="button"
                    className="reject-btn"
                    onClick={() =>
                      updateStatus(
                        visitor.id,
                        "Rejected",
                      )
                    }
                  >
                    <X size={15} />
                    Reject
                  </button>
                </>
              )}

              {visitor.status ===
                "Approved" && (
                <button
                  type="button"
                  className="check-in-btn"
                  onClick={() =>
                    updateStatus(
                      visitor.id,
                      "Checked In",
                    )
                  }
                >
                  Check in
                </button>
              )}

              {visitor.status ===
                "Checked In" && (
                <button
                  type="button"
                  className="check-out-btn"
                  onClick={() =>
                    updateStatus(
                      visitor.id,
                      "Checked Out",
                    )
                  }
                >
                  Check out
                </button>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VisitorStatusBadge({
  status,
}: {
  status: VisitorStatus;
}) {
  return (
    <span
      className={`visitor-status ${status
        .replaceAll(" ", "-")
        .toLowerCase()}`}
    >
      {status}
    </span>
  );
}

/* =========================================================
   FACILITIES
========================================================= */

function FacilitiesPage() {
  const [bookings, setBookings] =
    useState<Booking[]>(
      loadStorage(
        STORAGE_KEYS.bookings,
        defaultBookings,
      ),
    );

  const [selectedFacility, setSelectedFacility] =
    useState("Clubhouse");

  const [selectedDate, setSelectedDate] =
    useState(CURRENT_DATE);

  const [selectedTime, setSelectedTime] =
    useState("06:00 PM");

  const slots = [
    "10:00 AM",
    "12:00 PM",
    "02:00 PM",
    "04:00 PM",
    "06:00 PM",
    "08:00 PM",
  ];

  const bookFacility = () => {
    const alreadyBooked =
      bookings.some(
        (booking) =>
          booking.status ===
            "Confirmed" &&
          booking.facility ===
            selectedFacility &&
          booking.date === selectedDate &&
          booking.time === selectedTime,
      );

    if (alreadyBooked) {
      alert(
        "This facility is already booked for the selected time.",
      );
      return;
    }

    const booking: Booking = {
      id: Date.now(),
      facility: selectedFacility,
      date: selectedDate,
      time: selectedTime,
      status: "Confirmed",
    };

    const updated = [
      booking,
      ...bookings,
    ];

    setBookings(updated);

    saveStorage(
      STORAGE_KEYS.bookings,
      updated,
    );
  };

  const cancelBooking = (
    id: number,
  ) => {
    const updated = bookings.map(
      (booking) =>
        booking.id === id
          ? {
              ...booking,
              status:
                "Cancelled" as const,
            }
          : booking,
    );

    setBookings(updated);

    saveStorage(
      STORAGE_KEYS.bookings,
      updated,
    );
  };

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Confirmed",
    );

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="COMMUNITY SPACES"
        title="Facilities"
        description="Book shared spaces in a few simple steps."
        icon={<Building2 size={23} />}
      />

      <div className="facility-grid">
        {facilities.map((facility) => {
          const Icon = facility.icon;

          return (
            <button
              type="button"
              key={facility.name}
              className={`facility-card ${
                selectedFacility ===
                facility.name
                  ? "selected"
                  : ""
              }`}
              onClick={() =>
                setSelectedFacility(
                  facility.name,
                )
              }
            >
              <div className="facility-icon">
                <Icon size={22} />
              </div>

              <h3>
                {facility.name}
              </h3>

              <p>
                {facility.description}
              </p>

              <div className="facility-footer">
                <span>
                  Capacity{" "}
                  <strong>
                    {facility.capacity}
                  </strong>
                </span>

                <ChevronRight size={16} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="booking-layout">
        <section className="form-card booking-panel">
          <div className="form-card-heading">
            <div>
              <span className="eyebrow">
                NEW BOOKING
              </span>

              <h3>
                {selectedFacility}
              </h3>
            </div>

            <CalendarDays size={20} />
          </div>

          <div className="form-grid">
            <label>
              Booking date

              <input
                value={selectedDate}
                onChange={(event) =>
                  setSelectedDate(
                    event.target.value,
                  )
                }
              />
            </label>

            <label>
              Time slot

              <select
                value={selectedTime}
                onChange={(event) =>
                  setSelectedTime(
                    event.target.value,
                  )
                }
              >
                {slots.map((slot) => (
                  <option key={slot}>
                    {slot}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <button
            type="button"
            className="primary-btn booking-confirm"
            onClick={bookFacility}
          >
            Confirm booking
            <Check size={17} />
          </button>
        </section>

        <section className="content-card my-bookings">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                YOUR ACTIVITY
              </span>

              <h3>
                My bookings
              </h3>
            </div>

            <span className="count-pill">
              {activeBookings.length} active
            </span>
          </div>

          <div className="booking-list">
            {activeBookings.map(
              (booking) => (
                <div
                  className="booking-row"
                  key={booking.id}
                >
                  <div className="booking-icon">
                    <Building2 size={17} />
                  </div>

                  <div className="booking-copy">
                    <strong>
                      {booking.facility}
                    </strong>

                    <span>
                      {formatLongDate(
                        booking.date,
                      )}

                      <i />

                      {booking.time}
                    </span>
                  </div>

                  <button
                    type="button"
                    className="cancel-link"
                    onClick={() =>
                      cancelBooking(
                        booking.id,
                      )
                    }
                  >
                    Cancel
                  </button>
                </div>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   EVENTS
========================================================= */

function EventsPage() {
  const [events, setEvents] =
    useState<CommunityEvent[]>(
      loadStorage(
        STORAGE_KEYS.events,
        defaultEvents,
      ),
    );

  const [category, setCategory] =
    useState("All");

  const categories = [
    "All",
    ...Array.from(
      new Set(
        events.map(
          (event) => event.category,
        ),
      ),
    ),
  ];

  const filteredEvents =
    events.filter(
      (event) =>
        category === "All" ||
        event.category === category,
    );

  const registeredEvents =
    loadStorage<number[]>(
      "horizon-event-registrations",
      [],
    );

  const toggleRegistration = (
    id: number,
  ) => {
    const registered =
      loadStorage<number[]>(
        "horizon-event-registrations",
        [],
      );

    const isRegistered =
      registered.includes(id);

    const nextRegistered =
      isRegistered
        ? registered.filter(
            (eventId) =>
              eventId !== id,
          )
        : [...registered, id];

    const updatedEvents =
      events.map((event) =>
        event.id === id
          ? {
              ...event,
              attendees: isRegistered
                ? Math.max(
                    0,
                    event.attendees - 1,
                  )
                : event.attendees + 1,
            }
          : event,
      );

    setEvents(updatedEvents);

    saveStorage(
      STORAGE_KEYS.events,
      updatedEvents,
    );

    saveStorage(
      "horizon-event-registrations",
      nextRegistered,
    );
  };

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="COMMUNITY ENGAGEMENT"
        title="Events"
        description="Discover what is happening around your community."
        icon={<CalendarDays size={23} />}
      />

      <div className="filter-pills large">
        {categories.map((item) => (
          <button
            type="button"
            className={
              category === item
                ? "active"
                : ""
            }
            key={item}
            onClick={() =>
              setCategory(item)
            }
          >
            {item}
          </button>
        ))}
      </div>

      <div className="event-grid">
        {filteredEvents.map(
          (event) => {
            const registered =
              registeredEvents.includes(
                event.id,
              );

            const { day, month } =
              formatEventDay(
                event.date,
              );

            return (
              <article
                className="event-card"
                key={event.id}
              >
                <div className="event-card-top">
                  <div className="event-date-large">
                    <strong>{day}</strong>
                    <span>{month}</span>
                  </div>

                  <span className="category-pill">
                    {event.category}
                  </span>
                </div>

                <h3>
                  {event.title}
                </h3>

                <p>
                  {event.description}
                </p>

                <div className="event-info">
                  <span>
                    <CalendarDays
                      size={15}
                    />

                    {formatLongDate(
                      event.date,
                    )}
                  </span>

                  <span>
                    <Clock3 size={15} />
                    {event.time}
                  </span>

                  <span>
                    <Building2
                      size={15}
                    />
                    {event.location}
                  </span>

                  <span>
                    <Users size={15} />
                    {event.attendees}{" "}
                    attending
                  </span>
                </div>

                <button
                  type="button"
                  className={
                    registered
                      ? "secondary-btn full-btn"
                      : "primary-btn full-btn"
                  }
                  onClick={() =>
                    toggleRegistration(
                      event.id,
                    )
                  }
                >
                  {registered
                    ? "Cancel registration"
                    : "Register for event"}

                  {registered ? (
                    <X size={16} />
                  ) : (
                    <ArrowRight
                      size={16}
                    />
                  )}
                </button>
              </article>
            );
          },
        )}
      </div>
    </div>
  );
}

/* =========================================================
   POLLS
========================================================= */

function PollsPage() {
  const [polls, setPolls] =
    useState<Poll[]>(
      loadStorage(
        STORAGE_KEYS.polls,
        defaultPolls,
      ),
    );

  const [
    selectedOptions,
    setSelectedOptions,
  ] = useState<
    Record<number, number>
  >({});

  const [votedPolls, setVotedPolls] =
    useState<number[]>(
      loadStorage(
        STORAGE_KEYS.votedPolls,
        [],
      ),
    );

  const vote = (pollId: number) => {
    const optionIndex =
      selectedOptions[pollId];

    if (optionIndex === undefined) {
      return;
    }

    if (
      votedPolls.includes(pollId)
    ) {
      return;
    }

    const updatedPolls =
      polls.map((poll) => {
        if (poll.id !== pollId) {
          return poll;
        }

        const votes = [
          ...poll.votes,
        ];

        votes[optionIndex] += 1;

        return {
          ...poll,
          votes,
        };
      });

    const updatedVoted = [
      ...votedPolls,
      pollId,
    ];

    setPolls(updatedPolls);

    setVotedPolls(
      updatedVoted,
    );

    saveStorage(
      STORAGE_KEYS.polls,
      updatedPolls,
    );

    saveStorage(
      STORAGE_KEYS.votedPolls,
      updatedVoted,
    );
  };

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="COMMUNITY VOICE"
        title="Polls"
        description="Share your opinion and help shape community decisions."
        icon={<PieChart size={23} />}
      />

      <div className="poll-grid">
        {polls.map((poll) => {
          const totalVotes =
            poll.votes.reduce(
              (sum, value) =>
                sum + value,
              0,
            );

          const voted =
            votedPolls.includes(
              poll.id,
            );

          return (
            <article
              className="poll-card"
              key={poll.id}
            >
              <div className="poll-header">
                <span className="eyebrow">
                  COMMUNITY POLL
                </span>

                {voted && (
                  <span className="voted-tag">
                    <Check size={13} />
                    Voted
                  </span>
                )}
              </div>

              <h3>
                {poll.question}
              </h3>

              <div className="poll-options">
                {poll.options.map(
                  (
                    option,
                    index,
                  ) => {
                    const percentage =
                      totalVotes ===
                      0
                        ? 0
                        : Math.round(
                            (poll
                              .votes[
                              index
                            ] /
                              totalVotes) *
                              100,
                          );

                    return (
                      <label
                        key={option}
                        className={`poll-option ${
                          selectedOptions[
                            poll.id
                          ] ===
                          index
                            ? "selected"
                            : ""
                        } ${
                          voted
                            ? "results"
                            : ""
                        }`}
                      >
                        {!voted && (
                          <input
                            type="radio"
                            name={`poll-${poll.id}`}
                            checked={
                              selectedOptions[
                                poll.id
                              ] ===
                              index
                            }
                            onChange={() =>
                              setSelectedOptions(
                                (
                                  current,
                                ) => ({
                                  ...current,
                                  [poll.id]:
                                    index,
                                }),
                              )
                            }
                          />
                        )}

                        <div className="poll-option-copy">
                          <span>
                            {option}
                          </span>

                          {voted && (
                            <strong>
                              {
                                percentage
                              }
                              %
                            </strong>
                          )}
                        </div>

                        {voted && (
                          <div className="poll-progress">
                            <span
                              style={{
                                width: `${percentage}%`,
                              }}
                            />
                          </div>
                        )}
                      </label>
                    );
                  },
                )}
              </div>

              <div className="poll-footer">
                <span>
                  {totalVotes} total
                  votes
                </span>

                {!voted && (
                  <button
                    type="button"
                    className="primary-btn"
                    onClick={() =>
                      vote(poll.id)
                    }
                    disabled={
                      selectedOptions[
                        poll.id
                      ] === undefined
                    }
                  >
                    Submit vote
                    <Check size={16} />
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* =========================================================
   EMERGENCY
========================================================= */

function EmergencyPage() {
  const emergencyContacts = [
    {
      title: "Security Desk",
      number: "+91 98765 43210",
      description:
        "24/7 community security assistance.",
      icon: ShieldAlert,
    },
    {
      title: "Emergency Services",
      number: "112",
      description:
        "National emergency response number.",
      icon: Phone,
    },
    {
      title: "Association Office",
      number: "+91 90000 12345",
      description:
        "Community administration support.",
      icon: Building2,
    },
  ];

  return (
    <div className="section-page">
      <PageHeading
        eyebrow="SAFETY & SUPPORT"
        title="Emergency"
        description="Important contacts available whenever you need them."
        icon={<AlertTriangle size={23} />}
      />

      <div className="emergency-banner">
        <div className="emergency-banner-icon">
          <ShieldAlert size={27} />
        </div>

        <div className="emergency-banner-copy">
          <span className="eyebrow">
            EMERGENCY ASSISTANCE
          </span>

          <h2>
            Need immediate help?
          </h2>

          <p>
            For life-threatening situations,
            contact emergency services
            immediately.
          </p>
        </div>

        <a
          href="tel:112"
          className="emergency-call"
        >
          Call 112
          <Phone size={17} />
        </a>
      </div>

      <div className="emergency-grid">
        {emergencyContacts.map(
          (contact) => {
            const Icon = contact.icon;

            return (
              <article
                className="emergency-card"
                key={contact.title}
              >
                <div className="emergency-icon">
                  <Icon size={22} />
                </div>

                <h3>
                  {contact.title}
                </h3>

                <p>
                  {contact.description}
                </p>

                <a
                  href={`tel:${contact.number.replace(
                    /\s+/g,
                    "",
                  )}`}
                  className="emergency-number"
                >
                  <Phone size={16} />
                  {contact.number}
                </a>
              </article>
            );
          },
        )}
      </div>

      <div className="emergency-note">
        <AlertTriangle size={18} />

        <span>
          Keep emergency contacts accessible
          and provide your block and apartment
          number when calling the security desk.
        </span>
      </div>
    </div>
  );
}

/* =========================================================
   ADMIN DASHBOARD
========================================================= */

function AdminDashboardPage() {
  const complaints = loadStorage<Complaint[]>(
    STORAGE_KEYS.complaints,
    defaultComplaints,
  );

  const visitors = loadStorage<Visitor[]>(
    STORAGE_KEYS.visitors,
    defaultVisitors,
  );

  const bookings = loadStorage<Booking[]>(
    STORAGE_KEYS.bookings,
    defaultBookings,
  );

  const complaintData = [
    {
      name: "Open",
      value: complaints.filter(
        (item) =>
          item.status === "Open",
      ).length,
    },
    {
      name: "In Progress",
      value: complaints.filter(
        (item) =>
          item.status ===
          "In Progress",
      ).length,
    },
    {
      name: "Resolved",
      value: complaints.filter(
        (item) =>
          item.status ===
          "Resolved",
      ).length,
    },
  ];

  const visitorChart = [
    {
      day: "Mon",
      visitors: 18,
    },
    {
      day: "Tue",
      visitors: 25,
    },
    {
      day: "Wed",
      visitors: 21,
    },
    {
      day: "Thu",
      visitors: 30,
    },
    {
      day: "Fri",
      visitors: 28,
    },
    {
      day: "Sat",
      visitors: 42,
    },
    {
      day: "Sun",
      visitors: 36,
    },
  ];

  const facilityChart = [
    {
      name: "Gym",
      usage: 82,
    },
    {
      name: "Court",
      usage: 74,
    },
    {
      name: "Clubhouse",
      usage: 68,
    },
    {
      name: "Party Hall",
      usage: 55,
    },
  ];

  const visitorsToday =
    visitors.filter(
      (item) =>
        item.date === CURRENT_DATE,
    ).length;

  const activeBookings =
    bookings.filter(
      (booking) =>
        booking.status ===
        "Confirmed",
    ).length;

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div>
          <span className="eyebrow">
            ADMIN CONSOLE
          </span>

          <h1>
            Community Control Center
          </h1>

          <p>
            Monitor operations, identify
            trends and keep your community
            running smoothly.
          </p>
        </div>

        <div className="admin-live">
          <span className="status-dot" />
          Live system
        </div>
      </div>

      <div className="admin-stats-grid">
        <AdminStat
          icon={<Users size={20} />}
          title="Total Residents"
          value="248"
          note="+6 this month"
        />

        <AdminStat
          icon={
            <MessageSquare size={20} />
          }
          title="Open Complaints"
          value={
            complaints.filter(
              (item) =>
                item.status !==
                "Resolved",
            ).length
          }
          note="Needs attention"
        />

        <AdminStat
          icon={<Users size={20} />}
          title="Visitors Today"
          value={visitorsToday}
          note="Across all blocks"
        />

        <AdminStat
          icon={<Building2 size={20} />}
          title="Active Bookings"
          value={activeBookings}
          note="Current reservations"
        />
      </div>

      <div className="admin-analytics-grid">
        <section className="admin-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                SERVICE HEALTH
              </span>

              <h3>
                Complaint Status
              </h3>
            </div>

            <Activity size={19} />
          </div>

          <div className="donut-wrapper">
            <ResponsiveContainer
              width="100%"
              height={270}
            >
              <RechartsPieChart>
                <Pie
                  data={complaintData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={67}
                  outerRadius={95}
                  paddingAngle={4}
                >
                  {complaintData.map(
                    (_, index) => (
                      <Cell key={index} />
                    ),
                  )}
                </Pie>

                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>

            <div className="chart-center">
              <strong>
                {complaints.length}
              </strong>

              <span>
                Total requests
              </span>
            </div>
          </div>

          <div className="chart-legend">
            {complaintData.map(
              (item) => (
                <div
                  key={item.name}
                >
                  <span className="legend-dot" />

                  <span>
                    {item.name}
                  </span>

                  <strong>
                    {item.value}
                  </strong>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="admin-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                SECURITY ACTIVITY
              </span>

              <h3>
                Visitor Activity
              </h3>
            </div>

            <Users size={19} />
          </div>

          <div className="admin-chart">
            <ResponsiveContainer
              width="100%"
              height={315}
            >
              <BarChart
                data={visitorChart}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                />

                <XAxis dataKey="day" />

                <YAxis />

                <Tooltip />

                <Bar
                  dataKey="visitors"
                  radius={[
                    6,
                    6,
                    0,
                    0,
                  ]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </div>

      <div className="admin-lower-grid">
        <section className="admin-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                FACILITIES
              </span>

              <h3>
                Usage Overview
              </h3>
            </div>

            <Building2 size={19} />
          </div>

          <div className="facility-usage-list">
            {facilityChart.map(
              (item) => (
                <div
                  className="facility-usage"
                  key={item.name}
                >
                  <div className="facility-usage-top">
                    <span>
                      {item.name}
                    </span>

                    <strong>
                      {item.usage}%
                    </strong>
                  </div>

                  <div className="usage-bar">
                    <span
                      style={{
                        width: `${item.usage}%`,
                      }}
                    />
                  </div>
                </div>
              ),
            )}
          </div>
        </section>

        <section className="admin-panel">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                ACTION QUEUE
              </span>

              <h3>
                Latest Requests
              </h3>
            </div>

            <Clock3 size={19} />
          </div>

          <div className="admin-request-list">
            <AdminRequest
              icon={
                <MessageSquare
                  size={17}
                />
              }
              title="Water leakage in Block A"
              meta="High priority · 15 min ago"
              status="Review"
            />

            <AdminRequest
              icon={
                <Users size={17} />
              }
              title="New visitor approval"
              meta="Gate 2 · 21 min ago"
              status="Approve"
            />

            <AdminRequest
              icon={
                <Building2 size={17} />
              }
              title="Party Hall booking"
              meta="12 Sep · 38 min ago"
              status="Review"
            />

            <AdminRequest
              icon={
                <PackageCheck size={17} />
              }
              title="Parcel collection"
              meta="Security desk · 1 hr ago"
              status="View"
            />
          </div>
        </section>
      </div>

      <div className="admin-insight">
        <div className="admin-insight-icon">
          <Sparkles size={21} />
        </div>

        <div>
          <span className="eyebrow">
            COMMUNITY INTELLIGENCE
          </span>

          <h3>
            Community health is currently
            at 92%
          </h3>

          <p>
            High resident participation and
            improving complaint resolution
            indicate a healthy community
            environment.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminStat({
  icon,
  title,
  value,
  note,
}: {
  icon: ReactNode;
  title: string;
  value: string | number;
  note: string;
}) {
  return (
    <div className="admin-stat">
      <div className="admin-stat-icon">
        {icon}
      </div>

      <span>{title}</span>

      <strong>{value}</strong>

      <small>{note}</small>
    </div>
  );
}

function AdminRequest({
  icon,
  title,
  meta,
  status,
}: {
  icon: ReactNode;
  title: string;
  meta: string;
  status: string;
}) {
  return (
    <div className="admin-request">
      <div className="admin-request-icon">
        {icon}
      </div>

      <div className="admin-request-copy">
        <strong>
          {title}
        </strong>

        <span>
          {meta}
        </span>
      </div>

      <button type="button">
        {status}
      </button>
    </div>
  );
}

/* =========================================================
   SECURITY DASHBOARD
========================================================= */

function SecurityDashboardPage() {
  const [visitors, setVisitors] =
    useState<Visitor[]>(
      loadStorage(
        STORAGE_KEYS.visitors,
        defaultVisitors,
      ),
    );

  const pendingVisitors =
    visitors.filter(
      (item) =>
        item.status === "Pending",
    );

  const checkedInVisitors =
    visitors.filter(
      (item) =>
        item.status ===
        "Checked In",
    );

  const todayVisitors =
    visitors.filter(
      (item) =>
        item.date === CURRENT_DATE,
    );

  const updateVisitorStatus = (
    id: number,
    status: VisitorStatus,
  ) => {
    const updated = visitors.map(
      (visitor) =>
        visitor.id === id
          ? {
              ...visitor,
              status,
            }
          : visitor,
    );

    setVisitors(updated);

    saveStorage(
      STORAGE_KEYS.visitors,
      updated,
    );
  };

  return (
    <div className="security-dashboard">
      <div className="security-header">
        <div>
          <span className="eyebrow">
            SECURITY OPERATIONS
          </span>

          <h1>
            Gate & Visitor Control
          </h1>

          <p>
            Monitor visitor movement,
            approvals and community safety
            from one workspace.
          </p>
        </div>

        <div className="security-live">
          <Shield size={18} />
          Gate systems active
        </div>
      </div>

      <div className="stats-grid security-stats">
        <StatCard
          icon={<Clock3 size={20} />}
          title="Pending Approvals"
          value={
            pendingVisitors.length
          }
          subtitle="Waiting at gate"
        />

        <StatCard
          icon={<Users size={20} />}
          title="Visitors Today"
          value={
            todayVisitors.length
          }
          subtitle="Registered visits"
        />

        <StatCard
          icon={<DoorOpen size={20} />}
          title="Currently Inside"
          value={
            checkedInVisitors.length
          }
          subtitle="Active visitors"
        />

        <StatCard
          icon={
            <ShieldAlert size={20} />
          }
          title="Safety Status"
          value="Normal"
          subtitle="No active alerts"
        />
      </div>

      <div className="security-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                APPROVAL QUEUE
              </span>

              <h3>
                Pending Visitors
              </h3>
            </div>

            <Shield size={19} />
          </div>

          {pendingVisitors.length ===
          0 ? (
            <div className="empty-state">
              <CheckCircle2
                size={28}
              />

              <strong>
                No pending approvals
              </strong>

              <span>
                All visitor requests are
                cleared.
              </span>
            </div>
          ) : (
            <div className="security-visitor-list">
              {pendingVisitors.map(
                (visitor) => (
                  <div
                    className="security-visitor"
                    key={visitor.id}
                  >
                    <div className="visitor-avatar">
                      {visitor.name.charAt(
                        0,
                      )}
                    </div>

                    <div className="visitor-details">
                      <strong>
                        {visitor.name}
                      </strong>

                      <span>
                        {visitor.purpose}
                        <i />
                        {visitor.time}
                      </span>

                      <small>
                        {visitor.phone}
                      </small>
                    </div>

                    <div className="visitor-actions">
                      <button
                        type="button"
                        className="approve-btn"
                        onClick={() =>
                          updateVisitorStatus(
                            visitor.id,
                            "Approved",
                          )
                        }
                      >
                        <Check
                          size={15}
                        />
                        Approve
                      </button>

                      <button
                        type="button"
                        className="reject-btn"
                        onClick={() =>
                          updateVisitorStatus(
                            visitor.id,
                            "Rejected",
                          )
                        }
                      >
                        <X size={15} />
                        Reject
                      </button>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                LIVE GATE
              </span>

              <h3>
                Currently Inside
              </h3>
            </div>

            <DoorOpen size={19} />
          </div>

          {checkedInVisitors.length ===
          0 ? (
            <div className="empty-state">
              <Users size={28} />

              <strong>
                No active visitors
              </strong>

              <span>
                No visitors are currently
                checked in.
              </span>
            </div>
          ) : (
            <div className="security-visitor-list">
              {checkedInVisitors.map(
                (visitor) => (
                  <div
                    className="security-visitor"
                    key={visitor.id}
                  >
                    <div className="visitor-avatar">
                      {visitor.name.charAt(
                        0,
                      )}
                    </div>

                    <div className="visitor-details">
                      <strong>
                        {visitor.name}
                      </strong>

                      <span>
                        {visitor.purpose}
                      </span>

                      <small>
                        {visitor.phone}
                      </small>
                    </div>

                    <button
                      type="button"
                      className="check-out-btn"
                      onClick={() =>
                        updateVisitorStatus(
                          visitor.id,
                          "Checked Out",
                        )
                      }
                    >
                      Check out
                    </button>
                  </div>
                ),
              )}
            </div>
          )}
        </section>
      </div>

      <div className="security-bottom-grid">
        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                SECURITY TOOLS
              </span>

              <h3>
                Quick Access
              </h3>
            </div>
          </div>

          <div className="quick-action-grid">
            <QuickAction
              icon={<Search size={20} />}
              label="Resident Search"
            />

            <QuickAction
              icon={
                <PackageCheck
                  size={20}
                />
              }
              label="Parcel Log"
            />

            <QuickAction
              icon={<Phone size={20} />}
              label="Emergency Contacts"
            />

            <QuickAction
              icon={<Bell size={20} />}
              label="Gate Broadcast"
            />
          </div>
        </section>

        <section className="content-card">
          <div className="section-header">
            <div>
              <span className="eyebrow">
                SAFETY
              </span>

              <h3>
                Emergency Status
              </h3>
            </div>

            <ShieldAlert size={19} />
          </div>

          <div className="security-alert">
            <div className="alert-icon">
              <CheckCircle2 size={25} />
            </div>

            <div>
              <strong>
                All clear
              </strong>

              <span>
                No active security or
                emergency incidents
                reported.
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* =========================================================
   APP
========================================================= */

export default function App() {
  const [role, setRole] =
    useState<Role | null>(null);

  if (!role) {
    return (
      <LoginPage
        onLogin={setRole}
      />
    );
  }

  return (
    <ApplicationShell
      role={role}
      onLogout={() =>
        setRole(null)
      }
    />
  );
}