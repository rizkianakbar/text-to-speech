"use client";

import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";

const getVoiceId = (voice: SpeechSynthesisVoice) =>
  `${voice.name}-${voice.lang}`;

export default function Page() {
  const [text, setText] = useState("");
  const [rate, setRate] = useState<number>(1);
  const [pitch, setPitch] = useState<number>(1);
  const [selectedVoiceId, setSelectedVoiceId] = useState<string | null>(null);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [synth, setSynth] = useState<SpeechSynthesis | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);

  useEffect(() => {
    const synthesis = window.speechSynthesis;
    setSynth(synthesis);

    const getVoices = () => {
      const voicesList: SpeechSynthesisVoice[] = synthesis.getVoices();
      setVoices(voicesList);
    };

    getVoices();

    if (synthesis.onvoiceschanged !== undefined) {
      synthesis.onvoiceschanged = getVoices;
    }
  }, []);

  const selectedVoice = selectedVoiceId
    ? voices.find((voice) => getVoiceId(voice) === selectedVoiceId)
    : null;

  const speak = () => {
    if (synth && synth.speaking) {
      console.error("Already speaking...");
      return;
    }

    if (text !== "" && synth && selectedVoice) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.onend = () => {
        console.log("Speech ended");
        setIsSpeaking(false);
      };
      utterance.onerror = (event) => {
        console.error(`Speech synthesis error: ${event.error}`);
        setIsSpeaking(false);
      };
      utterance.voice = selectedVoice;
      utterance.rate = rate;
      utterance.pitch = pitch;
      synth.speak(utterance);
      setIsSpeaking(true);
    }
  };

  const stop = () => {
    if (synth && synth.speaking) {
      synth.cancel();
      setIsSpeaking(false);
    }
  };

  return (
    <main className="flex flex-col items-center h-screen max-w-lg gap-8 px-4 py-10 mx-auto md:px-0">
      <h1 className="text-3xl font-bold">Text to Speech</h1>
      <p className="text-center">
        Welcome to our Text to Speech application! Here, you can input any text
        you&apos;d like and play it back as speech. You also have the option to
        customize the speech by adjusting the rate and pitch to suit your
        preference.
      </p>
      <Textarea
        placeholder="Type your text here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <div className="flex flex-col w-full gap-4">
        <Label htmlFor="rate" className="flex items-center justify-between">
          <div>Speech Rate</div>
          <div>{rate}x</div>
        </Label>
        <Slider
          max={200}
          step={1}
          id="rate"
          value={[rate * 100]}
          onValueChange={(val) => setRate(val[0] / 100)}
        />
      </div>

      <div className="flex flex-col w-full gap-4">
        <Label htmlFor="rate" className="flex items-center justify-between">
          <div>Speech Pitch</div>
          <div>{pitch}x</div>
        </Label>
        <Slider
          max={200}
          step={1}
          id="rate"
          value={[pitch * 100]}
          onValueChange={(val) => {
            console.log(val[0] / 100);

            setPitch(val[0] / 100);
          }}
        />
      </div>

      <Select
        value={selectedVoiceId || undefined}
        onValueChange={(val) => setSelectedVoiceId(val)}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select voice..." />
        </SelectTrigger>
        <SelectContent>
          {voices.map((voice) => (
            <SelectItem key={getVoiceId(voice)} value={getVoiceId(voice)}>
              {`${voice.name} (${voice.lang})`}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Button
        className="w-full"
        disabled={!text || !selectedVoice}
        onClick={isSpeaking ? stop : speak}
      >
        {isSpeaking ? "Stop" : "Play"}
      </Button>
    </main>
  );
}
