<script>
  import { makeSubject } from "../../subject/subjectApi";

  export let subject = makeSubject();
  export let onSubmit = () => {};

  let isAddingSubject = false;

  const toggleForm = () => {
    isAddingSubject = !isAddingSubject;
  };
</script>

{#if isAddingSubject}
  <div
    class="fixed top-1/4 left-1/4 bg-base-200 p-8 card right-1/4 flex flex-col space-y-4"
  >
    <input
      class="input"
      type="text"
      placeholder="Title"
      bind:value={subject.title}
    />
    <textarea
      class="textarea"
      placeholder="Description"
      bind:value={subject.description}
    />
    <input
      class="input"
      type="text"
      placeholder="Dependencies"
      bind:value={subject.dependencies}
    />
    <div class="self-end inline-flex gap-4">
      <button class="btn btn-ghost" on:click={toggleForm}> Cancel </button>
      <button class="btn btn-primary self-end" on:click={onSubmit}>Save</button>
    </div>
  </div>
{:else}
  <button class="btn btn-ghost float-right" on:click={toggleForm}>
    Add child subject
  </button>
{/if}
