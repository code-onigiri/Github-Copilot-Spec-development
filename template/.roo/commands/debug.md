---
description: "Debug and fix an issue using a structured methodology."
argument-hint: "<issue-description>"
---

# Debug Command

You will systematically debug and fix the described issue.

1.  **Understand the Issue**: Ask for all necessary details to reproduce the bug:
    - What are the steps to reproduce it?
    - What is the expected behavior?
    - What is the actual behavior?
    - Are there any error messages?
2.  **Formulate a Hypothesis**: Based on the information, state a hypothesis about the root cause.
3.  **Plan Verification**: Propose a plan to verify the hypothesis (e.g., "I will check the logs in file X", "I will add a breakpoint in function Y").
4.  **Execute and Analyze**: Execute the plan and analyze the results.
5.  **Propose a Fix**: Once the root cause is identified, propose a specific code change to fix the issue.
6.  **Verify the Fix**: Explain how you will verify that the fix resolves the issue and doesn't introduce new ones (e.g., "I will run the tests and then perform the original reproduction steps.").
