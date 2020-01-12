var Conference = Conference || {};

Conference.checkedInAttendeeCounter = function () {
    "use strict";

    let checkedInAttendees = 0;
    return {
        increment: function () {
            checkedInAttendees++;
        },
        getCount: function () {
            return checkedInAttendees;
        },
        countIfCheckedIn: function (attendee) {
            if (attendee.isCheckedIn()) {
                this.increment();
            }
        }
    };
};