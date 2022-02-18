<script>
  import { router } from "tinro";
  import { ROUTES } from "../../routes";
  import Modal from "../atoms/Modal.svelte";

  export let closeModal = () => {};
  export let openModal = () => {};

  const handleSignUpClick = () => {
    closeModal();
    router.goto(ROUTES.SIGN_UP);
  };
</script>

<Modal bind:openModal bind:closeModal>
  <div class="modal-box flex flex-col space-y-6" on:click|stopPropagation>
    An account is required to add content.
    <div class="modal-action">
      <button class="btn btn-outline normal-case" on:click={closeModal}
        >Cancel</button
      >
      <button class="btn btn-primary normal-case" on:click={handleSignUpClick}
        >Sign Up</button
      >
    </div>
  </div>
</Modal>
