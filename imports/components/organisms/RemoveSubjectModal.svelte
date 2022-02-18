<script>
  import { state } from "../../state";
  import { makeSubject } from "../../subject/subjectApi";
  import Modal from "../atoms/Modal.svelte";

  export let openModal = () => {};

  export let subject = makeSubject();

  const handleDeleteOnClick = async () => {
    await state
      .removeSubject(subject._id)
      .then(() =>
        state.addAlert({
          message: "Subject removed succesfully",
          state: "success",
        })
      )
      .catch(() =>
        state.addAlert({
          message: "Unable to remove subject, contact our administrators",
          state: "success",
        })
      );
    window.history.back();
  };
</script>

<Modal bind:openModal let:closeModal>
  <div class="modal-box flex flex-col space-y-6" on:click|stopPropagation>
    Are you sure you want to delete {subject.title}?
    <div class="modal-action">
      <button class="btn btn-outline normal-case" on:click={closeModal}>
        Cancel
      </button>
      <button class="btn btn-error normal-case" on:click={handleDeleteOnClick}>
        Delete
      </button>
    </div>
  </div>
</Modal>
