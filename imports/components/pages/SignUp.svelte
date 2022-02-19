<script>
  import { Accounts } from "meteor/accounts-base";
  import { ROUTES } from "../../routes";
  import { router } from "tinro";

  let email = "";
  let password = "";
  let errorMessage = "";

  const handleSignUpOnClick = () => {
    Accounts.createUser(
      {
        username: email,
        password: password,
      },
      (error) => {
        if (error) {
          errorMessage = error.reason;
          return;
        }

        router.goto(ROUTES.HOME);
      }
    );
  };
</script>

<div class="card bg-base-100 col-start-5 col-span-4 flex flex-col space-y-4">
  <div class="card-body space-y-4">
    <input
      class="input input-bordered"
      placeholder="Email"
      type="email"
      bind:value={email}
    />
    <input
      class="input input-bordered"
      placeholder="Password"
      type="password"
      bind:value={password}
    />
    <div class="card-actions self-end">
      <a class="btn btn-ghost normal-case" href={ROUTES.LOGIN}> Login </a>
      <button
        class="btn btn-primary normal-case text-base-200"
        on:click={handleSignUpOnClick}
      >
        Sign up
      </button>
    </div>
  </div>
</div>

{errorMessage}
