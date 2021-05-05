// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
// 🐨 you'll want the following additional things from '../pokemon':
// fetchPokemon: the function we call to get the pokemon info
// PokemonInfoFallback: the thing we show while we're loading the pokemon info
// PokemonDataView: the stuff we use to display the pokemon info
import { PokemonForm, fetchPokemon, PokemonInfoFallback, PokemonDataView } from '../pokemon'
import {ErrorBoundary} from 'react-error-boundary'

/*
class ErrorBoundary extends React.Component
{
   constructor(props) {
      super(props);
      this.state = { hasError: false };
   }

   static getDerivedStateFromError(error) {
      return { hasError: true }
   }

   render() {
      if (this.state.hasError) {
         return <h1>Something went wrong.</h1>;
      }

      return this.props.children;
   }
}
*/

function ErrorComponent({error, resetErrorBoundary}) {
   return (
      <div role="alert">
         <p>Something went wrong:</p>
         <pre>{error.message}</pre>
         <button onClick={resetErrorBoundary}>Try again</button>
      </div>
   );
}

function PokemonInfo({pokemonName}) {
   const [state, setState] = React.useState({pokemon: null, error: '', status: 'idle'});
  // 🐨 Have state for the pokemon (null)
  // 🐨 use React.useEffect where the callback should be called whenever the
  // pokemon name changes.
  // 💰 DON'T FORGET THE DEPENDENCIES ARRAY!
  // 💰 if the pokemonName is falsy (an empty string) then don't bother making the request (exit early).
  // 🐨 before calling `fetchPokemon`, clear the current pokemon state by setting it to null
  // 💰 Use the `fetchPokemon` function to fetch a pokemon by its name:
  //   fetchPokemon('Pikachu').then(
  //     pokemonData => { /* update all the state here */},
  //   )
  // 🐨 return the following things based on the `pokemon` state and `pokemonName` prop:
  //   1. no pokemonName: 'Submit a pokemon'
  //   2. pokemonName but no pokemon: <PokemonInfoFallback name={pokemonName} />
  //   3. pokemon: <PokemonDataView pokemon={pokemon} />

  React.useEffect(() => {
   if (pokemonName !== '') {
      setState({pokemon: null, error: '', status: 'pending'});
      fetchPokemon(pokemonName).then(
         pokemonData => {
            setState({pokemon: pokemonData, error: '', status: 'resolved'});
         },
         errorObject => {
            setState({pokemon: null, error: errorObject.message, status: 'rejected'});
         }
      );
   }
  }, [pokemonName]);

   if (state.status === 'rejected') {
      /*
      return (
         <div role="alert">
            There was an error: <pre style={{whiteSpace: 'normal'}}>{state.error}</pre>
         </div>);
         */
        throw state.error;
   } else if (state.status === 'resolved') {
      return <PokemonDataView pokemon={state.pokemon} />
   } else if (state.status === 'pending') {
      return <PokemonInfoFallback name={pokemonName} />
   } else {
      return <div>Submit a pokemon</div>
   }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
         <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
         <hr />
         <div className="pokemon-info">
       <ErrorBoundary FallbackComponent={ErrorComponent} onReset={()=>{setPokemonName('')}} resetKeys={[pokemonName]}>
         <PokemonInfo pokemonName={pokemonName} />
       </ErrorBoundary>
         </div>
    </div>
  )
}

export default App
