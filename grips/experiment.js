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
var likertScale = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];
var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;"><b>Please indicate the degree to which you disagree or agree with each statement.</b></div>',
  questions: [
    {
      prompt: 'Taking risks makes life more fun.',
      labels: likertScale,
    },
    {
      prompt: "My friends would say that I'm a risk-taker.",
      labels: likertScale,
    },
    {
      prompt: 'I enjoy taking risks in most aspects of my life.',
      labels: likertScale,
    },
    {
      prompt: 'I would take a risk even if it meant I might get hurt.',
      labels: likertScale,
    },
    {
      prompt: 'Taking risks is an important part of my life.',
      labels: likertScale,
    },
    {
      prompt: 'I commonly make risky decisions.',
      labels: likertScale,
    },
    {
      prompt: 'I am a believer of taking chances.',
      labels: likertScale,
    },
    {
      prompt: 'I am attracted, rather than scared, by risk.',
      labels: likertScale,
    },
  ],
  on_finish: function (data) {
    data.likert_scale = likertScale;
  },
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
    exp_id: 'kirby',
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

grips_experiment = [];
var grips_init = () => {
  grips_experiment.push(fullscreen);
  grips_experiment.push(instructionNode);
  grips_experiment.push(testNode);
  grips_experiment.push(endBlock);
  grips_experiment.push(exitFullscreen);
};
