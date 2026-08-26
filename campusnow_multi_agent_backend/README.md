# CampusNow AI — 3-Agent Backend

This project follows the same creation pattern used in the supplied Day 4 CrewAI notebooks:

1. Configure the LLM.
2. Create specialised agents with `role`, `goal`, `backstory`, and `llm`.
3. Create tasks with clear `description` and `expected_output`.
4. Enforce structured output with Pydantic (`output_pydantic`).
5. Run the workflow sequentially.
6. Explicitly validate inputs and outputs.
7. Add guardrails, logging, stopping conditions, and Human-in-the-Loop for high-impact actions.

## Agents

### Agent 1 — Campus Request and Routing Specialist
Classifies the request, preserves the selected campus zone, decides whether live human input is needed, and chooses the appropriate source.

### Agent 2 — Campus Trust and Verification Specialist
Uses only supplied evidence, checks freshness/presence/consistency, and produces a conservative confidence score.

### Agent 3 — Campus Community and Volunteer Specialist
Evaluates useful contributions, awards small community points, detects suspicious behavior, and sends official volunteer-credit candidates to human review.

The application uses a **sequential workflow**:
`Routing -> Verification -> Community/Volunteer`

Human review is added for official volunteer credit and other high-impact decisions.

---

## Why the real app is split into two moments

A location-based question usually cannot be answered by all 3 agents in one instant because human responses may arrive later.

**Moment 1**
`React -> POST /api/requests -> Agent 1 -> DB -> waiting for community`

**Moment 2**
Community responses arrive, then:
`React -> POST /api/requests/{id}/verify -> Agent 2 -> Agent 3 -> final result`

This keeps the CrewAI design realistic instead of inventing live answers.

---

## Setup

### 1. Create a virtual environment

```bash
python -m venv .venv
```

Activate it, then:

```bash
pip install -r requirements.txt
```

### 2. Configure environment

Copy `.env.example` to `.env`.

Never put `OPENAI_API_KEY` or `SUPABASE_SERVICE_ROLE_KEY` in React.

### 3. Create Supabase tables

Run `supabase_schema.sql` in the Supabase SQL editor.

### 4. Start FastAPI

```bash
uvicorn app.main:app --reload --port 8000
```

Open:

`http://localhost:8000/docs`

The OpenAPI page lets you test the backend before connecting React.

### 5. Configure React

Put this in your React/Vite `.env`:

```env
VITE_CAMPUSNOW_API=http://localhost:8000/api
```

Copy:

- `react-example/campusNowApi.ts`
- `react-example/AskCampusNow.tsx`

into your React project and adapt the UI.

---

## API flow

### Check in

```http
POST /api/checkins
```

```json
{
  "user_id": "student-123",
  "location_id": "central-library"
}
```

### Create request — Agent 1

```http
POST /api/requests
```

```json
{
  "question": "Is the central library crowded now?",
  "location_id": "central-library",
  "requester_id": "student-999"
}
```

### Submit community response

```http
POST /api/requests/{request_id}/responses
```

```json
{
  "responder_id": "student-123",
  "answer": "Moderately crowded; I can see several free seats upstairs.",
  "is_present_now": true
}
```

The backend verifies presence from an active check-in. It does not trust the browser boolean alone.

### Verify — Agents 2 and 3

```http
POST /api/requests/{request_id}/verify
```

Possible result:

```json
{
  "request_id": "...",
  "status": "verified",
  "verification": {
    "answer": "The library appears moderately crowded, with some seats reported upstairs.",
    "confidence_score": 84,
    "evidence_used": ["response-id-1", "response-id-2"],
    "conflicting_evidence": false,
    "sufficient_evidence": true,
    "warning": null
  },
  "community": {
    "contribution_decisions": [],
    "volunteer_review_required": false,
    "moderation_required": false,
    "summary": "Useful recent contributions were recorded."
  }
}
```

If evidence is weak, the API returns `low_confidence` rather than asking the LLM to invent an answer.

---

## Important production notes

This package is a strong project/prototype backend, but before real university deployment you should:

- Replace client-supplied `user_id` with authenticated user identity from a verified Supabase JWT.
- Add Row Level Security policies in Supabase.
- Add rate limiting.
- Add a notification service for routed students.
- Add formal university policy for volunteer-hour recognition.
- Add privacy/legal review for location and student data.
- Add tests, tracing, retries and cost monitoring.
- Use a queue/background worker for higher traffic instead of running LLM calls inline.
