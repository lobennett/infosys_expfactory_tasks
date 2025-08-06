// Helper functions
const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

var instructTimeThresh = 5; // threshold for instructions, in seconds
var sumInstructTime = 0; // time spent on instructions, in seconds
var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 5 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var pageInstruct = [
  `
  <div class="centerbox">
    <p class="center-block-text">
      In this survey you will be responding to general questions that may or may not describe you. Please indicate the degree to which you disagree or agree with each statement. The survey begins on the next page.
    </p>
  </div>
  `,
];

var testTrials = [];
var likert_scale = [
  'Strongly Disagree',
  'Disagree',
  'Somewhat Disagree',
  'Neutral',
  'Somewhat Agree',
  'Agree',
  'Strongly Agree',
];
var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;"><b>Please indicate the degree to which you disagree or agree with each statement.</b></div>',
  questions: [
    {
      prompt:
        'I am good at analyzing situations and identifying what is required.',
      labels: likert_scale,
    },
    {
      prompt: 'I easily make decisions when faced with difficult situations.',
      labels: likert_scale,
    },
    {
      prompt: 'I consider multiple options before making decisions.',
      labels: likert_scale,
    },
    {
      prompt:
        'When I encounter difficult situations, I feel like I am in control and capable of coping.',
      labels: likert_scale,
    },
    {
      prompt: 'I look at challenges and obstacles from many different angles.',
      labels: likert_scale,
    },
    {
      prompt:
        'I seek additional information not immediately available before jumping to conclusions.',
      labels: likert_scale,
    },
    {
      prompt:
        'When I encounter a difficult situation, I am calm enough to think of a way to resolve the situation.',
      labels: likert_scale,
    },
    {
      prompt:
        "I try to think about things from another person's point of view.",
      labels: likert_scale,
    },
    {
      prompt:
        'I find it exciting that there are so many ways to deal with difficult situations.',
      labels: likert_scale,
    },
    {
      prompt: "I am good at putting myself in others' shoes.",
      labels: likert_scale,
    },
    {
      prompt:
        'When I encounter difficult situations, I typically know what to do.',
      labels: likert_scale,
    },
    {
      prompt:
        'It is important to look at difficult situations from many angles.',
      labels: likert_scale,
    },
    {
      prompt:
        'When faced with a problem, I consider multiple options before deciding how to react.',
      labels: likert_scale,
    },
    {
      prompt: 'I look at situations from different viewpoints.',
      labels: likert_scale,
    },
    {
      prompt: 'I can overcome the difficulties in life that I face.',
      labels: likert_scale,
    },
    {
      prompt: 'I can easily change my mind when presented with options.',
      labels: likert_scale,
    },
  ],
};
testTrials.push(trial);

var instructionTimeout;

// Show the one instruction page, allow clicking or timeout
var instructionsBlock = {
  type: jsPsychInstructions,
  pages: pageInstruct,
  allow_keys: false,
  show_clickable_nav: true,
  data: {
    trial_id: 'instructions',
    stimulus: pageInstruct,
  },
  on_load: function () {
    instructionTimeout = setTimeout(() => {
      console.log('Instructions timed out. Advancing automatically.');
      jsPsych.finishTrial(); // auto-advance after 60 seconds
    }, 60000);
  },
  on_finish: function (data) {
    clearTimeout(instructionTimeout);

    if (data.rt != null) {
      sumInstructTime += data.rt;
    } else {
      sumInstructTime += 60000;
    }
  },
};

var feedbackInstructBlock = {
  type: jsPsychHtmlKeyboardResponse,
  choices: ['Enter'],
  stimulus: getInstructFeedback,
  data: {
    trial_id: 'instruction_feedback',
    trial_duration: 30000,
  },
  trial_duration: 30000,
};

var testNode = {
  timeline: testTrials,
  loop_function: function (data) {
    return false;
  },
};

// Node that loops if too fast
var instructionNode = {
  timeline: [feedbackInstructBlock, instructionsBlock],
  loop_function: function (data) {
    sumInstructTime = 0;
    const trials = data.filter({ trial_id: 'instructions' }).trials;
    for (let i = 0; i < trials.length; i++) {
      sumInstructTime += trials[i].rt != null ? trials[i].rt : 60000;
    }

    if (sumInstructTime <= instructTimeThresh * 1000) {
      feedbackInstructText = `
        <p class=block-text>Read through instructions too quickly. Please take your time and make sure you understand the instructions.</p>
        <p class=block-text>Press <i>enter</i> to continue.</p>`;
      return true; // repeat
    } else {
      feedbackInstructText = `
        <p class=block-text>Done with instructions. Press <i>enter</i> to continue.</p>`;
      return false; // continue
    }
  },
};

var fullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: true,
};

var exitFullscreen = {
  type: jsPsychFullscreen,
  fullscreen_mode: false,
};

var endBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'end',
    exp_id: 'cfi',
    trial_duration: 10000,
  },
  trial_duration: 10000,
  stimulus: `
  <div class="centerbox" style="height: 50vh;">
    <p class="center-block-text">Congratulations for completing the task!</p>
    <p class="center-block-text">Press <i>enter</i> to continue.</p>
  </div>`,
  choices: ['Enter'],
};

cfi_experiment = [];
var cfi_init = () => {
  cfi_experiment.push(fullscreen);
  cfi_experiment.push(instructionNode);
  cfi_experiment.push(testNode);
  cfi_experiment.push(endBlock);
  cfi_experiment.push(exitFullscreen);
};
