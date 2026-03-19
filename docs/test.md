# Indu AE — M1, M2, M3, M5 & M6 (Stage 1) Test Checklist

**Date:** March 19, 2026

---

**Quick login buttons (dev only)** — On the login page, below the login form, there should be 5 color-coded quick-login buttons: Parent, Tutor, Consultant, Admin, Super Admin. Clicking any button should log in as the corresponding test account and redirect to the correct dashboard. If test accounts don't exist, a toast should prompt you to run `npx prisma db seed`.

**Persistent session (no Remember Me)** — Log in, close the browser entirely, reopen it and navigate back. You should still be logged in (7-day persistent cookie). There is no "Remember Me" checkbox — sessions are always persistent.

**Parent signup + email verification** — Sign up as a parent, check backend terminal for the verification link, click it, then log in. Should reach the Parent Dashboard.

**Admin login + create tutor/consultant accounts** — Log in as admin using admin credentials. Navigate to User Management, click "Add User", fill in details, select role (Tutor or Consultant), and create the account. The new user should appear in the user list. Check the backend terminal for the temp password.

**Force password change (admin-created accounts)** — Using the tutor/consultant created above, grab the temp password from the backend terminal. Log in as that user — should be forced to change password before accessing the dashboard. After changing, re-login with new credentials.

**Forgot password flow** — Click "Forgot Password" on login page, enter an email, check backend terminal for the reset link, click it, set new password, log in again.

**Admin: toggle user status** — In the Status column, flip the Switch on a user row. The badge should toggle between "Active" (green) and "Inactive" (red). The switch should be disabled during the request. Super Admin rows do not show a switch. Deactivated users cannot log in. Re-activate and confirm they can log in again.

**Admin: delete user (soft delete)** — Click the trash icon (red, first icon in Actions column for PARENT/ADMIN rows) on a user row. Confirm deletion. The user should disappear from the admin list (soft-deleted via `deletedAt` + `isActive: false`). Refresh tokens are invalidated. If the user is a tutor, their TutorProfile is also soft-deleted. Super Admin accounts cannot be deleted (403 forbidden).

**Admin: permissions management** — On an ADMIN row, click the shield icon (after the trash icon) to assign/remove permissions.

**Admin: search and filter** — Try the search box (search by name/email) and the role dropdown filter.

**Parent: child read-only access** — Log in as a parent. Call `GET /parents/children` to list children. Verify the parent can see their children but cannot create, update, or delete them (POST/PATCH/DELETE on `/parents/children` should return 404 or 405). Child management is now admin-only.

**Change password (logged-in user)** — Log in as any user (parent, tutor, or consultant), go to Settings, click "Change" under Security. Enter current password + new password. Log out and log back in with the new password.

**Parent: update profile** — Log in as a parent, go to Settings. Update profile fields (first name, last name, phone, address, city, country). Click "Save Changes". Refresh the page — changes should persist.

**Consultant: update profile** — Log in as a consultant, go to Settings. Update profile fields (first name, last name, phone, contact email). Click "Save Changes". Refresh the page — changes should persist.

**Token refresh** — Stay logged in for 15+ minutes (or wait), and verify the session stays alive via the auto-refresh mechanism.

**Duplicate email rejection** — Try creating a user with an email that already exists — both via signup and via admin "Add User".

---

---

## M2: Admin Child Management (UI)

**Admin: open child management dialog** — Log in as admin. Go to User Management. Find a PARENT row in the table — click the Users icon (Children button). A dialog should open showing that parent's children (or an empty state if none exist).

**Admin: add a child** — In the children dialog, click "Add Child". Fill in first name, last name, date of birth, select a grade from the dropdown, select one or more subjects, and optionally add notes. Click "Save". The child should appear in the list inside the dialog.

**Admin: edit a child** — In the children dialog, click the pencil icon on an existing child. The form should pre-populate with the child's current data. Change some fields (e.g., grade, add a subject) and click "Save". The updated data should reflect immediately.

**Admin: delete a child** — In the children dialog, click the trash icon on a child. The child should be removed from the list.

**Parent: verify child appears (read-only)** — Log in as the same parent whose child was just created by admin. Go to "My Children" page. The child should be visible with name, grade, DOB, and subjects. Verify there are NO edit or delete icons on the child cards. The page should say "To add or update profiles, please contact your admin."

