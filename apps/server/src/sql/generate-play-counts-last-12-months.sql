WITH months AS (
    SELECT generate_series(
        date_trunc('month', CURRENT_DATE) - INTERVAL '11 months',
        date_trunc('month', CURRENT_DATE),
        INTERVAL '1 month'
    )::date AS play_month
),
authors AS (
    SELECT DISTINCT author_id
    FROM post.track_view
)
SELECT
    a.author_id,
    m.play_month,
    COUNT(pd.id) AS play_count
FROM authors a
CROSS JOIN months m
LEFT JOIN post.track_view tv
    ON tv.author_id = a.author_id
LEFT JOIN post.play_data pd
    ON pd.track_id = tv.id
    AND pd.play_counted_at >= m.play_month
    AND pd.play_counted_at < m.play_month + INTERVAL '1 month'
GROUP BY
    a.author_id,
    m.play_month
ORDER BY
    a.author_id,
    m.play_month
