--CONSULTA 1: Horas comprometidas por professor

select p.name as professor,
       count(cs.id) as total_aulas,
       sum(timestampdiff(hour, cs.start_time, cs.end_time)) as total_horas
from professor p
    join subject s on p.id = s.id
    join class c on s.id = c.subject_id
    join class_schedule cs on c.id = cs.class_id
group by p.id, p.name
order by total_horas desc;

-- CONSULTA 2: Horários das salas (ocupados)

select r.name AS sala,
       cs.day_of_week AS dia_semana,
       cs.start_time AS inicio,
       cs.end_time AS fim,
       s.name AS materia,
       p.name AS professor
from room r
    join class_schedule cs on r.id = cs.room_id
    join class c on cs.class_id = c.id
    join subject s on c.subject_id = s.id
    join professor p on s.id = p.id
order by r.name, cs.day_of_week, cs.start_time;
