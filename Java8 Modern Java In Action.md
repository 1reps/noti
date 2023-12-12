# Java8 : Modern Java In Action

---

1. **람다 표현식**은 메서드로 전달할 수 있는 익명 함수를 단순화한 것
2. **람다의 특징**
    1. 익명 : 보통의 메서드와 달리 이름이 없으므로 익명이라 표현한다. 구현해야 할 코드에 대한 걱정거리가 줄어듦
    2. 함수 : 람다는 메서드처럼 특정 클래스에 종속되지 않으므로 함수라고 부른다.
    3. 전달 : 람다 표현식을 메서드 인수로 전달하거나 변수로 저장할 수 있다.
    4. 간결성 : 익명 클래스처럼 많은 자질구레한 코드를 구현할 필요가 없다.
3. **표현식**
    
    
    | 불리언 표현식 | (List<String> list) → list.isEmpty() |
    | --- | --- |
    | 객체 생성 | () → new Apple(10) |
    | 객체에서 소비 | (Apple a) → { sout(a.getWeight()) } |
    | 객체에서 선택/추출 | (String s) → s.length() |
    | 두 값을 조합 | (int a, int b) → a * b |
    | 두 객체 비교 | (Apple a1, Apple a2) → a1.getWeight().compareTo(a2.getWeight()) |
4. **함수형 인터페이스**
    
    ```java
    // 오직 하나의 추상 메서드만 지정
    public interface Predicate<T> { boolean test(T t); 
    public interface Comparator<T> { int compare(T o1, T o2); }
    public interface ActionListener extends EventListener { void actionPerformed(ActionEvent e); }
    public interface Callable<V> { V call() throws Exception; }
    public interface PrivilegedAction<T> { T run(); } 
    ```
    
5. **함수 디스크립터**
    1. Runnable 인터페이스는 인수와 반환값이 없는 시그니처이므로 **() → void** 표기
    2. public void process(Runnable r) { r.run() } 
        1. process(() → System.out.println(”This is awesome!!”));
6. **@FunctionalInterface**
    1. 추상 메서드가 한 개 이상이라면 “Multiple nonoverriding abstract methos found in interface Foo”
7. **람다 활용 : 실행 어라운드 패턴**
    
    ```java
    // 자원 처리(데이터베이스의 파일 처리)에 사용하는 순환 패턴은 자원을 열고, 처리한 다음(설정), 자원을 닫는 순서(정리)
    // try-with-resources -> 사용하면 자원을 명시적으로 닫을 필요가 없으므로 간결한 코드를 구현하는데 도움을 준다.
    public String processFile() throws IOException {
    	try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    		return br.readLine(); // 실제 필요한 작업을 하는 행
    	}
    }
    ```
    
    ![Untitled](Java8%20Modern%20Java%20In%20Action%202af82249e8c54752a3c50e718b23ca09/Untitled.png)
    
8. **동작 파라미터화를 기억하라**
    1. 위의 코드는 파일에서 한 번에 한 줄만 읽을 수 있다. 
    2. 정리 과정은 재사용하고 processFile 메서드만 다른 동작을 수행하도록 명령할 수 있다면 좋을 것이다.
    3. processFile의 동작을 파라미터화하는 것이다.
    4. BufferedReader를 이용해서 다른 동작을 수행할 수 있도록 processFile 메서드로 동작을 전달해야 한다.
    5. 람다를 이용해서 동작을 전달할 수 있다.
    
    ```java
    String result = processFile((BufferedReader br) → br.readLine() + br.readLine());
    ```
    
9. **함수형 인터페이스를 이용해서 동작 전달**
    
    ```java
    @FuntionalInterface
    public interface BufferedReaderProcessor {
    	String process(BufferedReader b) throws IOException;
    }
    // 정의한 인터페이스를 processFile 메서드의 인수로 전달할 수 있다.
    public String processFile(BufferedReaderProcessor p) throws IOException {
    	...
    }
    ```
    
