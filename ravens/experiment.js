// Preload images
// Using git commit hash for compatibility with expfactory
var GIT_HASH = '142986a6f28946223d8cb0b942ac0d0690edf7a8';
var pathSource =
  'https://deploy.expfactory.org/deployment/repo/infosys_expfactory_tasks/' +
  GIT_HASH +
  '/ravens/images/';

var images = [];
for (let i = 1; i <= 18; i++) {
  images.push(pathSource + `bottom_${i}.jpg`);
  images.push(pathSource + `top_${i}.jpg`);
}
// Add practice images
images.push(pathSource + 'practice/practice_bottom_1.jpg');
images.push(pathSource + 'practice/practice_bottom_2.jpg');
images.push(pathSource + 'practice/practice_top_1.jpg');
images.push(pathSource + 'practice/practice_top_2.jpg');
images.push(pathSource + 'practice/sample_matrix_bottom.jpg');
images.push(pathSource + 'practice/sample_matrix_top.jpg');
images.push(pathSource + 'practice/Opt_E_selected.png');

// Helper functions
const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

const pageInstruct = [
  `
  <div class="centerbox" >
    <p class="center-block-text" >
    This is a test of observation and clear thinking with 18 problems. The top part of each problem is a pattern with one part cut out of it. Your task is to look at the pattern, think of what the missing part must look like to complete the pattern correctly, both along the rows and the columns, and then find the right piece out of the eight shown. Only one of the answer choices is perfectly correct.
    </p>
    <p class="center-block-text">
    You will have 1 minute to answer each question. If you do not respond within this time limit, the question will automatically advance to the next one.
    </p>
    <p class="center-block-text">
    The following page will have an example trial.
    </p>
  </div>
`,
  `
  <div class="centerbox" style="height: auto; top: 42.5%;">
    <p class="center-block-text" style="font-size: 18px;">
    <b>Look at the top part (the pattern) of this sample problem.</b> Notice that going across the rows, the number of horizontal lines is equal. Going down the columns, the number of squares is equal.
    </p>
    <img src="${pathSource}practice/sample_matrix_top.jpg" alt="Sample Matrix Top" class="center-block-image" style="width: 400px; height: auto;">
      <p class="center-block-text" style="font-size: 18px; margin-top: 20px;">
      <b>Look at the solution of this sample problem.</b> The best completion of the missing cell is the alternative "E". The correct response to this question would be to press the "e" key.
      </p>
      <img src="${pathSource}practice/sample_matrix_bottom.jpg" alt="Sample Matrix Bottom" class="center-block-image" style="width: 400px; height: auto;">
  </div>
`,
  `
  <div class="centerbox">
    <p class="center-block-text" ">
    You will now complete two practice trials with feedback. The test trials will not include feedback.
    </p>
  </div>
  `,
];
const getFeedback = () =>
  `<div class="bigbox"><div class="picture_box"><p class="block-text">${feedbackText}</p></div></div>`;

var instructTimeThresh = 5; // threshold for instructions, in seconds
var sumInstructTime = 0; // time spent on instructions, in seconds
var feedbackInstructText = `
  <p class="center-block-text">
    Welcome! This experiment will take around 20 minutes.
  </p>
  <p class="center-block-text">
    To avoid technical issues, please keep the experiment tab (on Chrome or Firefox) active and in fullscreen mode for the whole duration of each task.
  </p>
  <p class="center-block-text"> Press <i>enter</i> to begin.</p>
`;

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

