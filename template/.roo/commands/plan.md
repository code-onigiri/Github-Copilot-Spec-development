---
description: "Generate an implementation plan from a specification."
argument-hint: "<feature-name>"
---

# Plan Command

You will generate a detailed implementation plan for the specified feature.

1.  **Find Spec**: Locate the `spec.md` for the given feature name in the `specs/` directory.
2.  **Generate Files**: Based on the specification, create the following files in the feature's directory:
    - `plan.md`: The main implementation plan.
    - `research.md`: Technology choices and rationale.
    - `data-model.md`: Database schemas and entity definitions.
    - `contracts/`: API contracts (e.g., OpenAPI specs).
    - `quickstart.md`: Usage examples.
3.  **Content**: Populate each file with the appropriate content as defined in the planning process rules.