10. **동작 실행**
    1. BufferedReaderProcessor에 정의된 process 메서드의 시그니처(BufferedReader → String)와 일치하는 람다를 전달할 수 있다.
    
    ```java
    public String processFile(BufferedReaderProcessor p) throws IOException {
    	try (BufferedReader br = new BufferedReader(new FileReader("data.txt"))) {
    		return p.process(br); // BufferedReader 객체 처리
    	}
    }
    ```
    
11. **람다 전달**
    
    ```java
    // 한 행을 처리하는 코드
    String oneLine = processFile((BufferedReader br) -> br.readLine());
    // 두 행을 처리하는 코드
    String twoLines = processFile((BufferedReader br) -> br.readLine() + br.readLine());
    ```
    
12. **Predicate**
    1. test라는 추상 메서드를 정의하며 test는 제네릭 형식 T의 객체를 인수로 받아 불리언을 반환한다.
    
    ```java
    @FunctionalInterface
    public interface Predicate<T> { boolean test(T t); }
    ...
    public <T> List<T> filter(List<T> list, Predicate<T> p) {
    	List<T> results = new ArrayList<>();
    	for (T t: list)
    		if (p.test(t))
    			results.add(t);
    	return results;
    }
    Predicate<String> nonEmptyStringPredicate = (String s) -> !s.isEmpty();
    List<String> nonEmpty = filter(listOfStrings, nonEmptyStringPredicate); // 문자열이 있는 리스트
    ```
    
13. **Consumer**
    1. 제네릭 형식 T 객체를 받아서 void를 반환하는 accept라는 추상 메서드를 정의한다.
    T 형식의 객체를 인수로 받아서 어떤 동작을 수행하고 싶을 때 Consumer 인터페이스를 사용할 수 있다.
    
    ```java
    @FunctionalInterface
    public interface Consumer<T> { void accept(T t); }
    ...
    public <T> void forEach(List<T> list, Consumer<T> c) {
    	for (T t: list) 
    		c.accept(t);
    }
    forEach(
    	Arrays.asList(1,2,3,4,5),
    	(Interger i) -> System.out.println(i) // Consumer의 accept 메서드를 구현하는 람다
    );
    ```
    
14. **Function**
    1. 제네릭 형식 T를 인수로 받아서 제네릭 형식 R 객체를 반환하는 추상 메서드 apply를 정의한다.
    입력을 출력으로 매핑하는 람다를 정의할 때 Function 인터페이스를 활용할 수 있다.
    
    ```java
    @FunctionalInterface
    public interface Function<T, R> { R apply(T t); }
    ...
    public <T, R> List<R> map(List<T> list, Function<T, R> f) {
    	List<R> result = new ArrayList<>();
    	for (T t: list)
    		result.add(f.apply(t));
    	return result;
    }
    // [7, 2, 6]
    List<Integer> I = map(
    	Arrays.asList("lambdas", "in", "action"),
    	(String s) -> s.length() // Function의 apply 메서드를 구현하는 람다
    );
    ...
    String[] strings = {"lambdas", "in", "action", "duplic"};
    Stream<Integer> integerStream = Arrays.stream(strings).map((String s) -> s.length());
    
    Map<Integer, String> notEmptyMap = new LinkedHashMap<>(); // 비어있는 Map 제공 가능
    Map<Integer, String> collect = Arrays.stream(strings)
            .collect(Collectors.toMap(
                    String::length,
                    Function.identity(),
                    (olVal, newVal) -> newVal, // 중복되는 키가 있으면 maerge 가능
                    () -> notEmptyMap
            ));
    
    System.out.println(collect); // {2=in, 6=duplic, 7=lambdas}
    ```
    
