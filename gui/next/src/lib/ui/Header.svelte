<!-- ================================================================== -->
<script>

// imports
// ------------------------------------------------------------------------
import { page } from '$app/stores';
import { table } from '$lib/api/table';
import { state } from '$lib/state';

import Icon from '$lib/ui/Icon.svelte';



// purpose:		preload tables data into the state store for faster navigation
// returns:		loads the tables into the $state.tables (array)
// ------------------------------------------------------------------------
const preloadTables = async () => {
  if(!$state.tables.length){
    $state.tables = await table.get();
  }
}

</script>


<!-- ================================================================== -->
<style>

header {
  padding-block: 1rem;
  height: 82px;
  position: sticky;
  top: 0;
  z-index: 100;

  border-bottom: 1px solid var(--color-frame);
  background-color: rgba(var(--color-rgb-page), .5);
  backdrop-filter: blur(17px);
  -webkit-backdrop-filter: blur(17px);

  transition: filter .2s ease-in-out;
}

.wrapper {
  margin-inline: auto;
  padding-inline: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2em;
}

  @media (max-width: 570px) {
    .wrapper {
      flex-direction: column;
    }
  }

h1 {
  line-height: .5em;
}

ul {
  display: flex;
  gap: 1rem;
}

li a {
  padding: .8rem;
  display: flex;
  flex-direction: column;
  gap: .5rem;
  justify-items: center;
  align-items: center;
  position: relative;

  border-radius: 1rem;
  background-color: var(--color-background);

  text-transform: uppercase;
  font-size: .9rem;
  color: var(--color-text-secondary);

  transition-property: background-color, border-radius;
  transition-duration: .1s, .2s;
  transition-timing-function: linear, cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

  li a:hover {
    border-radius: 1.2rem;
    background-color: var(--color-middleground);
  }

  li a.active {
    background-color: var(--color-middleground);

    color: var(--color-text);
  }

/* tooltip appearing on hover */
.label {
  margin-block-start: .4rem;
  padding: .2rem .5rem;
  position: absolute;
  top: 100%;
  opacity: 0;

  border-radius: .2rem;
  background-color: var(--color-text);

  white-space: nowrap;
  font-weight: 500;
  color: var(--color-page);

  transition: opacity .1s ease-in-out;
}

.label:before {
  width: 10px;
  height: 6px;
  margin-left: -5px;
  position: absolute;
  top: -6px;
  left: 50%;

  background-color: var(--color-text);
  clip-path: polygon(50% 0%, 100% 100%, 0% 100%);

  content: '';
}

a:hover .label {
  opacity: 1;
}

</style>



<!-- ================================================================== -->
<header>
  <div class="wrapper">

    <a href="/">
      <h1>
        <svg fill="none" height="25" viewBox="0 0 171 25" width="171" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <mask id="a" height="8" maskUnits="userSpaceOnUse" width="11" x="15" y="17"><path clip-rule="evenodd" d="m15.0547 17.3882h10.7723v7.207h-10.7723z" fill="#fff" fill-rule="evenodd"/></mask><g clip-rule="evenodd" fill-rule="evenodd"><g fill="var(--color-text)"><path d="m131.861 4.66507-1.374 1.27514h-.012l-1.433-1.27514h-3.072l-1.726 2.0088-1.956-2.0088v13.38343h3.915v-9.20598h1.763l.551.95173v8.25425h3.915l-.404-.461.416.461v-8.25425l.609-.95173h1.21l.51.95173v8.25425h4.032v-10.32834l-3.098-3.05509z"/><path d="m45.2343 12.6127-1.4359 1.3529h-4.1126v-5.18873h4.1126l1.4359 1.57303zm-2.706-7.85309h-2.8425l-1.9915 1.92063-1.998-1.92063v17.84799h3.9895v-4.6244l-.0532-.0555v-.0007l.0532.0562h5.6551l3.4834-3.0551v-6.49921l-3.4834-3.66928z"/><path d="m77.2059 12.9893v-3.49693h4.2249v-3.93985h-4.2249l-2.0167-2.19928.0017-.00168-2.021-1.96707v13.65941l3.9437 3.0046h5.0169v-3.9509h-3.2703z"/><path d="m66.7636 14.1107h-4.1518l-1.4498-1.5417v-2.2185l1.4498-1.32627h4.1518zm0-9.0243h-5.7096l-3.5169 2.99451v6.37069l3.5169 3.5969h5.7096l2.011-1.8826 2.017 1.8826v-9.02427l-2.017-1.89538z"/><path d="m113.625 5.04334-2.016 2.0623-2.02-2.0623v13.00516h4.036v-9.0542h4.161l2.498 2.5627v-4.45674l-2.601-2.09428z"/><path d="m84.0986 3.49927v14.54923h4.0363v-4.835h4.2249v-3.9399h-4.2249v-3.49697l1.6544-1.33067h3.2699v-3.951301h-5.0166z"/><path d="m53.0157 2.6936.0014-.00134-2.021-2.197601v8.777591l.0083.00875v.00135l-.0083-.00909v8.77524h4.0363v-8.77524l-.003.00337v-.00135l.003-.00303v-4.39014l-.001.00135z"/><path d="m103.833 12.5424-1.501 1.5491h-2.7414l-1.5016-1.5491v-2.2286l1.5016-1.33231h2.7414l1.501 1.33231zm-5.8556-7.51792-3.6434 3.00865v6.40167l3.6434 3.6137h5.9676l3.643-3.6137v-6.40167l-3.643-3.00865z"/><path d="m150.889 9.14538v3.25032l-1.425 2.0347h-2.954l-1.425-2.0347v-6.50027l1.425-2.03505h2.954l1.425 2.03505zm-5.919-8.737207-3.736 3.482837v10.50839l3.736 3.4832h6.033l3.736-3.4832v-10.50839l-3.736-3.482837z"/><path d="m167.448 7.52596h-.005l-.127-.09726.029.09726h-.061l.032-.09726h-5.183l-1.054-1.0012v-1.3512l1.054-1.20178h3.326l2.088 1.83413 3.186-1.80317-3.735-3.496972h-6.033l-3.736 3.496972v4.32149l3.417 2.63543h3.421v.0121h1.409l1.407.9891v1.3515l-1.424 1.2015h-2.956l-2.087-1.8338-3.187 1.8028 3.735 3.497h6.034l3.735-3.497v-4.3218l-3.285-2.5338z"/></g><path d="m4.70002.149719h2.43672l-3.83108 3.921011z" fill="#56b146"/><path d="m2.00038 10.5222s-1.9688335-3.64708-2.00038-3.64372l1.95688.01043z" fill="#c3233d"/><path d="m1.95703 6.88889 4.02467-.00068-3.98117 3.63399z" fill="#d5246a"/><path d="m5.82842 13.7166.15275-6.82839-3.98117 3.63399z" fill="#e77a2b"/><path d="m10.6388 10.3186-4.81165 3.398.15441-6.82839z" fill="#fac922"/><path d="m13.6277 5.82074-7.64625 1.0675 4.65725 3.43036z" fill="#56b146"/><path d="m11.8604.149719-3.08989 3.841251 4.85749 1.82976z" fill="#c3233d"/><path d="m19.1124.149719h-7.252l1.7676 5.671011z" fill="#487fb5"/><path d="m5.98145 6.88823 7.64625-1.0675-4.85754-1.82976z" fill="#d5246a"/><path d="m20.4868 5.82073h-6.8589l5.4845-5.671011z" fill="#23477b"/><path d="m17.0469 12.1355-6.4082-1.8169 2.9889-4.49786z" fill="#419845"/><path d="m20.4868 5.82074-3.4396 6.31476-3.4193-6.31476z" fill="#014c3d"/><path d="m22.8936 10.3186-5.8467 1.8169 3.4395-6.31476z" fill="#419845"/><path d="m21.829 14.004-4.7821-1.8685 5.8467-1.8169z" fill="#56b146"/><path d="m19.1123.149719 5.2799 4.404611-3.9055 1.2664z" fill="#487fb5"/><path d="m20.4863 5.82072 3.9055-1.2664-1.4983 5.76428z" fill="#008b47"/><path d="m22.8937 10.3186 5.4031 1.0358-6.4677 2.6496z" fill="#014c3d"/><path d="m28.2968 11.3544.0651 5.1999-6.5328-2.5503z" fill="#419845"/><path d="m21.8291 14.004 6.5328 2.5503-4.9359.8339z" fill="#23477b"/><path d="m28.3616 16.5543-2.5353 5.6629-2.4005-4.829z" fill="#56b146"/><g mask="url(#a)"><path d="m23.4268 17.3882 2.4005 4.829-3.6584-2.0616z" fill="#487fb5"/><path d="m25.8273 22.2172-3.6185 2.3982-.0399-4.4598z" fill="#23477b"/><path d="m22.1685 20.1556.0398 4.4598-1.8167-2.8966z" fill="#487fb5"/><path d="m22.2089 24.6154h-4.831l3.0142-2.8966z" fill="#23477b"/><path d="m20.3921 21.7188-3.0142 2.8966.5323-2.8966z" fill="#c3233d"/><path d="m17.9098 21.7188-.5323 2.8966-2.3228-2.8966z" fill="#d5246a"/></g><path d="m17.9098 21.7188h-2.8551l1.6935-2.0047z" fill="#c3233d"/><path d="m15.0547 21.7188v-3.7914l1.6935 1.7867z" fill="#e77a2b"/><path d="m24.3918 4.55432 3.9048 6.80008-5.403-1.0358z" fill="#56b146"/><path d="m17.9097 18.0256-.3872-1.9411 2.8551 1.3054z" fill="#419845"/><path d="m15.0547 17.9274 2.8551.0982-.3872-1.9411z" fill="#56b146"/><path d="m16.7482 19.7141 1.1616-1.6885-2.8551-.0982z" fill="#fac922"/><path d="m6.6543 2.67443 2.11627 1.31654-.10261-2.60212z" fill="#419845"/><path d="m6.6543 2.67443 2.01366-1.28558-1.5305-1.239131z" fill="#56b146"/><path d="m3.30566 4.07073 3.83108-3.921011-.48316 2.524711z" fill="#008b47"/><path d="m8.77013 3.99098-2.11627-1.31654-.98491 1.37442z" fill="#014c3d"/><path d="m3.30566 4.07074 3.34792-1.3963-.98492 1.37442z" fill="#419845"/><path d="m1.95703 6.88891 3.71219-2.84005.31248 2.83937z" fill="#e77a2b"/><path d="m5.66895 4.04885.31247 2.83938 2.78871-2.89726z" fill="#c3233d"/><path d="m1.95703 6.88891 1.34919-2.81818 2.363-.02187z" fill="#fac922"/><path d="m11.0079 13.7099-1.16122 2.0044h3.34462z" fill="#419845"/><path d="m8.49121 13.7166 1.35517 1.9977 1.16122-2.0044z" fill="#56b146"/><path d="m10.6387 10.3186.3689 3.3913 6.0393-1.5744z" fill="#014c3d"/><path d="m13.1912 15.7143 3.8559-3.5788-6.0393 1.5744z" fill="#008b47"/></g></svg>
        <span class="stamp">platformOS development tools</span>β
      </h1>
    </a>

    <nav>
      <ul>
        <li>
          <a href="/database" class:active={$page.url.pathname.startsWith('/database')} on:focus|once={preloadTables} on:mouseover|once={preloadTables}>
            <Icon icon="database" />
            <span class="label">
              Database
            </span>
          </a>
        </li>

        <li>
          <a href="/users" class:active={$page.url.pathname.startsWith('/users')}>
            <Icon icon="users" />
            <span class="label">
              Users
            </span>
          </a>
        </li>

        <li>
          <a href="/logs" class:active={$page.url.pathname.startsWith('/logs')}>
            <Icon icon="log" />
            <span class="label">
              Logs
            </span>
          </a>
        </li>

        <li>
          <a href="/constants" class:active={$page.url.pathname.startsWith('/constants')}>
            <Icon icon="constant" />
            <span class="label">
              Constants
            </span>
          </a>
        </li>

        <li>
          <a href="http://localhost:3333/gui/liquid">
            <Icon icon="liquid" />
            <span class="label">
              Liquid Evaluator
            </span>
          </a>
        </li>

        <li>
          <a href="http://localhost:3333/gui/graphql/">
            <Icon icon="graphql" />
            <span class="label">
              GraphiQL
            </span>
          </a>
        </li>
      </ul>
    </nav>

  </div>
</header>