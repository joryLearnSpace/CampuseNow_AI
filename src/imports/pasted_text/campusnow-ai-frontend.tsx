Create a **simple, modern, professional web interface** for a university platform called **CampusNow AI**.

## Project Idea

CampusNow AI is a smart university community platform that helps students ask questions and request help based on their current campus location.

Examples:

* "Is the library crowded now?"
* "Are there available seats in the library?"
* "Is the computer lab open?"
* "I lost my AirPods in the Computing Building."
* "Can someone in this building help me?"

The platform uses a **Python Multi-Agent System** in the backend.

The frontend MUST be designed to integrate with the existing **Python + FastAPI backend**. Do not implement AI logic inside React.

Technology:

* React
* TypeScript
* Vite
* Simple reusable components
* Responsive design
* REST API integration with Python/FastAPI
* Supabase authentication can be integrated later

---

# Design Style

Keep the interface **simple, clean, professional, and suitable for a Saudi university**.

Do NOT make it look overly futuristic or like a complicated AI dashboard.

Use:

* White/light background
* Dark navy as the primary color
* Soft blue accents
* Subtle green for verified/success states
* Light gray cards and borders
* Rounded cards
* Simple professional icons
* Clean typography
* Generous spacing
* Minimal animations

The interface should feel like a combination of a **university portal + modern community platform**.

Support both **English and Arabic layouts**, including RTL readiness.

---

# Main Navigation

Create a simple top navigation bar.

Left:

**CampusNow AI** logo/name

Navigation:

* Home
* Campus
* Ask
* Lost & Found
* Volunteer
* Profile

Right:

* Notifications icon
* User avatar/profile

On mobile, use a simple bottom navigation or hamburger menu.

---

# 1. Login Page

Create a clean university login page.

Display:

**CampusNow AI**

Subtitle:

> Know what's happening around campus — now.

Fields:

* University Email
* Password

Button:

**Sign In**

Also display:

> For university students and authorized staff.

Keep this page minimal.

Prepare the authentication functions so they can later connect to Supabase Auth.

---

# 2. Home Page — Campus Live

This is the main dashboard.

At the top display:

**Good morning, [Student Name]**

Then show the student's selected/current campus location:

📍 **Computing Building**

Status:

🟢 Checked in

Button:

**Change Location**

If the student has not checked in:

**Check In**

The Check In button must be prepared to call:

`POST /api/checkins`

---

## Quick Actions

Create four simple cards/buttons:

**Ask Here**

**Need Help**

**Lost & Found**

**What's Happening**

---

# Live Campus Feed

Below the quick actions display:

## Happening Now

Show simple cards such as:

### Central Library

📍 Central Library

**Is the library crowded right now?**

Status:

🟢 Verified

**Moderately crowded**

84% confidence

12 minutes ago

---

Another example:

### Lost Item

📍 Computing Building

**AirPods found near Lab 204**

15 minutes ago

---

Another:

### Help Request

📍 Student Services

**Can someone tell me if the service desk is open?**

2 responses

---

Allow filtering by:

* All
* Questions
* Help
* Lost & Found
* Events

---

# 3. Campus Locations Page

Create a page called:

## Explore Campus

Include a search bar:

**Search buildings or locations...**

Display location cards:

### Central Library

🟢 18 active users

Last update: 5 min ago

**View Location**

---

### Computing Building

🟢 27 active users

6 recent updates

**View Location**

---

### Student Services

🟡 8 active users

Last update: 12 min ago

**View Location**

IMPORTANT:

Never display the exact location of an individual student.

Only show aggregated information such as:

**18 active users**

Never:

**Sarah is currently in Room 204.**

---

# 4. Location Details Page

When a user selects a campus location, create a page such as:

# Central Library

Display:

📍 Central Library

🟢 **18 active users**

**Last verified update: 5 minutes ago**

---

## Current Status

Create a clean status card:

**Moderately Crowded**

Confidence:

**84%**

Last verified:

**5 minutes ago**

Supporting confirmations:

**6 students**

---

Below it provide actions:

**Ask Here**

**Confirm Status**

**Request Help**

**Report Lost Item**

---

Then:

## Recent Questions

Example:

**Are there seats upstairs?**

4 responses

Verified ✓

10 min ago

---

**Is the study room available?**

2 responses

Waiting for confirmation

18 min ago

---

# 5. Ask CampusNow Page