15. **기본형 특화**
    1. 자바의 모든 형식은 참조형 (ex. Byte, Integer, Object, List) 아니면 기본형 (ex. int, double, byte, char)에 해당
    2. 제네릭 파라미터(Consumer<T>의 T)에는 참조형만 사용할 수 있다.
    3. 자바에는 기본형을 참조형으로 변환하는 기능을 제공한다. 이 기능을 **박싱**이라고 한다.
    
    ```java
    List<Integer> list = new ArrayList<>();
    for (int i = 300; i < 400; i++) {
    	list.add(i);
    }
    ```
    
    ```java
    public interface IntPredicate { boolean test(int t); }
    ...
    IntPredicate evenNumbers = (int i) -> i % 2 == 0;
    evenNumbers.test(1000); // 참(박싱 없음)
    Predicate<Integer> oddNumbers = (Integer i) -> i % 2 != 0;
    oddNumbers.test(1000); // 거짓(박싱)
    ```
    
16. **객체의 최소값 최대값 비교**
    
    ```java
    Apple apply = BinaryOperator.minBy(Comparator.comparingInt(Apple::getWeight))
    						                .apply(new Apple(100, "red"), new Apple(160, "green"));
    System.out.println(apply); // 작은 무게를 가진 사과 객체를 반환한다.
    ```
    
17. **예외, 람다, 함수형 인터페이스의 관계**
    
    함수형 인터페이스는 확인된 예외를 던지는 동작을 허용하지 않는다.
    
    예외를 던지는 람다 표현식을 만들려면 확인된 예외를 선언하는 함수형 인터페이스를 직접 정의하거나 try/catch 블록을 감싸야 한다.
    
    ```java
    @FunctionalInterface
    public interface BufferedReaderProcessor {
    	String process(BufferedReader b) throws IOException;
    }
    BufferedReaderProcessor p = (BufferedReaderProcessor  br) -> br.readLine();
    // ... 예외 잡는 방법
    Funtion<BufferedReader, String> f = (BufferedReader b) -> {
    	try {
    		return b.readLine();
    	} catch(IOException e) {
    		throw new RuntimeException(e);
    	}
    };
    ```
    
18. **형식 검사, 형식 추론, 제약**
    
    ```java
    List<Apple> heavierThan150g = filter(inventory, (Apple apple) -> apple.getWeight() > 150);
    ```
    
    1. filter 메서드의 선언을 확인한다.
    2. filter 메서드는 두 번째 파라미터로 Predicate<Apple> 형식(대상 형식)을 기대한다.
    3. Predicate<Apple>은 test라는 한 개의 추상 메서드를 정의하는 함수형 인터페이스다.
    4. test 메서드는 Apple을 받아 boolean을 반환하는 함수 디스크립터를 묘사한다.
    5. filter 메서드로 전달된 인수는 이와 같은 요구사항을 만족해야 한다.
19. **같은 람다, 다른 함수형 인터페이스**
    
    ```java
    Callable<Integer> c = () -> 42;
    PrivilegedAction<Integer> p = () -> 42;
    ```
    
    이와 비슷한 예제가 있다.
    
    ```java
    Comparator<Apple> c1 = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
    ToIntBiFunction<Apple, Apple> c2 = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
    BIFunction<Apple, Apple, Integer> c3 = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight());
    ```
    
20. peek vs map
    
    ```java
    List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
    
    List<Integer> squaredNumbers = numbers.stream()
                                        .peek(x -> System.out.println("Before map: " + x))
                                        .map(x -> x * x)
                                        .peek(x -> System.out.println("After map: " + x))
                                        .collect(Collectors.toList());
    // Before map: 1
    // After map: 1
    // Before map: 2
    // After map: 4
    // Before map: 3
    // After map: 9
    // Before map: 4
    // After map: 16
    // Before map: 5
    // After map: 25
    // [1, 4, 9, 16, 25]
    ```
    
    ```java
    List<Integer> numbers = Arrays.asList(1, 2, 3, 4, 5);
    
    List<Integer> squaredNumbers = numbers.stream()
                                        .map(x -> x * x)
                                        .collect(Collectors.toList()); 
    // [1, 4, 9, 16, 25]
    ```
    
    ```java
    String[] strArr = new String[]{"A", "B", "C", "", "D"};
    List<String> stringList = new ArrayList<>(Arrays.asList(strArr));
    stringList.stream()
              .filter(s -> !s.isEmpty())
              .peek(resultList1::add)
              .forEach(System.out::println); // A B C D
    // peek은 filter된 값을 중간연산 후 stream으로 반환하여 forEach로 결과 값을 출력 
    stringList.stream()
              .filter(s -> !s.isEmpty())
              .map(resultList1::add)
              .forEach(System.out::println); // true true true true
    // map은 filter된 값에 map한 결과 값을 반환하여 forEach로 결과 값을 출력
    ```
    
