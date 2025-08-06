# Raven's Progressive Matrices

## Overview

Raven's Progressive Matrices is a non-verbal test of general intelligence and abstract reasoning ability. It measures the ability to identify patterns and logical relationships in visual information.

## Task Description

Participants view 18 matrix problems, each showing a 3x3 grid with one missing piece. The task is to:

1. Identify the pattern or rule governing the matrix (both across rows and down columns)
2. Select the correct missing piece from 8 multiple-choice options
3. Respond by pressing keys 'a' through 'h'

The task includes:

- Detailed instructions with sample problems
- 2 practice trials with feedback
- 18 test trials (1 minute per trial)
- Images showing both the matrix problem and answer choices

## Data Output

### Example Data

See [Ravens example output](../assets/data_examples/ravens_example.json) for a complete data sample.

### Key Variables

- **response**: Participant's answer ('a' through 'h')
- **correct_response**: The correct answer
- **correct**: 1 if correct, 0 if incorrect
- **rt**: Response time in milliseconds
- **trial_id**: Identifies trial type and number
- **exp_stage**: "practice" or "test"
- **problem_number**: Which matrix problem (1-18)

### Scoring

- Total correct responses (0-18)
- Response accuracy percentage
- Mean response time for correct/incorrect trials
- Pattern of errors across difficulty levels

## Preview

Try the task online: [Ravens Preview](https://deploy.expfactory.org/preview/76/)
