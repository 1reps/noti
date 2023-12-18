# QueryDSL

---

### 시작

```java
public void queryDSL() {
	EntityManager em = emf.createEntityManager();

	JPAQuery query = new JPAQuery(em);
	QMember qMember = new QMember("m") //생성되는 JPQL의 별칭이 m
	List<Member> members = 
	  query.from(qMember)
				.where(qMember.name.eq("회원1"))
				.orderBy(qMember.name.desc())
				.list(qMember);
}
```

QueryDSL을 사용하려면 우선 JPAQuery 객체를 생성해야 하는데 이때 엔티티 매니저를 생성자에 넘겨준다.

당므으로 사용할 쿼리 타입(Q)를 생성하는데 생성자에는 별칭을 주면 된다.

```sql
select m 
  from Member m
 where m.name = ?1
 order by m.name desc
```

---

### 기본 Q 생성

쿼리 타입(Q)은 사용하기 편리하도록 기본 인스턴스를 보관하고 있다. 
하지만 같은 엔티티를 조인하거나 같은 엔티티를 서브워리에 사용하면 같은 별칭이 사용되므로 이때는 별칭을 직접 지정해서 사용해야 한다.

```java
public class QMember extends EntityPathBase<Member> {
	public static final QMember member = new QMember("member1");
	...
}
```

쿼리 타입은 다음과 같이 사용된다.

```java
QMbmer qMember = new QMember("m") //직접 지정
QMbmer qMember = QMember.member;  //기본 인스턴스 사용
```

쿼리 타입의 기본 인스턴스를 사용하면 다음과 같이 코드를 더 간결하게 작성할 수 있다.

```java
import static jpabook.jpashop.domain.Qmember.member; //기본 인스턴스

public void basic() {
	EntityManager em = emf.createEntityManager();
	
	JPAQuery query = new JPAQuery(em);
	List<Member> members = 
			query.from(member)
					.where(member.name.eq("회원1"))
					.orderBy(member.name.desc())
					.list(member);
}
```

---

### 검색 조건 쿼리

```java
JPAQuery query = new JPAQuery(em);
QItem item = QItem.item;  //기본 인스턴스를 사용하겠다.
List<Item> list = query.from(item)
										.where(item.name.eq("좋은상품").and(item.price.gt(20000))
										.list(item);   //조회할 프로젝션 지정
```

```sql
select item
  from Item item
 where item.name = ?1 
   and item.price > ?2
```

```sql
item.price.between(10000, 20000) //10000원 ~ 20000원
item.name.contains("상품1")      //상품1이라는 이름을 포함한 상품  (like '%상품%')
item.name.startsWith("고급");    //이름이 고급으로 시작하는 상품   (lise '고급%') 
```

---

### 결과 조회

쿼리 작성이 끝나고 메소드를 호출하면 실제 데이터베이스를 조회한다.

보통 `uniqueResult()` 나 `list()` 를 사용하고 파라미터로 프로젝션 대상을 넘겨준다.

결과 조회 API는 com.mysema.query.Projectable에 정의되어 있다.

1. `uniqueResult()` : 조회 결과가 한 건일 때 사용한다. 조회 결과가 없으면 null을 반환하고 결과가 하나 이상이면 `com.mysema.query.NonUniqueResultException` 예외가 발생한다.
2. `singleResult()` : `uniqueResult()`와 같지만 결과가 하나 이상이면 처음 데이터~~~~~~~~~~~~~~~~~~~~~~~~~~~~를 반환한다.~~~~~~~~~~~~~~~~~~~~~~~~~~~~
3. `list()` : 결과가 하나 이상일 때 사용한다. 결과가 없으면 빈 컬렉션을 반환한다.

---

### 페이징과 정렬

```java
Qitem item = Qitem.item;

query.from(item)
		.where(item.price.gt(20000))
		.orderBy(item.price.desc(), item.stockQuantity.asc())
		.offset(10).limit(20)
		.list(item);
```

```java
QueryModifiers queryModifiers = new QueryModifiers(20L, 10L); //limit, offset
List<Item> list = query.from(item)
                      .restrict(queryModifiers)
											.list(item);
```

실제 페이징 처리를 하려면 검색된 전체 데이터 수를 알아야 한다. 이때는 listResult()를 사용한다.

```java
SearchResults<Item> result = 
		query.from(item)
				.where(item.price.gt(10000))
				.offset(10).limit(20)
				.listResults(item);

long total = result.getTotal(); //검색된 전체 데이터 수
long limit = result.getLimit();
long offset = result.getOffset();
List<Item> results = result.getResults(); //조회된 데이터
```