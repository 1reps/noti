# Spring Boot

---

### Section 8. 외부 설정을 이용한 자동 구성

- Environment 추상화와 프로퍼티
    
    
    ![Untitled](Spring%20Boot%201c2c3d96fdfe4b4db3056b9b0b98cfa8/Untitled.png)
    
    1. Class 가 존재하는가? (@Conditional Class 조건 체크)
    2. Configuration 클래스가 적용이되면 @Bean 이 붙은 메서드에서 Bean Object 를 생성할 것인가 아니면, 
    개발자가 직접 그와 동일한 타입의 @Bean 을 유저 구성정보에 만들어 놨는지 있다면 커스텀 @Bean 구성정보를 사용하게되며 자동 @Bean 구성정보는 무시하게된다.
    3. 포트를 바꾸고 싶을 때, 커스텀 빈 설정을 @ComponentScan에 의해 등록되는 유저 구성정보 방식을 이용 (자동 구성정보에 @ConditionalOnMissingBean 을 추가해주었음)
- 자동 구성에 Environment 프로터피 적용
    
    > 외부 Property 값 가져오기
    > 
    
    ```java
    @Bean
    ApplicationRunner applicationRunner(Environment env) {
        // Environment 를 통해서 application.properties 값(key, value)을 가져온다.
        return args -> {
            String name = env.getProperty("my.name");
            System.out.println("my.name: " + name);
        };
    }
    ```
    
    ![위에 있는 Environment 보다 Edit Configuration 에 있는 Environment variables 가 우선순위가 높다.](Spring%20Boot%201c2c3d96fdfe4b4db3056b9b0b98cfa8/Untitled%201.png)
    
    위에 있는 Environment 보다 Edit Configuration 에 있는 Environment variables 가 우선순위가 높다.
    
    ![마지막으로, VM Option… 을 이용하면 SystemProperty 로 가장 우선순위가 높다.](Spring%20Boot%201c2c3d96fdfe4b4db3056b9b0b98cfa8/Untitled%202.png)
    
    마지막으로, VM Option… 을 이용하면 SystemProperty 로 가장 우선순위가 높다.
    
    > ContextPath
    > 
    
    ```java
    @Bean("tomcatWebServerFactory")
    @ConditionalOnMissingBean
    public ServletWebServerFactory servletWebServerFactory() {
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.setContextPath("/app");
        return factory;
    }
    ```
    
    ![/app 을 붙이지 않으면 404 에러 발생](Spring%20Boot%201c2c3d96fdfe4b4db3056b9b0b98cfa8/Untitled%203.png)
    
    /app 을 붙이지 않으면 404 에러 발생
    
- @Value와 PropertySourcesPlaceholderConfigurer
    
    ```java
    @Bean
    PropertySourcesPlaceholderConfigurer propertySourcesPlaceholderConfigurer() {
        return new PropertySourcesPlaceholderConfigurer();
    }
    ```
    
- 프로퍼티 클래스의 분리
    
    ```java
    @Value("${port:8080}") // default 8080
    int port;
    ```
    
    > No beans of “” type found 에러
    > 
    
    ```java
    @Bean("tomcatWebServerFactory")
    @ConditionalOnMissingBean
    public ServletWebServerFactory servletWebServerFactory(ServerProperties properties) {
        // 프로퍼티와 클래스를 분리하는 과정에서 클래스를 주입받으면 No Beans of … type found 에러 발생
        TomcatServletWebServerFactory factory = new TomcatServletWebServerFactory();
        factory.setContextPath(properties.getContextPath());
        factory.setPort(properties.getPort());
    
        return factory;
    }
    
    @Bean
    public ServerProperties serverProperties(Environment environment) {
        // @Bean 메서드 생성 후 에러 해결
        ServerProperties properties = new ServerProperties();
        properties.setContextPath(environment.getProperty("contextPath"));
        properties.setPort(Integer.parseInt(environment.getProperty("port")));
    
        return properties;
    }
    ```
    
    > 소스 개선 (Binder)
    > 
    
    ```java
    @Bean
    public ServerProperties serverProperties(Environment environment) {
        return Binder.get(environment).bind("", ServerProperties.class).get();
    }
    ```
    
- 프로퍼티 빈의 후처리기 도입
    
    > prefix 를 이용해서 properties 에서 prefix 값 사용하기
    > 
    
    ```java
    @Retention(RetentionPolicy.RUNTIME)
    @Target(ElementType.TYPE)
    @Component
    public @interface MyConfigurationProperties {
        String prefix();
    }
    // ... //
    @MyConfigurationProperties(prefix = "server")
    // ... //
    server.contextPath=/app
    server.port=9090
    ```
    

### Spring JDBC 자동 구성 개발

- 자동 구성 클래스와 빈 설계
- DataSource 자동 구성 클래스
- JdbcTemplate과 트랜잭션 매니저 구성
- Hello 리포지토리
- 리포지토리를 사용하는 HelloService

### 스프링부트 자세히 살펴보기

- 스프링 부트의 자동 구성과 테스트로 전환
- 스프링 부트 자세히 살펴보기
- 자동 구성 분석 방법
- 자동 구성 조건 결과 확인
- Core 자동 구성 살펴보기
- Web 자동 구성 살펴보기
- Jdbc 자동 구성 살펴보기

