<script lang="ts">
    import { onMount } from "svelte";
    import type CTModule from "$lib/interfaces/CTModule";
    import FetchConfig from "$lib/FetchConfig";

    // @ts-ignore
    import { marked } from 'marked';
    import hljs from "highlight.js";

    let params : URLSearchParams;
    let module : CTModule;

    onMount(() => {
        params = new URLSearchParams(window.location.search)

            fetch(`https://www.chattriggers.com/api/modules/${params.get('id')}`, FetchConfig).then((res) => {
                module = res.data

                setTimeout(() => {
                    hljs.highlightAll()
                }, 0); // It only highlights if I do this for some reason            
            }).catch((err) => {
                module = {
                    name: "Invalid Module",
                    owner: {
                        name: "System",
                        id: -1,
                        rank: 'admin'
                    },
                    image: "noresults.png",
                    id: -1,
                    description: "We couldn't find this in the ChatTriggers database! Specify a valid module using `?id=ModuleName` at the end of your link!",
                    tags: [],
                    downloads: -1,
                    releases: []
                }
            })
    })
</script>

{#if module}
<div class="modules main">
    <div class="modules_list size-change">
        <button class="button_1 button_min" on:click={() => {history.back()}}>&lt;</button>
        <div class="modulecard">
            <div>
                <img src="{module.image ? module.image : 'fallback.png'}" class="modulecard_image" alt="{module.name}">
            </div>
            <div class="modulecard_text">
                <h1>{module.name}</h1>

                {#if module.owner.id!==-1} 
                <div class="trans modulecard_footer">
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--{module.owner.rank=='trusted' ? 'blue' : module.owner.rank=='admin' ? 'red' : 'x'})" viewBox="0 -960 960 960" width="20"><path d="M480-479q-64.5 0-109.75-45.25T325-634q0-64.5 45.25-109.75T480-789q64.5 0 109.75 45.25T635-634q0 64.5-45.25 109.75T480-479ZM169-173v-106q0-33 16.75-60.25T231-381q61-30 123.25-45.25T480-441.5q63.5 0 125.75 15.25T729-381q28.5 14.5 45.25 41.75T791-279v106H169Z"/></svg>
                        <fakespan style="color: var(--{module.owner.rank=='trusted' ? 'blue' : module.owner.rank=='admin' ? 'red' : 'x'})">{module.owner.name}</fakespan> 
                    </div>
                    
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--w)" viewBox="0 -960 960 960" width="20"><path d="M480-325 288.5-516.5l52-53 102 102V-790h75v322.5l102-102 52 53L480-325ZM245-170q-30.938 0-52.969-22.031Q170-214.062 170-245v-117.5h75V-245h470v-117.5h75V-245q0 30.938-22.031 52.969Q745.938-170 715-170H245Z"/></svg>
                        {module.downloads.toLocaleString()} downloads
                    </div>
                </div>
                {/if}
            </div>
        </div>

        <div class="releases">

        </div>

        <h2>Releases</h2>
        <div class="card">
            {#if module.releases.length>0}
            {#each module.releases as release}
                <div class="releasecard">
                    {release.releaseVersion} <code>(for CT {release.modVersion})</code><br>
                    {#if release.changelog}
                    <details>
                        <summary>Changelog</summary>
                        {@html marked.parse(release.changelog, {mangle: false, headerIds: false}).replace(/<a/g, '<a class="link"')}
                    </details>
                    {:else}
                    <span>No changelog for this release</span>
                    <br/>
                    {/if}
                    <br/>
                    <a href="https://chattriggers.com/modules/v/ixMod"><button class="button_1">Direct Download</button></a>
                </div>
            {/each}
            {:else}
            <p>This module has no releases</p>
            {/if}
        </div>
        <h2>Description</h2>
        <div class="card">
            {@html marked.parse(module.description, {mangle: false, headerIds: false}).replace(/<a/g, '<a class="link"')}
        </div>
    </div>
</div>
{/if}