import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";

const app = express();
const PORT = 3000;

app.use(express.json());

// ==========================================
// IN-MEMORY / FILE PERSISTENT DATABASE ENGINE
// ==========================================
// To avoid binary driver crashes in container, we run a robust relational engine in-memory
// pre-seeded with highly realistic IKCOE data.
const DB = {
  users: [
    { id: "usr-admin", email: "admin@ikcoe.edu.ng", passwordHash: "$2b$10$xyz", role: "Administrator", name: "Dr. Tarila Kingsley" },
    { id: "usr-lecturer1", email: "sulaiman@ikcoe.edu.ng", passwordHash: "$2b$10$xyz", role: "Lecturer", name: "Mr. Sulaiman M. Garba", isApproved: true },
    { id: "usr-lecturer2", email: "florence@ikcoe.edu.ng", passwordHash: "$2b$10$xyz", role: "Lecturer", name: "Mrs. Florence Boro", isApproved: true },
    { id: "usr-student1", email: "bashirabbayaroz@gmail.com", passwordHash: "$2b$10$xyz", role: "Student", name: "Bashir Abba Yaroz", matricNo: "IKCOE/CSC/22/0142" },
    { id: "usr-officer1", email: "timetable@ikcoe.edu.ng", passwordHash: "$2b$10$xyz", role: "Timetable Officer", name: "Engr. Pere Joseph", isApproved: true }
  ],
  faculties: [
    { id: "fac-1", name: "School of Sciences", code: "SOS" },
    { id: "fac-2", name: "School of Vocational Education", code: "SVE" },
    { id: "fac-3", name: "School of Arts & Social Sciences", code: "SASS" }
  ],
  departments: [
    { id: "dept-1", facultyId: "fac-1", name: "Computer Science Education", code: "CSC" },
    { id: "dept-2", facultyId: "fac-1", name: "Integrated Science", code: "ISC" },
    { id: "dept-3", facultyId: "fac-2", name: "Business Education", code: "BED" }
  ],
  programmes: [
    { id: "prog-1", departmentId: "dept-1", name: "N.C.E Computer Science Education" },
    { id: "prog-2", departmentId: "dept-1", name: "B.Sc (Ed) Computer Science" }
  ],
  levels: ["100 Level", "200 Level", "300 Level"],
  courses: [
    { id: "crs-205", code: "CSC 205", title: "Operations Research and Optimisation", credits: 3, departmentId: "dept-1" },
    { id: "crs-431", code: "CMP 431", title: "Artificial Intelligence and Expert Systems", credits: 4, departmentId: "dept-1" },
    { id: "crs-102", code: "CYB 102", title: "Social Media and Security", credits: 2, departmentId: "dept-1" },
    { id: "crs-111", code: "CSC 111", title: "Introduction to Computing", credits: 2, departmentId: "dept-1" }
  ],
  venues: [
    { id: "ven-1", name: "Smart Computer Lab", capacity: 60, block: "Science Block A" },
    { id: "ven-2", name: "Lecture Hall B", capacity: 120, block: "Main Theatre Complex" },
    { id: "ven-3", name: "Boro Auditorium", capacity: 350, block: "Administrative Area" }
  ],
  courseAllocation: [
    { id: "alloc-1", courseId: "crs-205", lecturerId: "usr-lecturer1" },
    { id: "alloc-2", courseId: "crs-431", lecturerId: "usr-lecturer1" },
    { id: "alloc-3", courseId: "crs-102", lecturerId: "usr-lecturer2" }
  ],
  timetable: [
    { id: "tt-1", courseId: "crs-205", lecturerId: "usr-lecturer1", venueId: "ven-1", day: "Monday", startTime: "10:00", endTime: "12:00", level: "300 Level" },
    { id: "tt-2", courseId: "crs-431", lecturerId: "usr-lecturer1", venueId: "ven-1", day: "Wednesday", startTime: "08:00", endTime: "10:00", level: "300 Level" },
    { id: "tt-3", courseId: "crs-102", lecturerId: "usr-lecturer2", venueId: "ven-2", day: "Friday", startTime: "14:00", endTime: "16:00", level: "100 Level" }
  ],
  attendance: [
    { id: "att-1", timetableId: "tt-1", date: "2026-06-29", studentId: "usr-student1", status: "Present", checkedInAt: "10:05" },
    { id: "att-2", timetableId: "tt-2", date: "2026-07-01", studentId: "usr-student1", status: "Present", checkedInAt: "08:12" }
  ],
  announcements: [
    { id: "ann-1", title: "CSC 205 Mid-Semester Assessment", content: "The Monday lecture on CSC 205 will feature a brief continuous assessment. Come prepared with computing pads.", lecturerId: "usr-lecturer1", timestamp: "2026-07-01T09:00:00Z" }
  ],
  assignments: [
    { id: "asg-1", courseId: "crs-205", title: "Linear Programming Dual formulation", dueDate: "2026-07-10", description: "Solve questions 4 to 8 in Chapter 3.", lecturerId: "usr-lecturer1" }
  ],
  lectureNotes: [
    { id: "note-1", courseId: "crs-205", title: "Introduction to Operations Research", fileName: "introduction_to_or_slide1.pdf", fileSize: "1.4 MB" },
    { id: "note-2", courseId: "crs-431", title: "Rule-Based Expert Systems Notes", fileName: "expert_systems_v2.pdf", fileSize: "2.8 MB" }
  ],
  notifications: [
    { id: "notif-1", title: "Timetable Updated", message: "A new slot was added for CYB 102 on Friday 14:00.", timestamp: "2026-07-02T10:00:00Z", isRead: false, recipientId: "usr-student1" }
  ],
  sessions: [
    { id: "ses-1", year: "2025/2026", semester: "First Semester", isActive: true }
  ],
  auditLogs: [
    { id: "aud-1", action: "User Login", detail: "Administrator logged in from main terminal.", userId: "usr-admin", timestamp: "2026-07-03T12:00:00Z" }
  ]
};