// Setting up first and second practice trials
var practiceThresh = 5;
var practiceTries = 0;
var practiceTrial1 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="centerbox">
      <div class="flex-container">
        <img src="${pathSource}practice/practice_top_1.jpg" alt="Sample Matrix Top" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
        <img src="${pathSource}practice/practice_bottom_1.jpg" alt="Sample Matrix Bottom" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
      </div>
    </div>
    `,
  choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  data: {
    trial_id: 'practice_trial_1',
    exp_stage: 'practice',
    stimulus_duration: 60000,
    trial_duration: 60000,
  },
  stimulus_duration: 60000,
  trial_duration: 60000,
  on_finish: function (data) {
    data['correct_trial'] = data.response == 'c' ? 1 : 0;
    data['correct_response'] = 'c';
    data['answer_options'] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    data['image_path_top'] = `${pathSource}practice/practice_top_1.jpg`;
    data['image_path_bottom'] = `${pathSource}practice/practice_bottom_1.jpg`;
  },
};

var practiceFeedbackBlock = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: function () {
    var last = jsPsych.data.get().last(1).values()[0];

    if (last.correct_trial == 1) {
      return '<div class=center-box><div class=center-text><font size=20>Correct!</font></div></div>';
    } else {
      // Check if this was the last attempt (practiceTries will be incremented in loop_function)
      if (practiceTries >= practiceThresh - 1) {
        return "<div class=center-box><div class=center-text><font size=20>That is incorrect, but we'll move on.</font></div></div>";
      } else {
        return '<div class=center-box><div class=center-text><font size=20>Incorrect! Try again.</font></div></div>';
      }
    }
  },
  data: function () {
    return {
      exp_stage: 'practice',
      trial_id: 'practice_feedback',
      trial_duration: 2000,
      stimulus_duration: 2000,
    };
  },
  choices: ['NO_KEYS'],
  stimulus_duration: 2000,
  trial_duration: 2000,
};

var practiceNode1 = {
  timeline: [practiceTrial1, practiceFeedbackBlock],
  loop_function: function (data) {
    var last = jsPsych.data.get().last(2).trials[0];
    if (last.correct_trial == 1) {
      practiceTries = 0; // Reset on correct answer
      return false;
    } else {
      practiceTries++;
      if (practiceTries >= practiceThresh) {
        practiceTries = 0;
        return false; // Move on after threshold
      }
      return true; // Continue looping
    }
  },
};

var practiceTrial2 = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
    <div class="centerbox">
      <div class="flex-container">
        <img src="${pathSource}practice/practice_top_2.jpg" alt="Sample Matrix Top" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
        <img src="${pathSource}practice/practice_bottom_2.jpg" alt="Sample Matrix Bottom" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
      </div>
    </div>
    `,
  choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
  data: {
    trial_id: 'practice_trial_2',
    exp_stage: 'practice',
    stimulus_duration: 60000,
    trial_duration: 60000,
  },
  on_finish: function (data) {
    data['correct_trial'] = data.response == 'f' ? 1 : 0;
    data['correct_response'] = 'f';
    data['answer_options'] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    data['image_path_top'] = `${pathSource}practice/practice_top_2.jpg`;
    data['image_path_bottom'] = `${pathSource}practice/practice_bottom_2.jpg`;
  },
};
var practiceNode2 = {
  timeline: [practiceTrial2, practiceFeedbackBlock],
  loop_function: function (data) {
    var last = jsPsych.data.get().last(2).trials[0];
    if (last.correct_trial == 1) {
      practiceTries = 0; // Reset on correct answer
      return false;
    } else {
      practiceTries++;
      if (practiceTries >= practiceThresh) {
        practiceTries = 0;
        return false; // Move on after threshold
      }
      return true; // Continue looping
    }
  },
};

var testStartBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'test_start',
    exp_stage: 'test',
    trial_duration: 60000,
  },
  choices: ['Enter'],
  stimulus:
    '<div class="centerbox"><p class="center-block-text">You are now ready to begin the test trials. Press <i>enter</i> to continue. This screen will automatically advance in 1 minute.</p></div>',
  trial_duration: 60000,
  response_ends_trial: true,
};

var testTrials = [];
var testLen = 18;
var testAnswers = [
  'b',
  'e',
  'g',
  'b',
  'c',
  'b',
  'e',
  'b',
  'b',
  'e',
  'a',
  'e',
  'a',
  'c',
  'b',
  'e',
  'f',
  'd',
];
for (let i = 1; i <= testLen; i++) {
  var trial = {
    type: jsPsychHtmlKeyboardResponse,
    stimulus: `
    <div class="centerbox">
      <div class="flex-container">
        <img src="${pathSource}top_${i}.jpg" alt="Sample Matrix Top" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
        <img src="${pathSource}bottom_${i}.jpg" alt="Sample Matrix Bottom" class="center-block-image" style="width: 400px; height: auto; margin-bottom: 20px;">
      </div>
    `,
    choices: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'],
    data: {
      trial_id: `test_trial_${i}`,
      exp_stage: 'test',
      stimulus_duration: 60000,
      trial_duration: 60000,
    },
    on_finish: function (data) {
      data['correct_response'] = testAnswers[i - 1];
      data['correct_trial'] = data.response == testAnswers[i - 1] ? 1 : 0;
      data['answer_options'] = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
      data['image_path_top'] = `${pathSource}top_${i}.jpg`;
      data['image_path_bottom'] = `${pathSource}bottom_${i}.jpg`;
    },
    stimulus_duration: 60000,
    trial_duration: 60000,
  };
  testTrials.push(trial);
}

var testNode = {
  timeline: [testStartBlock].concat(testTrials),
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
    exp_id: 'ravens',
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

ravens_experiment = [];
var ravens_init = () => {
  ravens_experiment.push(fullscreen);
  ravens_experiment.push(instructionNode);
  ravens_experiment.push(practiceNode1);
  ravens_experiment.push(practiceNode2);
  ravens_experiment.push(testNode);
  ravens_experiment.push(endBlock);
  ravens_experiment.push(exitFullscreen);
};
