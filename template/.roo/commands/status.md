---
description: "Check the project and feature status."
---

# Status Command

You will provide a summary of the project's current status.

1.  **Scan `specs/` directory**: List all feature specifications currently being worked on.
2.  **Summarize Feature Status**: For each feature, check the existence and modification dates of `spec.md`, `plan.md`, and `tasks.md` to determine its phase (e.g., "Specification", "Planning", "Implementation").
3.  **Analyze `tasks.md`**: For features in the implementation phase, calculate the percentage of completed tasks from the `tasks.md` file.
4.  **Report**: Present the status in a clear, structured format, for example:

    ```markdown
    # Project Status

    ## Feature: [###-feature-name-1]

    - **Status**: Implementation (3/10 tasks complete - 30%)
    - **Next Task**: [T004] Implement user authentication endpoint.

    ## Feature: [###-feature-name-2]

    - **Status**: Planning (plan.md created)
    - **Next Step**: Run `/tasks` to create implementation tasks.
    ```
