<script>
  import { router } from "tinro";
  import { state } from "../../state";
  import { scale } from "svelte/transition";
  import keyBy from "lodash/keyBy";
  import groupBy from "lodash/groupBy";
  import Plus from "../icons/Plus.svelte";
  import AddSubjectModal from "../organisms/AddSubjectModal.svelte";

  const meta = router.meta();

  let openAddSubjectModal = () => {};

  $: curriculumSlug = $meta.params.curriculumSlug;
  $: curriculum = $state.curriculums.find(
    ({ slug }) => slug === curriculumSlug
  );
  $: subjectsById = keyBy($state.subjects, "_id");
  $: rootSubjects =
    curriculum?.rootSubjects.map((subjectId) => subjectsById[subjectId]) || [];
  $: groupOrder = Array.from(
    new Set([
      ...(curriculum?.groupOrder || []),
      ...(rootSubjects?.map(({ group }) => group) || []),
    ])
  );
  $: rootSubjectsByGroup = groupBy(rootSubjects, "group");
  $: selectedGroup =
    selectedGroup ||
    groupOrder?.find((groupName) => rootSubjectsByGroup[groupName]?.length);

  let handleTabPressed = (groupName) => {
    selectedGroup = groupName;
  };
</script>

<AddSubjectModal
  bind:openModal={openAddSubjectModal}
  parentCurriculum={curriculum}
/>

{#if curriculum}
  <h1
    class="font-bold font-title row-start-2 col-start-2 col-span-full text-4xl mb-4"
  >
    {curriculum.title}
  </h1>

  <div class="w-full h-full flex col-start-2 col-end-12 flex-col space-y-12">
    <p class="whitespace-pre-line">{curriculum.description}</p>

    <div class="flex justify-between items-center">
      <h1 class="text-2xl font-semibold font-title">Subjects</h1>
      {#if $state.user?.isAdmin}
        <button
          class="btn normal-case btn-primary btn-outline space-x-1"
          on:click={() => {
            openAddSubjectModal();
          }}
        >
          <Plus solid />
          <span>Add root subject</span>
        </button>
      {/if}
    </div>

    <!-- ROOT SUBJECTS -->
    <div class="tabs">
      {#each groupOrder as group}
        {#if rootSubjectsByGroup[group]?.length}
          <button
            class="tab tab-bordered space-x-2"
            on:click={() => handleTabPressed(group)}
            class:tab-active={group === selectedGroup}
          >
            <span>{group || "Ungrouped"}</span>
          </button>
        {/if}
      {/each}
    </div>
    <div class="grid gap-6 grid-cols-3">
      {#each rootSubjectsByGroup[selectedGroup] || [] as subject (subject._id)}
        <a
          class="card shadow bg-base-100"
          in:scale={{ start: 0.8, opacity: 0 }}
          href={`/${curriculumSlug}/${subject.slug}`}
        >
          <div class="card-body font-title">
            <div class="card-title">
              {subject.title}
            </div>
            <p>
              {subject.children.length} <span class="font-light">subjects</span>
            </p>
          </div>
        </a>
      {/each}
    </div>
  </div>
{/if}