**Parent: dashboard child cards (read-only)** — On the Parent Dashboard, the "My Children" section should show child cards without any edit or delete icons.

---

## M6 Stage 1: Demo Request Flow (UI)

### Board Reference

**Board dropdown populates** — Log in as a parent, go to Demo Requests, click "Request Demo". The Board dropdown should show boards (CBSE, ICSE, IB, Cambridge, State Board, Other) fetched from the API.

### Parent: Submit & Manage Demo Requests

**Parent: submit a demo request via UI** — Log in as a parent. Go to Demo Requests page. Click "Request Demo". Fill in: contact email (pre-filled), contact phone, child first name, child last name, child DOB, select a board, select a grade, select one or more subjects, choose a time slot (Morning/Afternoon/Evening), pick a preferred date, optionally an alternative date and notes. Click "Submit Request". The dialog should close and the new request should appear in the list with status PENDING.

**Parent: view demo request list** — The Demo Requests page should show stat cards (Total, Active, Completed, Cancelled) with correct counts. Requests should be listed below with parent name, child name, board, grade, subjects, and status badge.

**Parent: cancel a demo request** — Find a PENDING or ASSIGNED request. Click "Cancel Request". The status should change to CANCELLED and the request should move to the Cancelled section.

**Parent: cannot cancel CONFIRMED/COMPLETED requests** — Verify that CONFIRMED and COMPLETED requests do not show a cancel button.

### Consultant: Demo Request Management

**Consultant: view demo requests** — Log in as a consultant. The sidebar should show "Demo Requests" (not "Tutor Requests"). Click it. The page should show clickable stat filter cards: All, Pending, Assigned to Me, Confirmed, Completed.

**Consultant: filter by clicking stat cards** — Click the "Pending" card — only PENDING requests should show. Click "Assigned to Me" — only requests assigned to you should show. Click "All" — all requests should show. The active card should have a teal ring highlight.

**Consultant: expand a request** — Click on any request card. It should expand to show contact details (email, phone), preferred date (with alternative date if provided), child DOB, and notes.

**Consultant: assign a PENDING request** — Expand a PENDING request. Click "Assign to Me". The status should change to ASSIGNED and the request should now appear under "Assigned to Me" filter. The Pending count should decrease by 1.

**Consultant: confirm an ASSIGNED request** — Expand an ASSIGNED request. Click "Confirm". The status should change to CONFIRMED.

**Consultant: cancel an ASSIGNED request** — Expand an ASSIGNED request. Click "Cancel". The status should change to CANCELLED.

**Consultant: mark CONFIRMED as completed** — Expand a CONFIRMED request. Click "Mark Completed". The status should change to COMPLETED.

**Consultant: invalid status transitions** — Verify that you cannot go backwards (e.g., COMPLETED back to CONFIRMED). The API should reject invalid transitions.

### Consultant Dashboard

**Consultant: dashboard labels** — Log in as a consultant. The dashboard should show "Pending Demo Requests" (not "Tutor Requests") in the metrics card, welcome banner ("12 pending demo requests"), and the "View Demo Requests" button. The "Pending Demo Requests" section should link to the Demo Requests page.

### Full End-to-End Flow

**E2E: parent → consultant → completed** — (1) Log in as parent, submit a demo request. (2) Log in as consultant, verify the request appears in the Pending list, assign it to yourself. (3) Confirm the request. (4) Mark it as completed. (5) Log back in as parent, verify the request shows as COMPLETED.

---

## M3: Tutor Management (UI)

### Public Tutor Directory (Parent — Find Tutors)

**Parent: browse tutors** — Log in as a parent. Click "Find Tutors" in the sidebar. The page should load tutors from the API with name, experience, rating, subjects, and bio snippet. If no tutors exist yet, an empty state should show.

**Parent: search tutors** — Type a tutor's name in the search bar and press Enter. Results should filter to matching tutors. Clear the search — all tutors should reappear.

**Parent: filter by subject** — Select a subject from the dropdown. Only tutors teaching that subject should appear. Select "All Subjects" to reset.

