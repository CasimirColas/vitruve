-- @param {String} $1:metricType
-- @param {Int} $2:limit
SELECT 
      a.id,
      a.name,
      AVG(m.value) as average_value
    FROM 
      "Athlete" a
    JOIN 
      "Metric" m ON a.id = m."athleteId"
    WHERE 
      m."metricType"::text = $1
    GROUP BY 
      a.id, a.name
    ORDER BY 
      average_value DESC
    LIMIT $2