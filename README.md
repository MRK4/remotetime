# 🌍 Remote Workforce Time Visualizer — POC

## Overview

This project is a Proof of Concept web application designed for companies that embrace remote work.  
Its purpose is to help teams visualize when collaborators are working across time zones in order to better schedule meetings, calls, and collaborative sessions.

The application displays a world globe showing where team members are located.  
Users can select a time range and instantly see which collaborators are available based on working hours, timezone, role, and availability status.

This project is strictly a frontend POC using static in-app data.

---

## Goal

The main objective is to provide a clear and visual way to identify optimal collaboration windows across distributed teams.

The application helps answer questions such as:

- Who is working during a specific time window?
- Where are available collaborators located?
- Which roles are currently reachable?
- When is the best time to organize a meeting?

This project is intended as a technical and UI demonstration rather than a production-ready tool.

---

## Tech Stack

- **Framework:** Next.js (App Router)
- **Styling:** TailwindCSS
- **UI Components:** shadcn/ui
- **Data:** Static hardcoded data (POC only)

---

## Core Features

### 🌐 Globe Visualization
- Interactive world globe displaying collaborators
- Visual markers representing each person’s location
- Highlighting of matching users based on filters
- Clear visual distribution of the remote workforce

### ⏱ Time Range Selection
- User selects a custom time range
- Automatic timezone handling
- Identification of collaborators working within that range

### 👥 Filtering System
Users can filter collaborators based on:
- Role within the company
- Working hours

### ✨ Highlighting Matching Users
Collaborators matching:
- Selected time range  
- Availability  
- Selected filters  

…are visually emphasized on the globe and within a list.

---

## Userning Principles

- Clarity over complexity
- Strong visual feedback
- Fast filtering and instant results
- Clean and modern UI
- Focus on usability for distributed teams

---

## Possible Future Evolution

- Real database integration
- Authentication and company workspaces
- Calendar integrations (Google / Outlook)
- Slack / Teams integrations

---

## Purpose of the Project

This project demonstrates how modern web technologies can help distributed teams better understand availability across time zones through clear and interactive visualization.

It is designed as a technical showcase and exploration of remote collaboration tooling.

