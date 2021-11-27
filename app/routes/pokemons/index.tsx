import type { Pokemon } from '@prisma/client'
import type { LoaderFunction } from 'remix'
import { Link, Outlet, useLoaderData } from 'remix'
import { db } from '~/utils/db.server'
import PokemonData from './update'


export let loader: LoaderFunction = async () => {
    return await db.pokemon.findMany({
        select: { id: true, name: true, spriteUrl: true},
        orderBy: { createdAt: "desc"}
    })
}

export default function pokemons() {
    let data = useLoaderData<Pokemon[]>();
    
    return (
        <div>
            <p>Pokemons</p>
            <ul style={{listStyle: 'none'}}>
                {data.map(pokemon => (
                    <PokemonData 
                        key={pokemon.id} 
                        id={pokemon.id} 
                        spriteUrl={pokemon.spriteUrl} 
                        name={pokemon.name} />
                    ))
                }
            </ul>
            <Link to="new">Create Pokemon</Link>
            <Outlet />
        </div>
    )

    
  }
