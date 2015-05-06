(function() {
  if (this.redmine_time_tracker == null) {
    this.redmine_time_tracker = {};
  }

  this.redmine_time_tracker.TimeTracker = (function() {
    function TimeTracker() {}

    TimeTracker.hideMultiFormButtons = function(button_class) {
      var last;
      last = $("input." + button_class).parent().parent().last().index();
      return $("input." + button_class).each(function() {
        if (last !== $(this).parent().parent().index()) {
          return $(this).hide();
        } else {
          return $(this).show();
        }
      });
    };

    TimeTracker.base_url = function() {
      var src;
      src = $("link[href*=\"time_tracker.css\"]")[0].href;
      return src.substr(0, src.indexOf("plugin_assets"));
    };

    return TimeTracker;

  })();

  $(function() {
    $(document).on("ajax:success", ".tt_stop, .tt_start, .tt_dialog_stop", function(xhr, html, status) {
      $("#content .flash").remove();
      return $("#content").prepend(html);
    });
    $(document).on("ajax:success", ".tt_stop, .tt_start, .tt_dialog_stop", function(xhr, html, status) {
      $("#content .flash").remove();
      return $("#content").prepend(html);
    });
    return $(document).on("ajax:success", ".tt_stop, .tt_start, .tt_dialog_stop", function(xhr, html, status) {
      $("#content .flash").remove();
      return $("#content").prepend(html);
    });
  });

}).call(this);
