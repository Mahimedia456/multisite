import React from "react";
import Reveal from "../../components/Reveal";
import SectionShell from "../../components/ui/SectionShell";
import WaveDividerBottom from "../../components/ui/WaveDividerBottom";
import VideoBlock from "../../components/ui/VideoBlock";

export default function VideoSection() {
  return (
    <SectionShell className="pb-14">
      <div className="relative">
        <WaveDividerBottom className="-bottom-14" />
        <Reveal>
          <VideoBlock />
        </Reveal>
      </div>
    </SectionShell>
  );
}
