<script>
  import { Route, router } from "tinro";
  import { ROUTES } from "./routes";
  import { makePlatter } from "./silverPlatters/makePlatter";
  import Arvri from "./components/icons/Arvri.svelte";
  import User from "./components/icons/User.svelte";
  import Alerts from "./components/atoms/Alerts.svelte";
  import Login from "./components/pages/Login.svelte";
  import Curriculum from "./components/pages/Curriculum.svelte";
  import SubjectsTree from "./components/pages/SubjectsTree.svelte";
  import Home from "./components/pages/Home.svelte";
  import SignUp from "./components/pages/SignUp.svelte";

  const state = makePlatter()();
  const themeList = [
    { value: "light", label: "Light" },
    { value: "dark", label: "Dark" },
    { value: "cupcake", label: "Cupcake" },
    { value: "bumblebee", label: "Bumblebee" },
    { value: "emerald", label: "Emerald" },
    { value: "corporate", label: "Corporate" },
    { value: "synthwave", label: "Synthwave" },
    { value: "retro", label: "Retro" },
    { value: "cyberpunk", label: "Cyberpunk" },
    { value: "valentine", label: "Valentine" },
    { value: "halloween", label: "Halloween" },
    { value: "garden", label: "Garden" },
    { value: "forest", label: "Forest" },
    { value: "aqua", label: "Aqua" },
    { value: "lofi", label: "Lofi" },
    { value: "pastel", label: "Pastel" },
    { value: "fantasy", label: "Fantasy" },
    { value: "wireframe", label: "Wireframe" },
    { value: "black", label: "Black" },
    { value: "luxury", label: "Luxury" },
    { value: "dracula", label: "Dracula" },
  ];
  let theme = localStorage.getItem("theme") || "corporate";
  $: localStorage.setItem("theme", theme);

  const handleLogOnClick = () => {
    if ($state.userId) {
      state.logout();
      return;
    }

    router.goto(ROUTES.LOGIN);
  };

  const handleSignUpClick = () => {
    router.goto(ROUTES.SIGN_UP);
  };
</script>

<svelte:head>
  <title>Arvri</title>
</svelte:head>

<!-- GRID CONTAINER -->
<div
  class="w-full h-full flex flex-col bg-base-200 text-base-content oveflow-y-scroll overflow-x-hidden"
  data-theme={theme}
>
  <Alerts {state} />

  <div
    class="grid gap-6 grid-cols-12 pb-24 grid-rows-none max-w-screen-xl mx-auto w-full"
  >
    <div
      class="row-start-1 col-start-2 col-end-12 inline-flex w-full gap-4 items-center py-6"
    >
      <a
        class="font-bold text-primary text-2xl flex space-x-1 items-center"
        href="/"
      >
        <Arvri />
        <span class="font-title">Arvri</span>
      </a>
      <span class="ml-auto flex space-x-6 items-center">
        <select class="select select-sm w-36" bind:value={theme}>
          {#each themeList as { value, label }}
            <option {value} selected={value === theme}>{label}</option>
          {/each}
        </select>
        {#if $state.userId}
          <span class="flex items-center space-x-1">
            <button
              class="btn btn-ghost normal-case"
              on:click={handleLogOnClick}
            >
              Logout
            </button>
            <button class="btn btn-ghost btn-circle">
              <User />
            </button>
          </span>
        {:else}
          <buton class="btn btn-ghost normal-case" on:click={handleSignUpClick}>
            Sign Up
          </buton>
          <buton
            class="btn btn-primary normal-case text-base-200"
            on:click={handleLogOnClick}
          >
            Login
          </buton>
        {/if}
      </span>
    </div>

    <Route breadcrumb="Home" firstmatch>
      <Route path={ROUTES.HOME}><Home /></Route>
      <Route path={ROUTES.SIGN_UP}>
        <SignUp />
      </Route>
      <Route path={ROUTES.LOGIN}>
        <Login />
      </Route>
      <Route firstmatch path={`${ROUTES.CURRICULUM}`}>
        <Route path={ROUTES.SUBJECT}>
          <SubjectsTree />
        </Route>
        <Route path="/">
          <Curriculum />
        </Route>
      </Route>
    </Route>
  </div>
  <footer
    class="mt-auto col-start-2 text-bold col-end-12 row-start-auto py-6 flex flex-col items-center justify-center bg-base-100 text-base-content"
  >
    <p class="font-bold opacity-70 mb-4 font-title">Designed & developed by</p>
    <div class="flex space-x-4 opacity-70">
      <p>Luiz de Oliveira</p>
      <p class="text-accent">luizcarlos1405@gmail.com</p>
    </div>
    <div class="flex space-x-4 opacity-70">
      <p>Giulia Valente</p>
      <p class="text-accent">gvalentef@gmail.com</p>
    </div>
  </footer>
</div>
