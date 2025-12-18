# **App Name**: ChronoHabits 2025

## Core Features:

- Habit Configuration: Allows users to define and customize a list of 15 habits with names and types (checkbox/numeric) via a setup page, with changes propagated across the entire system.
- Local Data Storage: Implements a data layer using browser local storage (LocalStorage) to persist daily habit data for all dates in 2025.
- Global Control System: A control system using a dropdown selector for month and year, updating all views (daily, weekly, monthly summaries, dashboard) dynamically.
- Daily Habit Tracking: Presents a dynamic daily view filtered by the control selector, displaying daily habit checkboxes and the daily completion percentage.
- Weekly Progress View: Groups days into weeks (Sunday to Saturday), showing weekly completion percentages that automatically adjust with changes in the month/year selection.
- Yearly Completion Overview: Analyzes the completion rate for each habit and provides a visualization with dynamic charts. Users can ask an AI tool to produce an action plan based on this analysis.
- Completion Dashboard: Features a colorful, clean dashboard displaying overall completion percentage, habit-wise completion, progress bars, and dynamically updated charts based on month/year selection.

## Style Guidelines:

- Primary color: Dark blue (#3F51B5) to represent stability and focus, crucial for habit tracking.
- Background color: Very light gray (#F5F5F5), almost white, to provide a clean and neutral backdrop that reduces visual clutter.
- Accent color: Orange (#FF9800) to highlight interactive elements and progress indicators.
- Body and headline font: 'Inter', a grotesque-style sans-serif, for a clean and modern user interface. Note: currently only Google Fonts are supported.
- Use a set of minimalist icons to represent each habit, making it easy to visually identify them at a glance.
- Laptop-first responsive design with a clean, modern layout. Clear sections for setup, daily, weekly, and dashboard views.
- Subtle animations on data updates and transitions between views to enhance user experience.