### 내장 WAS 종류와 특징

- Tomcat
    
    ~7버전까지 대규모 트래픽에섭 불안정하다 vs 아니다 등의 의견이 분분
    
    8버전 폭망, 8.5버전으로 대응하여 안정화
    
    9버전이 나와 안정화 이후로도 꾸준히 업데이트 중
    
    Spring Boot에서도 기본 내장 WAS는 Tomcat이다.
    
- Jetty
    
    > 장점
    > 
    
    경량 WAS이다.
    
    적은 메모리 사용과 가벼운 이점, 속도 역시 빠르다.
    
    소규모 프로그램 등에 내장하여 사용하면 좋다.
    
    > 단점
    > 
    
    대규모 트래픽에 취약하다.
    
- Netty
    
    Async, Event-Driven 방식 네트워크 애플리케이션 프레임워크이다.
    
    Undertow도 Netty 기반이다.
    
    Spring Boot 2 부터 Webflux Framework를 사용해서 Reactive Programming을 할 수 있다.
    
    Webflux를 사용하면 기본 내장 WAS는 Netty가 된다.
    
- Undertow
    
    Blocking과 Non-Blocking API를 모두 안정적으로 제공하는 유연한 고성능 웹서버
    
    대규모 트래픽으로부터 Tomcat보다 안정적이다.
    
    Spring에서 공식적으로 내장 WAS를 지원
    

### 초기구성

- build.gradle
    
    ```
    plugins {
    	id 'java'
    	id 'org.springframework.boot' version '2.7.13'
    	id 'io.spring.dependency-management' version '1.0.15.RELEASE'
    }
    
    group = 'org.zerock'
    version = '0.0.1-SNAPSHOT'
    
    java {
    	sourceCompatibility = '11'
    }
    
    ext {
    	junitVersion = '5.8.2'
    }
    
    configurations {
    	compileOnly {
    		extendsFrom annotationProcessor
    	}
    }
    
    repositories {
    	mavenCentral()
    }
    
    dependencies {
    	//Junit
    	testImplementation("org.junit.jupiter:junit-jupiter-api:${junitVersion}")
    	testRuntimeOnly("org.junit.jupiter:junit-jupiter-engine:${junitVersion}")
    	implementation group: 'org.springframework', name: 'spring-core', version: '5.3.19'
    	implementation group: 'org.springframework', name: 'spring-context', version: '5.3.19'
    	implementation group: 'org.springframework', name: 'spring-test', version: '5.3.19'
    
    	//Lombok
    	compileOnly 'org.projectlombok:lombok'
    	annotationProcessor 'org.projectlombok:lombok'
    	testCompileOnly 'org.projectlombok:lombok'
    	testAnnotationProcessor 'org.projectlombok:lombok'
    	
    	//Lombok을 이용해서 @Log4j2를 이용하려면 Log4j2 관련 라이브러리를 추가
    	implementation group: 'org.apache.logging.log4j', name: 'log4j-core', version: '2.17.2'
    	implementation group: 'org.apache.logging.log4j', name: 'log4j-api', version: '2.17.2'
    	implementation group: 'org.apache.logging.log4j', name: 'log4j-slf4j-impl', version: '2.17.2'
    
    	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
    	implementation 'org.springframework.boot:spring-boot-starter-security'
    	implementation 'org.springframework.boot:spring-boot-starter-thymeleaf'
    	implementation 'org.springframework.boot:spring-boot-starter-web'
    	implementation 'org.thymeleaf.extras:thymeleaf-extras-springsecurity5'
    
    	developmentOnly 'org.springframework.boot:spring-boot-devtools'
    	runtimeOnly 'org.mariadb.jdbc:mariadb-java-client'
    	testImplementation 'org.springframework.boot:spring-boot-starter-test'
    	testImplementation 'org.springframework.security:spring-security-test'
    
    	//JSTL 라이브러리 이건 나중에 제거하던지
    	implementation group: 'jstl', name:'jstl', version: '1.2'
    }
    
    tasks.named('test') {
    	useJUnitPlatform()
    }
    
    //error: log4j-slf4j-impl cannot be present with log4j-to-slf4j, 기존 starter 로깅을 제외하고 log4j로 대체한다고 gradle한테 알린다.
    configurations {
    	all {
    		exclude group: 'org.springframework.boot', module: 'spring-boot-starter-logging'
    	}
    }
    ```
    
- log4j2.xml
    
    ```
    <?xml version="1.0" encoding="UTF-8"?>
    
    <configuration status="INFO">
    
        <Appenders>
            <!--콘솔-->
            <Console name="console" target="SYSTEM_OUT">
                <PatternLayout charset="UTF-8" pattern="%d{hh:mm:ss} %5p [%c] %m%n"></PatternLayout>
            </Console>
        </Appenders>
    
        <loggers>
            <logger name="org.springframework" level="INFO" additivity="false">
                <appender-ref ref="console" />
            </logger>
    
            <logger name="org.zerock" level="INFO" additivity="false">
                <appender-ref ref="console" />
            </logger>
    
            <root level="INFO" additivity="false">
                <AppenderRef ref="console" />
            </root>
        </loggers>
    
    </configuration>
    ```
    
-