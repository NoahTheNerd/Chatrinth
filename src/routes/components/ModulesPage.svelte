<script lang="ts">
    //@ts-nocheck
    import { onMount } from "svelte";
    import proxyGet from "$lib/proxy";

    import { marked } from 'marked'

    import type CTModule from "$lib/interfaces/CTModule";

    let modules : Array<Object> = []

    let tags : Array<String> = []
    let tagsDisplay: Object = {}

    onMount(() => {
        proxyGet('https://www.chattriggers.com/api/tags').then((res) => {
            const data = res.data
            data.forEach((tag : string) => {
                if (tag!=="") {
                    tags.push(tag.toLowerCase())
                    tagsDisplay[tag.toLowerCase()] = tag
                } // For some reason, the CT API has a tag with no contents at all.
            })
            tags = tags
            tagsDisplay = tagsDisplay
        })

        proxyGet('https://www.chattriggers.com/api/modules?limit=10&offset=0&tags=&q=&sort=DATE_CREATED_DESC').then((res) => {
            const data = res.data
            data.modules.forEach((moduleData : CTModule) => {
                modules.push(moduleData)
            })
            modules = modules
        })
    })

    

    // function getTagBox(tag) {
    //     const Checkbox = document.getElementById(`tag_${tag}`)
    //     const isChecked = Checkbox.getAttribute('checked') == 'true' ? true : false
    //     return isChecked
    // }

    let tagsSelected = {}
    tags.forEach((tag) => {
        tagsSelected[tag] = false
    })

    function toggleTagBox(tag) {
        const Checkbox = document.getElementById(`tag_${tag}`)
        const isChecked = Checkbox.getAttribute('checked') == 'true' ? true : false
        Checkbox.setAttribute('checked', !isChecked)
        tagsSelected[tag] = !isChecked
        tagsSelected = tagsSelected // reactivity fix

        console.log(tagsSelected)
    }
</script>

<div class="tags">
    <h2>Tags</h2>
    <div class="tags_list">
        {#each tags as tag}
            <div class="tags_item">
                <button id="tag_{tag}" class="button_checkbox" on:click={() => {toggleTagBox(tag)}}>
                    {#if tagsSelected[tag]}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 3L4 6L9 1" stroke="white" stroke-width="2"/>
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"></svg>
                    {/if}
                </button> 
                    
                <label for="tag_{tag}">{tagsDisplay[tag]}</label>
            </div>
        {/each}
    </div>
</div>

<div class="modules">
    <h2>Modules</h2>
    <input type="text" class="input_text" placeholder="Does nothing"> <button class="button_1">Search</button>

    <br/><br/>
    <div class="modules_list">
        {#each modules as moduleData}
            <div class="modulecard">
                <div>
                    <img src="{moduleData.image ? moduleData.image : 'fallback.png'}" class="modulecard_image" alt="{moduleData.name}">
                </div>
                <div class="modulecard_text">
                    <h3>{moduleData.name}</h3>
                    <span>{@html moduleData.description ? marked.parse( moduleData.description.replace(/#/g, '').split('\n')[0])
                                        .replace(/<p>/g, '<span>')
                                        .replace(/<\/p>/g, '</span>') 
                                        .replace(/<a>/g, '<a class="link">')
                    : 'A ChatTriggers module'}</span>

                    

                    <div class="multi-info trans modulecard_footer">
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--w)" viewBox="0 -960 960 960" width="20"><path d="M480-479q-64.5 0-109.75-45.25T325-634q0-64.5 45.25-109.75T480-789q64.5 0 109.75 45.25T635-634q0 64.5-45.25 109.75T480-479ZM169-173v-106q0-33 16.75-60.25T231-381q61-30 123.25-45.25T480-441.5q63.5 0 125.75 15.25T729-381q28.5 14.5 45.25 41.75T791-279v106H169Z"/></svg>
                            Creator: {moduleData.owner.name} 
                        </div>
                        
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--w)" viewBox="0 -960 960 960" width="20"><path d="M480-325 288.5-516.5l52-53 102 102V-790h75v322.5l102-102 52 53L480-325ZM245-170q-30.938 0-52.969-22.031Q170-214.062 170-245v-117.5h75V-245h470v-117.5h75V-245q0 30.938-22.031 52.969Q745.938-170 715-170H245Z"/></svg>
                            Downloads: {moduleData.downloads}
                        </div>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</div>