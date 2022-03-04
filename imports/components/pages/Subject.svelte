<script>
  import { flip } from "svelte/animate";
  import { router } from "tinro";
  import { orderableChildren } from "../custom-actions/orderableChildren";
  import { subjectPlatter } from "../../silverPlatters/subjectPlatter";
  import { moveArrayItem } from "../../helpers";
  import Link from "../icons/Link.svelte";
  import Heart from "../icons/Heart.svelte";
  import Trash from "../icons/Trash.svelte";
  import Plus from "../icons/Plus.svelte";
  import Pencil from "../icons/Pencil.svelte";
  import ChevronRight from "../icons/ChevronRight.svelte";
  import MenuAlt4 from "../icons/MenuAlt4.svelte";
  import Home from "../icons/Home.svelte";
  import Collection from "../icons/Collection.svelte";
  import AddSubjectModal from "../organisms/AddSubjectModal.svelte";
  import RemoveSubjectModal from "../organisms/RemoveSubjectModal.svelte";
  import AddContentModal from "../organisms/AddContentModal.svelte";
  import AccountRequiredModal from "../organisms/AccountRequiredModal.svelte";
  import { makePath } from "../../helpers";

  const meta = router.meta();
  const state = subjectPlatter();

  let isDragging = false;
  let openAddSubjectModal = () => {};
  let openAddContentModal = () => {};
  let openRemoveSubjectModal = () => {};
  let openAccountRequiredModal = () => {};

  $: ({
    user,
    userId,
    subject,
    childrenSubjects,
    subjectContents,
    curriculum,
    curriculumSlug,
    breadcrumbs,
  } = $state);
  $: console.log("childrenSubjects", childrenSubjects);

  const handleAddContentOnClick = () => {
    if (userId) {
      openAddContentModal();
      return;
    }

    openAccountRequiredModal();
  };

  const handleHeartOnClick = (conentId) => {
    if (!userId) {
      openAccountRequiredModal();
      return;
    }

    state.upvoteContent(conentId);
  };

  const handleOnDragStart = ({ itemNodeCopy }) => {
    itemNodeCopy.style["box-shadow"] = "0px 4px 6px -2px rgba(0,0,0,0.8)";
    itemNodeCopy.style.transform = `${itemNodeCopy.style.transform} scale(1.01, 1.01)`;
    /* itemNode.style.opacity = "0%"; */
  };

  const handleOnDragMove = ({ itemNodeCopy, fromIndex, toIndex }) => {
    isDragging = true;
    const newOrder = moveArrayItem(subject.children, fromIndex, toIndex);
    itemNodeCopy.style.transform = `${itemNodeCopy.style.transform} scale(1.01, 1.01)`;

    state.reorderChildren(subject._id, newOrder);
  };

  const handleOnDragEnd = async () => {
    setTimeout(() => {
      isDragging = false;
    }, 0);
    /* itemNode.style.opacity = "100%"; */
  };
</script>

<!-- MODALS -->
<AddSubjectModal
  {state}
  parentSubject={subject}
  bind:openModal={openAddSubjectModal}
/>
<RemoveSubjectModal {state} bind:openModal={openRemoveSubjectModal} {subject} />
<AddContentModal
  {state}
  bind:openModal={openAddContentModal}
  parentSubject={subject}
/>
<AccountRequiredModal bind:openModal={openAccountRequiredModal} />

