describe('Conference.attendeeCollection', function () {
  'use strict';

  describe('contains(attendee)', function () {
    // * 테스트가 있는지?
  });
  describe('add(attendee)', function () {
    // * 테스트 추가
  });
  describe('remove(attendee)', function () {
    // * 테스트 삭제
  });

  describe('iterate(callback)', function () {
    let collection, callbackSpy;

    // !! 도우미 함수
    function addAttendeesToCollection(attendeeArray) {
      attendeeArray.forEach(function (attendee) {
        collection.add(attendee);
      });
    }

    // !! 테스트 할 항목을 실질적으로 확인
    function verifyCallbackWasExecutedForEachAttendee(attendeeArray) {
      // !! 각 원소마다 한번씩 스파이가 호출되었는지 확인한다.
      expect(callbackSpy.calls.count()).toBe(attendeeArray.length);

      // !! 각 호출마다 spy에 전달한 첫 번째 인자가 해당 attendee인지 확인한다.
      const allCalls = callbackSpy.calls.all();
      for (var i = 0; i < allCalls.length; i++) {
        expect(allCalls[i].args[0]).toBe(attendeeArray[i]);
      }
    }

    // * 각 테스트 실행 전 초기화 
    beforeEach(function () {
      collection = Conference.attendeeCollection();
      callbackSpy = jasmine.createSpy();
    });

    it('빈 콜렉션에서는 콜백을 실행하지 않는다', function () {
      collection.iterate(callbackSpy);
      expect(callbackSpy).not.toHaveBeenCalled();
    });

    it('원소가 하나뿐인 콜렉션은 콜백을 한번만 실행한다', function () {
      const attendees = [
        Conference.attendee('HK', 'kim')
      ];
      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });

    it('콜렉션 원소마다 한번씩 콜백을 실행한다', function () {
      const attendees = [
        Conference.attendee('KJ', 'kim'),
        Conference.attendee('JK', 'kim'),
        Conference.attendee('HO', 'kim')
      ];
      addAttendeesToCollection(attendees);

      collection.iterate(callbackSpy);

      verifyCallbackWasExecutedForEachAttendee(attendees);
    });

  });
});