// Department Course Configuration
const DEPARTMENTS_COURSES = {
    cs: {
        name: "Computer Science & AI",
        className: "cs",
        courses: [
            "B.Sc Artificial Intelligence & Robotics",
            "B.Tech Computer Science & Engineering",
            "M.Sc Cyber Security & Data Privacy",
            "Diploma in Full-Stack Web Development"
        ]
    },
    engineering: {
        name: "Engineering",
        className: "engineering",
        courses: [
            "B.Tech Mechanical Engineering",
            "B.Tech Electronics & Communication",
            "B.Tech Aerospace Engineering",
            "M.Tech Robotics & Automation"
        ]
    },
    business: {
        name: "Business Administration",
        className: "business",
        courses: [
            "Bachelor of Business Administration (BBA)",
            "Master of Business Administration (MBA)",
            "Executive Finance Program",
            "B.Sc Business Analytics & Economy"
        ]
    },
    arts: {
        name: "Creative Arts",
        className: "arts",
        courses: [
            "B.FA Graphic Design & UX",
            "B.A Film & Multimedia Production",
            "M.A Fine Arts & Digital Illustration",
            "Certificate in Animation & VFX"
        ]
    }
};

// Default Avatar Selection Lists
const DEFAULT_AVATARS = [
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=150",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=150"
];

// Initial mock database to populate dashboard beautifully
const INITIAL_STUDENTS = [
    {
        id: "STU-2026-0001",
        fullName: "Aria Thorne",
        email: "aria.thorne@academy.edu",
        phone: "9876543210",
        dob: "2005-04-12",
        gender: "Female",
        department: "cs",
        course: "B.Sc Artificial Intelligence & Robotics",
        semester: "Semester 3",
        enrollmentType: "Full-Time",
        avatar: DEFAULT_AVATARS[0],
        hostel: true,
        scholarship: true,
        sports: false,
        registeredDate: "2026-06-15"
    },
    {
        id: "STU-2026-0002",
        fullName: "Ethan Caldwell",
        email: "e.caldwell@academy.edu",
        phone: "8765432109",
        dob: "2004-09-22",
        gender: "Male",
        department: "engineering",
        course: "B.Tech Aerospace Engineering",
        semester: "Semester 5",
        enrollmentType: "Full-Time",
        avatar: DEFAULT_AVATARS[1],
        hostel: false,
        scholarship: false,
        sports: true,
        registeredDate: "2026-06-18"
    },
    {
        id: "STU-2026-0003",
        fullName: "Elena Rostova",
        email: "elena.r@academy.edu",
        phone: "7654321098",
        dob: "2006-01-30",
        gender: "Female",
        department: "arts",
        course: "B.FA Graphic Design & UX",
        semester: "Semester 1",
        enrollmentType: "Distance Learning",
        avatar: DEFAULT_AVATARS[2],
        hostel: true,
        scholarship: false,
        sports: true,
        registeredDate: "2026-06-19"
    }
];

// Application State
let students = [];
let activeStep = 1;
let currentView = "grid"; // grid or list
let selectedAvatarUrl = DEFAULT_AVATARS[0];

// Main Initialization
document.addEventListener("DOMContentLoaded", () => {
    // Load student database
    loadDatabase();
    
    // Set Header Info
    initHeader();
    
    // Setup Sidebar Nav Switches
    setupNavigation();
    
    // Setup Theme Switcher
    setupTheme();
    
    // Setup Registration Form & Live Preview ID
    setupRegistrationWizard();
    
    // Setup Student Directory Filter/Search logic
    setupDirectoryFilters();
    
    // Render initial views
    updateDashboardStats();
    renderDirectory();
    
    // Trigger Lucide icons rendering
    if (window.lucide) {
        window.lucide.createIcons();
    }
});

// Load state from local storage or set initial values
function loadDatabase() {
    const saved = localStorage.getItem("apex_students_db");
    if (saved) {
        try {
            students = JSON.parse(saved);
        } catch (e) {
            console.error("Failed to parse student database, resetting", e);
            students = [...INITIAL_STUDENTS];
            saveDatabase();
        }
    } else {
        students = [...INITIAL_STUDENTS];
        saveDatabase();
    }
}

// Save state to local storage
function saveDatabase() {
    localStorage.setItem("apex_students_db", JSON.stringify(students));
}

// Setup static date and administrative greeting
function initHeader() {
    const dateEl = document.getElementById("current-date");
    if (dateEl) {
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        dateEl.textContent = new Date().toLocaleDateString('en-US', options);
    }
}

