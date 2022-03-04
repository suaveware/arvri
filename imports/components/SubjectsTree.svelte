<script>
  import { Route } from "tinro";
  import { ROUTES } from "../../routes";
  import Subject from "./pages/Subject.svelte";


  // This is a router helper component that will draw itself recursivelly.

  // This variable helps us know if we are the final component of the recursion.
  let childSelf = null;
  $: isEndOfRecursion = !childSelf;
</script>

<Route path={ROUTES.SUBJECT}>
  <svelte:self bind:this={childSelf} />
</Route>

{#if isEndOfRecursion}
    <Subject />
{/if}
