<script lang="ts">
    import type { Game } from "../../Phaser/Game/Game";
    import { FAQScene, FAQSceneName } from "../../Phaser/Login/FAQScene";

    export let game: Game;

    function submit() {
        ((game.scene.getScene(FAQSceneName)) as FAQScene).start();
    }
</script>

<form class="faqScene" on:submit|preventDefault={submit}>
    <section class="text-center">
        <h5>Welcome to the SUASecLab!</h5>
        <p>You can move around using WASD keys.<p>
        <p>You can use the Shift key to move faster.</p>
        <p>Please use a headset if possible.<p>
        <p>Please use the latest version of your browser.<p>
        <p>Please use a device with a hardware keyboard.<p>
        <p>Please enable JavaScript for this site.<p>
        <p>Please make sure your privacy settings allow accessing your camera and microphone<p>
        <p>Group conversations can grow up to 4 participants. Use the Jitsi lounges for bigger conferences.<p>
        <p>Press Space when slide-in window messages appear or click on them to open the slide-in window.</p>
        <p>When slide-in windows are opened, you can close them by clicking on the 'x' button on the gray bar. You can resize the slide-in window by dragging the gray bar.</p>
        <p>If you experience issues with the slide-in windows, retry to open them by moving out of the special zone and entering it again. If that does not work, reload the website.</p>
        <p>You can customize your character and change the game settings by clicking on the upper left button.</p>
        <p>If you want to report a bug or reach out to the development team, please contact Tobias Tefke &lt;t.tefke@stud.fh-sm.de&gt;</p>
    </section>
    <section class="action">
        <button type="submit" id="understoodFormSubmit" class="nes-btn is-primary letsgo">Continue</button>
    </section>
</form>

<style lang="scss">
    .faqScene {
        pointer-events: auto;
        background: #000000;
        border-radius: 6px;
        pointer-events: auto;
        margin: 2.5% 25% 2.5% 25%;
        width: 50%;
        color: #ebeeee;

        button {
            font-size: 10pt;
        }

        section {
            h5 {
                margin: 10px;
                font-size: 15pt;
                font-family: "Press Start 2P";
            } 
            &.text-center{
                text-align: center;
                font-family: "Press Start 2P";
            }
            p {
                text-align: left;
                font-size: 10pt;
                font-family: "Press Start 2P";
            }
        }
    }
</style>