Create a simple form.

Title:

# Ask CampusNow

Subtitle:

> Ask students who are currently near this location.

Fields:

### Your Question

Textarea placeholder:

**e.g. Is the library crowded right now?**

### Location

Dropdown containing campus locations.

### Category

Options:

* Place Status
* Help
* Lost & Found
* Event
* Other

Button:

**Ask Now**

---

## Python Integration

When the user clicks **Ask Now**, send:

`POST /api/requests`

Example request:

```json
{
  "question": "Is the central library crowded now?",
  "location_id": "central-library",
  "requester_id": "CURRENT_USER_ID"
}
```

The React interface must NOT generate an AI answer itself.

The Python backend runs:

**Agent 1 — Campus Request & Routing Agent**

Then return and display:

* Request ID
* Request status
* Number of eligible responders
* Routing message

Example UI:

**Your question has been sent.**

👥 12 students may be able to help.

Status:

**Waiting for responses...**

---

# 6. Community Response Interface

Students who are checked into the relevant location should be able to answer.

Display:

## Someone needs help nearby

📍 Central Library

**Is the library crowded right now?**

Buttons for quick responses where appropriate:

**Not Crowded**

**Moderate**

**Very Crowded**

Or allow:

**Write a response**

Button:

**Submit Response**

Connect this to:

`POST /api/requests/{request_id}/responses`

Send:

```json
{
  "responder_id": "CURRENT_USER_ID",
  "answer": "Moderately crowded, but there are seats upstairs.",
  "is_present_now": true
}
```

The frontend must NOT decide whether the user is actually present.

The Python backend will verify the user's active Check-In.

After submission display:

✓ **Response submitted**

If presence is verified:

✓ **Presence verified**

---

# 7. Verified Answer Page

After enough responses have been collected, allow the interface to request verification through:

`POST /api/requests/{request_id}/verify`

The Python backend will run:

**Agent 2 — Trust & Verification Agent**

followed by:

**Agent 3 — Community & Volunteer Agent**

Display the returned result professionally.

Example:

# Verified Answer

📍 Central Library

**The library appears moderately crowded, but several seats are available upstairs.**

### Confidence

**84%**

Create a simple progress indicator.

Supporting responses:

**6**

Last updated:

**3 minutes ago**

Badge:

✓ **Community Verified**

---

If confidence is low, do NOT display the result as verified.

Instead display:

⚠️ **Not enough information yet**

> We don't have enough recent reliable responses to confirm the current status.

Button:

**Check Again**

This state is important because the Python AI agents must not hallucinate live campus information.

---

# 8. Lost & Found Page

Create a simple Lost & Found page.

Tabs:

**Lost**

**Found**

Button:

**Report Item**

Cards should contain:

* Item name
* General campus location
* Date/time
* Description
* Status

Example:

### AirPods

📍 Computing Building

Found today

**Possible Match**

Button:

**View Details**

Do not expose sensitive contact or exact-location information publicly.

---

# 9. Volunteer Page

Create:

# Campus Helpers

Subtitle:

> Help your university community and build your contribution record.

Display the student's profile:

**Helper Level**

Trusted Helper

**Community Points**

240

**Verified Contributions**

18

**Helpful Responses**

15

---

## Volunteer Activity

Display:

Eligible activity:

**2h 20m**

Status:

🟡 **Pending University Review**

Important:

The frontend must clearly distinguish:

**Community Points**

from:

**Official Volunteer Hours**

Never tell users that AI automatically approved volunteer hours.

Official hours must show:

**Pending Human Review**

until an administrator approves them.

---

# 10. Profile Page

Display:

Student name

University email

Faculty/College

Helper Level

Community Points

Verified Contributions

Recent activity

Privacy settings

Include:

### Location Privacy

Toggle:

**Allow temporary campus Check-In**

Explanation:

> CampusNow only uses your temporary campus zone to route relevant requests. Your exact location is never publicly displayed.

---

# 11. Admin Dashboard

Create a simple separate administrator interface.

Navigation:

* Overview
* Volunteer Reviews
* Moderation
* Agent Logs
* Locations

Dashboard cards:

**Active Requests**

**Pending Reviews**

**Active Helpers**

**Low Confidence Requests**

---

## Volunteer Reviews

Display:

Student

Contribution count

Eligible activity

Agent recommendation

Button:

**Review**

When opened:

### Volunteer Contribution Review

