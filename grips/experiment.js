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

var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 2 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var testTrials = [];
var likertScale = [
  'Strongly Disagree',
  'Disagree',
  'Neutral',
  'Agree',
  'Strongly Agree',
];
var surveyQuestions = [
  {
    prompt: 'Taking risks makes life more fun.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: "My friends would say that I'm a risk-taker.",
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'I enjoy taking risks in most aspects of my life.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'I would take a risk even if it meant I might get hurt.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Taking risks is an important part of my life.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'I commonly make risky decisions.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'I am a believer of taking chances.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'I am attracted, rather than scared, by risk.',
    labels: likertScale,
    required: true,
  },
];

var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;"><b>Below are some general statements that may or may not describe you. Please indicate the degree to which you disagree or agree with each statement.</b></div>',
  questions: surveyQuestions,
  on_finish: function (data) {
    data.likert_scale = likertScale;
    mapResponsesToQuestions(data, surveyQuestions, likertScale);
  },
};
testTrials.push(trial);

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
    exp_id: 'grips',
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
  grips_experiment.push(feedbackInstructBlock);
  grips_experiment.push(testNode);
  grips_experiment.push(endBlock);
  grips_experiment.push(exitFullscreen);
};