// Sidebar Navigation Control
function setupNavigation() {
    const navItems = document.querySelectorAll(".nav-list .nav-item");
    const sections = document.querySelectorAll(".section-panel");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    
    const pageTitles = {
        dashboard: { title: "Dashboard Overview", subtitle: "Welcome back, Administrator" },
        register: { title: "Register New Student", subtitle: "Complete steps to onboard a student" },
        directory: { title: "Student Directory", subtitle: "Access student database records and download ID cards" }
    };

    navItems.forEach(item => {
        item.addEventListener("click", (e) => {
            e.preventDefault();
            const targetPage = item.getAttribute("data-page");
            switchPage(targetPage);
        });
    });

    // Mobile Hamburger Toggle
    const hamburger = document.getElementById("hamburger-toggle");
    const sidebar = document.getElementById("sidebar");
    
    if (hamburger && sidebar) {
        hamburger.addEventListener("click", () => {
            sidebar.classList.toggle("open");
        });
        
        // Close sidebar if user clicks main workspace area
        document.querySelector(".main-wrapper").addEventListener("click", () => {
            sidebar.classList.remove("open");
        });
    }
}

// Helper to transition navigation panels
function switchPage(pageId) {
    const navItems = document.querySelectorAll(".nav-list .nav-item");
    const sections = document.querySelectorAll(".section-panel");
    const pageTitle = document.getElementById("page-title");
    const pageSubtitle = document.getElementById("page-subtitle");
    
    const pageTitles = {
        dashboard: { title: "Dashboard Overview", subtitle: "Welcome back, Administrator" },
        register: { title: "Register New Student", subtitle: "Complete steps to onboard a student" },
        directory: { title: "Student Directory", subtitle: "Access student database records and download ID cards" }
    };

    navItems.forEach(nav => {
        if (nav.getAttribute("data-page") === pageId) {
            nav.classList.add("active");
        } else {
            nav.classList.remove("active");
        }
    });

    sections.forEach(sec => {
        if (sec.id === `page-${pageId}`) {
            sec.classList.add("active");
        } else {
            sec.classList.remove("active");
        }
    });

    // Update Header Text
    if (pageTitles[pageId]) {
        pageTitle.textContent = pageTitles[pageId].title;
        pageSubtitle.textContent = pageTitles[pageId].subtitle;
    }

    // Refresh Dashboard stats/charts if returning to dashboard
    if (pageId === "dashboard") {
        updateDashboardStats();
    } else if (pageId === "directory") {
        renderDirectory();
    }

    // Close mobile menu if open
    const sidebar = document.getElementById("sidebar");
    if (sidebar) sidebar.classList.remove("open");
}

// Light / Dark Theme Logic
function setupTheme() {
    const themeBtn = document.getElementById("theme-toggle");
    const themeText = document.getElementById("theme-text");
    const themeIcon = document.getElementById("theme-icon");
    const htmlEl = document.documentElement;

    // Load theme setting
    const savedTheme = localStorage.getItem("apex_theme") || "light";
    htmlEl.setAttribute("data-theme", savedTheme);
    updateThemeUI(savedTheme);

    themeBtn.addEventListener("click", () => {
        const currentTheme = htmlEl.getAttribute("data-theme");
        const nextTheme = currentTheme === "dark" ? "light" : "dark";
        htmlEl.setAttribute("data-theme", nextTheme);
        localStorage.setItem("apex_theme", nextTheme);
        updateThemeUI(nextTheme);
        showToast("Theme Updated", `Switched to ${nextTheme} mode styling.`, "info");
    });

    function updateThemeUI(theme) {
        if (theme === "dark") {
            themeText.textContent = "Light Mode";
            themeIcon.setAttribute("data-lucide", "sun");
        } else {
            themeText.textContent = "Dark Mode";
            themeIcon.setAttribute("data-lucide", "moon");
        }
        if (window.lucide) {
            window.lucide.createIcons();
        }
    }
}