Show:

* Contributions
* Verification information
* AI recommendation
* Relevant audit information

Buttons:

**Approve**

**Reject**

**Request Revision**

These actions must connect to:

`POST /api/human-reviews/{review_id}/decision`

The HUMAN administrator makes the final decision.

---

# 12. Agent Transparency

Do not expose complicated AI reasoning or chain-of-thought.

Instead provide simple status messages.

For example:

**Processing your request...**

Then:

✓ Request understood

✓ Relevant campus location identified

⏳ Waiting for community responses

✓ Responses received

✓ Information verified

✓ Result ready

Do not display internal prompts or hidden reasoning.

---

# Python Multi-Agent Integration

The frontend must be fully prepared to connect to the existing Python backend.

Backend:

**Python + FastAPI + CrewAI + Supabase**

The backend contains three specialised agents:

### Agent 1

**Campus Request & Routing Agent**

Responsible for understanding and routing requests.

### Agent 2

**Trust & Verification Agent**

Responsible for validating evidence and calculating confidence.

### Agent 3

**Community & Volunteer Agent**

Responsible for evaluating contributions, reputation, points, and volunteer-review recommendations.

The agents use a:

**Sequential Multi-Agent Workflow**

with:

**Human-in-the-Loop for high-impact actions.**

---

# API Service

Create a reusable TypeScript API layer such as:

`src/services/campusNowApi.ts`

Do NOT scatter `fetch()` calls across UI components.

Include functions such as:

```ts
createCheckIn()
createCampusRequest()
submitCommunityResponse()
getCampusRequest()
verifyCampusRequest()
decideHumanReview()
```

Use:

```ts
const API_BASE =
  import.meta.env.VITE_CAMPUSNOW_API ??
  "http://localhost:8000/api";
```

All React components must call this API service.

---

# Important Architecture Rule

The architecture MUST remain:

```text
React + TypeScript
        ↓
REST API
        ↓
Python FastAPI
        ↓
Multi-Agent System
        ↓
Agent 1
Routing
        ↓
Community / Supabase
        ↓
Agent 2
Verification
        ↓
Agent 3
Community & Volunteer
        ↓
Human Review when required
        ↓
FastAPI JSON Response
        ↓
React Interface
```

Do NOT recreate the agents in TypeScript.

Do NOT call the LLM directly from React.

Do NOT expose AI API keys or the Supabase Service Role Key in the frontend.

The React interface is the **presentation layer**.

Python/FastAPI is the **backend and agent layer**.

---

# Required React Structure

Organize the frontend approximately as:

```text
src/
├── components/
│   ├── Navbar.tsx
│   ├── LocationCard.tsx
│   ├── CampusFeedCard.tsx
│   ├── ConfidenceBadge.tsx
│   ├── StatusBadge.tsx
│   └── LoadingState.tsx
│
├── pages/
│   ├── Login.tsx
│   ├── Home.tsx
│   ├── Campus.tsx
│   ├── LocationDetails.tsx
│   ├── Ask.tsx
│   ├── RequestDetails.tsx
│   ├── LostFound.tsx
│   ├── Volunteer.tsx
│   ├── Profile.tsx
│   └── AdminDashboard.tsx
│
├── services/
│   └── campusNowApi.ts
│
├── types/
│   └── campusNow.ts
│
├── App.tsx
└── main.tsx
```

Keep components reusable and avoid unnecessarily large files.

---

# UX Requirements

Every API request must have:

* Loading state
* Success state
* Error state
* Empty state where appropriate

For requests waiting for community responses, display:

**Waiting for responses...**

Do not fake responses.

For verification:

**Verifying community information...**

For low confidence:

**Not enough reliable information yet.**

For successful verification:

**Verified community result**

For Human-in-the-Loop:

**Pending administrator review**

---

# Final Requirement

Build the interface as a **functional frontend prepared for real backend integration**, not as a static UI mockup.

All forms, buttons, request states, response states, verification results, confidence indicators, Check-In actions, volunteer-review actions, and admin actions must be designed around the provided Python/FastAPI API.

Where the Python endpoint already exists, connect the interface to it.

Where a future endpoint is required, isolate it inside the TypeScript API service and clearly mark it as a future integration point rather than implementing fake frontend AI logic.

Keep the final product **simple, professional, realistic, easy to navigate, and suitable for a university hackathon demonstration**.