21. 형식 추론
    
    자바 컴파일러는 람다 표현식이 사용된 콘텍스트(대상 형식)를 이용해서 람다 표현식과 관련된 함수형 인터페이스를 추론한다.
    
    대상 형식을 이용해서 함수 디스크립터를 알 수 있으므로 컴파일러는 람다의 시그니처도 추론할 수 있다.
    
    결과적으로 컴파일러는 람다 표현식의 파라미터 형식에 접근할 수 있으므로 람다 문법에서 이를 생략할 수 있다.
    
    ```java
    List<Apple> greenAplles = filter(inventory, apple -> GREEN.equals(apple.getColor()));
    ```
    
    여러 파라미터를 포함하는 람다 표현식에서는 코드 가독성 향상이 더 두드러진다.
    
    ```java
    Comparator<Apple> c = (Apple a1, Apple a2) -> a1.getWeight().compareTo(a2.getWeight()); // 형식을 추론하지 않음
    Comparator<Apple> c = (a1, a2) -> a1.getWeight().compareTo(a2.getWeight()); // 형식을 추론함
    ```
    
22. 지역 변수 사용
    
    람다 표현식에서는 익명 함수가 하는 것처럼 자유 변수(외부에서 정의된 변수)를 활용할 수 있다. (= 람다 캡쳐링)
    
    ```java
    int portNumber = 1337;
    Runnable r = () -> System.out.println(portNumber);
    ```
    
    자유 변수에도 약간의 제약이 있다. 
    람다는 인스턴스 변수와 정적 변수를 자유롭게 캡처 (자신의 바디에서 참조할 수 있도록)할 수 있다.
    
    하지만 그러려면 지역 변수는 명시적으로 final로 선언되어 있어야 하거나 실질적으로 final로 선언된 변수와 똑같이 사용되어야 한다.
    
    즉, 람다 표현식은 한 번만 할당할 수 있는 지역 변수를 캡처할 수 있다.
    (참고 : 인스턴스 변수 캡처는 final 지역 변수 this를 캡처하는 것과 마찬가지다).
    
    ```java
    int portNumber = 1337;
    Runnable r = () -> System.out.println(portNumber);
    portNumber = 31337;
    ```
    
23. 지역 변수의 제약
    
    인스턴수 변수와 지역 변수는 태생부터 다르다.
    인스턴스 변수는 힙에 저장되는 반면 지역 변수는 스택에 위치한다.
    
    람다에서 지역 변수에 바로 접근할 수 있다는 가정하에 람다가 스레드에서 실행된다면 변수를 할당한 스레드가 사라져서 변수 할당이 해제되었는데도 람다를 실행하는 스레드에서는 해당 변수에 접근하려 할 수 있다.
    
    따라서 자바 구현에서는 원래 변수에 접근을 허용하는 것이 아니라 자유 지역 변수의 복사본을 제공한다.
    
    따라서 복사본의 값이 바뀌지 않아야 하므로 지역 변수에는 한 번의 값을 할당해야 한다는 제약이 생긴 것이다.
    
    또란 지역 변수의 제약 때문에 외부 변수를 변화시키는 일반적인 명령형 프로그래밍 패턴(병렬화를 방해하는 요소로 나중에 설명한다)에 제동을 걸 수 있다.