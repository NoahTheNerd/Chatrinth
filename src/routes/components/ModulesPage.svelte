<script lang="ts">
    //@ts-nocheck
    import { onMount } from "svelte";
    import { marked } from 'marked';
    import type CTModule from "$lib/interfaces/CTModule";
    import FetchConfig from "$lib/FetchConfig";

    const BaseModules = {
        dead: {
            name: "Oh noes!",
            description: "We couldn't connect to ChatTriggers. Your internet may be offline or have no access! Try restarting your router!",
            owner: {
                name: "System",
                id: -1,
                rank: "admin"
                },
            downloads: 0,
            id: -1,
            image: "nowifi.png",
    
        },
        empty: {
            name: "No results!",
            description: "We looked all across the land, but no results were found.",
            owner: {
                name: "System",
                id: -1,
                rank: "admin"
            },
            downloads: 0,
            id: -1,
            image: "noresults.png"
        }
    }

    const tagsBlacklist : Array<String> = [
        "Hive",
        "Mineplex",
        ""
    ]

    const tagsFallback : Array<String> = [
        "Utility",
        "Library",
        "Singleplayer",
        "Multiplayer",
        "GUI",
        "HUD",
        "Audio",
        "API",
        "1.8",
        "1.12",
        "1.19",
        "Proof of Concept",
        "Hypixel",
        "Mineplex",
        "Hive",
        "ASM",
        "SkyBlock",
        ""
    ];

    const displaySort = {
        DATE_CREATED_DESC: "Newest",
        DOWNLOADS_DESC: "Most Downloads",

        DATE_CREATED_ASC: "Oldest",
        DOWNLOADS_ASC: "Least Downloads"
    }

    const versionRegex : RegExp = new RegExp(/1.[\d]/)

    let modules : Array<Object> = []
    let tags : Array<String> = []
    let tagsDisplay: Object = {}
    let versionTags : Array<String> = []

    let tagsSelected = {}
    let versionsSelected = {}

    let pagenumber = 1
    let sortby = 0

    function getQueryDetails() {
        const elemQ = document.querySelector('#query_text')
        const elemLimit = document.querySelector('#query_text')

        const arrTags = []
        Object.keys(tagsSelected).forEach(tag => {
            if (tagsSelected[tag]) arrTags.push(tagsDisplay[tag])
        })
        const arrVersions = []
        Object.keys(versionsSelected).forEach(version => {
            if (versionsSelected[version]) arrVersions.push(version.replace('ver_',''))
        })

        const limit = (elemLimit.value > 0 && elemLimit.value < 51 ? elemLimit.value : '10')

        const params = `?offset=${(pagenumber-1) * limit}&limit=${limit}&sort=${Object.keys(displaySort)[sortby]}&tags=${arrTags.concat(arrVersions).join()}&q=${elemQ.value}`
        return params
    }

    function regenerateTags(data : Array<String>) {
        tags = []
        data.forEach((tag : string) => {
            if (!tagsBlacklist.includes(tag)) {
                if (!versionRegex.test(tag)) {
                    tags.push(tag.toLowerCase().replace(/ /g, ''))
                    tagsDisplay[tag.toLowerCase().replace(/ /g, '')] = tag
                } else {
                    versionTags.push(tag)
                }
            } // For some reason, the CT API has a tag with no contents at all.
        })
        tags = tags
        tagsDisplay = tagsDisplay
        versionTags = versionTags
    }

    async function sendQuery(savePage : boolean = false) {

        const details = await getQueryDetails()
        fetch('https://www.chattriggers.com/api/modules'+details, FetchConfig).then((res) => {
            if (!savePage) pagenumber = 1
            
            const data = res.data
            modules = []
            data.modules.forEach((moduleData : CTModule) => {
                modules.push(moduleData)
            })

            if (modules.length==0) modules.push(BaseModules.empty)
            modules = modules
        }).catch((error) => {
            modules = []
            modules.push(BaseModules.dead)
            modules = modules
        })
    }

    onMount(() => {
        fetch('https://www.chattriggers.com/api/tags', FetchConfig).then((res) => {
            const data = res.data
            regenerateTags(data)
        }).catch((error) => {
            regenerateTags(tagsFallback)
        })

        sendQuery()
    })
    

    // function getTagBox(tag) {
    //     const Checkbox = document.getElementById(`tag_${tag}`)
    //     const isChecked = Checkbox.getAttribute('checked') == 'true' ? true : false
    //     return isChecked
    // }

    function toggleTagBox(tag : string, customObject : Object) {
        const Checkbox = document.getElementById(`tag_${tag}`)
        const isChecked = Checkbox.getAttribute('checked') == 'true' ? true : false
        Checkbox.setAttribute('checked', !isChecked)
        if (!customObject) {
            tagsSelected[tag] = !isChecked
            tagsSelected = tagsSelected // reactivity fix
        } else {
            customObject[tag] = !isChecked
            
            // For whatever fucking reason this fucking fucker doesn't fucking trigger the fucking reactivity. Fuck you, Svelte.
            // Go Fuck yourself. Fuck you. Fucking stupid fucking system to detect your fucking reactivity.
            // customObject = customObject

            // Please add and customobject used into this stupid assignment chain down below
            versionsSelected = versionsSelected
        }
        sendQuery()
    }
    
    function cycleSort() {
        sortby++
        if (sortby==4) sortby = 0;
        sendQuery()   
    }

    function abbreviateNumber(value : number) {
        let newValue = value;
        const suffixes = ["", "K", "M", "B","T"];
        let suffixNum = 0;
        while (newValue >= 1000) {
            newValue /= 1000;
            suffixNum++;
        }

        if (value>999) newValue = newValue.toPrecision(3);

        newValue += suffixes[suffixNum];

        return newValue;
    }

    function changePage(amount : number) {
        if (pagenumber<2 && amount<1) return pagenumber = 1
        pagenumber = pagenumber + amount
        sendQuery()
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

    <form>
        <b>Amount per page</b><br/>
        <input id="query_amount" type="number" class="input_number" max="50" min="1" value="10"/>
    </form>

    <form>
        <b>Game version</b><br/>
        {#each versionTags as version}
            <div class="tags_item">
                <button id="tag_ver_{version}" class="button_checkbox" on:click={() => {toggleTagBox('ver_'+version, versionsSelected)}}>
                    {#if versionsSelected[`ver_${version}`]}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none">
                            <path d="M1 3L4 6L9 1" stroke="white" stroke-width="2"/>
                        </svg>
                    {:else}
                        <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8" fill="none"></svg>
                    {/if}
                </button> 
                    
                <label for="tag_ver_{version}">{version}</label>
            </div>
        {/each}
    </form>
</div>

<div class="modules">
    <h2>Modules</h2>

    <div class="multi-info flex_1">
        <div>
            <form>
                <input id="query_text" type="text" class="input_text" placeholder="Search for modules"> 
                <input type="submit" class="button_1" on:click={sendQuery} value="Search">

                <button class="button_1" on:click={cycleSort}>Sort: {Object.values(displaySort)[sortby]}</button>
            </form>
        </div>
        
        <div>
            <button class="button_1 button_min" on:click={() => {changePage(-1)}}>&lt;</button>
            <span class="high-margin">Page {pagenumber}</span>
            <button class="button_1 button_min" on:click={() => {changePage(1)}}>&gt;</button>
        </div>
    </div>

    <div class="modules_list">
        {#each modules as moduleData}
            <div class="modulecard">
                <div>
                    <img src="{moduleData.image ? moduleData.image : 'fallback.png'}" class="modulecard_image" alt="{moduleData.name}">
                </div>
                <div class="modulecard_text">
                    <h3>{moduleData.name}</h3>
                    <span>{@html moduleData.description ? marked.parse( moduleData.description.replace(/#/g, '').split('\n')[0], { headerIds: false, mangle: false } )
                                        .replace(/<p>/g, '<span>')
                                        .replace(/<\/p>/g, '</span>') 
                                        .replace(/<a/g, '<a class="link" ')
                                        .replace(/<img .*?>/g, '[Image]')
                    : 'A ChatTriggers module'}</span>

                    

                    {#if moduleData.owner.id!==-1} 
                    <div class="multi-info trans modulecard_footer">
                        <div>
                            <svg alt="Creator" title="Creator" xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--{moduleData.owner.rank=='trusted' ? 'blue' : moduleData.owner.rank=='admin' ? 'red' : 'x'})" viewBox="0 -960 960 960" width="20"><path d="M480-479q-64.5 0-109.75-45.25T325-634q0-64.5 45.25-109.75T480-789q64.5 0 109.75 45.25T635-634q0 64.5-45.25 109.75T480-479ZM169-173v-106q0-33 16.75-60.25T231-381q61-30 123.25-45.25T480-441.5q63.5 0 125.75 15.25T729-381q28.5 14.5 45.25 41.75T791-279v106H169Z"/></svg>
                            <fakespan style="color: var(--{moduleData.owner.rank=='trusted' ? 'blue' : moduleData.owner.rank=='admin' ? 'red' : 'x'})">{moduleData.owner.name}</fakespan> 
                        </div>
                        
                        <div>
                            <svg alt="Downloads" title="Downloads" xmlns="http://www.w3.org/2000/svg" class="icon" height="20" fill="var(--w)" viewBox="0 -960 960 960" width="20"><path d="M480-325 288.5-516.5l52-53 102 102V-790h75v322.5l102-102 52 53L480-325ZM245-170q-30.938 0-52.969-22.031Q170-214.062 170-245v-117.5h75V-245h470v-117.5h75V-245q0 30.938-22.031 52.969Q745.938-170 715-170H245Z"/></svg>
                            {abbreviateNumber(moduleData.downloads)}
                        </div>
                    </div>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
    <br/>
    <div class="center">
        <button class="button_1 button_min" on:click={() => {changePage(-1)}}>&lt;</button>
        <span class="high-margin">Page {pagenumber}</span>
        <button class="button_1 button_min" on:click={() => {changePage(1)}}>&gt;</button>
    </div>
</div>