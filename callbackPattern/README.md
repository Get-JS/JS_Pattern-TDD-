#  Callback Pattern
- 콜백은 나중에 실행할 부차 함수(second function)에 인자로 넣는 함수
- 여기서 콜백이 실행될 **'나중'** 시점이 `부차 함수의` **실행 완료 이전이면 동기(synchronous),** 반대로 **실행 완료 이후면 비동기(asynchronous)** 
- 현재 예제들은 전부 동기 콜백이지만, 비동기 콜백도 적용 기법(과 그에 따른 잠재적 문제들)은 같다.
- 콜백 패턴은 언어 자체는 물론이고 제이쿼리 같은 서드파티 라이브러리에서 **사용 빈도가 매우 높아** 자바스크립트의 바른 길로 가려면 반드시 섭렵해야 할 중요 패턴이다.

## Sinario
- 신규 화면은 참가자 목록을 보여주고 그중 한 사람 또는 여러 사람을 선택(체크인한 것으로 표시)한 뒤 **외부 시스템과 연동하여** 체크인을 완료한다.
- UI 배후의 체크인 기능은 checkInService 함수에 구현을 해야 한다. 
- 참가자 체크인 여부를 비롯한 각종 정보를 **Conference.attendee함수가**, 생성한 객체에 담아두면 **참가자 체크인 뒤처리는 checkInService의 몫이다.**

## attendee.js, attendeeCollection.js
- 업무 요건상, 하나 또는 둘 이상의 attendee 객체에 대해 checkIn 함수를 실행해야 한다. 
- 나중에 참가자 단체를 처리하는 방식이 바뀔지 모르니 **attendee 객체 컬렉션을 캡슐화한** **`attendeeCollection`** 객체를 두는 것이 타당해 보인다. 

- 참가자를 각각 체크인 하려면 **`attendeeColletion`** 객체는 참가자 **개인별로 어떤 액션을 수행할 수 있는** 구조여야 한다. 이러한 액션을 **`콜백 함수에`** 넣어 실행하고 싶다. 

## attendeeCollection_test
여기서 테스트는 2가지를 확인한다.
- 콜백 실행 횟수가 정확하다
- 콜백이 실행될 때마다 알맞은 인자가 전달된다. 

* 테스트 목적을 달성하려면 **매번 함수를 실행할 때마다 수신한 인자 등을 기록할 일종의 콜백함수가 필요하다.** **`재스민 스파이가`** 바로 이런일(사실 더 많은 일을 할 수 있다.)에 제격이다.

### createSpy
- createSpy로 만든 스파이는 말 그대로 빈 껍데기 스파이(bare spy)다. 
- spyOn(someObject, 'someFunction')처럼 만든 스파이와 달리 빈 껍데기 스파이는 **이미 존재하는 객체나 감시할 대상 함수가 필요 없다.**
- 따라서 호출 추적 정도의 **`'감시 행위' 이상의 활동은 기대하기 어렵다.`** 
- 즉, 빈 껍데기 스파이는 `감시할 함수(함수 자체가 없다.)를 호출한 후 구현부로 흘러들어 가게 하거나` `다른 함수를 함께 호출하는 기능` **따위는 없다.**
- 이러한 한계는 있지만, **콜백 함수가 제대로 실행되었는지 확인하는 용도로는** 딱이다.

### notice 
attendeeCollection 기능 구현은 마쳤지만, **`Sinario에서`** 제시한 요건이 아직 다 반영된 건 아니다. 

참가자 체크인 후 **외부 시스템에 체크인을 등록하는 코드가 아직 남았다.** 

## anonymousFunction 
- 익명함수를 atttendee.Collection.iterate 함수에 바로 넣기만 하면 된다.
```js
    var attendess = Confernce.attendeeCollection();

    // UI에서 선택된 참가자들을 추가한다. 
    attendees.iterate(function(attendee){
        attendee.checkIn();
        // 외부 서비스를 통해 체크인 등록한다.
    })
```

### side effect 
1. 익명 콜백 함수는 콜백만 **따로 떼어낼 방법이 없어서** 단위 테스트가 불가능 하다.
   - 위의 로직도 참가자 체크인 기능이 attendeeCollection에 묶여 있으므로 (콜백 실행 여부가 아니라, **참가자들이 제대로 체크인 해서 등록 처리가 끝났는지 테스트할 의도가 아니라면**) 컬렉션에 포함된 참가자들의 체크인 여부는 전체 컬렉션을 상대로 계속 테스트를 반복할 수밖에 없다.
   - **한낱 익명 콜백 함수 하나를 테스트하는 코드가 전체 테스트 꾸러미를 WET하게 만든다면** 다중 작업을 익명함수로 처리할 땐 오죽하겠는가? **엄청난 반복의 늪에 빠지고 말 것이다.** 

2. 익명 함수는 디버깅을 매우 어렵게 만든다( `side effect 1.` 보다 훨씬 더 중요한 문제다.) 익명 함수는 정의 자체가 **이름 없는 함수라서 디버거가 호출 스택체 식별자를 표시할 수 없다.**
   - 하지만 정의하자마자 바로 넘기는 콜백 함수에도 **이름을 붙일 수 있다.** 물론 그렇다고 **테스트 성이 더 좋아지는 건 아니지만, 적어도 디버깅 작업은 한결 수월해진다.** 
    ```js
        var attendees = Conference.attendeeCollection();
        // UI에서 선택된 참갖들을 추가한다.
        attendees.iterate(function doCheckIn(attendee){
            attendee.checkIn();
            // 외부 서비스를 통해 체크인 등록한다.
        });
    ```

