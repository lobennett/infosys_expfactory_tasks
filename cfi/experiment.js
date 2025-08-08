// Helper functions
const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

// Map survey responses to question prompts
const mapResponsesToQuestions = (data, surveyQuestions, likertScale) => {
  Object.keys(data.response).forEach((key, idx) => {
    const question = surveyQuestions[idx];
    if (question && question.prompt) {
      const responseIndex = data.response[key];
      const questionCleaned = question.prompt
        .replace(/[.,-]/g, '')
        .replace(/\s+/g, '_')
        .toLowerCase();
      // If no response, set to "NA"
      if (responseIndex === '') {
        data[questionCleaned] = 'NA';
      } else {
        const scaleValue = likertScale[responseIndex];
        const scaleValueCleaned = scaleValue.replace(/\s+/g, '_').toLowerCase();
        data[questionCleaned] = scaleValueCleaned;
      }
    }
  });
};

var instructTimeThresh = 2; // threshold for instructions, in seconds
var sumInstructTime = 0; // time spent on instructions, in seconds
var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 3 minutes.
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
  'Somewhat Disagree',
  'Neutral',
  'Somewhat Agree',
  'Agree',
  'Strongly Agree',
];

var surveyQuestions = [
  {
    prompt: 'I am good at "sizing up" situations.',
    labels: likertScale,
  },
  {
    prompt:
      'I have a hard time making decisions when faced with difficult situations.',
    labels: likertScale,
  },
  {
    prompt: 'I consider multiple options before making a decision.',
    labels: likertScale,
  },
  {
    prompt:
      'When I encounter difficult situations, I feel like I am losing control.',
    labels: likertScale,
  },
  {
    prompt:
      'I like to look at difficult situations from many different angles.',
    labels: likertScale,
  },
  {
    prompt:
      'I seek additional information not immediately available before attributing causes to behavior.',
    labels: likertScale,
  },
  {
    prompt:
      'When encountering difficult situations, I become so stressed that I can not think of a way to resolve the situation.',
    labels: likertScale,
  },
  {
    prompt: "I try to think about things from another person's point of view.",
    labels: likertScale,
  },
  {
    prompt:
      'I find it troublesome that there are so many different ways to deal with difficult situations.',
    labels: likertScale,
  },
  {
    prompt: "I am good at putting myself in others' shoes.",
    labels: likertScale,
  },
  {
    prompt:
      "When I encounter difficult situations, I just don't know what to do.",
    labels: likertScale,
  },
  {
    prompt: 'It is important to look at difficult situations from many angles.',
    labels: likertScale,
  },
  {
    prompt:
      'When in difficult situations, I consider multiple options before deciding how to behave.',
    labels: likertScale,
  },
  {
    prompt: 'I often look at a situation from different viewpoints.',
    labels: likertScale,
  },
  {
    prompt: 'I am capable of overcoming the difficulties in life that I face.',
    labels: likertScale,
  },
  {
    prompt:
      'I consider all the available facts and information when attributing causes to behavior.',
    labels: likertScale,
  },
  {
    prompt: 'I feel I have no power to change things in difficult situations.',
    labels: likertScale,
  },
  {
    prompt:
      'When I encounter difficult situations, I stop and try to think of several ways to resolve it.',
    labels: likertScale,
  },
  {
    prompt:
      "I can think of more than one way to resolve a difficult situation I'm confronted with.",
    labels: likertScale,
  },
  {
    prompt:
      'I consider multiple options before responding to difficult situations.',
    labels: likertScale,
  },
];

var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;"><b>Please use the scale below to indicate the extent to which you agree or disagree with the following statements.</b></div>',
  questions: surveyQuestions,
  on_finish: function (data) {
    data.likert_scale = likertScale;
    mapResponsesToQuestions(data, surveyQuestions, likertScale);
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
  allow_backward: false,
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
