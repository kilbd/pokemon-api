select b.name as pokemon, group_concat(a.name) as evolves_into
from evolutions
left join pokemon a on a.id = evolutions.pokemon_id
left join pokemon b on b.id = evolves_from
group by pokemon;