**Parent: sort tutors** — Change the sort dropdown (e.g., "Highest Rated", "Most Experience"). Verify the order changes accordingly.

**Parent: pagination** — If more than 9 tutors exist, pagination controls should appear. Click "Next" to load the next page.

**Parent: click tutor card to view profile** — Click anywhere on a tutor card (not just the avatar). A dialog should open showing the tutor's full profile: bio, subjects with rates, certifications, intro video (YouTube embed if set), and availability for the next 7 days.

**Parent: view tutor intro video** — In the tutor profile dialog, if the tutor has an intro video URL set, a YouTube embed should be visible in the "Intro Video" section. If no video is set, the section should not appear.

### Tutor Self-Management (Tutor Dashboard)

**Tutor: view own profile** — Log in as a tutor. Click "Profile" in the sidebar. The page should load the tutor's profile from the API showing name, email, bio, experience, phone, and profile photo placeholder.

**Tutor: edit profile** — Click "Edit Profile". Change the bio, phone number, or years of experience. Click "Save Changes". Refresh the page — changes should persist.

**Tutor: view certifications** — On the Profile page, scroll to the Certifications section. Any existing certifications should display with title, institution, year, and a link to the document.

**Tutor: add certification** — Click "Add Certification". Fill in title, institution, year, and document URL. Click "Add". The new certification should appear in the list.

**Tutor: delete certification** — Click the trash icon on a certification. It should be removed from the list.

**Tutor: add intro video** — On the Profile page, scroll to the Intro Video section. Click "Add Video". Enter a valid YouTube URL (e.g., `https://www.youtube.com/watch?v=dQw4w9WgXcQ`). Click "Save". The video should appear as an embedded YouTube player.

**Tutor: change intro video** — With a video already saved, click "Change". Enter a different YouTube URL. Click "Save". The embed should update to the new video.

**Tutor: remove intro video** — With a video already saved, click "Remove". The video embed should disappear and the "Add Video" button should reappear.

