# Hospital Triage App Design Document

## Design Overview
The Hospital Triage App provides a professional and consistent interface for both patients and administrative staff to manage and navigate the emergency triage process. This document outlines the design system for the Hospital Triage App, detailing the visual, structural, and interactive design elements used throughout the application. 

---

## Fonts
- **Roboto (Bold, Medium, Regular):**  
  Used across all headings, buttons, labels, and body text for its clean appearance and high legibility on digital screens.

---

## Colour Palette

### User Interface
- **Dark Green (#0E3B2E):** Primary colour for main buttons and headings, creating a calm and trustworthy tone.  
- **White (#FFFFFF):** Main background colour to reduce visual strain and increase clarity.  
- **Light Grey (#D9D9D9):** Used for borders, outlines, and subtle dividers.

### Admin Interface
- **Dark Grey (#1A1A1A):** Used for titles, table text, and key admin elements to support readability and contrast.  
- **White (#FFFFFF):** Clean background used across the admin dashboard for fast scanning of patient entries.

---

## App Components

### Titles
- “Hospital Triage – User” and “Hospital Triage – Admin”  
- Displayed prominently using **Roboto Bold**, providing clear context for each interface.

### Buttons
- **Primary Buttons:**  
  Dark Green background, White text, rounded edges.
- **Secondary Buttons:**  
  White background with Light Grey border, Dark Grey text.

### Input Fields
- White background with Light Grey border, clear padding, and Dark Grey text.
- Focus state highlights the field with a Dark Green border.

### Patient Questionnaire
- A clean form on the user page where patients select injury type and pain level.

### Admin Summary
- A structured dashboard showing patient submissions with controls to modify urgency levels or remove patients.

---

## Layout and Navigation
- Mobile-first, single-column layout for clarity and ease of use.  
- Clear hierarchy throughout: **Title → Description → Inputs/Controls → Action Buttons**.  
- User page optimized for fast form submission; admin page optimized for quick scanning and decision-making.

---

## Consistency
- Consistent application of the colour palette across all screens.  
- Typography hierarchy maintained using Roboto (Bold for titles, Medium for labels, Regular for body text).  
- Uniform component styling ensures predictable behaviours across the app.

---

## Component Integration
The titles, questionnaire, and input fields on the user page, along with the admin summary and action buttons on the admin page, work together to create a cohesive and intuitive triage flow.

---

## Functionality
The app enables patients to record their conditions quickly and allows staff to process and prioritize cases efficiently. The design supports high-paced triage environments by emphasizing clarity, simplicity, and speed.