// Dashboard statistics and dynamic CSS/SVG chart
function updateDashboardStats() {
    const totalCount = students.length;
    const csCount = students.filter(s => s.department === "cs").length;
    const engCount = students.filter(s => s.department === "engineering").length;
    const busCount = students.filter(s => s.department === "business").length;
    const artCount = students.filter(s => s.department === "arts").length;

    // Numerical Updates
    animateCounter("stat-total-count", totalCount);
    animateCounter("stat-cs-count", csCount);
    animateCounter("stat-eng-count", engCount);
    animateCounter("stat-bus-count", busCount);
    animateCounter("stat-art-count", artCount);

    // Chart visual height adjustments (based on percentage of total count)
    const maxVal = Math.max(csCount, engCount, busCount, artCount, 1);
    
    updateChartBar("chart-bar-cs", csCount, maxVal);
    updateChartBar("chart-bar-eng", engCount, maxVal);
    updateChartBar("chart-bar-bus", busCount, maxVal);
    updateChartBar("chart-bar-art", artCount, maxVal);

    // Render Recent items listing
    const recentList = document.getElementById("recent-registrations-list");
    if (!recentList) return;

    // Get last 4 entries sorted by register Date descending or just last in array
    const recents = [...students].reverse().slice(0, 4);

    if (recents.length === 0) {
        recentList.innerHTML = `
            <div class="empty-state" style="padding: 1.5rem 0;">
                <p style="font-size: 0.85rem; margin-bottom: 0;">No registrations yet.</p>
            </div>
        `;
    } else {
        recentList.innerHTML = recents.map(student => `
            <div class="recent-item">
                <img src="${student.avatar}" class="recent-avatar" alt="${student.fullName}">
                <div class="recent-details">
                    <div class="recent-name">${student.fullName}</div>
                    <div class="recent-meta">${student.id} &bull; <span class="dept-badge ${student.department}">${DEPARTMENTS_COURSES[student.department]?.name || student.department}</span></div>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); font-weight: 500;">
                    ${formatCompactDate(student.registeredDate)}
                </div>
            </div>
        `).join("");
    }
}

// Micro-animation utility for counters
function animateCounter(id, targetVal) {
    const el = document.getElementById(id);
    if (!el) return;
    
    const startVal = parseInt(el.textContent) || 0;
    if (startVal === targetVal) {
        el.textContent = targetVal;
        return;
    }
    
    let current = startVal;
    const duration = 800; // ms
    const increment = targetVal > startVal ? Math.ceil((targetVal - startVal) / 20) : Math.floor((targetVal - startVal) / 20) || -1;
    
    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= targetVal) || (increment < 0 && current <= targetVal)) {
            current = targetVal;
            clearInterval(timer);
        }
        el.textContent = current;
    }, duration / 20);
}

// Chart visual updates
function updateChartBar(id, val, maxVal) {
    const bar = document.getElementById(id);
    if (!bar) return;
    
    const pct = (val / maxVal) * 80 + 5; // offset bottom border padding
    bar.style.height = `${pct}%`;
    bar.setAttribute("data-val", val);
}

// Formatting date utility
function formatCompactDate(dateString) {
    try {
        const d = new Date(dateString);
        if (isNaN(d.getTime())) return dateString;
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
    } catch(e) {
        return dateString;
    }
}

