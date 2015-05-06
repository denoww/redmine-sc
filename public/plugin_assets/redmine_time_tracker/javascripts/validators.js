(function() {
  var extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
    hasProp = {}.hasOwnProperty;

  if (this.redmine_time_tracker == null) {
    this.redmine_time_tracker = {};
  }

  this.redmine_time_tracker.FormValidator = (function() {
    function FormValidator(form) {
      this.form = form;
    }

    FormValidator.prototype.validate = function() {
      this._clean_up();
      this._do_validation();
      return this._update_submit_button_state();
    };

    FormValidator.prototype._do_validation = function() {};

    FormValidator.prototype._clean_up = function() {
      return this._invalid_form_inputs().removeClass('invalid');
    };

    FormValidator.prototype._validates_presence_of = function(element) {
      return this._validates(element, element.val() !== '');
    };

    FormValidator.prototype._validates = function(element, condition) {
      if (!condition) {
        return element.addClass('invalid');
      }
    };

    FormValidator.prototype._form_is_invalid = function() {
      return this._invalid_form_inputs().length > 0;
    };

    FormValidator.prototype._invalid_form_inputs = function() {
      return this.form.find(':input.invalid');
    };

    FormValidator.prototype._update_submit_button_state = function() {
      return this.form.find(':submit').attr('disabled', this._form_is_invalid());
    };

    return FormValidator;

  })();

  this.redmine_time_tracker.ListInputValidator = (function(superClass) {
    extend(ListInputValidator, superClass);

    function ListInputValidator(name) {
      this.start_field = $("#" + name + "_start_time");
      this.stop_field = $("#" + name + "_stop_time");
      this.spent_field = $("#" + name + "_spent_time");
      ListInputValidator.__super__.constructor.call(this, this.start_field.closest("form"));
    }

    ListInputValidator.prototype._do_validation = function() {
      this._validates_presence_of(this.start_field);
      this._validates_presence_of(this.stop_field);
      this._validates_presence_of(this.spent_field);
      return ListInputValidator.__super__._do_validation.apply(this, arguments);
    };

    return ListInputValidator;

  })(this.redmine_time_tracker.FormValidator);

  this.redmine_time_tracker.EditTimeLogValidator = (function(superClass) {
    extend(EditTimeLogValidator, superClass);

    function EditTimeLogValidator(name) {
      this.date_field = $("#" + name + "_tt_log_date");
      EditTimeLogValidator.__super__.constructor.call(this, name);
    }

    EditTimeLogValidator.prototype._do_validation = function() {
      this._validates_presence_of(this.date_field);
      return EditTimeLogValidator.__super__._do_validation.apply(this, arguments);
    };

    return EditTimeLogValidator;

  })(this.redmine_time_tracker.ListInputValidator);

  this.redmine_time_tracker.AddBookingValidator = (function(superClass) {
    extend(AddBookingValidator, superClass);

    function AddBookingValidator(name) {
      this.proj_id_field = $("#" + name + "_project_id");
      this.proj_select = $("#" + name + "_project_id_select");
      this.activity_select = $("#" + name + "_activity_id_select");
      this.max_time_field = $("#" + name + "_max_time");
      this.min_time_field = $("#" + name + "_min_time");
      this.max_spent_time_field = $("#" + name + "_max_spent_time");
      AddBookingValidator.__super__.constructor.call(this, name);
    }

    AddBookingValidator.prototype._do_validation = function() {
      var max_spent_time, max_time, min_time, spent_time, start, stop;
      this._validates_presence_of(this.proj_select);
      this._validates_presence_of(this.activity_select);
      start = timeString2min(this.start_field.val());
      min_time = timeString2min(this.min_time_field.val());
      stop = timeString2min(this.stop_field.val());
      max_time = timeString2min(this.max_time_field.val());
      spent_time = timeString2min(this.spent_field.val());
      max_spent_time = timeString2min(this.max_spent_time_field.val());
      this._validates(this.spent_field, spent_time <= max_spent_time);
      if (max_spent_time < 1440) {
        if (min_time > max_time) {
          this._validates(this.start_field, !((max_time <= start && start < min_time)));
          this._validates(this.stop_field, !((max_time < stop && stop <= min_time)));
        } else {
          this._validates(this.start_field, (min_time <= start && start < max_time));
          this._validates(this.stop_field, (min_time < stop && stop <= max_time));
        }
      }
      return AddBookingValidator.__super__._do_validation.apply(this, arguments);
    };

    return AddBookingValidator;

  })(this.redmine_time_tracker.ListInputValidator);

  this.redmine_time_tracker.EditBookingValidator = (function(superClass) {
    extend(EditBookingValidator, superClass);

    function EditBookingValidator(name) {
      this.date_field = $("#" + name + "_tt_booking_date");
      this.valid_dates = $("#" + name + "_valid_dates").val().split("|");
      EditBookingValidator.__super__.constructor.call(this, name);
    }

    EditBookingValidator.prototype._do_validation = function() {
      this._validates_presence_of(this.date_field);
      this._validates(this.date_field, !($.inArray(this.date_field.val(), this.valid_dates) === -1));
      return EditBookingValidator.__super__._do_validation.apply(this, arguments);
    };

    return EditBookingValidator;

  })(this.redmine_time_tracker.AddBookingValidator);

  this.redmine_time_tracker.TimeTrackerFormValidator = (function(superClass) {
    extend(TimeTrackerFormValidator, superClass);

    function TimeTrackerFormValidator() {
      this.proj_field = $('#time_tracker_project_id');
      this.activity_select = $('#time_tracker_activity_id');
      TimeTrackerFormValidator.__super__.constructor.call(this, $('.time-tracker-form'));
    }

    TimeTrackerFormValidator.prototype._do_validation = function() {
      var activity_id, proj_id;
      proj_id = this.proj_field.val();
      activity_id = this.activity_select.val();
      this._validates(this.activity_select, proj_id === "" || activity_id !== "");
      return TimeTrackerFormValidator.__super__._do_validation.apply(this, arguments);
    };

    return TimeTrackerFormValidator;

  })(this.redmine_time_tracker.FormValidator);

}).call(this);
