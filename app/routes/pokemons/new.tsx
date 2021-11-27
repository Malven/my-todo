import { useEffect, useRef } from "react";
import { ActionFunction, Form, json, Outlet, redirect, useActionData } from "remix";
import { db } from '~/utils/db.server';

export function meta() {
  return { title: "Add pokemon" };
}

// When your form sends a POST, the action is called on the server.
// - https://remix.run/api/conventions#action
// - https://remix.run/guides/data-updates
export let action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let pokemonId = formData.get("pokemonId");

  // Typical action workflows start with validating the form data that just came
  // over the network. Clientside validation is fine, but you definitely need it
  // server side.  If there's a problem, return the the data and the component
  // can render it.
  if (typeof pokemonId === "string" && (parseInt(pokemonId) < 0 || parseInt(pokemonId) > 897)) {
    return json({error: "Must be a number between 0 and 898!"}, { status: 400 });
  }

  const result = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
  if(!result){
    return json({error: "Pokemon not found!"}, { status: 400 });
  }

  const pokemon = await result.json();
  await db.pokemon.create({
    data: {
      done: false,
      name: pokemon.name,
      spriteUrl: pokemon.sprites.front_default,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      apiId: pokemon.id
    }
  });


  // Finally, if the data is valid, you'll typically write to a database or send or
  // email or log the user in, etc. It's recommended to redirect after a
  // successful action, even if it's to the same place so that non-JavaScript workflows
  // from the browser doesn't repost the data if the user clicks back.
  return redirect("/pokemons");
};

export default function NewPokemon() {
  // https://remix.run/api/remix#useactiondata
  let actionMessage = useActionData<any>();
  let pokemonId = useRef<HTMLInputElement>(null);

  // This form works without JavaScript, but when we have JavaScript we can make
  // the experience better by selecting the input on wrong answers! Go ahead, disable
  // JavaScript in your browser and see what happens.
  useEffect(() => {
    if (actionMessage && pokemonId.current) {
      pokemonId.current.select();
    }
  }, [actionMessage]);

  return (
    <div className="remix__page">
      <main>
        <h2>Add a pokemon!</h2>
        <Form method="post" className="remix__form">
          <label>
            <div>Pokemon id (0-898):</div>
            <input ref={pokemonId} name="pokemonId" type="number" />
          </label>
          <div>
            <button>Add!</button>
          </div>
          {actionMessage?.error ? (
            <p>
              <b>{actionMessage.error}</b>
            </p>
          ) : null}
        </Form>
      </main>

      <aside>
        <Outlet />
      </aside>
    </div>
  );
}