// Setup Multi-Step Form wizard & ID Generator interaction
function setupRegistrationWizard() {
    const form = document.getElementById("student-registration-form");
    const btnNext = document.getElementById("btn-wizard-next");
    const btnPrev = document.getElementById("btn-wizard-prev");
    const steps = document.querySelectorAll(".form-step-content");
    const stepNodes = document.querySelectorAll(".stepper .step");
    const progressBar = document.getElementById("wizard-progress-bar");
    const deptSelect = document.getElementById("reg-department");
    const courseSelect = document.getElementById("reg-course");

    // Dynamic Course loader depending on department select
    deptSelect.addEventListener("change", () => {
        const deptKey = deptSelect.value;
        courseSelect.innerHTML = `<option value="" disabled selected>Select Specialized Course</option>`;
        
        if (DEPARTMENTS_COURSES[deptKey]) {
            courseSelect.disabled = false;
            DEPARTMENTS_COURSES[deptKey].courses.forEach(c => {
                const opt = document.createElement("option");
                opt.value = c;
                opt.textContent = c;
                courseSelect.appendChild(opt);
            });
            
            // Trigger theme update on preview ID card instantly
            const cardEl = document.getElementById("interactive-id-card");
            cardEl.className = `id-card theme-${deptKey}`;
            
            const deptText = DEPARTMENTS_COURSES[deptKey].name;
            document.getElementById("id-preview-dept").textContent = deptText;
        } else {
            courseSelect.disabled = true;
        }
        updateIDCardPreview();
    });

    // Real-time Card updates on input change
    const inputIds = ["reg-fullname", "reg-course", "reg-type"];
    inputIds.forEach(id => {
        const input = document.getElementById(id);
        input.addEventListener("input", updateIDCardPreview);
        input.addEventListener("change", updateIDCardPreview);
    });

    // Standard Avatar Pick Action
    const avatarImgs = document.querySelectorAll(".avatar-option-img");
    avatarImgs.forEach(img => {
        img.addEventListener("click", () => {
            avatarImgs.forEach(i => i.classList.remove("selected"));
            img.classList.add("selected");
            selectedAvatarUrl = img.src;
            updateIDCardPreview();
        });
    });

    // Custom avatar local file upload to DataURL
    const fileInput = document.getElementById("reg-avatar-file");
    if (fileInput) {
        fileInput.addEventListener("change", (e) => {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(event) {
                    selectedAvatarUrl = event.target.result;
                    avatarImgs.forEach(i => i.classList.remove("selected"));
                    updateIDCardPreview();
                    showToast("Avatar Uploaded", "Custom image uploaded and rendered successfully.", "success");
                };
                reader.readAsDataURL(file);
            }
        });
    }

    // Next button clicks
    btnNext.addEventListener("click", () => {
        if (activeStep < 4) {
            // Validate step inputs
            if (validateStep(activeStep)) {
                activeStep++;
                renderWizardStep();
            } else {
                showToast("Form Validation Error", "Please verify highlighted fields and try again.", "error");
            }
        } else {
            // Submission step final confirmation
            submitRegistration();
        }
    });

    // Prev button clicks
    btnPrev.addEventListener("click", () => {
        if (activeStep > 1) {
            activeStep--;
            renderWizardStep();
        }
    });

    // Reset Form fields on submit
    function resetForm() {
        form.reset();
        activeStep = 1;
        selectedAvatarUrl = DEFAULT_AVATARS[0];
        
        avatarImgs.forEach(i => i.classList.remove("selected"));
        avatarImgs[0].classList.add("selected");
        
        courseSelect.disabled = true;
        courseSelect.innerHTML = `<option value="" disabled selected>Choose department first</option>`;
        
        const cardEl = document.getElementById("interactive-id-card");
        cardEl.className = "id-card theme-cs";
        
        renderWizardStep();
        updateIDCardPreview();
    }

    // Finalize Registration submission
    function submitRegistration() {
        // Collect form data
        const fullName = document.getElementById("reg-fullname").value.trim();
        const email = document.getElementById("reg-email").value.trim();
        const phone = document.getElementById("reg-phone").value.trim();
        const dob = document.getElementById("reg-dob").value;
        const gender = document.getElementById("reg-gender").value;
        const department = document.getElementById("reg-department").value;
        const course = document.getElementById("reg-course").value;
        const semester = document.getElementById("reg-semester").value;
        const enrollmentType = document.getElementById("reg-type").value;
        
        const hostel = document.getElementById("pref-hostel").checked;
        const scholarship = document.getElementById("pref-scholarship").checked;
        const sports = document.getElementById("pref-sports").checked;

        // Auto-generate fresh Student ID number
        const year = new Date().getFullYear();
        const serialNum = String(students.length + 1).padStart(4, "0");
        const studentId = `STU-${year}-${serialNum}`;

        const newStudent = {
            id: studentId,
            fullName,
            email,
            phone,
            dob,
            gender,
            department,
            course,
            semester,
            enrollmentType,
            avatar: selectedAvatarUrl,
            hostel,
            scholarship,
            sports,
            registeredDate: new Date().toISOString().split('T')[0]
        };

        // Add to database array
        students.push(newStudent);
        saveDatabase();
        
        // Feedback success notifications
        showToast("Registration Complete", `${fullName} registered with ID ${studentId}.`, "success");
        
        // Reset forms and return to dashboard overview
        resetForm();
        switchPage("dashboard");
    }

    function renderWizardStep() {
        // Update Step displays
        steps.forEach((step, idx) => {
            if (idx + 1 === activeStep) {
                step.classList.add("active");
            } else {
                step.classList.remove("active");
            }
        });

        // Set Stepper Nodes Styles
        stepNodes.forEach((node, idx) => {
            const stepNum = idx + 1;
            node.classList.remove("active", "completed");
            if (stepNum === activeStep) {
                node.classList.add("active");
            } else if (stepNum < activeStep) {
                node.classList.add("completed");
            }
        });

        // Progress bar width indicator
        const progressPct = ((activeStep - 1) / (steps.length - 1)) * 100;
        progressBar.style.width = `${progressPct}%`;

        // Configure Nav Buttons
        btnPrev.disabled = activeStep === 1;
        
        if (activeStep === 4) {
            btnNext.innerHTML = `Complete Registration <i data-lucide="check-circle" style="width:16px;height:16px;"></i>`;
            btnNext.className = "btn btn-success";
            populateSummaryReview();
        } else {
            btnNext.innerHTML = `Next <i data-lucide="arrow-right" style="width:16px;height:16px;"></i>`;
            btnNext.className = "btn btn-primary";
        }

        if (window.lucide) {
            window.lucide.createIcons();
        }
    }

    // Step verification and validator checks
    function validateStep(step) {
        let isValid = true;

        if (step === 1) {
            const nameEl = document.getElementById("reg-fullname");
            const emailEl = document.getElementById("reg-email");
            const phoneEl = document.getElementById("reg-phone");
            const dobEl = document.getElementById("reg-dob");
            const genderEl = document.getElementById("reg-gender");

            // Name validation (min letters & space)
            const nameRegex = /^[a-zA-Z\s]{3,40}$/;
            if (!nameRegex.test(nameEl.value.trim())) {
                showFieldError("fullname", true);
                isValid = false;
            } else {
                showFieldError("fullname", false);
            }

            // Email validation regex
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(emailEl.value.trim())) {
                showFieldError("email", true);
                isValid = false;
            } else {
                showFieldError("email", false);
            }

            // Phone validation regex
            const phoneRegex = /^[0-9]{10}$/;
            if (!phoneRegex.test(phoneEl.value.trim())) {
                showFieldError("phone", true);
                isValid = false;
            } else {
                showFieldError("phone", false);
            }

            // DOB validation
            if (!dobEl.value) {
                showFieldError("dob", true);
                isValid = false;
            } else {
                showFieldError("dob", false);
            }

            // Gender validation
            if (!genderEl.value) {
                showFieldError("gender", true);
                isValid = false;
            } else {
                showFieldError("gender", false);
            }
        } 
        
        else if (step === 2) {
            const deptEl = document.getElementById("reg-department");
            const courseEl = document.getElementById("reg-course");
            const termEl = document.getElementById("reg-semester");
            const typeEl = document.getElementById("reg-type");

            if (!deptEl.value) {
                showFieldError("department", true);
                isValid = false;
            } else {
                showFieldError("department", false);
            }

            if (!courseEl.value) {
                showFieldError("course", true);
                isValid = false;
            } else {
                showFieldError("course", false);
            }

            if (!termEl.value) {
                showFieldError("semester", true);
                isValid = false;
            } else {
                showFieldError("semester", false);
            }

            if (!typeEl.value) {
                showFieldError("type", true);
                isValid = false;
            } else {
                showFieldError("type", false);
            }
        } 
        
        else if (step === 3) {
            const decEl = document.getElementById("pref-declaration");
            if (!decEl.checked) {
                showFieldError("declaration", true);
                isValid = false;
            } else {
                showFieldError("declaration", false);
            }
        }

        return isValid;
    }

    function showFieldError(fieldId, isError) {
        const input = document.getElementById(`reg-${fieldId}`) || document.getElementById(`pref-${fieldId}`);
        const errMsg = document.getElementById(`err-${fieldId}`);
        
        if (input && errMsg) {
            if (isError) {
                input.classList.add("error");
                errMsg.style.display = "block";
            } else {
                input.classList.remove("error");
                errMsg.style.display = "none";
            }
        }
    }

    function populateSummaryReview() {
        const nameVal = document.getElementById("reg-fullname").value.trim();
        const emailVal = document.getElementById("reg-email").value.trim();
        const phoneVal = document.getElementById("reg-phone").value.trim();
        const deptKey = document.getElementById("reg-department").value;
        const courseVal = document.getElementById("reg-course").value;
        const termVal = document.getElementById("reg-semester").value;
        const typeVal = document.getElementById("reg-type").value;
        
        const hostelVal = document.getElementById("pref-hostel").checked ? "Yes" : "No";
        const scholarVal = document.getElementById("pref-scholarship").checked ? "Yes" : "No";
        const sportsVal = document.getElementById("pref-sports").checked ? "Yes" : "No";

        const deptName = DEPARTMENTS_COURSES[deptKey]?.name || "N/A";

        const summaryContainer = document.getElementById("summary-review-list");
        summaryContainer.innerHTML = `
            <div class="summary-group">
                <span class="summary-label">Full Name</span>
                <span class="summary-value">${nameVal}</span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Email & Phone</span>
                <span class="summary-value">${emailVal}<br><small>${phoneVal}</small></span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Department</span>
                <span class="summary-value">${deptName}</span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Course Program</span>
                <span class="summary-value">${courseVal}</span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Term / Mode</span>
                <span class="summary-value">${termVal} &bull; ${typeVal}</span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Hostel & Scholarship</span>
                <span class="summary-value">Hostel: ${hostelVal} / Scholarship: ${scholarVal}</span>
            </div>
            <div class="summary-group">
                <span class="summary-label">Extracurriculars</span>
                <span class="summary-value">${sportsVal}</span>
            </div>
        `;
    }
}

