---
description: "Break down a plan into concrete implementation tasks."
argument-hint: "<feature-name>"
---

# Tasks Command

You will break down the implementation plan into a list of concrete tasks.

1.  **Find Plan**: Locate the `plan.md` for the given feature name in the `specs/` directory.
2.  **Create `tasks.md`**: Create a `tasks.md` file in the feature's directory.
3.  **Generate Tasks**: Based on the `plan.md`, generate a list of tasks in the following format:
    ```markdown
    - [ ] [T###] [P?] [USX?] Action description in path/to/file.ext
    ```
    - `T###`: Sequential task ID.
    - `[P]`: Optional marker for tasks that can be done in parallel.
    - `[USX]`: Optional reference to a user story.
    - Ensure every task has a specific file path.
