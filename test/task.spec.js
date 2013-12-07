var Task = require('../task.js'),
    PoppinsMock = require('./PoppinsMock'),
    poppinsMock = new PoppinsMock(),
    issueMocks = require('./IssueMocks'),
    asana = require('asana-api'),
    asanaClientMock = {tasks: {create: function () {}, stories: {create: function () {}}}},
    WORKSPACE_ID = 1,
    PROJECT_ID = 1,
    task;


describe('Asana Pusher', function () {
  describe('Task', function () {
    describe('Constructor', function () {
      it('should create an asana client if not given one', function () {
        var spy = spyOn(asana, 'createClient');
        task = new Task(poppinsMock, null);
        expect(spy).toHaveBeenCalled();
      });
    });


    describe('onIssueOpened', function () {
      it('should be called when a Pull Request or Issue is opened', function () {
        var spy = spyOn(Task.prototype, 'onIssueOpened');

        task = new Task(poppinsMock, asanaClientMock);

        poppinsMock.emit('pullRequestOpened', issueMocks.newIssue);
        poppinsMock.emit('issueOpened', issueMocks.newIssue);

        expect(spy.callCount).toBe(2);
      });


      it('should call asanaClient.tasks.create', function () {
        var spy = spyOn(asanaClientMock.tasks, 'create');

        task = new Task(poppinsMock, asanaClientMock);
        task.onIssueOpened.call(task, issueMocks.newIssue);

        var taskBody = {
          name: issueMocks.newIssue.title,
          notes: issueMocks.newIssue.body + '\n\n' + issueMocks.newIssue.html_url
        };

        expect(spy).toHaveBeenCalledWith(WORKSPACE_ID, PROJECT_ID, taskBody);
      });
    });


    describe('onIssueCommented', function () {
      it('should be called when a comment is added to a Pull Request or Issue', function () {
        var spy = spyOn(Task.prototype, 'onIssueCommented');

        task = new Task(poppinsMock, asanaClientMock);

        poppinsMock.emit('pullRequestCommented',
          {
            action: 'created',
            issue: issueMocks.newIssue,
            comment: issueMocks.issueComment
          });
        poppinsMock.emit('issueCommented',
          {
            action: 'created',
            issue: issueMocks.newIssue,
            comment: issueMocks.issueComment
          });

        expect(spy.callCount).toBe(2);
      });


      it('should save the comment as a story on the task', function () {
        var spy = spyOn(asanaClientMock.tasks.stories, 'create');

        task = new Task(poppinsMock, asanaClientMock);
        task.onIssueCommented.call(task,
          {
            action: 'created',
            issue: issueMocks.newIssue,
            comment: issueMocks.issueComment
          });

        var story = {
          text: 'From ' + issueMocks.issueComment.user.login +
            '\n\n' +
            issueMocks.issueComment.body
        };

        expect(spy).toHaveBeenCalledWith(0, story);
      });
    });


    describe('onIssueLabelAdded', function () {

    });


    describe('onIssueLabelRemoved', function () {

    });


    describe('onIssueAssigneeChanged', function () {

    });


    describe('onIssueClosed', function () {
      it('should be called when a Pull Request or Issue is closed', function () {

      });
    });


    describe('onIssueReopened', function () {
      it('should be called when a Pull Request or Issue is reopened', function () {

      });
    });


    describe('onMilestoneChanged', function () {});


    describe('milestoneCreated', function () {});
  });
});