### Sol.
익명(이름 붙인)함수를 곧장 콜백으로 넘기면 테스트하기 곤란해지니 참가자 체크인 콜백을 구현할 뭔가 좋은 (테스트하기 좋은)방법이 없을까?

참가자 체크인은 중요한 기능 요건이므로 가령 **`checkInService`** 같은 **자체 모듈에 캡슐화하면 어떨까?**
이렇게 하면 **테스트 가능한 단위로 만들 수 있고 체크인 로직을 `attendeeCollection` 에서 분리하여 코드를 재사용할 수 도 있다.**

# The other problem 
콜백 패턴의 믿음성을 끌어내리는 원인은 익명 콜백 함수 뿐만아니다. 

**'콜백 화살',** 콜백 함수에서 엉뚱한 값을 가리키는 **'this'** 이 두가지를 더 예방 해보자.

## Callback Arrow
- 코드(the other problem/callbackArrow.js)는 읽기는 물론 고치기도 어렵거니와 단위 테스트는 사실상 불가능하다. 

### Sol. (Refactoring)
- (the other problem/callbackArrowSol.js)언뜻 리팩토링 전 이 더 깔끔 해 보이지만, 
- 중첩 콜백을 쓴 실제 제품 코드는 중간중간 다른 로직이 보태지기 마련이라 이런 보기편한 코드는 보기 드물다. 

- 무엇보다 **단위 테스트를 전적으로 할 수 있다는 점이 장점이다.** 
- 중첩 익명 콜백함수의 모든 기능을 그 자체만으로 단위 테스트할 수 있는 **CallbackArrow의 함수 프로퍼티로 빼낸 덕분이다.**
- 더구나 콜백 함수마다 명찰이 달려 있으니 **디버깅 도구에서 스택 추적 시 편리하다.** 

## this
- 콜백 함수에서 this 변수를 참조할 때는 특별히 조심해야 한다. 
- **전혀 상관없는 값을 참조할 수 있기 때문이다.**

### Sinario
- 체크인을 마친 `attendeeCollection의` attendee 객체 수를 세는 **`checkedInAttendeeCounter`** 모듈을 구현해야 한다.
- checkInService와 크게 다를 바 없이 `attendeeCollection.iterate에` **표출할 함수를 넘기는 식으로 작성하면 된다.** 

### problerm 
- 여기서 countIfCheckedIn이 checkedInAttendeeCounter 인스턴스를 this로 참조하는 로직을 눈여겨보자.
- 단위 테스트는 모두 통과 했지만, **checkedInAttendeeCounter를 정말 attendeeCollection 인스턴스와 함께 쓸 수 있을까?** 
  - 의문점 자체가 테스트로 확인
  - 버그가 있다는 건 테스트 꾸러미가 아직 덜 됐다는 반증이다. 항상 버그를 고치기 전에 실패할 테스를 먼저 작성 한다.
```js
    var checkInService = Confernce.checkInService(Confernce.checkInRecorder()),
    attendees = Confernce.attendeeCollection();
    coutner = Confernce.checkedInAttendeeCounter();

    // UI에서 선택한 참가자들을 참가자 컬렉션에 추가한다. 
    attendee.add(Conference.attendee("배찌", "김"));
    attendee.add(Conference.attendee("Nick", "BradShaw"));
    
    // 참석자들을 체크인한다.
    attendee.iterate(checkInService.checkIn);

    // 체크인을 마친 참가자 인원수를 세어본다.
    attendee.iterate(coutner.countIfCheckedIn);

    console.log(counter.getCount());
    // result: 0
```

- **0이 아니라 2가 나와야 예상한 값이랑 일치한다.** 
- 디버깅 과정에서 `checkedInAttendeeCounter에서` **this가 실제로 가리킨 값은** checkedInAttendeeCounter가 아니라 **전역 window 객체임을** 알 수 있다.
- 일반적으로 this값은 함수를 호출한(대게 함수 앞에 점으로 연결한)객체를 가리키지만, **콜백함수를 만들어 넣을 때 어떤 객체를 참조하라고 직접 지정할 수는 없다.** 
- 이런 이유로 **콜백 함수는 대부분 this를 `명시적으로` 가리킨다.**

### Sol. (Refactoring)
- attendeeCollection.iterate에서 forEach는 콜백 내부에서 참조할 객체를 두 번째 인자로 전달함으로써 **this가 무엇을 참조해야 하는지 밝힐 수 있다.** 
- attendeeCollection.iterate로 하여금 **this가 참조할 객체를 두 번째 인자로 받아 forEach에 그대로 넘겨주게끔 고친다.** 
- 이렇게 해서 countIfCheckedIn 함수에 걸맞은 **this를 `checkedInAttendeeCounter` 인스턴스에 묶어둘 수 있다.**

#### notice !!! 
- 그러나 **만일 attendeeCollection이 외부 업체가 납품한 라이브러리 코드라 수정할 수 없는 경우라면** 무용지물 아닌가?
- 작성한 콜백에서 **안정적으로 현재 객체 인스턴스를 가리키도록 할 순 없을까?**
- 우선, checkedInAttendeeCounter.countIfCheckedIn 실행 시 **this가 checkedInAttendeeCounter인스턴스 `이외의 객체를 가리키는 상황을` 가정한 단위 테스트를 작성 한다.**
- Conference.checkedInAttendeeCounter 자신의 참조값을 **self라는 변수에 담고** countIfCheckedIn에서 **this 대신 self로 참조하면 getCount 함수를 확실히 바라볼 수 있을 것이다.** 
- 이렇게 Conference.checkedInAttendeeCounter 구현부를 고친 다음 단위 테스트를 실행하면 성공한것을 볼 수 있다.