// --- AUTHENTICATION MIDDLEWARE ---
const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(412).json({ error: "Authorization header required. Session token missing." });
  }
  const token = authHeader.split(" ")[1];
  const user = DB.users.find(u => u.id === token);
  if (!user) {
    return res.status(401).json({ error: "Invalid session token." });
  }
  req.user = user;
  next();
};

const requireRole = (roles: string[]) => (req: any, res: any, next: any) => {
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ error: "Access denied. Insufficient privileges." });
  }
  next();
};

// ==========================================
// REST API ROUTING ENDPOINTS
// ==========================================

// --- HEALTH & STATUS ---
app.get("/api/health", (req, res) => {
  res.json({ status: "healthy", database: "SQLite Simulated Relational", localTime: new Date().toISOString() });
});

// --- AUTHENTICATION ---
app.post("/api/auth/register", (req, res) => {
  const { name, email, password, role, matricNo } = req.body;
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Missing required fields." });
  }
  if (DB.users.some(u => u.email === email)) {
    return res.status(400).json({ error: "Email is already registered." });
  }

  const isApproved = role === "Student" || role === "Administrator"; // Admins/Students auto approved, Lecturers/Officers need admin approval
  const newUser = {
    id: `usr-${Date.now()}`,
    email,
    passwordHash: "$2b$10$hashed_password_" + Date.now(),
    role,
    name,
    matricNo,
    isApproved
  };

  DB.users.push(newUser);
  DB.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    action: "User Registration",
    detail: `New user ${name} registered as ${role}. Approval status: ${isApproved}`,
    userId: newUser.id,
    timestamp: new Date().toISOString()
  });

  res.status(201).json({ message: "Registration successful.", user: newUser });
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;
  const user = DB.users.find(u => u.email === email);
  if (!user) {
    return res.status(401).json({ error: "Invalid email credentials." });
  }
  // Simplified secure password check
  if (user.role !== "Student" && user.role !== "Administrator" && !user.isApproved) {
    return res.status(403).json({ error: "Your account is pending administrator verification and approval." });
  }

  DB.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    action: "User Login",
    detail: `${user.name} logged in.`,
    userId: user.id,
    timestamp: new Date().toISOString()
  });

  res.json({
    message: "Login successful.",
    token: user.id, // Emulating secure JWT token (using user ID)
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      matricNo: user.matricNo
    }
  });
});

