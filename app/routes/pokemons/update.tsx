import { useEffect, useState } from "react";
import { ActionFunction, Form, json, redirect, useActionData, useTransition } from "remix";
import { db } from '~/utils/db.server';

export type PokemonProps = {
    id: string;
    spriteUrl: string;
    name: string;
}

export let action: ActionFunction = async ({request}) => {
    const formData = await request.formData();
    const newName = formData.get("name");
    const id = formData.get("id");
    if(newName === "" || newName === null || typeof id !== 'string' || typeof newName !== 'string'){
        return json({error: "Name cannot be empty!"}, {status: 400});
    }

    await db.pokemon.update({
        where: { id },
        data: {
            name: newName,
        }
    })

    return redirect("/pokemons");
}

export default function PokemonData({id, spriteUrl, name}: PokemonProps) {
    const [edit, setEdit] = useState(false);
    const actionData = useActionData<any>();
    const transition = useTransition();

    useEffect(() => {
        if(transition.type === "actionRedirect"){
            setEdit(false);
        }
    }, [transition.type])

    return (<li key={id}>
        <img src={spriteUrl} /> 
        <p>{name} </p>
        {edit ? 
            (<Form action="update" method="post">
                <input name="id" type="string" hidden defaultValue={id} />
                <input name="name" type="string" defaultValue={name} />
                {actionData?.error ? <p>{actionData.error}</p> : null}
                <button type="submit">Update</button>
            </Form>) : null
        }
        {!edit ? <button onClick={() => setEdit(true)}>Edit</button> : null }
    </li>);
  }