# p.348 (JPQL)

---

```jsx
public interface BoardRepository extends JpaRepository<Board, Long> {
    @Query(value = "select b from Board b where b.title like concat('%', :keyword, '%')")
    Page<Board> findKeyword(@Param("keyword") String keyword, Pageable pageable);
}
```

```jsx
@DisplayName("JPQL")
@Test
public void testJPQL() {
    PageRequest pageable = PageRequest.of(0, 10, Sort.by("bno").descending());

    Page<Board> result = boardRepository.findKeyword("title...100", pageable);

    List<Board> todoList = result.getContent();

    todoList.forEach(board -> log.info(board));
}

...

select
    board0_.bno as bno1_0_,
    board0_.moddate as moddate2_0_,
    board0_.regdate as regdate3_0_,
    board0_.content as content4_0_,
    board0_.title as title5_0_,
    board0_.writer as writer6_0_ 
from
    board board0_ 
where
    board0_.title like concat('%', ?, '%') 
order by
    board0_.bno desc limit ?

...

Board(bno=100, title=title...100, content=content...100, writer=user0)
```

> JPQL 은 정적으로 고정되기 때문에, JPQL 은 코드를 통해서 생성해야 하는데 이 문제를 해결하기 위해 다양한 방법들이 존재하지만 국내에서 가장 많이 사용되는 방식은 Querydsl 입니다.
>