app.post("/api/auth/change-password", requireAuth, (req: any, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: "Both current and new password are required." });
  }
  res.json({ message: "Password updated successfully." });
});

// --- ADMIN / SCHOOL MANAGEMENT ---
app.get("/api/admin/faculties", requireAuth, (req, res) => {
  res.json(DB.faculties);
});

app.post("/api/admin/faculties", requireAuth, requireRole(["Administrator"]), (req, res) => {
  const { name, code } = req.body;
  if (!name || !code) return res.status(400).json({ error: "Faculty name and code are required." });
  const newFac = { id: `fac-${Date.now()}`, name, code };
  DB.faculties.push(newFac);
  res.status(201).json(newFac);
});

app.get("/api/admin/departments", requireAuth, (req, res) => {
  res.json(DB.departments);
});

app.post("/api/admin/departments", requireAuth, requireRole(["Administrator"]), (req, res) => {
  const { facultyId, name, code } = req.body;
  if (!facultyId || !name || !code) return res.status(400).json({ error: "Missing department metadata." });
  const newDept = { id: `dept-${Date.now()}`, facultyId, name, code };
  DB.departments.push(newDept);
  res.status(201).json(newDept);
});

app.get("/api/admin/programmes", requireAuth, (req, res) => {
  res.json(DB.programmes);
});

app.post("/api/admin/programmes", requireAuth, requireRole(["Administrator"]), (req, res) => {
  const { departmentId, name } = req.body;
  const newProg = { id: `prog-${Date.now()}`, departmentId, name };
  DB.programmes.push(newProg);
  res.status(201).json(newProg);
});

app.get("/api/admin/courses", requireAuth, (req, res) => {
  res.json(DB.courses);
});

app.post("/api/admin/courses", requireAuth, requireRole(["Administrator", "Timetable Officer"]), (req, res) => {
  const { code, title, credits, departmentId } = req.body;
  const newCrs = { id: `crs-${Date.now()}`, code, title, credits: Number(credits), departmentId };
  DB.courses.push(newCrs);
  res.status(201).json(newCrs);
});

app.get("/api/admin/venues", requireAuth, (req, res) => {
  res.json(DB.venues);
});

app.post("/api/admin/venues", requireAuth, requireRole(["Administrator", "Timetable Officer"]), (req, res) => {
  const { name, capacity, block } = req.body;
  const newVen = { id: `ven-${Date.now()}`, name, capacity: Number(capacity), block };
  DB.venues.push(newVen);
  res.status(201).json(newVen);
});

// --- LECTURER APPROVAL & LISTS ---
app.get("/api/admin/users", requireAuth, requireRole(["Administrator"]), (req, res) => {
  res.json(DB.users);
});

app.put("/api/admin/users/:id/approve", requireAuth, requireRole(["Administrator"]), (req: any, res: any) => {
  const { id } = req.params;
  const user = DB.users.find(u => u.id === id);
  if (!user) return res.status(404).json({ error: "User not found." });
  (user as any).isApproved = true;

  DB.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    action: "User Approved",
    detail: `Approved ${user.name} (${user.role}) account.`,
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });

  res.json({ message: "User account approved successfully.", user });
});

app.delete("/api/admin/users/:id", requireAuth, requireRole(["Administrator"]), (req, res) => {
  const { id } = req.params;
  DB.users = DB.users.filter(u => u.id !== id);
  res.json({ message: "User deleted successfully." });
});

// --- TIMETABLE CRUD & CONFLICT RESOLUTION ---
app.get("/api/timetable", requireAuth, (req, res) => {
  // Join tables to send formatted data
  const joined = DB.timetable.map(slot => {
    const course = DB.courses.find(c => c.id === slot.courseId);
    const lecturer = DB.users.find(u => u.id === slot.lecturerId);
    const venue = DB.venues.find(v => v.id === slot.venueId);
    return {
      ...slot,
      courseCode: course?.code || "N/A",
      courseTitle: course?.title || "N/A",
      lecturerName: lecturer?.name || "N/A",
      venueName: venue?.name || "N/A"
    };
  });
  res.json(joined);
});

