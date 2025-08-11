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
    Welcome! This experiment will take around 5 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

var testTrials = [];
var likertScale = [
  'Disagree strongly',
  'Disagree moderately',
  'Disagree a little',
  'Neither agree nor disagree',
  'Agree a little',
  'Agree moderately',
  'Agree strongly',
];

var surveyQuestions = [
  {
    prompt: 'Extraverted, enthusiastic.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Critical, quarrelsome.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Dependable, self-disciplined.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Anxious, easily upset.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Open to new experiences, complex.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Reserved, quiet.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Sympathetic, warm.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Disorganized, careless.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Calm, emotionally stable.',
    labels: likertScale,
    required: true,
  },
  {
    prompt: 'Conventional, uncreative.',
    labels: likertScale,
    required: true,
  },
];

var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;">Here are a number of personality traits that may or may not apply to you. Please indicate the extent to which you agree or disagree with each statement. You should rate the extent to which the pair of traits applies to you, even if one characteristic applies more strongly than the other.<br><br>I see myself as...</div>',
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
    exp_id: 'ten_item_personality',
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

ten_item_personality_experiment = [];
var ten_item_personality_init = () => {
  ten_item_personality_experiment.push(fullscreen);
  ten_item_personality_experiment.push(feedbackInstructBlock);
  ten_item_personality_experiment.push(testNode);
  ten_item_personality_experiment.push(endBlock);
  ten_item_personality_experiment.push(exitFullscreen);
};
