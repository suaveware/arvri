<script>
  import { Route } from "tinro";
  import { ROUTES } from "../../routes";
  import Subject from "../molecules/Subject.svelte";
  import { subjectsTreePlatter } from "../../silverPlatters/subjectsTreePlatter";

  const state = subjectsTreePlatter();

  $: curriculumSlug = $state.curriculumSlug;
  $: curriculum = $state.curriculum;
  $: curriculumTitle = curriculum?.title;
  $: subject = $state.subject;
  $: subjectContents = $state.subjectContents;
  $: childrenSubjects = $state.childrenSubjects;

  // This is a recursive component. This variable helps us if we are the final
  // component of the recursion
  let childSelf = null;
  $: isEndOfRecursion = !childSelf;
</script>

<Route path={ROUTES.SUBJECT}>
  <svelte:self bind:this={childSelf} />
</Route>

<!-- Show all subjects that are children of subjectId -->
{#if isEndOfRecursion}
  {#if subject}
    <Subject
      {subject}
      {curriculumSlug}
      {curriculumTitle}
      {subjectContents}
      {childrenSubjects}
    />
  {:else if !$state.loading}
    <div class="col-span-full w-full h-full">
      <h1
        class="font-title text-4xl py-20 flex-grow flex justify-center items-center"
      >
        Ops, nothing here :(
      </h1>
      <p class="w-full text-center">
        Try going back or <a href="/" class="link link-primary">
          return to home page
        </a>.
      </p>
    </div>
  {/if}
{/if}