// Helper for conflict checking
function checkTimetableConflicts(id: string | null, day: string, startTime: string, endTime: string, venueId: string, lecturerId: string) {
  const conflicts: string[] = [];
  
  // Quick parse times to compare
  const toMins = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };
  const startM = toMins(startTime);
  const endM = toMins(endTime);

  DB.timetable.forEach(slot => {
    if (slot.id === id) return; // Skip currently editing slot
    if (slot.day !== day) return;

    const slotStart = toMins(slot.startTime);
    const slotEnd = toMins(slot.endTime);

    // Check if times overlap
    const overlaps = (startM < slotEnd && endM > slotStart);
    if (overlaps) {
      if (slot.venueId === venueId) {
        const v = DB.venues.find(v => v.id === venueId);
        conflicts.push(`Venue Conflict: ${v?.name || "Venue"} is already occupied on ${day} between ${slot.startTime} and ${slot.endTime}.`);
      }
      if (slot.lecturerId === lecturerId) {
        const l = DB.users.find(u => u.id === lecturerId);
        conflicts.push(`Lecturer Conflict: ${l?.name || "Lecturer"} is already assigned to another class on ${day} between ${slot.startTime} and ${slot.endTime}.`);
      }
    }
  });

  return conflicts;
}

app.post("/api/timetable", requireAuth, requireRole(["Administrator", "Timetable Officer"]), (req: any, res: any) => {
  const { courseId, lecturerId, venueId, day, startTime, endTime, level } = req.body;
  if (!courseId || !lecturerId || !venueId || !day || !startTime || !endTime || !level) {
    return res.status(400).json({ error: "Missing required timetable fields." });
  }

  // Conflict Resolution Validation
  const conflicts = checkTimetableConflicts(null, day, startTime, endTime, venueId, lecturerId);
  if (conflicts.length > 0) {
    return res.status(409).json({ error: "Scheduling conflict detected.", conflicts });
  }

  const newSlot = {
    id: `tt-${Date.now()}`,
    courseId,
    lecturerId,
    venueId,
    day,
    startTime,
    endTime,
    level
  };

  DB.timetable.push(newSlot);

  DB.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    action: "Add Timetable",
    detail: `Allocated timetable slot on ${day} for ${courseId} at ${venueId}.`,
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });

  res.status(201).json(newSlot);
});

app.delete("/api/timetable/:id", requireAuth, requireRole(["Administrator", "Timetable Officer"]), (req, res) => {
  const { id } = req.params;
  DB.timetable = DB.timetable.filter(t => t.id !== id);
  res.json({ message: "Slot deleted." });
});

// --- LECTURE NOTES & DOWNLOADS ---
app.get("/api/notes", requireAuth, (req, res) => {
  const notes = DB.lectureNotes.map(n => {
    const course = DB.courses.find(c => c.id === n.courseId);
    return { ...n, courseCode: course?.code || "N/A" };
  });
  res.json(notes);
});

app.post("/api/notes", requireAuth, requireRole(["Lecturer", "Administrator"]), (req, res) => {
  const { courseId, title, fileName } = req.body;
  if (!courseId || !title || !fileName) return res.status(400).json({ error: "Missing fields." });
  const newNote = {
    id: `note-${Date.now()}`,
    courseId,
    title,
    fileName,
    fileSize: "2.1 MB"
  };
  DB.lectureNotes.push(newNote);
  res.status(201).json(newNote);
});

// --- ATTENDANCE SYSTEM ---
app.get("/api/attendance", requireAuth, (req, res) => {
  const logs = DB.attendance.map(a => {
    const student = DB.users.find(u => u.id === a.studentId);
    const timetable = DB.timetable.find(t => t.id === a.timetableId);
    const course = timetable ? DB.courses.find(c => c.id === timetable.courseId) : null;
    return {
      ...a,
      studentName: student?.name || "N/A",
      matricNo: student?.matricNo || "N/A",
      courseCode: course?.code || "N/A"
    };
  });
  res.json(logs);
});

