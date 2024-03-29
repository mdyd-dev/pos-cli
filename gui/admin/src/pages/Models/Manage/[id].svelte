<script>
  import { onMount } from "svelte";
  import { params } from "@sveltech/routify";
  import { slide } from "svelte/transition";

  import getTime from "@/lib/getTime";
  import api from "@/lib/api";

  import modelsStore from "./_models-store";
  import pageStore from "./_page-store";

  import InputField from "@/_components/InputField.svelte";
  import NewModel from "./_new.svelte";
  import Filter from "./_filter.svelte";
  import Pagination from "./_pagination.svelte";

  const schemaId = $params.id;
  let schemaName;

  let show = 'nondeleted';

  let data = [];
  $: if (show === 'nondeleted') {
    data = $modelsStore.filter(m => !m.deleted_at);
  } else {
    data = $modelsStore.filter(m => m.deleted_at);
  }

  let props = [];

  onMount(() => {
    pageStore.setSchemaId(schemaId);
    modelsStore.refreshModels(schemaId);

    api.getModelSchemas(schemaId).then(schema => {
      schemaName = schema[0].name;
      props = schema[0].properties;
    });
  });

  const handleDelete = id => {
    const confirmation = confirm(
      "Are you sure you want to delete this record?"
    );
    if (!confirmation) return;

    api.deleteModel(id).then(data => {
      modelsStore.refreshModels(schemaId);
    });
  };

  const formCache = {};
  const handleFormChanged = ({ detail }) => {
    // FIXME: MONSTER - Maybe use store for that?
    const currentData = formCache[detail.id] || {};
    const model = Object.assign({}, currentData, detail.props);

    formCache[detail.id] = model;
  };

  const handleUpdateModel = ({ id }) => {
    api.updateModel({ id, props: formCache[id] }).then(data => {
    });
  };

  const handleUndelete = id => {
    api.undeleteModel(id).then(data => {
      modelsStore.refreshModels(schemaId);
    })
  };
</script>

<div class="flex flex-wrap mb-6">
  <div class="w-1/2">
    <h1 class="text-4xl">{schemaName}</h1>
  </div>

  <div class="w-full">
    <NewModel {props} {schemaName}/>
  </div>

  <div class="w-full">
    <Filter {props} {schemaId} />
  </div>

  <div class="flex w-full">
    <button type="button" class="mr-4 button secondary" class:active="{show === 'nondeleted'}" on:click="{() => show = 'nondeleted'}">
      Show non-deleted
    </button>

    <button type="button" class="button secondary" class:active="{show === 'deleted'}" on:click="{() => show = 'deleted'}">
      Show deleted
    </button>
  </div>
</div>

<section class="flex flex-wrap text-gray-700 ">
  {#each data as { id, created_at, updated_at, deleted_at, properties }, i (id)}
    <article class="flex flex-wrap w-full mb-6" transition:slide>
      <div class="w-full">
        <div class="h-full p-8 bg-gray-200 rounded" class:bg-red-200="{deleted_at}">
          <header class="flex pb-6 mb-6 border-b border-blue-600">
            <h3 class="text-3xl font-light">ID: {id}</h3>
            <p class="ml-auto">
              Created: {getTime(created_at)}
              <br />
              Updated: {getTime(updated_at)}
            </p>
          </header>

          <form class="flex flex-wrap"
            on:submit|preventDefault={e => handleUpdateModel({ id })}>

            {#each props as { name, attribute_type }, i}
              <div class="w-5/12 mb-3 mr-4">
                <InputField {attribute_type} {name} {id}
                  value={properties[name]}
                  on:formChanged={handleFormChanged} />
              </div>
            {/each}

            <div class="w-full mt-4">
              <button class="button">Save</button>
            </div>
          </form>

          <footer class="flex">
            {#if deleted_at}
              <div class="w-64 ml-auto">
              <p class="mb-2">This record was deleted at: <br/> {getTime(deleted_at)}</p>
              <button class="button secondary" type="button" on:click={() => handleUndelete(id)}>
                Restore record
              </button>
              </div>
            {:else}
              <button class="ml-auto button danger" type="button" on:click={() => handleDelete(id)}>
                Delete
              </button>
            {/if}
          </footer>
        </div>
      </div>
    </article>
  {/each}
</section>

<Pagination />