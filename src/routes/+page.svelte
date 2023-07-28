<script lang="ts">
    import { onMount } from "svelte";
    import Auth from "./components/auth.svelte";
    import ModulesPage from "./components/ModulesPage.svelte";

    const noCors : RequestInit = { mode: 'no-cors' }

    let user;

    onMount(() => {
        // fetch('https://www.chattriggers.com/api/account/current', noCors).then((res) => {
        //     if (res.ok==false) {
        //         console.log('Failed to fetch the user! They seem to be logged out!')
        //     } else {
        //         let jsonRes = res.json()
        //         user = jsonRes
        //     }
        // })
    })
</script>

<!-- Homepage -->
<div class="main">
    <div class="main_contents" id="main_contents">
        <ModulesPage/>
    </div>
</div>