// Live card preview updates
function updateIDCardPreview() {
    const fullName = document.getElementById("reg-fullname").value.trim() || "John Doe";
    const deptKey = document.getElementById("reg-department").value;
    const course = document.getElementById("reg-course").value || "B.Sc AI & Robotics";
    const enrollmentType = document.getElementById("reg-type").value || "Full-Time";

    // Text details updates
    document.getElementById("id-preview-name").textContent = fullName;
    document.getElementById("id-preview-course").textContent = course;
    document.getElementById("id-preview-type").textContent = enrollmentType;
    document.getElementById("id-preview-avatar").src = selectedAvatarUrl;

    const deptText = DEPARTMENTS_COURSES[deptKey]?.name || "Computer Science";
    document.getElementById("id-preview-dept").textContent = deptText;
    
    // Future expiration date generator
    const year = new Date().getFullYear();
    document.getElementById("id-preview-valid").textContent = `Dec ${year + 3}`;

    // Barcode number generator update
    const serialCode = String(students.length + 1).padStart(4, "0");
    document.getElementById("id-preview-id").textContent = `STU-${year}-${serialCode}`;
}

// Student Directory Setup
function setupDirectoryFilters() {
    const search = document.getElementById("dir-search-input");
    const deptFilter = document.getElementById("dir-filter-dept");
    const typeFilter = document.getElementById("dir-filter-type");

    search.addEventListener("input", renderDirectory);
    deptFilter.addEventListener("change", renderDirectory);
    typeFilter.addEventListener("change", renderDirectory);

    // View toggling (Grid vs List Table)
    const btnGrid = document.getElementById("btn-view-grid");
    const btnList = document.getElementById("btn-view-list");
    const gridLayout = document.getElementById("directory-grid-layout");
    const listLayout = document.getElementById("directory-list-layout");

    btnGrid.addEventListener("click", () => {
        btnGrid.classList.add("active");
        btnList.classList.remove("active");
        gridLayout.style.display = "grid";
        listLayout.style.display = "none";
        currentView = "grid";
    });

    btnList.addEventListener("click", () => {
        btnList.classList.add("active");
        btnGrid.classList.remove("active");
        gridLayout.style.display = "none";
        listLayout.style.display = "block";
        currentView = "list";
    });

    // CSV Database Export handler
    const btnExport = document.getElementById("btn-export-csv");
    btnExport.addEventListener("click", exportDatabaseToCSV);

    // Modal Card Viewer control setup
    setupModalControl();
}

