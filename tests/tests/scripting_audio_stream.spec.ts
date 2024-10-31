import {chromium, expect, test} from "@playwright/test";
import { evaluateScript } from "./utils/scripting";
import { login } from "./utils/roles";
import Map from "./utils/map";
import {publicTestMapUrl} from "./utils/urls";

test.describe("Scripting audio streams", () => {
  test("can play and listen to sounds", async ({
    page,
    browser,
  }, { project }) => {
    // This test runs only on Chrome
    // Firefox fails it because the sample rate must be equal to the microphone sample rate
    // Safari fails it because Safari
    if(browser.browserType() !== chromium || project.name === "mobilechromium") {
      //eslint-disable-next-line playwright/no-skipped-test
      test.skip();
      return;
    }

    await page.goto(
        publicTestMapUrl("tests/E2E/empty.json", "scripting_audio_stream")
    );
    await login(page, "bob", 3, "us-US", false);

    await Map.teleportToPosition(page, 32, 32);

    // Open new page for alice
    const newBrowser = await browser.newContext();
    const alice = await newBrowser.newPage();
    await alice.goto(
        publicTestMapUrl("tests/E2E/empty.json", "scripting_audio_stream")
    );
    await login(alice, "alice", 4, "us-US", false);

    // Move alice to the same position as bob
    await Map.teleportToPosition(alice, 32, 32);

    // Test play sound scripting
    await evaluateScript(page, async () => {
      const sampleRate = 24000;

      const audioStream = await WA.player.proximityMeeting.startAudioStream(sampleRate);

      // Generate a sine wave
      const frequency = 440;
      const amplitude = 1;
      const duration = 20;
      const numSamples = duration * sampleRate;
      const samples = new Float32Array(numSamples);
      for (let i = 0; i < numSamples; i++) {
        samples[i] = amplitude * Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }

      window.audioStream = audioStream;
      audioStream.appendAudioData(samples).catch((e) => {
        window.streamInterrupted = true;
      });
    });

    // Test listen to sound scripting
    await evaluateScript(alice, async () => {
      const sampleRate = 24000;

      return new Promise((resolve) => {
        WA.player.proximityMeeting.listenToAudioStream(sampleRate).subscribe((data: Float32Array) => {
          // At some point, the volume of the sound should be high enough to be noticed in the sample
          if (data.some((sample) => Math.abs(sample) > 0.7)) {
              resolve();
          }
        });
      });
    });

    await expect.poll(() => evaluateScript(page, () => window.streamInterrupted)).toBe(undefined);

    // Now, let's reset the audio buffer
    await evaluateScript(page, async () => {
      window.audioStream.resetAudioBuffer();
    });

    await expect.poll(() => evaluateScript(page, () => window.streamInterrupted)).toBe(true);

    await alice.close();
    await newBrowser.close();
  });
});