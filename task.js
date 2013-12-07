var util = require('util'),
    EventEmitter = require('events').EventEmitter,
    asana = require('asana-api'),
    asanaClient,
    poppins;

var PoppinsAsanaPusher = module.exports = function PoppinsAsanaPusher (pop, client) {
  poppins = pop;
  asanaClient = client || asana.createClient(poppins.config.asana);

  poppins.on('pullRequestOpened', this.onIssueOpened);
  poppins.on('issueOpened', this.onIssueOpened);
  poppins.on('pullRequestCommented', this.onIssueCommented);
  poppins.on('issueCommented', this.onIssueCommented);
};

PoppinsAsanaPusher.prototype.onIssueOpened = function onIssueOpened (issue) {
  var asanaTask = {
    name: issue.title,
    notes: issue.body + '\n\n' + issue.html_url
  };

  asanaClient.tasks.create(poppins.config.asana.workspace,
    poppins.config.asana.project,
    asanaTask);
};

PoppinsAsanaPusher.prototype.onIssueCommented = function onIssueCommented (data) {
  var comment = data.comment;
  var issue = data.issue;
  var asanaStory = {
    text: 'From ' + comment.user.login +
      '\n\n' +
      comment.body
  };

  //Need to figure out how taskId is stored
  var taskId = 0;

  asanaClient.tasks.stories.create(taskId,
    asanaStory);
};
