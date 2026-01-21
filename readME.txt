Project Name: StudyBuddy
Name: Edigha Emmanuel 
Matric: 24/16012
Department: Cyber Security
 A web-based study session planner application built as part of the Software Development Life Cycle (SDLC) assignment. The app helps students plan, track, and manage their study sessions effectively.
Github Repo: https://github.com/edigha/StudyBuddy
 Problem Statement
As a university student, managing study time across multiple subjects can be challenging. Students often struggle with:
- Planning study sessions for different courses
- Tracking study progress and completion
- Managing study resources and materials
- Prioritizing subjects based on urgency
- Maintaining consistent study habits

 Features
- Plan study sessions with subject, topic, duration, and priority
- Track session status (Pending, In Progress, Completed)
- Filter sessions by status and priority
- View study progress and statistics
- Store study resources and notes
- Data persistence using LocalStorage
- Responsive design for mobile and desktop

SDLC Implementation (Waterfall Model)

 Phase 1: Planning
- Problem: Students need systematic study session planning
- Solution: Create a digital study planner with tracking features
- Target Users: University students
- Tools: HTML, CSS, JavaScript, LocalStorage

 Phase 2: Requirements Analysis
Functional Requirements:
- Create, read, update, delete study sessions
- Track session status and completion
- Filter and sort sessions
- Calculate study statistics
- Store session data locally

Non-Functional Requirements:
- Responsive design
- Offline functionality
- Fast performance
- Intuitive user interface

 Phase 3: System Design
Architecture: Client-side web application
Components:
- `StudySession` class - Data model
- `StudyPlanner` class - Application logic
- HTML/CSS - User interface
- LocalStorage - Data persistence

 Phase 4: Implementation
Technologies Used:
- HTML5 for structure
- CSS3 for styling and responsiveness
- JavaScript (ES6+) for functionality
- LocalStorage API for data persistence
- Font Awesome for icons

 Phase 5: Testing
- Tested CRUD operations
- Verified data persistence
- Tested responsive design
- Validated calculations
- Cross-browser testing

 Phase 6: Deployment
- Runs in any modern browser
- No installation required
- Can be hosted on GitHub Pages

 Phase 7: Maintenance
- Bug fixes and improvements
- Feature enhancements based on feedback
- Performance optimization

 How to Use
1. Open `index.html` in a web browser
2. Fill out the form to add a study session
3. View and manage sessions in the list
4. Click on sessions to view details and update status
5. Use filters to organize sessions

File Structure
StudyBuddy/
├── index.html # Main application
├── style.css # Stylesheets
├── script.js # Application logic
└── README.md # Documentation

Technical Details
- Frontend: HTML5, CSS3, Vanilla JavaScript
- Storage: Browser LocalStorage
- Design: Responsive with CSS Grid/Flexbox
- Icons: Font Awesome 6
- Fonts: Google Fonts (Poppins)

 Future Enhancements
- Add study timer/stopwatch
- Implement Pomodoro technique
- Add calendar view
- Create study groups feature
- Add progress charts and graphs
- Export study reports