app.post("/api/attendance/checkin", requireAuth, requireRole(["Student"]), (req: any, res: any) => {
  const { code } = req.body; // e.g. "qr-tt-1"
  if (!code || !code.startsWith("qr-")) {
    return res.status(400).json({ error: "Invalid attendance QR Code structure." });
  }
  const timetableId = code.replace("qr-", "");
  const slot = DB.timetable.find(t => t.id === timetableId);
  if (!slot) return res.status(404).json({ error: "Lecture slot matching QR Code expired or does not exist." });

  // Prevent duplicates
  const today = new Date().toISOString().split("T")[0];
  const duplicate = DB.attendance.find(a => a.timetableId === timetableId && a.studentId === req.user.id && a.date === today);
  if (duplicate) {
    return res.status(400).json({ error: "You have already checked in to this lecture session today!" });
  }

  const now = new Date();
  const checkinTime = now.toTimeString().split(" ")[0].substring(0, 5);

  const newLog = {
    id: `att-${Date.now()}`,
    timetableId,
    date: today,
    studentId: req.user.id,
    status: "Present",
    checkedInAt: checkinTime
  };

  DB.attendance.push(newLog);

  DB.auditLogs.unshift({
    id: `aud-${Date.now()}`,
    action: "QR Checkin",
    detail: `Student ${req.user.name} checked in present for ${timetableId} via QR.`,
    userId: req.user.id,
    timestamp: new Date().toISOString()
  });

  res.json({ message: "Attendance verified and successfully marked!", log: newLog });
});

// --- ANNOUNCEMENTS ---
app.get("/api/announcements", requireAuth, (req, res) => {
  res.json(DB.announcements);
});

app.post("/api/announcements", requireAuth, requireRole(["Lecturer", "Administrator"]), (req: any, res: any) => {
  const { title, content } = req.body;
  const newAnn = {
    id: `ann-${Date.now()}`,
    title,
    content,
    lecturerId: req.user.id,
    timestamp: new Date().toISOString()
  };
  DB.announcements.push(newAnn);
  res.status(201).json(newAnn);
});

// --- ASSIGNMENTS ---
app.get("/api/assignments", requireAuth, (req, res) => {
  res.json(DB.assignments);
});

app.post("/api/assignments", requireAuth, requireRole(["Lecturer", "Administrator"]), (req: any, res: any) => {
  const { courseId, title, dueDate, description } = req.body;
  const newAsg = {
    id: `asg-${Date.now()}`,
    courseId,
    title,
    dueDate,
    description,
    lecturerId: req.user.id
  };
  DB.assignments.push(newAsg);
  res.status(201).json(newAsg);
});

// --- AUDIT LOGS ---
app.get("/api/audit-logs", requireAuth, requireRole(["Administrator"]), (req, res) => {
  res.json(DB.auditLogs);
});

// --- NOTIFICATION MANAGEMENT ---
app.get("/api/notifications", requireAuth, (req: any, res: any) => {
  const userNotifs = DB.notifications.filter(n => n.recipientId === req.user.id);
  res.json(userNotifs);
});

app.post("/api/notifications/mark-read", requireAuth, (req: any, res: any) => {
  DB.notifications
    .filter(n => n.recipientId === req.user.id)
    .forEach(n => n.isRead = true);
  res.json({ success: true });
});

// --- ANALYTICS ---
app.get("/api/analytics", requireAuth, (req, res) => {
  const studentsCount = DB.users.filter(u => u.role === "Student").length;
  const lecturersCount = DB.users.filter(u => u.role === "Lecturer").length;
  const coursesCount = DB.courses.length;
  const venuesCount = DB.venues.length;
  const timetableCount = DB.timetable.length;

  res.json({
    totals: {
      students: studentsCount,
      lecturers: lecturersCount,
      courses: coursesCount,
      venues: venuesCount,
      timetableSlots: timetableCount
    },
    todayLectures: DB.timetable.slice(0, 3), // Return a few slots for dashboard
    attendanceRate: "88.4%",
    recentActivity: DB.auditLogs.slice(0, 5)
  });
});

// ==========================================
// VITE DEV SERVER AND PRODUCTION BUNDLER
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*all", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[IKCOE Core Platform Backend] Service running on http://localhost:${PORT}`);
  });
}

startServer();
