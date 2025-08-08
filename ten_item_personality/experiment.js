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
      In this survey you will be responding to a number of personality traits that may or may not apply to you. Please indicate the extent to which you agree or disagree with each statement. You should rate the extent to which the pair of traits applies to you, even if one characteristic applies more strongly than the other. The survey begins on the next page.
    </p>
  </div>
  `,
];

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
  },
  {
    prompt: 'Critical, quarrelsome.',
    labels: likertScale,
  },
  {
    prompt: 'Dependable, self-disciplined.',
    labels: likertScale,
  },
  {
    prompt: 'Anxious, easily upset.',
    labels: likertScale,
  },
  {
    prompt: 'Open to new experiences, complex.',
    labels: likertScale,
  },
  {
    prompt: 'Reserved, quiet.',
    labels: likertScale,
  },
  {
    prompt: 'Sympathetic, warm.',
    labels: likertScale,
  },
  {
    prompt: 'Disorganized, careless.',
    labels: likertScale,
  },
  {
    prompt: 'Calm, emotionally stable.',
    labels: likertScale,
  },
  {
    prompt: 'Conventional, uncreative.',
    labels: likertScale,
  },
];

var trial = {
  type: jsPsychSurveyLikert,
  preamble:
    '<div style="text-align: center; margin-top: 100px;"><b>I see myself as...</b></div>',
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
  data: {
    trial_id: 'instructions',
    stimulus: pageInstruct,
  },
  allow_backward: false,
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
  ten_item_personality_experiment.push(instructionNode);
  ten_item_personality_experiment.push(testNode);
  ten_item_personality_experiment.push(endBlock);
  ten_item_personality_experiment.push(exitFullscreen);
};