<div class="col-start-2 col-end-12 space-y-4">
  <!-- BREADCRUMBS -->
  <div class="flex space-x-4 opacity-75">
    {#each breadcrumbs as { name, path }, index}
      <a href={path} class="flex space-x-2 font-semibold">
	{#if !index}
	  <Home/>
	{:else}
	  <Collection/>
	{/if}
        <span class="font-title">{name}</span>
	{#if index < breadcrumbs.length - 1}
          <ChevronRight />
	{/if}
      </a>
    {/each}
  </div>
  <!-- TITLE -->
  <div class="flex justify-between">
    <h1 class="relative font-bold text-5xl mb-8 font-title">
      {#if user?.isAdmin}
        <span class="flex space-x-1 absolute top-full left-0 transform">
          <button
            class="btn btn-sm btn-circle btn-ghost space-x-1 normal-case flex items-center"
            on:click={openRemoveSubjectModal}
          >
            <span class="transform scale-90 opacity-75"><Trash /></span>
          </button>
          <button
            on:click={() => openAddSubjectModal(subject)}
            class="btn btn-sm btn-circle btn-ghost space-x-1 normal-case flex items-center"
          >
            <span class="transform scale-90 opacity-75"><Pencil /></span>
          </button>
        </span>
      {/if}
      {subject.title}
    </h1>
  </div>
</div>

<!-- NAV -->
<div
  class="col-start-10 col-end-12 row-start-3 self-start card shadow font-semibold hadow-lg bg-base-100 flex-grow divide-y-2 divide-base-300 divide-opacity-25 divide-neutral divide-solid sticky top-12"
>
  <span class="font-semibold p-5 flex">
    <span>{subject.title}</span>
  </span>
  {#if user?.isAdmin}
    <div
      use:orderableChildren={{
        onStart: handleOnDragStart,
        onMove: handleOnDragMove,
        onEnd: handleOnDragEnd,
      }}
    >
      {#each childrenSubjects as child, index (child._id)}
        <div
          draggable="false"
          class="p-5 font-normal flex w-full select-none cursor-pointer"
          on:click={() =>
            !isDragging && router.goto(makePath([meta.match, child.slug]))}
          animate:flip={{ duration: 200 }}
        >
          <div class="mr-1">
            {index + 1}
          </div>
          <div class="opacity-75 text-sm flex justify-center items-center">
            {child.title}
          </div>
          <div class="opacity-75 ml-auto">
            <MenuAlt4 />
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <div>
      {#each childrenSubjects as child, index (child._id)}
        <a
          draggable="false"
          class="p-5 font-normal flex w-full select-none cursor-pointer"
          href={makePath([meta.match, child.slug])}
          animate:flip={{ duration: 400 }}
        >
          <span class="mr-1">{index + 1}</span>
          <span class="opacity-75">{child.title}</span>
          {#if user?.isAdmin}
            <span class="opacity-75 ml-auto"><MenuAlt4 /></span>
          {/if}
        </a>
      {/each}
    </div>
  {/if}
  {#if !childrenSubjects?.length}
    <span class="self-center justify-self-center opacity-50 p-2 font-light">
      No subjects
    </span>
  {/if}
  {#if user?.isAdmin}
    <span class="flex items-center justify-center font-normal">
      <button
        class="btn btn-link font-normal normal-case space-x-1"
        on:click={openAddSubjectModal}
      >
        <Plus solid />
        <span>Add subject</span>
      </button>
    </span>
  {/if}
</div>

<!-- SUBJECT -->
{#if subject.title}
  <div class="w-full h-full flex col-start-2 col-end-10 flex-col space-y-12">
    {#if subject?.description}
      <p class="whitespace-pre-line">
        {subject.description}
      </p>
    {/if}

    <div class="flex justify-between items-center w-full self-start">
      {#if subjectContents?.length}
        <h1 class="text-2xl font-semibold font-title">Content</h1>
      {/if}
      <button
        class="btn normal-case btn-primary btn-outline space-x-1"
        on:click={handleAddContentOnClick}
      >
        <Plus solid />
        <span>Add content</span>
      </button>
    </div>
    <!-- CONTENTS -->
    <div class="space-y-6">
      {#each subjectContents as content (content._id)}
        <div
          class="card shadow bg-base-100 bordered text-base-content"
          animate:flip={{ duration: 400 }}
        >
          <div class="flex flex-col p-5 space-y-2">
            <h1 class="font-bold font-title">
              {content.title}
            </h1>
            {#if content.description}
              <p>{content.description}</p>
            {/if}
            <div
              class="card-actions flex flex-nowrap justify-between items-center"
            >
              <a
                class="flex items-center space-x-2 link link-primary no-underline"
                href={content.url}
                target="_blank"
                rel="noopener noreferrer"
                tinro-ignore
              >
                <Link solid />
                <span>{content.url}</span>
              </a>
              <button
                class="btn btn-primary btn-ghost btn-sm opacity-50 inline-flex items-center gap-2"
                on:click={() => handleHeartOnClick(content._id)}
              >
                {content.upvotedBy.length}
                <Heart
                  solid={content.upvotedBy.find((userId) => userId === userId)}
                />
              </button>
            </div>
          </div>
        </div>
      {/each}
    </div>
  </div>
{/if}
