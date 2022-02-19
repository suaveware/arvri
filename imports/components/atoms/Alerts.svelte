<script>
  import { fly } from "svelte/transition";

  export let state;
</script>

<div
  class="flex flex-col fixed top-4 w-2/5 transform -translate-x-1/2 left-1/2 z-50"
>
  {#each $state.alerts as { message, state, dismissable, closeAlert }}
    <div
      class="alert mt-2 w-full text-white"
      class:alert-info={state === "info"}
      class:bg-info={state === "info"}
      class:alert-success={state === "success"}
      class:bg-success={state === "success"}
      class:alert-warning={state === "warning"}
      class:bg-warning={state === "warning"}
      class:alert-error={state === "error"}
      class:bg-error={state === "error"}
      transition:fly={{
        duration: 200,
        y: -40,
        opacity: 0,
      }}
    >
      <div class="flex-1 inline-flex items-center gap-1 w-full">
        <span>
          {#if state === "error"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          {:else if state === "warning"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          {:else if state === "success"}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
          {:else}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          {/if}
        </span>
        <span>{message}</span>
        {#if dismissable}
          <button class="btn btn-sm btn-ghost ml-auto" on:click={closeAlert}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        {/if}
      </div>
    </div>
  {/each}
</div>
