var Conference = Conference || {};

Conference.checkInRecorder = function() {
  "use strict";
  const attendees = [];

  return {
    recordCheckIn: function(attendee) {
      // * 외부 서비스를 통해 체크인 등록한다
      attendees.push(attendee);
    }
  };
};