// Student records rendering (filtered)
function renderDirectory() {
    const gridContainer = document.getElementById("directory-grid-layout");
    const tableBody = document.getElementById("directory-table-body");
    
    if (!gridContainer || !tableBody) return;

    // Filters
    const searchQuery = document.getElementById("dir-search-input").value.trim().toLowerCase();
    const selectedDept = document.getElementById("dir-filter-dept").value;
    const selectedType = document.getElementById("dir-filter-type").value;

    const filtered = students.filter(student => {
        const matchesSearch = student.fullName.toLowerCase().includes(searchQuery) ||
                            student.id.toLowerCase().includes(searchQuery) ||
                            student.email.toLowerCase().includes(searchQuery);
        const matchesDept = !selectedDept || student.department === selectedDept;
        const matchesType = !selectedType || student.enrollmentType === selectedType;
        
        return matchesSearch && matchesDept && matchesType;
    });

    // Clear initial layouts
    gridContainer.innerHTML = "";
    tableBody.innerHTML = "";

    if (filtered.length === 0) {
        const emptyHTML = `
            <div class="empty-state" style="grid-column: 1 / -1; width: 100%;">
                <i data-lucide="users"></i>
                <h4>No Students Found</h4>
                <p>Try clearing filters or search terms to inspect more registrations.</p>
                <button class="btn btn-primary" onclick="clearDirectoryFilters()">Reset Filters</button>
            </div>
        `;
        gridContainer.innerHTML = emptyHTML;
        tableBody.innerHTML = `<tr><td colspan="7" style="text-align:center;">No match student records.</td></tr>`;
        
        if (window.lucide) {
            window.lucide.createIcons();
        }
        return;
    }

    // Populate Grid Cards
    filtered.forEach(student => {
        const deptMeta = DEPARTMENTS_COURSES[student.department] || { name: student.department, className: "cs" };
        
        const cardHTML = `
            <div class="glass-card student-card">
                <div class="student-card-decor ${deptMeta.className}"></div>
                <img src="${student.avatar}" class="student-card-avatar" alt="${student.fullName}">
                <h4>${student.fullName}</h4>
                <span class="student-card-sub">${student.id}</span>
                
                <div class="student-card-info-box">
                    <div class="student-card-info-item">
                        <span>Department</span>
                        <span>${deptMeta.name}</span>
                    </div>
                    <div class="student-card-info-item">
                        <span>Term</span>
                        <span>${student.semester}</span>
                    </div>
                    <div class="student-card-info-item">
                        <span>Status</span>
                        <span>${student.enrollmentType}</span>
                    </div>
                    <div class="student-card-info-item">
                        <span>Registered</span>
                        <span>${student.registeredDate}</span>
                    </div>
                </div>

                <div class="student-card-actions">
                    <button class="btn btn-secondary" onclick="openIDCardModal('${student.id}')" title="View Digital ID Card">
                        <i data-lucide="id-card" style="width: 14px; height:14px;"></i> View ID
                    </button>
                    <button class="btn btn-secondary" onclick="deleteStudentRecord('${student.id}')" style="color: var(--danger);" title="Delete Student">
                        <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                    </button>
                </div>
            </div>
        `;
        gridContainer.innerHTML += cardHTML;

        // Populate List Table Rows
        const trHTML = `
            <tr>
                <td>
                    <div class="table-identity">
                        <img src="${student.avatar}" class="table-avatar" alt="${student.fullName}">
                        <div>
                            <div class="table-name">${student.fullName}</div>
                            <div class="table-email">${student.email} &bull; ${student.phone}</div>
                        </div>
                    </div>
                </td>
                <td style="font-family: monospace; font-weight:600;">${student.id}</td>
                <td><span class="dept-badge ${student.department}">${deptMeta.name}</span></td>
                <td>${student.course}</td>
                <td>${student.semester}</td>
                <td>${student.enrollmentType}</td>
                <td style="text-align: right;">
                    <div style="display:inline-flex; gap: 0.25rem;">
                        <button class="action-icon-btn view-btn" onclick="openIDCardModal('${student.id}')" title="View Student ID">
                            <i data-lucide="id-card" style="width: 16px; height: 16px;"></i>
                        </button>
                        <button class="action-icon-btn delete-btn" onclick="deleteStudentRecord('${student.id}')" title="Delete record">
                            <i data-lucide="trash-2" style="width: 16px; height: 16px;"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
        tableBody.innerHTML += trHTML;
    });

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Clear directory search controls
function clearDirectoryFilters() {
    document.getElementById("dir-search-input").value = "";
    document.getElementById("dir-filter-dept").value = "";
    document.getElementById("dir-filter-type").value = "";
    renderDirectory();
}

// Remove Student Record
function deleteStudentRecord(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    if (confirm(`Are you sure you want to permanently delete the registration record of ${student.fullName}?`)) {
        students = students.filter(s => s.id !== studentId);
        saveDatabase();
        showToast("Record Deleted", `Successfully removed registry of ${student.fullName}.`, "error");
        
        // Refresh directory & dashboard statistics
        renderDirectory();
        updateDashboardStats();
    }
}

// Interactive custom Toast Notifications utility
function showToast(title, message, type = "info") {
    const container = document.getElementById("toast-container");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    
    // Choose Toast visual icon
    let iconName = "info";
    if (type === "success") iconName = "check-circle";
    if (type === "error") iconName = "x-circle";

    toast.innerHTML = `
        <div class="toast-icon">
            <i data-lucide="${iconName}"></i>
        </div>
        <div class="toast-body">
            <div class="toast-title">${title}</div>
            <div class="toast-message">${message}</div>
        </div>
        <div class="toast-close">&times;</div>
    `;

    container.appendChild(toast);
    
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // Slide Toast in
    setTimeout(() => {
        toast.classList.add("show");
    }, 50);

    // Auto dismiss after 4 seconds
    const dismissTimer = setTimeout(dismissToast, 4000);

    function dismissToast() {
        toast.classList.remove("show");
        // Remove from DOM after slide out completes
        setTimeout(() => {
            toast.remove();
        }, 4000);
    }

    // Manual close button click
    toast.querySelector(".toast-close").addEventListener("click", () => {
        clearTimeout(dismissTimer);
        dismissToast();
    });
}

// Digital ID card viewer Modal controls
function setupModalControl() {
    const modal = document.getElementById("card-modal");
    const closeIcon = document.getElementById("modal-close-icon");
    const btnClose = document.getElementById("modal-btn-close");
    const btnPrint = document.getElementById("modal-btn-print");

    const closeActions = [closeIcon, btnClose];
    closeActions.forEach(btn => {
        btn.addEventListener("click", () => {
            modal.classList.remove("active");
        });
    });

    // Close on backdrop overlay click
    modal.addEventListener("click", (e) => {
        if (e.target === modal) {
            modal.classList.remove("active");
        }
    });

    // Execute standard Browser Printing Flow specifically on card ID
    btnPrint.addEventListener("click", () => {
        window.print();
    });
}

// Open digital Student Card overlay modal
function openIDCardModal(studentId) {
    const student = students.find(s => s.id === studentId);
    if (!student) return;

    const modal = document.getElementById("card-modal");
    const target = document.getElementById("modal-card-render-target");
    const printArea = document.getElementById("print-card-area");

    const deptMeta = DEPARTMENTS_COURSES[student.department] || { name: student.department, className: "cs" };
    
    // Future expiration year calculation
    const issueYear = parseInt(student.id.split("-")[1]) || new Date().getFullYear();
    const expiryYear = issueYear + 3;

    const cardContent = `
        <div class="id-card theme-${student.department}" style="margin: 0 auto; box-shadow: none;">
            <div class="id-card-header">
                <div class="id-card-logo">
                    <i data-lucide="graduation-cap"></i> Apex Academy
                </div>
                <div class="id-card-subtitle">Digital Student ID</div>
            </div>

            <div class="id-card-body">
                <div class="id-card-avatar-container">
                    <img src="${student.avatar}" alt="${student.fullName}" class="id-card-avatar">
                    <div class="id-card-badge">${student.enrollmentType}</div>
                </div>

                <div class="id-card-name">${student.fullName}</div>
                <div class="id-card-id">${student.id}</div>

                <div class="id-card-details">
                    <div class="id-detail-item">
                        <span class="id-detail-label">Department</span>
                        <span class="id-detail-value">${deptMeta.name}</span>
                    </div>
                    <div class="id-detail-item">
                        <span class="id-detail-value-course" style="font-size:0.75rem; font-weight:600; text-align: left; display:block;">
                            <span class="id-detail-label">Course Program</span><br>
                            ${student.course}
                        </span>
                    </div>
                    <div class="id-detail-item" style="margin-top:0.5rem;">
                        <span class="id-detail-label">Valid Until</span>
                        <span class="id-detail-value">Dec ${expiryYear}</span>
                    </div>
                    <div class="id-detail-item" style="text-align: right; margin-top:0.5rem;">
                        <span class="id-detail-label">Blood Group</span>
                        <span class="id-detail-value">O +ve</span>
                    </div>
                </div>
            </div>

            <div class="id-card-footer">
                <div class="id-barcode" title="Student ID Barcode">
                    <div class="id-barcode-lines"></div>
                </div>
                <div class="id-qr" title="Student Profile QR Code">
                    <div class="id-qr-box"></div>
                </div>
            </div>
        </div>
    `;

    // Inject in screen view targets
    target.innerHTML = cardContent;
    
    // Inject in browser print DOM target
    printArea.innerHTML = cardContent;

    // Display modal window overlay
    modal.classList.add("active");

    if (window.lucide) {
        window.lucide.createIcons();
    }
}

// Export database records to CSV format download
function exportDatabaseToCSV() {
    if (students.length === 0) {
        showToast("Export Failed", "Database registration records are currently empty.", "error");
        return;
    }

    // CSV Headers
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Student ID,Full Name,Email,Phone,DOB,Gender,Department,Course,Semester,Enrollment Type,Hostel,Scholarship,Sports,Registration Date\n";

    // Generate CSV Rows
    students.forEach(s => {
        const row = [
            `"${s.id}"`,
            `"${s.fullName}"`,
            `"${s.email}"`,
            `"${s.phone}"`,
            `"${s.dob}"`,
            `"${s.gender}"`,
            `"${s.department}"`,
            `"${s.course}"`,
            `"${s.semester}"`,
            `"${s.enrollmentType}"`,
            `"${s.hostel ? 'Yes' : 'No'}"`,
            `"${s.scholarship ? 'Yes' : 'No'}"`,
            `"${s.sports ? 'Yes' : 'No'}"`,
            `"${s.registeredDate}"`
        ].join(",");
        csvContent += row + "\n";
    });

    // Create virtual link to trigger browser download dialog
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `apex_academy_students_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    
    link.click();
    document.body.removeChild(link);

    showToast("Database Exported", "Student records file download triggered.", "success");
}
