<fieldset style="max-width:fit-content;line-height:2;">
    <legend>Login</legend>

    <input type="text" id="auth_username" class="input_text" placeholder="Username">
    <br/>
    <input type="password" id="auth_password" class="input_text" placeholder="Password">
    <br/>

    <button class="button_secondary" on:click={authUser}>Log in</button>
</fieldset>

<script lang="ts">
    // @ts-nocheck
    // go fuck yourself typescript
    import axios from 'axios';
    import { URLParams } from '$lib/class/URLParams';

    function authUser() {
        const authPass = document.querySelector('#auth_password')
        const authName = document.querySelector('#auth_username')

        if (authPass && authName) {
            const username : string | null = authName?.value
            const password : string | null = authPass?.value
            
            if (username && password) {
                fetch(`https://www.chattriggers.com/api/account/login`, {
                    method: 'POST',
                    mode: 'no-cors',
                    body: new URLParams({username,password}).toString()
                }).then((res) => {
                    console.log(res)
                })
            } else alert('Username/password field cannot be blank!')
        } else alert('Username/password field undefined!')
    }
</script>