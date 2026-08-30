-- Atomically enforces a per-user active-hold limit and acquires the
-- per-night hold keys for a room, so both checks happen as one Redis
-- operation and can't race with concurrent hold requests.
--
-- KEYS[1]    = user holds sorted-set key ("user_holds:{userId}"); member =
--              holdToken, score = expiry (epoch seconds)
-- KEYS[2..N] = per-night hold keys ("hold:{hotelId}:{roomId}:{date}")
--
-- ARGV[1] = now (epoch seconds)
-- ARGV[2] = expiry = now + ttlSeconds
-- ARGV[3] = max active holds allowed per user
-- ARGV[4] = value to store in each per-night key ("{userId}:{holdToken}")
-- ARGV[5] = holdToken (member added to the user holds set)
-- ARGV[6] = ttlSeconds
--
-- Returns: 1 on success, -1 if any night is already held, -2 if the user
-- already has the maximum number of active holds.

redis.call('ZREMRANGEBYSCORE', KEYS[1], '-inf', ARGV[1])

if redis.call('ZCARD', KEYS[1]) >= tonumber(ARGV[3]) then
    return -2
end

for i = 2, #KEYS do
    if redis.call('EXISTS', KEYS[i]) == 1 then
        return -1
    end
end

for i = 2, #KEYS do
    redis.call('SET', KEYS[i], ARGV[4], 'EX', ARGV[6])
end

redis.call('ZADD', KEYS[1], ARGV[2], ARGV[5])
redis.call('EXPIRE', KEYS[1], tonumber(ARGV[6]) * 2)

return 1
