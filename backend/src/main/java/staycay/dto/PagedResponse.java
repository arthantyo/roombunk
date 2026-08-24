package staycay.dto;

import java.util.List;
import java.util.function.Function;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;

// Plain POJO stand-in for Page<T>, since PageImpl has no default constructor and can't be
// deserialized by Jackson when cached in Redis.
public record PagedResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages) {

    public static <T> PagedResponse<T> from(Page<T> page) {
        return new PagedResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages());
    }

    public <R> PagedResponse<R> map(Function<T, R> mapper) {
        return new PagedResponse<>(
                content.stream().map(mapper).collect(Collectors.toList()),
                page,
                size,
                totalElements,
                totalPages);
    }
}
