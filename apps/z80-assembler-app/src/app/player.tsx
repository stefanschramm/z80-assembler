import { useState } from 'react';
import { Button } from 'react-daisyui';
import { FaStop, FaVolumeUp } from 'react-icons/fa';
import { encodeFloat } from 'retroload-lib';

interface PlayerProps {
  visible: boolean,
  bytes: number[] | undefined;
}

let audioContext: AudioContext | undefined = undefined;
let bufferSource: AudioBufferSourceNode | undefined  = undefined;

export function Player({visible, bytes}: PlayerProps) {
  const [isPlaying, setIsPlaying] = useState<boolean>(false);

  function handlePlay() {
    if (bytes === undefined) {
      return;
    }
    if (isPlaying) {
      return;
    }
    if (audioContext === undefined) {
      // Must be initialized by a user action
      audioContext = new AudioContext();
    }
    const encodingResult = encodeFloat('zx81p', new Uint8Array(bytes), {name: ''});
    const buffer = audioContext.createBuffer(1, encodingResult.data.length, 44100);
    buffer.copyToChannel(encodingResult.data, 0, 0);
    bufferSource = audioContext.createBufferSource();
    bufferSource.connect(audioContext.destination);
    bufferSource.addEventListener('ended', (e) => setIsPlaying(false));
    bufferSource.buffer = buffer ?? null;
    bufferSource.start();
    setIsPlaying(true);
  }

  function handleStop() {
    if (bufferSource === undefined) {
      return;
    }
    bufferSource.stop();
    setIsPlaying(false);
  }

  if (!visible || bytes === undefined || bytes.length === 0) {
    return '';
  }

  return <div>
      <Button disabled={isPlaying} color="ghost" onClick={handlePlay}><FaVolumeUp className="h-5 w-5"/>Play</Button>
      <Button disabled={!isPlaying} color="ghost" onClick={handleStop}><FaStop className="h-5 w-5"/>Stop</Button>
    </div>;
}
