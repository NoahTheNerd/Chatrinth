<script lang="ts">
    // @ts-nocheck
    import { ctPost } from "$lib/ctFetch";

    function getDetails() {
        return { 
            username: document.querySelector('#auth_username').value,
            password: document.querySelector('#auth_password').value,
            email: document.querySelector('#auth_email').value,
        }
    }

    function register() {
        const details = getDetails();
        if (!(details.username && details.password && details.email)) return alert('Please fill in all fields!')

        ctPost('account/new', `username=${details.username}&password=${details.password}&email=${details.email}`).then(res => {
            console.log(res)
        }).catch(err => {
            if (!err.response) return alert('An unknown error occured!')
            switch(err.response.status) {
                case 409:
                    alert('This account already exists!');    
                break;
                case 400:
                    alert('Invalid data!')
                break;
                default:
                    alert('An unknown error occured!')
            }
        })
    }
</script>
<div class="main">
    <div class="force-center">
        <form class="loginform" autocomplete="off" autocorrect="off">
            <h2>Chatrinth</h2>
            <p>Welcome to Chatrinth!<br>Register a new <a href="https://chattriggers.com" target="_blank" class="link">ChatTriggers</a> account!</p>
            <input type="text" class="input_textbox" placeholder="Username" id="auth_username">
            <input type="text" class="input_textbox" placeholder="Email" id="auth_email">
            <input type="password" class="input_textbox" placeholder="Password" id="auth_password">
            <input type="submit" class="button_1" value="Register & Log in" on:click={register}/>

            <a href="/ct/auth/login" class="muted_link">Log in instead</a>
        </form>
    </div>
</div>