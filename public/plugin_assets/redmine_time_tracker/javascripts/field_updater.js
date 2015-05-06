(function() {
  if (this.redmine_time_tracker == null) {
    this.redmine_time_tracker = {};
  }

  this.redmine_time_tracker.FieldUpdater = (function() {
    function FieldUpdater() {}

    FieldUpdater.updateBookingHours = function(name) {
      var start, stop;
      start = timeString2min($("#" + name + "_start_time").val());
      stop = timeString2min($("#" + name + "_stop_time").val());
      return $("#" + name + "_spent_time").val(min2timeString(stop + (stop < start ? 1440 : 0) - start));
    };

    FieldUpdater.updateBookingStop = function(name) {
      var spent_time, start;
      start = timeString2min($("#" + name + "_start_time").val());
      spent_time = timeString2min($("#" + name + "_spent_time").val());
      return $("#" + name + "_stop_time").val(min2parsedTimeString((start + spent_time) % 1440));
    };

    FieldUpdater.updateBookingProject = function(name) {
      var issue_id, issue_id_field, project_id_field, project_id_select;
      issue_id_field = $("#" + name + "_issue_id");
      project_id_field = $("#" + name + "_project_id");
      project_id_select = $("#" + name + "_project_id_select");
      issue_id = issue_id_field.val();
      if (!issue_id || $.trim(issue_id) === "") {
        project_id_select.attr("disabled", false);
        return issue_id_field.removeClass("invalid");
      } else {
        return $.ajax({
          url: redmine_time_tracker.TimeTracker.base_url() + "issues/" + issue_id + ".json?key=" + current_user_api_key(),
          type: "GET",
          success: (function(_this) {
            return function(transport) {
              var issue;
              issue_id_field.removeClass("invalid");
              issue = transport.issue;
              if (issue == null) {
                project_id_select.attr("disabled", false);
              } else {
                project_id_select.attr("disabled", true);
                project_id_field.val(issue.project.id);
                $("#" + project_id_select.attr("id")).val(issue.project.id).trigger('change');
              }
              return _this.updateBookingActivity(name);
            };
          })(this),
          error: function() {
            project_id_select.attr("disabled", false);
            return issue_id_field.addClass("invalid");
          }
        });
      }
    };

    FieldUpdater.updateBookingActivity = function(name) {
      return $.ajax({
        url: redmine_time_tracker.TimeTracker.base_url() + "tt_completer/get_activity.json?key=" + current_user_api_key() + "&project_id=" + $("#" + name + "_project_id").val(),
        type: "GET",
        success: (function(_this) {
          return function(activites) {
            var activity_field, selected_activity;
            activity_field = $("#" + name + "_activity_id_select");
            selected_activity = activity_field.find("option:selected").text();
            activity_field.find("option[value!=\"\"]").remove();
            return $.each(activites, function(i, activity) {
              activity_field.append("<option value=\"" + activity.id + "\">" + activity.name + "</option>");
              if (selected_activity === activity.name) {
                return activity_field.val(activity.id);
              }
            });
          };
        })(this)
      });
    };

    return FieldUpdater;

  })();

}).call(this);
