<script>
  import { fly } from "svelte/transition";

  let isOpen = false;

  export const closeModal = () => {
    isOpen = false;
  };
  export const openModal = () => {
    isOpen = true;
  };
</script>

{#if isOpen}
  <div class="fixed inset-0 bg-black bg-opacity-50 z-50" on:click={closeModal}>
    <span
      class="w-full h-full grid place-items-center"
      transition:fly={{
        duration: 200,
        y: 40,
        opacity: 0,
      }}
    >
      <slot {closeModal} {openModal} />
    </span>
  </div>
{/if}
