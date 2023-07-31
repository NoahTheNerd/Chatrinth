<script lang="ts">
    import { onMount } from "svelte";
    import ModulesPage from "./components/ModulesPage.svelte";

    const noCors : RequestInit = { mode: 'no-cors' }

    let user;
</script>

<!-- Homepage -->
<div class="main">
    <div class="main_contents" id="main_contents">
        <ModulesPage/>
    </div>
</div>