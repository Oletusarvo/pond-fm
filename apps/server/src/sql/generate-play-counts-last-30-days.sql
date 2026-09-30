WITH days AS (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL'29 days',
        CURRENT_DATE,
        INTERVAL '1 day'
    )::date AS play_date
),
authors AS (
    SELECT DISTINCT author_id
    FROM post.track_view
)
SELECT
    a.author_id,
    d.play_date,
    COUNT(pd.id) AS play_count
FROM authors a
CROSS JOIN days d
LEFT JOIN post.track_view tv
    ON tv.author_id = a.author_id
LEFT JOIN post.play_data pd
    ON pd.track_id = tv.audius_track_id
    AND pd.play_counted_at >= d.play_date
    AND pd.play_counted_at < d.play_date + INTERVAL '1 day'
GROUP BY
    a.author_id,
    d.play_date
ORDER BY
    a.author_id,
    d.play_date
