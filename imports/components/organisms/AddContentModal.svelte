<script>
  import { makeContent } from "../../content/contentApi";
  import Modal from "../atoms/Modal.svelte";
  import ChevronRight from "../icons/ChevronRight.svelte";
  import BookOpen from "../icons/BookOpen.svelte";

  export let state;
  export let parentSubject;
  export let content = makeContent({ subjectId: parentSubject._id });
  export let closeModal = () => {
    content = makeContent({ subjectId: parentSubject._id });
    doCloseModal();
  };
  export let openModal = () => {};
  let doCloseModal = () => {};

  let errors = {};

  $: {
    content;
    errors = {};
  }

  const handleSaveOnClick = async () => {
    if (!content.url.startsWith("http")) {
      content.url = `https://${content.url}`;
    }

    errors = await state
      .saveContent(makeContent(content))
      .then(() => {
        closeModal();

        state.addAlert({
          message: "Content saved succesfully",
          state: "success",
        });

        return {};
      })
      .catch(({ details }) => details?.errors);
  };
</script>

<Modal bind:openModal bind:closeModal={doCloseModal}>
  <div
    class="modal-box max-w-full flex flex-col space-y-6 h-3/4 w-1/2"
    on:click|stopPropagation
  >
    <div class="flex flex-grow flex-col space-y-4">
      <div class="flex space-x-3 font-title font-semibold">
        <span class="opacity-75 flex space-x-3">
          <BookOpen />
          <span>{parentSubject.title}</span>
        </span>
        <ChevronRight />
        <span>New content</span>
      </div>
      <div class="form-control">
        <label for="content-title" class="label">
          <span class="label-text font-light uppercase">Title</span>
        </label>
        <input
          class="input input-bordered"
          class:input-error={!!errors.title}
          bind:value={content.title}
          id="content-title"
          type="text"
          placeholder="Ex: “Arthropods class”"
        />
        {#if errors.title}
          <div class="label">
            <span class="label-text-alt">{errors.title}</span>
          </div>
        {/if}
      </div>
      <div class="form-control flex flex-col flex-grow">
        <label for="content-description" class="label">
          <span class="label-text font-light uppercase">Description</span>
        </label>
        <textarea
          class="textarea flex-grow textarea-bordered resize-none"
          bind:value={content.description}
          id="content-description"
          type="text"
          placeholder="Ex: “The content covers topics A, B and C”"
        />
      </div>
      <div class="form-control">
        <label for="content-title" class="label">
          <span class="label-text font-light uppercase">Url</span>
        </label>
        <input
          class="input input-bordered"
          class:input-error={!!errors.url}
          bind:value={content.url}
          id="content-title"
          type="text"
          placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
        />
        {#if errors.url}
          <div class="label">
            <span class="label-text-alt">{errors.url}</span>
          </div>
        {/if}
      </div>
    </div>
    <div class="modal-action mt-auto">
      <button class="btn btn-outline normal-case" on:click={closeModal}>
        Cancel
      </button>
      <button class="btn btn-primary normal-case" on:click={handleSaveOnClick}>
        Save
      </button>
    </div>
  </div>
</Modal>
