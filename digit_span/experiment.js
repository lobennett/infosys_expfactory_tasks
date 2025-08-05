// Helper functions
const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

const getCurrentDigitCount = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${numDigits} Digits</p></div></div>`;

const pageInstruct = [
  `
  <div class="centerbox" >
    <p class="center-block-text" >
    In this test you will have to try to remember a sequence of numbers that will appear on the screen one after the other. At the end of each trial, enter all the numbers into the textbox in the sequence in which they occurred. Do your best to memorize the numbers, but do not write them down or use any other external tool to help you remember them.
    </p>
    <p class="center-block-text">
    Trials will start on the next page.
    </p>
  </div>
`,
];

const sampleDigitWithReplacement = () => {
  const possibleValues = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  const digit =
    possibleValues[Math.floor(Math.random() * possibleValues.length)];
  currentDigit = digit;
  return `<div class='bigbox'><div class='picture_box'><p class='block-text'>${digit}</p></div></div>`;
};

// var instructTimeThresh = 5; // threshold for instructions, in seconds
var instructTimeThresh = 0;
var sumInstructTime = 0; // time spent on instructions, in seconds
var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 10 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;
var numTrials = 14;
var numDigits = 3;
var minDigits = 1;
var consecutiveErrors = 0;
var currentDigit;

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
    setTimeout(() => {
      jsPsych.finishTrial(); // auto-advance after 60 seconds
    }, 60000);
  },
  on_finish: function (data) {
    if (data.rt != null) {
      sumInstructTime += data.rt;
    } else {
      sumInstructTime += 60000;
    }
  },
};

var feedbackText =
  '<div class = centerbox><p class = center-block-text>Press <i>enter</i> to begin practice.</p></div>';
var feedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'practice_feedback',
    exp_stage: 'practice',
    trial_duration: 30000,
  },
  choices: ['Enter'],
  stimulus: getFeedback,
  trial_duration: 30000,
  response_ends_trial: true,
};

var reverseBlockStart = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'reverse_block_start',
    exp_stage: 'test',
    trial_duration: 60000,
  },
  choices: ['Enter'],
  stimulus:
    '<div class = centerbox><p class = block-text>In these next trials, instead of reporting back the sequence you just saw, report the <strong>reverse</strong> of that sequence. So the last item should be first in your response, the second to last should be the second in your response, etc...</p><p class = block-text>Press <strong>enter</strong> to begin.</p></div>',
  trial_duration: 60000,
  response_ends_trial: true,
};

var forwardTrials = [];
for (let i = 0; i < numTrials; i++) {
  var trialStart = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: getCurrentDigitCount,
    choices: ['NO_KEYS'],
    stimulus_duration: 1000,
    trial_duration: 1500,
    data: {
      trial_id: `test_forward_start_trial_${i + 1}`,
      exp_stage: 'test',
      stimulus_duration: 1000,
      trial_duration: 1500,
      direction: 'forward',
    },
  };
  forwardTrials.push(trialStart);

  for (let j = 0; j < numDigits; j++) {
    var trial = {
      type: jsPsychHtmlKeyboardResponse,
      stimulus: sampleDigitWithReplacement(),
      choices: ['NO_KEYS'],
      stimulus_duration: 1000,
      trial_duration: 1500,
      data: {
        trial_id: `test_forward_digit_trial_${i + 1}`,
        exp_stage: 'test',
        stimulus_duration: 1000,
        trial_duration: 1500,
        direction: 'forward',
        current_digit: currentDigit,
      },
    };
    forwardTrials.push(trial);
  }

  var responsePrompt = {
    type: jsPsychSurveyHtmlForm,
    html: `
      <style>
        input[type=number]::-webkit-outer-spin-button,
        input[type=number]::-webkit-inner-spin-button {
          -webkit-appearance: none;
          margin: 0;
        }
        input[type=number] {
          -moz-appearance: textfield;
        }
        #jspsych-survey-html-form-next {
          display: none;
        }
      </style>
      <p>Enter the digits in order:</p>
      <input name="digit_response" type="number"
             onkeydown="if(event.key==='Enter'){var btn=document.getElementById('jspsych-survey-html-form-next'); if(btn) btn.click();}">
    `,
    data: {
      trial_id: `test_forward_response_trial_${i + 1}`,
      exp_stage: 'test',
      direction: 'forward',
    },
    stimulus_duration: 5000,
    trial_duration: 5000,
    on_load: function () {
      // Focus the input field after the trial loads
      setTimeout(function () {
        var inputField = document.querySelector('input[name="digit_response"]');
        if (inputField) {
          inputField.focus();
        }
      }, 200);

      // Auto-submit after 5 seconds
      setTimeout(function () {
        var submitButton = document.getElementById(
          'jspsych-survey-html-form-next'
        );
        if (submitButton) {
          submitButton.click();
        }
      }, 5000);
    },
    on_finish: function (data) {
      // Ensure it's treated as a string of digits
      data.digit_response =
        data.response && data.response.digit_response
          ? data.response.digit_response
          : '';

      // Get previous trials for num digit responses
      let lastTrials = jsPsych.data.get().filter({
        trial_id: `test_forward_digit_trial_${i + 1}`,
      }).trials;
      let correctResponse = lastTrials.map((trial) => trial.current_digit);

      // append to data object
      data.correct_response = correctResponse.join('');
      data.correct_trial =
        data.correct_response === data.digit_response ? 1 : 0;

      if (data.correct_trial == 1) {
        numDigits++;
      } else {
        consecutiveErrors++;
        if (consecutiveErrors === 2 && numDigits > minDigits) {
          numDigits--;
          consecutiveErrors = 0;
        }
      }

      console.log(numDigits);
      console.log(consecutiveErrors);
      console.log(minDigits);
      console.log(data);
    },
  };
  forwardTrials.push(responsePrompt);
}

var testNodeForward = {
  timeline: forwardTrials,
  loop_function: function (data) {
    return false;
  },
};

var backwardTrials = [];
var testNodeBackward = {
  timeline: [reverseBlockStart].concat(backwardTrials),
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
    exp_id: 'digit_span',
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

digit_span_experiment = [];
var digit_span_init = () => {
  digit_span_experiment.push(fullscreen);
  digit_span_experiment.push(instructionNode);
  digit_span_experiment.push(testNodeForward);
  digit_span_experiment.push(testNodeBackward);
  digit_span_experiment.push(endBlock);
  digit_span_experiment.push(exitFullscreen);
};
