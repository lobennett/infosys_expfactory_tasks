# Kirby Delay-Discounting Task

## Overview

The Kirby Delay-Discounting Task measures temporal discounting - the tendency to prefer smaller, immediate rewards over larger, delayed rewards. This is a key measure of impulsivity and self-control.

## Task Description

Participants choose between 27 pairs of monetary options:

- **Immediate option**: Smaller amount available "today"
- **Delayed option**: Larger amount available after a specified delay (7-192 days)

Participants press 'q' for the left option or 'p' for the right option. The task includes one practice trial followed by 27 test trials.

## Data Output

### Example Data

See [Kirby example output](../assets/data_examples/kirby_example.json) for a complete data sample.

### Key Variables

- **response**: Participant's choice ('q' for left/immediate, 'p' for right/delayed)
- **today_amount**: Immediate reward amount
- **later_amount**: Delayed reward amount
- **later_delay**: Delay in days for larger reward
- **rt**: Response time in milliseconds
- **trial_id**: Identifies trial type and number
- **exp_stage**: "practice" or "test"

### Analysis

Calculate discount parameter (k) values using standard Kirby analysis. Higher k values indicate greater temporal discounting (more impulsive choices).

## Preview

Try the task online: [Kirby Preview](https://deploy.expfactory.org/preview/75/)
