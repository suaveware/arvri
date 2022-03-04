<script>
  import { makeSubject } from "../../entities/subject/subjectApi";
  import Modal from "../atoms/Modal.svelte";
  import ChevronRight from "../icons/ChevronRight.svelte";
  import BookOpen from "../icons/BookOpen.svelte";

  export let state;
  export let parentSubject;
  export let parentCurriculum;
  export let subject = makeSubject();
  export const closeModal = () => {
    subject = makeSubject();
    doCloseModal();
  };
  export const openModal = (editSubject) => {
    if (editSubject) {
      subject = editSubject;
    }
    doOpenModal();
  };

  let doCloseModal = () => {};
  let doOpenModal = () => {};
  let errors = {};

  $: {
    subject;
    errors = {};
  }

  const handleSaveOnClick = async () => {
    errors = await state
      .saveSubject(makeSubject(subject))
      .then((newSubjectId) => {
        subject = makeSubject();
        closeModal();

        if (parentSubject) {
          state.addSubjectChild(parentSubject._id, newSubjectId);
        }
        if (parentCurriculum) {
          state.addSubjectToCurriculum(parentCurriculum._id, newSubjectId);
        }

        state.addAlert({
          message: "Subject saved succesfully",
          state: "success",
        });

        return {};
      })
      .catch(({ details }) => details?.errors);
  };
</script>

<Modal bind:openModal={doOpenModal} bind:closeModal={doCloseModal}>
  <div
    class="modal-box max-w-full flex flex-col space-y-6 h-3/4 w-1/2"
    on:click|stopPropagation
  >
    <div class="flex flex-col flex-grow space-y-4 font-title w-full">
      <div class="flex space-x-3">
        <span class="opacity-75 flex space-x-3">
          <BookOpen /><span
            >{parentSubject?.title || parentCurriculum?.title}</span
          >
        </span>
        <ChevronRight />
        <span>New subject</span>
      </div>
      <div class="form-control">
        <label for="subject-title" class="label">
          <span class="label-text font-light uppercase">Title</span>
        </label>
        <input
          class="input input-bordered"
          class:input-error={!!errors.title}
          bind:value={subject.title}
          id="subject-title"
          type="text"
          placeholder="Ex: “Quick Sort”"
        />
        {#if errors.title}
          <div class="label">
            <span class="label-text-alt">{errors.title}</span>
          </div>
        {/if}
      </div>
      {#if $state.user?.isAdmin}
        <div class="form-control">
          <label for="subject-group" class="label">
            <span class="label-text font-light uppercase">Group</span>
          </label>
          <input
            class="input input-bordered"
            bind:value={subject.group}
            id="subject-group"
            type="text"
            placeholder="Ex: “5th semester”"
          />
        </div>
      {/if}
      <div class="form-control flex flex-col flex-grow">
        <label for="subject-description" class="label">
          <span class="label-text font-light uppercase">Description</span>
        </label>
        <textarea
          class="h-52 textarea textarea-bordered flex-grow resize-none"
          bind:value={subject.description}
          id="subject-description"
          type="text"
          placeholder="Ex: “The content covers topics A, B and C”"
        />
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
