var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function () {
  "use strict";

  let checkedInAttendees = 0;
  const self = {
    increment: function () {
      checkedInAttendees++;
    },
    getCount: function () {
      return checkedInAttendees;
    },
    countIfCheckedIn: function (attendee) {
      if (attendee.isCheckedIn()) {
        self.increment();
      }
    }
  };

  return self;
};