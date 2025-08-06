# Digit Span Task

## Overview

The Digit Span Task is a classic working memory assessment that measures an individual's ability to temporarily hold and manipulate numerical information in memory.

## Task Description

The task consists of two phases:

### Forward Trials

Participants view sequences of digits (starting with 3 digits) presented one at a time, then recall them in the **same order**. Sequence length increases after correct responses and decreases after consecutive errors.

### Reverse Trials

Participants view digit sequences and recall them in **reverse order** (last digit first, second-to-last second, etc.).

Participants have 10 seconds to respond to each trial. The task adapts difficulty based on performance.

## Data Output

### Example Data

See [Digit Span example output](../assets/data_examples/digit_span_example.json) for a complete data sample.

### Key Variables

- **digit_response**: Participant's numerical response
- **correct_response**: The correct answer as a string
- **correct_trial**: 1 if correct, 0 if incorrect
- **direction**: "forward" or "reverse"
- **num_digits**: Number of digits in the sequence
- **current_digit**: Individual digit presented
- **rt**: Response time in milliseconds
- **trial_id**: Identifies trial type (digit_trial, response_trial, etc.)

### Scoring

- Forward span: Longest sequence correctly recalled in forward order
- Reverse span: Longest sequence correctly recalled in reverse order
- Total span: Combined forward and reverse performance

## Preview

Try the task online: [Digit Span Preview](https://deploy.expfactory.org/preview/73/)
