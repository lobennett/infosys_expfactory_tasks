// Helper functions
const getInstructFeedback = () =>
  `<div class="centerbox"><p class="center-block-text">${feedbackInstructText}</p></div>`;

// var instructTimeThresh = 5; // threshold for instructions, in seconds
var instructTimeThresh = 0;
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
      In this experiment you will be presented with two amounts of money to choose between. One of the amounts will be available now and the other will be available in the future. Your job is to indicate which option you would prefer by pressing <b>"q"</b> for the left option and <b>"p"</b> for the right option.
    </p>
    <p class="center-block-text">
      You should indicate your <b>true preference</b> as if you were going to receive these monetary payouts based upon the time point you choose.
    </p>
  </div>
  `,
];

var kirbyOptions = {
  small_amt: [
    54, 55, 19, 31, 14, 47, 15, 25, 78, 40, 11, 67, 34, 27, 69, 49, 80, 24, 33,
    28, 34, 25, 41, 54, 54, 22, 20,
  ],
  large_amt: [
    55, 75, 25, 85, 25, 50, 35, 60, 80, 55, 30, 75, 35, 50, 85, 60, 85, 35, 80,
    30, 50, 30, 75, 60, 80, 25, 55,
  ],
  later_del: [
    117, 61, 53, 7, 19, 160, 13, 14, 192, 62, 7, 119, 186, 21, 91, 89, 157, 29,
    14, 179, 30, 80, 20, 111, 30, 136, 7,
  ],
};

var testTrials = [];
for (let i = 0; i < kirbyOptions.small_amt.length; i++) {
  var trial = {
    type: jsPsychHtmlKeyboardResponse,
    data: {
      trial_id: `test_trial_${i}`,
      exp_stage: 'test',
      stimulus_duration: 60000,
      trial_duration: 60000,
    },
    choices: ['q', 'p'],
    stimulus: `
     <div style="text-align: center; margin-bottom: 30px;">
       <p style="font-size: 18px; margin-bottom: 20px;">
         Please select the option that you would prefer, pressing <strong>'q'</strong> for left and <strong>'p'</strong> for right:
       </p>
     </div>
     <div style="display: flex; justify-content: center; gap: 50px; align-items: center;">
       <div style="border: 2px solid #333; padding: 20px; border-radius: 8px; text-align: center; min-width: 150px;">
         <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
           <strong>$${kirbyOptions.small_amt[i]}</strong>
         </p>
         <p style="margin: 0; font-size: 16px;">
           today
         </p>
       </div>
       <div style="border: 2px solid #333; padding: 20px; border-radius: 8px; text-align: center; min-width: 150px;">
         <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
           <strong>$${kirbyOptions.large_amt[i]}</strong>
         </p>
         <p style="margin: 0; font-size: 16px;">
           ${kirbyOptions.later_del[i]} days
         </p>
       </div>
     </div>
    `,
    post_trial_gap: 500,
  };
  testTrials.push(trial);
}

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

var practiceTrial = {
  type: jsPsychHtmlKeyboardResponse,
  stimulus: `
  <div style="text-align: center; margin-bottom: 30px;">
    <p style="font-size: 18px; margin-bottom: 20px;">
      Please select the option that you would prefer, pressing <strong>'q'</strong> for left and <strong>'p'</strong> for right:
    </p>
  </div>
  <div style="display: flex; justify-content: center; gap: 50px; align-items: center;">
    <div style="border: 2px solid #333; padding: 20px; border-radius: 8px; text-align: center; min-width: 150px;">
      <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
        <strong>$20</strong>
      </p>
      <p style="margin: 0; font-size: 16px;">
        today
      </p>
    </div>
    <div style="border: 2px solid #333; padding: 20px; border-radius: 8px; text-align: center; min-width: 150px;">
      <p style="margin: 0 0 10px 0; font-size: 18px; font-weight: bold;">
        <strong>$25</strong>
      </p>
      <p style="margin: 0; font-size: 16px;">
        5 days
      </p>
    </div>
  </div>
  `,
  choices: ['q', 'p'],
  data: {
    trial_id: 'practice_trial',
    stimulus_duration: 10000,
    trial_duration: 10000,
    exp_stage: 'practice',
  },
  // stimulus_duration: 10000,
  // trial_duration: 10000,
  post_trial_gap: 1000,
};

var testStartBlock = {
  type: jsPsychHtmlKeyboardResponse,
  data: {
    trial_id: 'test_start',
    exp_stage: 'test',
    stimulus_duration: 60000,
    trial_duration: 60000,
  },
  choices: ['Enter'],
  stimulus:
    '<div class="centerbox"><p class="center-block-text">You are now ready to begin the test trials. Remember to indicate your <b>true</b> preferences. Press <i>enter</i> to continue. If you do not press <i>enter</i> within 1 minute, this screen will automatically advance to the next one.</p></div>',
  trial_duration: 60000,
  stimulus_duration: 60000,
  response_ends_trial: true,
};

var testNode = {
  timeline: testTrials,
  loop_function: function (data) {
    return false;
  },
};

var practiceNode = {
  timeline: [practiceTrial, testStartBlock],
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

kirby_experiment = [];
var kirby_init = () => {
  kirby_experiment.push(fullscreen);
  kirby_experiment.push(instructionNode);
  kirby_experiment.push(practiceNode);
  kirby_experiment.push(testNode);
  kirby_experiment.push(endBlock);
  kirby_experiment.push(exitFullscreen);
};