**Tutor: view dashboard** — Click "Dashboard" in the sidebar. The dashboard should show real stats: total students, upcoming sessions, completed sessions, total earnings, average rating, and subjects count. (Values may be 0 for a new tutor — that's expected.)

### Admin Tutor Management

**Admin: navigate to Tutor Management** — Log in as admin. The sidebar should show "Tutor Management" (with a graduation cap icon). Click it. The Tutor Management page should load.

**Admin: list all tutors** — The page should show a table of all non-deleted tutors with name, email, subjects, status (Switch + Badge), and actions (Pencil edit, Subjects, Performance, Trash delete). If no tutors exist, an empty state should show.

**Admin: search tutors** — Type a tutor's name or email in the search box. The table should filter to matching tutors.

**Admin: toggle tutor status** — In the Status column, flip the Switch on a tutor row. The badge should toggle between "Active" (green) and "Inactive" (red). The switch should be disabled during the request. This only changes `isActive` — the tutor remains in the admin list but won't appear in public search if deactivated.

**Admin: edit tutor details** — Click the pencil (edit) icon on a tutor row. An edit dialog should open with name, phone, bio, experience fields. Change some values and click "Save". The table should reflect the updated data.

**Admin: delete tutor (soft delete)** — Click the trash icon (red) on a tutor row. Confirm deletion. The tutor should disappear from the admin table (soft-deleted via `deletedAt` + `isActive: false`). Their user account is also deactivated and refresh tokens invalidated.

**Admin: assign subject to tutor** — Click the "Manage Subjects" button on a tutor row. A dialog should open showing currently assigned subjects. Select a new subject from the dropdown, enter a rate (per hour), and click "Assign". The subject should appear in the tutor's subject list.

**Admin: remove subject from tutor** — In the Manage Subjects dialog, click the X/remove button on an assigned subject. It should be removed.

**Admin: view tutor performance** — Click the chart/performance icon on a tutor row (if available). Should show total sessions, completed sessions, cancelled sessions, average rating, and total earnings.

---

## M5: Availability & Scheduling (UI)

### Tutor Availability Self-Management

**Tutor: view availability page** — Log in as a tutor. Click "Availability" in the sidebar. The page should load with two sections: Weekly Templates and Blocked Dates. A summary card should show total weekly hours.

**Tutor: add availability template** — Click "Add Time Slot". Select a day of the week (Monday–Sunday), enter start time and end time. Click "Add". The new template should appear under the correct day group. The weekly hours summary should update.

**Tutor: add multiple templates** — Add templates for different days (e.g., Monday 9:00–12:00, Wednesday 14:00–17:00). Each should appear grouped by day.

**Tutor: delete availability template** — Click the trash icon on an existing template. It should be removed. The weekly hours summary should decrease.

**Tutor: add blocked date** — In the Blocked Dates section, click "Block Date". Select a future date and optionally enter a reason (e.g., "Family event"). Click "Add". The blocked date should appear in the list.

**Tutor: delete blocked date** — Click the trash icon on a blocked date. It should be removed from the list.

**Tutor: empty state** — If no templates or blocked dates exist, the page should show appropriate empty state messages (e.g., "No availability templates set up yet").

### Availability Computation (Parent View)

**Parent: view tutor availability** — From the Find Tutors page, click "View Profile" on a tutor, then click "Book Session" or view availability. The system should compute available slots for the next 7 days based on the tutor's templates minus blocked dates. Only future slots should appear.

---

## M4: Course & Subject Management (UI)

### Admin: Course CRUD

**Admin: navigate to Course Management** — Log in as admin. The sidebar should show "Course Management" (with a book icon). Click it. The page should load with a table of all courses.

**Admin: view course list** — The table should display courses with name, subject, grade, credits/class (from grade tier), status (Switch + Badge), and actions (Pencil, Materials, Trash). Stats cards at the top should show total courses, active count, and subject count.

**Admin: search and filter courses** — Type a course name in the search box. Use the Subject and Grade dropdowns to filter. The table should update in real time. Pagination should work if more than 20 courses exist.

**Admin: create a course** — Click "Create Course". Select a subject and grade from the dropdowns — the course name should auto-generate (e.g., "Mathematics — Grade 5"). Optionally add a description. Click "Create". The course should appear in the table.

**Admin: duplicate subject+grade rejection** — Try creating a course with the same subject+grade combo as an existing course. Should show an error toast.

**Admin: toggle course status** — In the Status column, flip the Switch on a course row. The badge should toggle between "Active" (green) and "Inactive" (red). The switch should be disabled while the request is in progress. This only changes `isActive` — the course remains in the admin list.

**Admin: edit a course** — Click the pencil (edit) icon on a course row. Change the name, description, or toggle Active/Inactive in the edit dialog. Click "Save Changes". The table should reflect the updates.

**Admin: delete a course (soft delete)** — Click the trash icon (red) on a course. Confirm deletion. The course should disappear from the admin table (soft-deleted via `deletedAt` field). This is different from deactivation — deleted courses are permanently hidden from admin lists and cannot be restored.

### Admin: Course Materials

**Admin: open materials dialog** — Click the document (FileText) icon on a course row. A dialog should open showing existing materials (or empty state).

**Admin: add material** — In the materials dialog, enter a title, file URL, and file type (PDF, DOCX, etc.). Click "Add". The material should appear in the list.

**Admin: remove material** — Click the X button on a material. It should be removed from the list.

### Admin: Grade Tier Pricing

**Admin: view grade tiers** — Click the "Grade Tiers" button at the top of the Course Management page. A dialog should show all grade tiers with their current credits/class value (e.g., Tier 1: 2 credits, Tier 2: 3 credits).

**Admin: edit grade tier credits** — Click the pencil icon on a tier. Change the credits/class value. Click "Save". The tier should update. Courses in that tier should now reflect the new pricing.

### Public: Course Browsing

**Public: list courses** — Call `GET /courses` — should return active, non-deleted courses with subject, grade, and tier info. Inactive or soft-deleted courses should not appear.

**Public: get course detail** — Call `GET /courses/:id` — should return course with materials, assigned tutors, and grade tier. Should return 404 for deleted courses.

---

## M8: Credit Wallet System (UI)

### Admin: Credit Package Management

**Admin: navigate to Credits & Wallets** — Log in as admin. The sidebar should show "Credits & Wallets" (with a credit card icon). Click it. The page should load with two tabs: "Credit Packages" and "Parent Wallets".

**Admin: view credit packages** — The "Credit Packages" tab should show all non-deleted packages with name, credits, price in AED, status (Switch + Badge), and actions (Pencil edit, Trash delete). Packages should be sorted by price ascending (cheapest first: Starter → Standard → Premium). There is no Sort Order field.

**Admin: create credit package** — Click "New Package". Enter name, credits, and price in AED. Click "Create". The package should appear in the table sorted by price. There is no Sort Order field.

**Admin: toggle package status** — In the Status column, flip the Switch on a package row. The badge should toggle between "Active" (green) and "Inactive" (red). The switch should be disabled while the request is in progress. This only changes `isActive` — the package remains in the admin list. Inactive packages do not appear in the public package list.

**Admin: edit credit package** — Click the pencil (edit) icon on a package. Change name, credits, or price. Click "Save Changes". The table should update. Note: Active/Inactive toggle is in the Status column, not in the edit dialog.

**Admin: delete credit package (soft delete)** — Click the trash icon (red) on a package. Confirm deletion. The package should disappear from the admin table (soft-deleted via `deletedAt` field, also sets `isActive: false`). This is different from deactivation — deleted packages are permanently hidden and cannot be restored.

**Admin: verify standard package price** — The "Standard Pack" should show AED 100.00 (10 credits). If it shows AED 112.50, re-run `npx prisma db seed` to apply the price fix.

### Admin: Parent Wallet Management

**Admin: view parent wallets** — Click the "Parent Wallets" tab. A table should show all parents with their name, email, and current credit balance.

**Admin: search wallets** — Type a parent name or email in the search box. The table should filter to matching results.

**Admin: adjust credits (add)** — Click "Adjust" on a parent row. Enter a positive amount (e.g., 10) and a reason (e.g., "Welcome bonus"). Click "Confirm Adjustment". The parent's balance should increase. Type should be ADMIN_ADJUSTMENT.

**Admin: adjust credits (deduct)** — Click "Adjust" on a parent row. Enter a negative amount (e.g., -5) and a reason. Click "Confirm Adjustment". The parent's balance should decrease. Should fail if balance would go negative.

### Parent: Credits Page

**Parent: view credit balance** — Log in as a parent. Go to Credits page. The page should show the real credit balance (fetched from `GET /wallet/balance`) with a gradient card showing current balance, total purchased, and total used.

**Parent: view transaction history** — The transaction history section should list all transactions from the API with type icons (green for purchases, red for deductions, blue for adjustments), description, date, and amount. Filter by type using the dropdown.

**Parent: paginate transactions** — If more than 15 transactions exist, pagination controls should appear.

**Parent: view credit packages** — Click "Purchase Credits". A dialog should show active credit packages (from `GET /credit-packages`) with name, credits, and AED price. Packages should be sorted by price ascending (cheapest first).

**Parent: purchase flow** — Click a package. A toast should indicate "Payment gateway integration coming soon." (Payment integration is a future feature.)

### Public: Credit Packages API

**Public: list active packages** — Call `GET /credit-packages` — should return only active, non-deleted packages sorted by price ascending.

---

### Consistent Admin UI Pattern (applies to all admin management pages)

All admin management pages (User Management, Tutor Management, Course Management, Credits & Wallets) follow the same UI pattern:

- **Status column:** Switch toggle + Badge (green "Active" / red "Inactive"). Flipping the switch changes `isActive` only — this is reversible. The switch is disabled during the async request.
- **Actions column:** Pencil (edit) + role-specific icons + Trash2 (delete, red). The trash icon performs a soft delete (`deletedAt` + `isActive: false`) — the record disappears from admin lists and cannot be restored.
- **Toggle ≠ Delete:** Toggle is reversible (just flips `isActive`). Delete is irreversible (sets `deletedAt`, hides from all lists).
- **Super Admin protection:** Super Admin accounts cannot be deactivated or deleted.
- **Icon order in User Management:** For PARENT and ADMIN rows, Trash2 (delete) appears first, then role-specific icon (Shield for admins, Users for parents).

---

*Note: Verification links, reset links, and temp passwords are logged to the backend terminal during development. In production these will be sent via email.*
